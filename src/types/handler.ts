import type { Vanillagrid } from "./vanillagrid";
import type { Grid } from "./grid";
import type { ColInfo } from "./colInfo";
import type { Cell, CellData, CellRecord } from "./cell";

export interface Handler {
    /** ////////////////////////
     * handleActive
     *//////////////////////////
    reConnectedCallbackElement(cell: Cell): void;
    selectCell(targetCell: Cell): boolean;
    focusCell(targetCell: Cell): void;
    resetSelection(grid: Grid): void;
    unselectCells(grid: Grid): void;
    selectCells(startCell: Cell, endCell: Cell, _focusCell?: Cell): boolean;
    setActiveCol(grid: Grid): void;
    setActiveRow(grid: Grid): void;
    startScrolling(grid: Grid, action: string): void;
    stopScrolling(vg: Vanillagrid): void;
    copyGrid(copyCells: Cell[]): void;
    getCopyText(copyCells: Cell[]): string;
    pasteGrid(e: ClipboardEvent, grid: Grid): void;
    getRecordsWithModifyValue(cell: Cell, value: any, isMethodCalled?: boolean): CellRecord[];
    getTabCell(targetCell: Cell, isNegative: boolean): Cell | null;
    getMoveRowCell(targetCell: Cell, mRow: number): Cell | null;
    getMoveColCell(targetCell: Cell, mCol: number): Cell | null;
    recordGridModify(grid: Grid, records: CellRecord[]): void;
    redoundo(grid: Grid, isRedo?: boolean): boolean;
    selectAndCheckboxOnChange(target: any): void;
    /** ////////////////////////
     * handleElement
     *//////////////////////////
    modifyColSize(grid: Grid, targetCell: Cell, modifySize: number): void;
    changeColSize(grid: Grid, targetCol: number, changeSize: number): void;
    modifyCellValue(cell: Cell, value: any, records: CellRecord[], isMethodCalled?: boolean): void;
    modifyCell(vg: Vanillagrid): void;
    sort(grid: Grid, arr: CellData[][], id: string, isAsc?: boolean, isNumSort?: boolean): Record<string, any>[];
    setFilterOptions(select: any, options: any): void;
    reloadColFilterValue(grid: Grid, colId: number | string): void;
    reloadFilter(grid: Grid, colId: number | string): void;
    reloadColForMerge(grid: Grid, colIndex: number): void;
    reloadGridWithModifyCell(grid: Grid, colIndex: number): void;
    reloadGridForMerge(grid: Grid): void;
    reloadFooterValue(grid: Grid): void;
    setGridDataRowCol(el: Cell, row: number, col: number): void;
    setGridDataPosition(el: Cell): void;
    getGridCell(grid: Grid, colInfo: ColInfo, valueOrData: any, rowCount: number, colCount: number): Cell;
    /** ////////////////////////
     * handleGrid
     *//////////////////////////
    __getDefaultColInfo(grid: Grid, newColInfo: ColInfo, isAdd?: boolean): ColInfo;
    __getColInfo(grid: Grid, colIndexOrColId: string | number, useError?: boolean): ColInfo | null;
    __getColIndex(grid: Grid, colIndexOrColId: number | string, useError?: boolean): number | null;
    __setGridColSize(grid: Grid): void;
    _getCellChildNode(cell: Cell): HTMLElement | null;
    __loadHeader(grid: Grid): void;
    _getHeaderRow(grid: Grid, rowIndex: number): Cell[];
    _getHeaderCell(grid: Grid, rowIndex: number, colIndexOrColId: number | string): Cell;
    _getHeaderCells(grid: Grid): Cell[][];
    __getHeaderFilter(grid: Grid, colIndexOrColId: number | string): any;
    __loadFooter(grid: Grid): void;
    _getFooterRow(grid: Grid, rowIndex: number): Cell[];
    _getFooterCell(grid: Grid, rowIndex: number, colIndexOrColId: number | string): Cell;
    _getFooterCells(grid: Grid): Cell[][];
    _getRow(grid: Grid, rowIndex: number): Cell[];
    _getCell(grid: Grid, rowIndex: number, colIndexOrColId: number | string): Cell | null;
    _getCells(grid: Grid): Cell[][];
    __gridBodyCellsReConnected(grid: Grid): void;
    __mountGridBodyCell(grid: Grid): void;
    __clear(grid: Grid): void;
    __checkRowIndex(grid: Grid, row: number): void;
    __checkColRownumOrStatus(grid: Grid, colIndexOrColId: number | string): void;
    __checkColIndex(grid: Grid, col: number): void;
    ___getDatasWithoutExceptedProperty(grid: Grid, exceptedProperty?: string[]): CellData[][];
    _doFilter(grid: Grid): void;
    __gridCellReConnectedWithControlSpan(cell: Cell): void;
    __getData(cell: Cell, exceptedProperty?: string[]): CellData;
    __setCellData(grid: Grid, row: number, colIndexOrColId: number | string, cellData: CellData, isImmutableColCheck?: boolean): boolean;
    _getDataTypeStyle(grid: Grid): any;
    _getFilterSpan(): HTMLElement | null;
    _getFooterFormula(): Record<string, Function> | null;
    /** ////////////////////////
     * handleCell
     *//////////////////////////
    isCellVisible(cell: Cell): boolean;
    getFirstCellValidNumber(footerCell: Cell): number | null;
    removeGridEditor(activeGridEditor: any): boolean;
    addBagicEventListenerToGridEditor(gridEditor: HTMLElement, activeGrid: Grid): void;
    setBagicAttributesToGridEditor(gridEditor: any, cell: Cell): void;
    createGridEditorTextarea(cell: Cell): HTMLTextAreaElement;
    createGridEditorNumber(cell: Cell): HTMLInputElement;
    createGridEditorDate(cell: Cell): HTMLInputElement;
    createGridEditorMonth(cell: Cell): HTMLInputElement;
    createGridEditorMask(cell: Cell): HTMLInputElement;
    createGridEditorCode(cell: Cell): HTMLInputElement;
    createGridEditor(cell: Cell, isEnterKey?: boolean): void;
    getValidValue(cell: Cell, value: any): any;
    getTextFromCell (cell: Cell): string;
    getFormatNumber(format: string, value: any): string;
    getFormatNumberFromCell(cell: Cell): string;
    getDateWithValueDateFormat(dateStr: string): string | null;
    getDateWithValueMonthFormat(dateStr: string): string | null;
    getDateWithInputDateFormat(dateStr: string): string | null;
    getDateWithInputMonthFormat(dateStr: string): string | null;
    getDateWithGridDateFormat(cell: Cell): string | null;
    getDateWithGridMonthFormat(cell: Cell): string | null;
    getCheckboxCellTrueOrFalse(cell: Cell): boolean;
    getCodeValue(code: string[], defaultCode: string | null, value: string): string | null;
    getMaskValue(format: string, value: string): string | null;
    setSelectOptions(select: any, options: any): void;
    getSelectOptions(select: any): null | {
        value: any;
        text: string;
    }[];
}
