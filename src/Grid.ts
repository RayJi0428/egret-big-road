/**
 * 節點資料
 */
class Grid {

	public col: number = 0;

	public row: number = 0;
	public constructor(col: number = 0, row: number = 0) {
		this.col = col;
		this.row = row;
	}
	public reset(): void {
		this.col = 0;
		this.row = 0;
	}
}