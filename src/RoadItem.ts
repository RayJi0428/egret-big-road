/**
 * 型態定義
 */
enum TYPE {
	NON,//空
	ODD,//單
	EVEN//雙
}

/**
 * 線段定義(bit flag)
 */
class LINE {
	public static NON: number = 0;
	public static UP: number = 1;
	public static DOWN: number = 2;
	public static LEFT: number = 4;
	public static RIGHT: number = 8;
}
/**
 * 路子(單雙/大小 等等...)
 */
class RoadItem extends egret.Sprite {

	private tf: egret.TextField;

	private static LINE_DEFINE: { flag: number, endX: number, endY: number }[] = [
		{ flag: LINE.UP, endX: 12, endY: 0 },
		{ flag: LINE.DOWN, endX: 12, endY: 24 },
		{ flag: LINE.LEFT, endX: 0, endY: 12 },
		{ flag: LINE.RIGHT, endX: 24, endY: 12 }
	];
	/**
	 * ctor
	 */
	public constructor() {
		super();
		let bg: egret.Shape = new egret.Shape();
		bg.graphics.beginFill(0x999999);
		bg.graphics.drawRect(0, 0, 24, 24);

		bg.graphics.beginFill(0x0);
		bg.graphics.drawRect(1, 1, 22, 22);

		bg.graphics.endFill();
		this.addChild(bg);

		this.tf = new egret.TextField();
		this.tf.fontFamily = "微軟正黑體";
		this.tf.size = 20;
		this.tf.x = this.tf.y = 2;
		this.tf.text = "單";

		this.addChild(this.tf);

		this.refresh(TYPE.NON, LINE.NON);
	}

	/**
	 * 
	 */
	public refresh(type: number, flag: number): void {

		let lineColor: number = 0;
		switch (type) {
			case TYPE.NON:
				this.tf.text = "";
				break;
			case TYPE.ODD:
				this.tf.text = "單";
				this.tf.textColor = 0xff0000;
				lineColor = 0xffffff;
				break;
			case TYPE.EVEN:
				this.tf.text = "雙";
				this.tf.textColor = 0x00ccff;
				lineColor = 0xffffff;
				break;
		}

		if (type == TYPE.NON) {
			return;
		}
		RoadItem.LINE_DEFINE.forEach((define: { flag: number, endX: number, endY: number }) => {
			if (flag & define.flag) {
				let line: egret.Shape = new egret.Shape();
				line.graphics.lineStyle(2, lineColor, 1);
				line.graphics.moveTo(12, 12);
				line.graphics.lineTo(define.endX, define.endY);
				line.graphics.endFill();
				this.addChild(line);
			}
		});
	}
}