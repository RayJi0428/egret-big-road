/**
 * 路子(單雙/大小 等等...)
 */
class RoadItem extends egret.Sprite {

	private tf: egret.TextField;

	private lineContainer: egret.DisplayObjectContainer;

	private static LINE_DEFINE: { flag: number, endX: number, endY: number }[] = [
		{ flag: RoadData.LINE_UP, endX: 12, endY: 0 },
		{ flag: RoadData.LINE_DOWN, endX: 12, endY: 24 },
		{ flag: RoadData.LINE_LEFT, endX: 0, endY: 12 },
		{ flag: RoadData.LINE_RIGHT, endX: 24, endY: 12 }
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

		this.lineContainer = new egret.DisplayObjectContainer();
		this.addChild(this.lineContainer);

		this.refresh(RoadData.NON, RoadData.LINE_NON);
	}

	/**
	 * 
	 */
	public refresh(type: number, flag: number): void {

		let lineColor: number = 0;
		switch (type) {
			case RoadData.NON:
				this.tf.text = "";
				break;
			case RoadData.ODD:
				this.tf.text = "單";
				this.tf.textColor = 0xff0000;
				lineColor = 0xffffff;
				break;
			case RoadData.EVEN:
				this.tf.text = "雙";
				this.tf.textColor = 0x00ccff;
				lineColor = 0xffffff;
				break;
		}

		this.lineContainer.removeChildren();

		RoadItem.LINE_DEFINE.forEach((define: { flag: number, endX: number, endY: number }) => {
			if (flag & define.flag) {
				let line: egret.Shape = new egret.Shape();
				line.graphics.lineStyle(2, lineColor, 1);
				line.graphics.moveTo(12, 12);
				line.graphics.lineTo(define.endX, define.endY);
				line.graphics.endFill();
				this.lineContainer.addChild(line);
			}
		});
	}
}