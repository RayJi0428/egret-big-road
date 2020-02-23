/**
 * 節點資料
 */
class Grid {

	/**源頭 */
	public head: number = 0;

	/**所在欄 */
	public col: number = 0;

	/**所在列 */
	public row: number = 0;


	public constructor(col: number = 0, row: number = 0, headCol: number = 0) {
		this.col = col;
		this.row = row;
		this.head = headCol;
	}
	public reset(): void {
		this.col = 0;
		this.row = 0;
		this.head = 0;
	}

	public toRight(): void {
		this.col = 1;
		this.row = 0;
	}

	public toBottom(): void {
		this.col = 0;
		this.row = 1;
	}

	public setup(head: number, col: number, row: number): void {
		this.head = head;
		this.col = col;
		this.row = row;
	}

	public copy(grid: Grid): void {
		this.head = grid.head;
		this.col = grid.col;
		this.row = grid.row;
	}
}