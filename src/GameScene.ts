/**
 * 主畫面
 */
class GameScene extends egret.Sprite {

	//資料二維陣列(head;type)
	private dataMap: { head: number, type: number }[][];

	//顯示物件二維陣列
	private itemMap: RoadItem[][];

	//是否畫線一維陣列
	private drawLineList: number[];

	//線頭
	private head: Grid;

	//指針
	private beginCol: number;

	//當前位置
	private cur: Grid;

	//方向
	private dir: Grid;

	private numCol: number;
	private numRow: number;

	private road: number[];
	/**
	 * 
	 */
	public constructor() {
		super();

		//建立牌路
		this.createRoad(20, 6);

		this.road = [];

		let odd: RoadItem = new RoadItem();
		odd.scaleX = odd.scaleY = 2;
		this.addChild(odd);
		odd.x = 500;
		odd.refresh(TYPE.ODD, LINE.NON);
		odd.touchEnabled = true;
		odd.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.road.push(1);
			this.setRoad(this.road);
		}, this);

		let even: RoadItem = new RoadItem();
		even.scaleX = even.scaleY = 2;
		this.addChild(even);
		even.x = 500;
		even.y = 60;
		even.refresh(TYPE.EVEN, LINE.NON);
		even.touchEnabled = true;
		even.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.road.push(2);
			this.setRoad(this.road);
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
			this.drawLineList.push(0);
			for (let j: number = 0; j < numRow; ++j) {
				this.dataMap[i][j] = { head: -1, type: TYPE.NON };
				let item: RoadItem = new RoadItem();
				item.x = i * item.width;
				item.y = j * item.height;
				this.addChild(item);
				this.itemMap[i][j] = item;
			}
		}

		this.head = new Grid();
		this.cur = new Grid();
		this.dir = new Grid();
	}

	private reset(): void {
		for (let i: number = 0; i < this.numCol; ++i) {
			this.drawLineList[i] = 0;
			for (let j: number = 0; j < this.numRow; ++j) {
				this.dataMap[i][j].head = -1;
				this.dataMap[i][j].type = TYPE.NON;
			}
		}
		this.head.reset();
		this.cur.reset();
		this.dir.reset();
		this.beginCol = 0;
	}

	/**
	 * 設定牌路
	 * @param 假設road是結果的一維陣列(1,2,3,4)
	 */
	private setRoad(roadList: number[]): void {

		this.reset();

		let lastType: number = -1;
		let lineType: number = LINE.NON;
		let len: number = roadList.length;

		//資料
		for (let i: number = 0; i < len; ++i) {

			egret.error(JSON.stringify(this.cur));

			let result: number = roadList[i];
			let newType: number = this.getTypeByResult(result);
			if (lastType == -1) {
				//第一筆原地不動
				this.beginCol = 0;
				this.head.col = this.beginCol;
				this.cur.col = this.beginCol;
				this.cur.row = this.head.row;
				this.dir.col = 0;
				this.dir.row = 0;
			}
			else if (lastType != newType) {
				//不同色要換欄，原地不動
				this.beginCol++;
				this.head.col = this.beginCol;
				this.cur.col = this.beginCol;
				this.cur.row = this.head.row;
				this.dir.col = 0;
				this.dir.row = 0;
			}
			else if (this.cur.row + this.dir.row >= this.numRow ||
				(this.dataMap[this.cur.col + this.dir.col][this.cur.row + this.dir.row] &&
					this.dataMap[this.cur.col + this.dir.col][this.cur.row + this.dir.row].type != TYPE.NON)) {
				//向下已到底 或 未到底但不為空 (轉右)
				this.dir.col = 1;
				this.dir.row = 0;

				if (this.cur.row == 0) {
					//第一列向右不畫線
				}
				else {
					this.drawLineList[this.head.col] = 1;
				}
			}

			if (this.cur.row == 0 && this.dir.col > 0) {
				this.beginCol++;
			}

			//移動並記錄資料
			this.cur.col += this.dir.col;
			this.cur.row += this.dir.row;
			lastType = newType;
			this.dataMap[this.cur.col][this.cur.row].head = this.head.col;
			this.dataMap[this.cur.col][this.cur.row].type = newType;

			if (this.dir.col == 0 && this.dir.row == 0) {
				//原地不動要重置方向(向下)
				this.dir.row = 1;
			}
		}

		//顯像
		for (let ci: number = 0; ci < this.numCol; ++ci) {
			for (let ri: number = 0; ri < this.numRow; ++ri) {
				let data: { head: number, type: number } = this.dataMap[ci][ri];
				let drawLine: boolean = this.drawLineList[data.head] > 0;
				let line: number = LINE.NON;
				if (data.type != TYPE.NON) {
					if (drawLine) {
						if (ri == 0) {
							//第一個畫線一定是下
							line = LINE.DOWN;
						}
						else if (this.dataMap[ci + 1][ri] && data.head == this.dataMap[ci + 1][ri].head) {
							//右邊是自己人
							if (this.dataMap[ci][ri - 1] && data.head == this.dataMap[ci][ri - 1].head) {
								//上面是自己人
								line = LINE.UP | LINE.RIGHT;
							}
							else {
								line = LINE.LEFT | LINE.RIGHT;
							}
						}
						else if (this.dataMap[ci - 1] && this.dataMap[ci - 1][ri] && data.head == this.dataMap[ci - 1][ri].head) {
							//左邊是自己人
							line = LINE.LEFT | LINE.RIGHT;
						}
						else {
							line = LINE.UP | LINE.DOWN;
						}
					}
				}

				//最終設定
				this.itemMap[ci][ri].refresh(data.type, line);
			}
		}
	}

	private getTypeByResult(road: number): number {
		let type: number = TYPE.NON;
		if (road) {
			//有值，判斷單雙
			type = road % 2 == 0 ? TYPE.EVEN : TYPE.ODD;
		}
		return type;
	}
}