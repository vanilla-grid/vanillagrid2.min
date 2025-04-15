import type { ColInfo } from "./colInfo";

/**
 * A special html element that data-cell inside the grid.
 */
export interface Cell extends CellData, HTMLElement{
    /**
     * The ID of the grid to which the cell belongs.
     */
    _gridId: string;
    /**
     * The string 'ghd' | 'gbd' | 'gfd' ('grid-header-data', 'grid-body-data', 'grid-footer-data') are a constant.
     */
    _type: string;
    _frozenCol?: boolean;
    _frozenRow?: boolean;
    _isLastCell?: boolean;
    _filterSelector?: HTMLSelectElement & { _gridId: string; colId: string };
}


/**
 * The data that a cell contains.
 */
export interface CellData extends Omit<ColInfo, 'header' | 'footer' | 'filterValue' | 'filterValues'> {
    /**
     * The value that the cell has
     */
    value: any;
    rowIndex: number;
    /**
     * Whether a filter has been applied.
     */
    filter: boolean | null;
    text?: string;
    /**
     * How many rows span a cell in a grid
     */
    rowSpan?: number;
    /**
     * How many cols span a cell in a grid
     */
    colSpan?: number;
    /**
     * Whether the cell uses the row Merge feature.
     */
    isRowMerge?: boolean;
    /**
     * Whether the cell uses the col Merge feature.
     */
    isColMerge?: boolean;
    /**
     * If visible is false, this row is hidden.
     */
    rowVisible?: boolean | null;
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
