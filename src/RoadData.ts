class RoadData {

	public static NON: number = 0;
	public static ODD: number = 1;
	public static EVEN: number = 2;

	public static LINE_NON: number = 0;
	public static LINE_UP: number = 1;
	public static LINE_DOWN: number = 2;
	public static LINE_LEFT: number = 4;
	public static LINE_RIGHT: number = 8;

	/**源頭 */
	public head: number = -1;

	/**類型 */
	public type: number = RoadData.NON;

	public line: number = 0;

	public constructor() {
	}

	public get isFull(): boolean {
		return this.type != RoadData.NON;
	}

	public reset(): void {
		this.head = -1;
		this.type = RoadData.NON;
	}
}