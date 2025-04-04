import type { ColInfo } from "./colInfo";

/**
 * A special html element that data-cell inside the grid.
 */
export interface Cell extends CellData, HTMLElement{
}


/**
 * The data that a cell contains.
 */
export interface CellData {
    /**
     * The ID of the grid to which the cell belongs.
     */
    _gridId: string;
    /**
     * The string 'ghd' | 'gbd' | 'gfd' ('grid-header-data', 'grid-body-data', 'grid-footer-data') are a constant.
     */
    _type: string;
    /**
     * The value that the cell has
     */
    _value: any;
    /**
     * Row position of a cell in a grid
     */
    _row: number;
    /**
     * Column position of a cell in a grid
     */
    _col: number;
    /**
     * How many rows span a cell in a grid
     */
    _rowSpan: number;
    /**
     * How many cols span a cell in a grid
     */
    _colSpan: number;
    /**
     * Whether the cell uses the row Merge feature.
     */
    _isRowMerge: boolean;
    /**
     * Whether the cell uses the col Merge feature.
     */
    _isColMerge: boolean;
    /**
     * colInfo which cell has
     */
    _colInfo: ColInfo;
}

/**
 * Record of cell changes
 */
export interface CellRecord {
    /**
     * Changed Cells
     */
    cell: Cell;
    /**
     * Value before change
     */
    oldValue: any;
    /**
     * Value after change
     */
    newValue: any;
}
