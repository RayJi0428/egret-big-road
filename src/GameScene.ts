/**
 * 主畫面
 */
class GameScene extends egret.Sprite {

	//資料二維陣列(head;type)
	private dataMap: RoadData[][];

	//顯示物件二維陣列
	private itemMap: RoadItem[][];

	//是否畫線一維陣列
	private drawLineList: boolean[];

	//上一個位置
	private pre: Grid;

	//方向
	private dir: Grid;

	//目標位置
	private target: Grid;

	private numCol: number;
	private numRow: number;

	private results: number[];
	/**
	 * 
	 */
	public constructor() {
		super();

		//建立牌路
		this.createRoad(4, 4);

		this.results = [];

		let odd: RoadItem = new RoadItem();
		odd.scaleX = odd.scaleY = 2;
		this.addChild(odd);
		odd.x = 500;
		odd.refresh(RoadData.ODD, RoadData.LINE_NON);
		odd.touchEnabled = true;
		odd.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.results.push(1);
			this.drawBigRoad(this.results);
		}, this);

		let even: RoadItem = new RoadItem();
		even.scaleX = even.scaleY = 2;
		this.addChild(even);
		even.x = 500;
		even.y = 60;
		even.refresh(RoadData.EVEN, RoadData.LINE_NON);
		even.touchEnabled = true;
		even.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.results.push(2);
			this.drawBigRoad(this.results);
		}, this);

	}

	/**
	 * 建立牌路
	 * 先把所有item放定位
	 */
	private createRoad(numCol: number, numRow: number): void {

		this.numCol = numCol;
		this.numRow = numRow;

		this.dataMap = [];
		this.itemMap = [];
		this.drawLineList = [];

		for (let i: number = 0; i < numCol; ++i) {
			this.dataMap[i] = [];
			this.itemMap[i] = [];
			this.drawLineList.push(false);
			for (let j: number = 0; j < numRow; ++j) {
				this.dataMap[i][j] = new RoadData();
				let item: RoadItem = new RoadItem();
				item.x = i * item.width;
				item.y = j * item.height;
				this.addChild(item);
				this.itemMap[i][j] = item;
			}
		}
		this.pre = new Grid();
		this.dir = new Grid();
		this.target = new Grid();
	}

	/**
	 * 每次設定時先重置資料
	 */
	private resetData(): void {
		for (let i: number = 0; i < this.numCol; ++i) {
			this.drawLineList[i] = false;
			for (let j: number = 0; j < this.numRow; ++j) {
				this.dataMap[i][j].reset();
			}
		}
		this.pre.reset();
		this.dir.reset();
		this.target.reset();
	}

	private checkColumn(col: number): void {
		//新增欄位
		if (!this.dataMap[col]) {
			this.dataMap[col] = [];
			for (let j: number = 0; j < this.numRow; ++j) {
				this.dataMap[col][j] = new RoadData();
			}
			this.drawLineList.push(false);
		}
	}
	/**
	 * 繪製大路
	 * @param {results} 結果的一維陣列(1,2,3,4)
	 */
	private drawBigRoad(results: number[]): void {

		//每次設定時先重置資料
		this.resetData();

		//預設線向下
		let lineType: number = RoadData.LINE_NON;
		let len: number = results.length;

		let rCount: number = 0;
		//資料------------------------------------------------------------------
		for (let i: number = 0; i < len; ++i) {
			if (i == len - 1) {
				egret.log("A");
			}
			let targetType: number = this.getTypeByResult(results[i]);

			if (i == 0) {
				//第一筆原地不動(並設定方向向下)
				this.dir.toBottom();
			}
			else if (targetType != this.dataMap[this.pre.col][this.pre.row].type) {
				//不同色，換欄回到第一列原地不動
				let newHead: number = this.pre.head + (this.pre.row == 0 ? rCount : 0) + 1;
				this.target.setup(newHead, newHead, 0);
				this.checkColumn(this.target.col);

				//索引重新開始
				rCount = 0;
				//設定方向向下
				this.dir.toBottom();
			}
			else {
				//同色
				//這次預計要放置的位置 = 上次位置 + 方向
				this.target.setup(this.pre.head, this.pre.col + this.dir.col, this.pre.row + this.dir.row);
				this.checkColumn(this.target.col);

				if (this.target.row >= this.numRow ||
					this.dataMap[this.target.col][this.target.row].isFull) {
					//向下超過邊界 或 未到底但下方不為空(轉右)
					this.dir.toRight();
					//重新設定目標
					this.target.setup(this.pre.head, this.pre.col + this.dir.col, this.pre.row + this.dir.row);
					this.checkColumn(this.target.col);

					if (this.target.row != 0) {
						//非第一列有轉右的話要記錄起來
						this.drawLineList[this.target.head] = true;
					}
				}
			}

			//計算向右數量
			if (this.dir.col > 0) {
				rCount++;
			}
			//移動並記錄資料
			let targetData: RoadData = this.dataMap[this.target.col][this.target.row];
			targetData.head = this.target.head;
			targetData.type = targetType;

			//紀錄最後一次節點資料
			this.pre.copy(this.target);
		}

		this.dataMap.reverse();
		this.dataMap.length = this.numCol;
		this.dataMap.reverse();

		egret.error(this.dataMap.length);

		//顯像------------------------------------------------------------------
		for (let ci: number = 0; ci < this.numCol; ++ci) {
			for (let ri: number = 0; ri < this.numRow; ++ri) {
				let data: RoadData = this.dataMap[ci][ri];
				let drawLine: boolean = this.drawLineList[data.head];
				let line: number = RoadData.LINE_NON;
				if (data.isFull) {
					if (drawLine) {
						if (ri == 0) {
							//第一個畫線一定是下
							line = RoadData.LINE_DOWN;
						}
						else if (this.dataMap[ci + 1] && this.dataMap[ci + 1][ri] && data.head == this.dataMap[ci + 1][ri].head) {
							//右邊是自己人
							if (this.dataMap[ci][ri - 1] && data.head == this.dataMap[ci][ri - 1].head) {
								//上面是自己人
								line = RoadData.LINE_UP | RoadData.LINE_RIGHT;
							}
							else {
								line = RoadData.LINE_LEFT | RoadData.LINE_RIGHT;
							}
						}
						else if (this.dataMap[ci - 1] && this.dataMap[ci - 1][ri] && data.head == this.dataMap[ci - 1][ri].head) {
							//左邊是自己人
							line = RoadData.LINE_LEFT | RoadData.LINE_RIGHT;
						}
						else if (this.dataMap[ci][ri - 1] && data.head == this.dataMap[ci][ri - 1].head) {
							line = RoadData.LINE_UP | RoadData.LINE_DOWN;
						}
						else {
							line = RoadData.LINE_LEFT | RoadData.LINE_RIGHT;
						}
					}
				}

				//最終設定
				this.itemMap[ci][ri].refresh(data.type, line);
			}
		}
	}

	/**
	 * 從結果取得type
	 */
	private getTypeByResult(road: number): number {
		let type: number = RoadData.NON;
		if (road) {
			//有值，判斷單雙
			type = road % 2 == 0 ? RoadData.EVEN : RoadData.ODD;
		}
		return type;
	}
}