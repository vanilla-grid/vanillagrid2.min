import type { Vanillagrid } from "./vanillagrid";
import type { ColInfo } from "./colInfo";
import type { Cell, CellData, CellRecord } from "./cell";

export interface Handler {
    /** ////////////////////////
     * handleActive
     *//////////////////////////
    reConnectedCallbackElement(cell: Cell): void;
    selectCell(targetCell: Cell): boolean;
    focusCell(targetCell: Cell): void;
    resetSelection(gridId: string): void;
    unselectCells(gridId: string): void;
    selectCells(startCell: Cell, endCell: Cell, _focusCell?: Cell): boolean;
    setActiveCol(gridId: string): void;
    setActiveRow(gridId: string): void;
    startScrolling(gridId: string, action: string): void;
    stopScrolling(vg: Vanillagrid): void;
    copyGrid(copyCells: Cell[]): void;
    getCopyText(copyCells: Cell[]): string;
    pasteGrid(e: ClipboardEvent, gridId: string): void;
    getRecordsWithModifyValue(cell: Cell, value: any, isMethodCalled?: boolean): CellRecord[];
    getTabCell(targetCell: Cell, isNegative: boolean): Cell | null;
    getMoveRowCell(targetCell: Cell, mRow: number): Cell | null;
    getMoveColCell(targetCell: Cell, mCol: number): Cell | null;
    recordGridModify(gridId: string, records: CellRecord[]): void;
    redoundo(gridId: string, isRedo?: boolean): boolean;
    selectAndCheckboxOnChange(target: any): void;
    /** ////////////////////////
     * handleElement
     *//////////////////////////
    modifyColSize(targetCell: Cell, modifySize: number): void;
    changeColSize(gridId: string, targetCol: number, changeSize: number): void;
    modifyCellValue(cell: Cell, value: any, records: CellRecord[], isMethodCalled?: boolean): void;
    modifyCell(vg: Vanillagrid): void;
    sort(gridId: string, arr: CellData[][], id: string, isAsc?: boolean, isNumSort?: boolean): Record<string, any>[];
    setFilterOptions(select: any, options: any): void;
    reloadColFilterValue(gridId: string, colId: number | string): void;
    reloadFilter(gridId: string, colId: number | string): void;
    reloadColForMerge(gridId: string, colIndex: number): void;
    reloadGridWithModifyCell(gridId: string, colIndex: number): void;
    reloadGridForMerge(gridId: string): void;
    reloadFooterValue(gridId: string): void;
    setGridDataRowCol(el: Cell, row: number, col: number): void;
    setGridDataPosition(el: Cell): void;
    getGridCell(gridId: string, colInfo: ColInfo, valueOrData: any, rowCount: number, colCount: number): Cell;
    /** ////////////////////////
     * handleGrid
     *//////////////////////////
    __getDefaultColInfo(gridId: string, newColInfo: ColInfo, isAdd?: boolean): ColInfo;
    __getColInfo(gridId: string, colIndexOrColId: string | number, useError?: boolean): ColInfo | null;
    __getColIndex(gridId: string, colIndexOrColId: number | string, useError?: boolean): number | null;
    __setGridColSize(gridId: string): void;
    _getCellChildNode(cell: Cell): HTMLElement | null;
    __loadHeader(gridId: string): void;
    _getHeaderRow(gridId: string, rowIndex: number): Cell[];
    _getHeaderCell(gridId: string, rowIndex: number, colIndexOrColId: number | string): Cell;
    _getHeaderCells(gridId: string): Cell[][];
    __getHeaderFilter(gridId: string, colIndexOrColId: number | string): any;
    __loadFooter(gridId: string): void;
    _getFooterRow(gridId: string, rowIndex: number): Cell[];
    _getFooterCell(gridId: string, rowIndex: number, colIndexOrColId: number | string): Cell;
    _getFooterCells(gridId: string): Cell[][];
    _getRow(gridId: string, rowIndex: number): Cell[];
    _getCell(gridId: string, rowIndex: number, colIndexOrColId: number | string): Cell | null;
    _getCells(gridId: string): Cell[][];
    __gridBodyCellsReConnected(gridId: string): void;
    __mountGridBodyCell(gridId: string): void;
    __clear(gridId: string): void;
    __checkRowIndex(gridId: string, row: number): void;
    __checkColRownumOrStatus(colIndexOrColId: number | string): void;
    __checkColIndex(gridId: string, col: number): void;
    ___getDatasWithoutExceptedProperty(gridId: string, exceptedProperty?: string[]): CellData[][];
    _doFilter(gridId: string): void;
    __gridCellReConnectedWithControlSpan(cell: Cell): void;
    __getData(cell: Cell, exceptedProperty?: string[]): CellData;
    __setCellData(gridId: string, row: number, colIndexOrColId: number | string, cellData: CellData, isImmutableColCheck?: boolean): boolean;
    _getDataTypeStyle(): any;
    _getFilterSpan(): HTMLElement | null;
    _getFooterFormula(): Record<string, Function> | null;
    /** ////////////////////////
     * handleCell
     *//////////////////////////
    isCellVisible(cell: Cell): boolean;
    getFirstCellValidNumber(footerCell: Cell): number | null;
    removeGridEditor(): boolean;
    addBagicEventListenerToGridEditor(gridEditor: HTMLElement): void;
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
    /** ////////////////////////
     * handleGrid
     *//////////////////////////
    connectedGridHeader(gridId: string): void;
    connectedGridBody(gridId: string): void;
    connectedGridFooter(gridId: string): void;
    connectedGridData(cell: Cell): void;
}
