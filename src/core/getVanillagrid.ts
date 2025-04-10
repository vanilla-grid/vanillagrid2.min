import type { Vanillagrid, VanillagridConfig } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { DefaultGridCssInfo, DefaultGridInfo } from "../types/gridInfo";
import type { ColInfo, DefaultColInfo } from "../types/colInfo";
import type { Cell, CellData, CellRecord } from "../types/cell";
import type { Handler } from "../types/handler";
import { SelectionPolicy, VerticalAlign } from "../types/enum";
import { injectCustomElement } from "../utils/createElement";
import { mountVanillagrid } from "./mountVanillagrid";
import { unmountVanillagrid } from "./unmountVanillagrid";
import { setHandleActive } from "../utils/handleActive";
import { setHandleElement } from "../utils/handleElement";
import { setHandleGrid } from "../utils/handleGrid";
import { setHandleCell } from "../utils/handleCell";

let singletonVanillagrid: Vanillagrid | null = null;
const gridList: Record<string, Grid> = {};
const handler = {
    reConnectedCallbackElement(cell: Cell) {},
    selectCell(targetCell: Cell) {},
    focusCell(targetCell: Cell) {},
    resetSelection(grid: Grid) {},
    unselectCells(grid: Grid) {},
    selectCells(startCell: Cell, endCell: Cell, _focusCell?: Cell) {},
    setActiveCol(grid: Grid) {},
    setActiveRow(grid: Grid) {},
    startScrolling(grid: Grid, action: string) {},
    stopScrolling(vg: Vanillagrid) {},
    copyGrid(copyCells: Cell[]) {},
    getCopyText(copyCells: Cell[]) {},
    pasteGrid(e: ClipboardEvent, grid: Grid) {},
    getRecordsWithModifyValue(cell: Cell, value: any, isMethodCalled?: boolean) {},
    getTabCell(targetCell: Cell, isNegative: boolean) {},
    getMoveRowCell(targetCell: Cell, mRow: number) {},
    getMoveColCell(targetCell: Cell, mCol: number) {},
    recordGridModify(grid: Grid, records: CellRecord[]) {},
    redoundo(grid: Grid, isRedo?: boolean) {},
    selectAndCheckboxOnChange(target: any) {},
    modifyColSize(grid: Grid, targetCell: Cell, modifySize: number) {},
    changeColSize(grid: Grid, targetCol: number, changeSize: number) {},
    modifyCellValue(cell: Cell, value: any, records: CellRecord[], isMethodCalled?: boolean) {},
    modifyCell(vg: Vanillagrid) {},
    sort(grid: Grid, arr: CellData[][], id: string, isAsc?: boolean, isNumSort?: boolean) {},
    setFilterOptions(select: any, options: any) {},
    reloadColFilterValue(grid: Grid, colId: number | string) {},
    reloadFilter(grid: Grid, colId: number | string) {},
    reloadColForMerge(grid: Grid, colIndex: number) {},
    reloadGridWithModifyCell(grid: Grid, colIndex: number) {},
    reloadGridForMerge(grid: Grid) {},
    reloadFooterValue(grid: Grid) {},
    setGridDataRowCol(el: Cell, row: number, col: number) {},
    setGridDataPosition(el: Cell) {},
    getGridCell(grid: Grid, colInfo: ColInfo, valueOrData: any, rowCount: number, colCount: number) {},
    __getDefaultColInfo(grid: Grid, newColInfo: ColInfo, isAdd?: boolean) {},
    __getColInfo(grid: Grid, colIndexOrColId: string | number, useError?: boolean) {},
    __getColIndex(grid: Grid, colIndexOrColId: number | string, useError?: boolean) {},
    __setGridColSize(grid: Grid) {},
    _getCellChildNode(cell: Cell) {},
    __loadHeader(grid: Grid) {},
    _getHeaderRow(grid: Grid, rowIndex: number) {},
    _getHeaderCell(grid: Grid, rowIndex: number, colIndexOrColId: number | string) {},
    _getHeaderCells(grid: Grid) {},
    __getHeaderFilter(grid: Grid, colIndexOrColId: number | string) {},
    __loadFooter(grid: Grid) {},
    _getFooterRow(grid: Grid, rowIndex: number) {},
    _getFooterCell(grid: Grid, rowIndex: number, colIndexOrColId: number | string) {},
    _getFooterCells(grid: Grid) {},
    _getRow(grid: Grid, rowIndex: number) {},
    _getCell(grid: Grid, rowIndex: number, colIndexOrColId: number | string) {},
    _getCells(grid: Grid) {},
    __gridBodyCellsReConnected(grid: Grid) {},
    __mountGridBodyCell(grid: Grid) {},
    __clear(grid: Grid) {},
    __checkRowIndex(grid: Grid, row: number) {},
    __checkColRownumOrStatus(grid: Grid, colIndexOrColId: number | string) {},
    __checkColIndex(grid: Grid, col: number) {},
    ___getDatasWithoutExceptedProperty(grid: Grid, exceptedProperty?: string[]) {},
    _doFilter(grid: Grid) {},
    __gridCellReConnectedWithControlSpan(cell: Cell) {},
    __getData(cell: Cell, exceptedProperty?: string[]) {},
    __setCellData(grid: Grid, row: number, colIndexOrColId: number | string, cellData: CellData, isImmutableColCheck?: boolean) {},
    _getDataTypeStyle(grid: Grid) {},
    _getFilterSpan() {},
    _getFooterFormula() {},
    isCellVisible(cell: Cell) {},
    getFirstCellValidNumber(footerCell: Cell) {},
    removeGridEditor(activeGridEditor: any) {},
    addBagicEventListenerToGridEditor(gridEditor: HTMLElement, activeGrid: Grid) {},
    setBagicAttributesToGridEditor(gridEditor: any, cell: Cell) {},
    createGridEditorTextarea(cell: Cell) {},
    createGridEditorNumber(cell: Cell) {},
    createGridEditorDate(cell: Cell) {},
    createGridEditorMonth(cell: Cell) {},
    createGridEditorMask(cell: Cell) {},
    createGridEditorCode(cell: Cell) {},
    createGridEditor(cell: Cell, isEnterKey?: boolean) {},
    getValidValue(cell: Cell, value: any) {},
    getTextFromCell (cell: Cell) {},
    getFormatNumber(format: string, value: any) {},
    getFormatNumberFromCell(cell: Cell) {},
    getDateWithValueDateFormat(dateStr: string) {},
    getDateWithValueMonthFormat(dateStr: string) {},
    getDateWithInputDateFormat(dateStr: string) {},
    getDateWithInputMonthFormat(dateStr: string) {},
    getDateWithGridDateFormat(cell: Cell) {},
    getDateWithGridMonthFormat(cell: Cell) {},
    getCheckboxCellTrueOrFalse(cell: Cell) {},
    getCodeValue(code: string[], defaultCode: string | null, value: string) {},
    getMaskValue(format: string, value: string) {},
    setSelectOptions(select: any, options: any) {},
    getSelectOptions(select: any) {}
} as Handler;

export const getVanillagrid = (config?: VanillagridConfig): Vanillagrid => {
    if(singletonVanillagrid) return singletonVanillagrid;

    if(!config) config = getVanillagridConfig();

    singletonVanillagrid = {
        elements : {
            sortAscSpan: config.elements.sortAscSpan,
            sortDescSpan: config.elements.sortDescSpan,
            filterSpan: config.elements.filterSpan,
        },
        footerFormula: config.footerFormula,
        dataType: config.dataType,
        attributes: {
            defaultGridInfo: config.attributes.defaultGridInfo,
            defaultGridCssInfo: config.attributes.defaultGridCssInfo,
            defaultColInfo: config.attributes.defaultColInfo,
        },
        checkByte: config.checkByte,
        getGrid: (gridId: string) => {
            if(gridList[gridId]) return null;
            const grid: Grid = gridList[gridId];
            return grid.methods ? grid.methods : null;
        },
        documentEvent: {
            mousedown: null,
            mouseup: null,
            keydown: null,
            copy: null,
            paste: null,
        },
        _status: {
            isDragging: false,
            onHeaderDragging: false,
            isHeaderDragging: false,
            mouseX: 0,
            mouseY: 0,
            activeGrid: null,
            activeGridEditor: null,
            editOldValue: null,
            editNewValue: null,
            filterOldValue: null,
            filterNewValue: null,
            mouseoverCell: null,
            scrollInterval: null,
        },
        init() { initVanillagrid(); },
        mountGrid(element?: HTMLElement) { mountVanillagrid(singletonVanillagrid!, gridList, handler, element) },
        destroy() { destroyVanillagrid() },
        unmountGrid(element?: HTMLElement) { unmountVanillagrid(singletonVanillagrid!, gridList, element) },
        _VanillaGrid: null,
        _GridHeader: null,
        _GridBody: null,
        _GridFooter: null,
        _GridData: null,
        _initialized: false,
    };

    return singletonVanillagrid;
}

export const getVanillagridConfig = (): VanillagridConfig => {
    const defaultGridInfo: DefaultGridInfo = {
        locked : false,
        lockedColor : true,
        resizable : true,
        redoable : true,
        redoCount : 30,
        visible : true,
        headerVisible : true,
        rownumVisible : true,
        rownumSize : '60px',
        rownumLockedColor: true,
        statusVisible : true,
        statusLockedColor: true,
        selectionPolicy : SelectionPolicy.range,
        nullValue : null,
        dateFormat : 'yyyy-mm-dd',
        monthFormat : 'yyyy-mm',
        alterRow : true,
        frozenColCount : 0,
        frozenRowCount : 0,
        sortable : true,
        filterable : true,
        allCheckable : true,
        checkedValue : 'Y',
        uncheckedValue : 'N',
    };
    const defaultGridCssInfo: DefaultGridCssInfo = {
        width : '100%',
        height : '600px',
        margin : '0 auto',
        padding : '0',
        sizeLevel : 5,
        verticalAlign : VerticalAlign.center,
        cellFontSize : 14,
        cellMinHeight : 21,
        horizenBorderSize : 1,
        verticalBorderSize : 1,
        gridFontFamily : 'Arial',
        editorFontFamily : 'Arial',
        overflowWrap : null,
        wordBreak : null,
        whiteSpace : null,
        linkHasUnderLine : true,
        invertColor : false,
        color : null,
        colorSet : null,
        gridBorderColor : null,
        headerCellBackColor : null,
        headerCellBorderColor : null,
        headerCellFontColor : null,
        footerCellBackColor : null,
        footerCellBorderColor : null,
        footerCellFontColor : null,
        bodyBackColor : null,
        bodyCellBackColor : null,
        bodyCellBorderColor : null,
        bodyCellFontColor : null,
        editorBackColor : null,
        editorFontColor : null,
        selectCellBackColor : null,
        selectCellFontColor : null,
        selectColBackColor : null,
        selectColFontColor : null,
        selectRowBackColor : null,
        selectRowFontColor : null,
        mouseoverCellBackColor : null,
        mouseoverCellFontColor : null,
        lockCellBackColor : null,
        lockCellFontColor : null,
        alterRowBackColor : null,
        alterRowFontColor : null,
        buttonFontColor : null,
        buttonBorderColor : null,
        buttonBackColor : null,
        buttonHoverFontColor : null,
        buttonHoverBackColor : null,
        buttonActiveFontColor : null,
        buttonActiveBackColor : null,
        linkFontColor : null,
        linkHoverFontColor : null,
        linkActiveFontColor : null,
        linkVisitedFontColor : null,
        linkFocusFontColor : null,
    };
    const defaultColInfo: DefaultColInfo = {
        untarget: false,
        rowMerge : false,
        colMerge : false,
        colVisible : true,
        required : false,
        resizable : true,
        sortable : true,
        filterable : true,
        originWidth : '80px',
        dataType : 'text',
        selectSize : '100%',
        locked: false,
        lockedColor: true,
        format : null,
        codes : null,
        defaultCode : null,
        maxLength : null,
        maxByte : null,
        maxNumber : null,
        minNumber : null,
        roundNumber : null,
        align : null,
        verticalAlign : null,
        overflowWrap : null,
        wordBreak : null,
        whiteSpace : null,
        backColor : null,
        fontColor : null,
        fontBold : false,
        fontItalic : false,
        fontThruline : false,
        fontUnderline : false,
    };
    const vanillagridConfig = {
        elements : {
            sortAscSpan: null,
            sortDescSpan: null,
            filterSpan: null,
        },
        footerFormula: {},
        dataType: {},
        attributes: {
            defaultGridInfo: defaultGridInfo,
            defaultGridCssInfo: defaultGridCssInfo,
            defaultColInfo: defaultColInfo,
        },
        checkByte: {
            lessoreq0x7ffByte: 2,
            lessoreq0xffffByte: 3,
            greater0xffffByte: 4,
        },
    }
    return vanillagridConfig;
}

const initVanillagrid = () => {
    const vg: Vanillagrid = singletonVanillagrid!;
    setHandleActive(vg, gridList, handler);
    setHandleElement(vg, gridList, handler);
    setHandleGrid(vg, gridList, handler);
    setHandleCell(vg, gridList, handler);

    vg.documentEvent.mousedown = function (e: any) {
        if (vg._status.activeGridEditor && vg._status.activeGridEditor !== e.target) {
            handler.modifyCell(vg);
        }
        
        if (vg._status.activeGrid && !vg._status.activeGrid.elements.grid.contains(e.target)) {
            vg._status.activeGrid = null;
        }
    };
    document.removeEventListener('mousedown', vg.documentEvent.mousedown);
    document.addEventListener('mousedown', vg.documentEvent.mousedown);
    
    vg.documentEvent.mouseup = function (e: any) {
        vg._status.mouseX = 0;
        vg._status.mouseY = 0;
        handler.stopScrolling(vg);

        if (vg._status.isDragging) {
            vg._status.isDragging = false;
        }
        if (vg._status.isHeaderDragging) {
            vg._status.isHeaderDragging = false;
        }
    }
    document.removeEventListener('mouseup', vg.documentEvent.mouseup);
    document.addEventListener('mouseup', vg.documentEvent.mouseup);
    
    vg.documentEvent.keydown = function (e: any) {
        if (vg._status.activeGrid && !vg._status.activeGridEditor) {
            
            if(vg._status.activeGrid.events.onKeydownGrid(e) === false) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                    case 'Z': 
                        handler.redoundo(vg._status.activeGrid);
                        e.preventDefault();
                        break;
                    case 'y':
                    case 'Y': 
                        handler.redoundo(vg._status.activeGrid, false);
                        e.preventDefault();
                        break;
                    case 'a':
                    case 'A': 
                        vg._status.activeGrid.data.variables.targetCell = handler._getCell(vg._status.activeGrid, 1, 3)!;
                        handler.selectCells(handler._getCell(vg._status.activeGrid, 1, 1)!, handler._getCell(vg._status.activeGrid, vg._status.activeGrid.methods.getRowCount(), vg._status.activeGrid.methods.getColCount())!);
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            }
            if (vg._status.activeGrid.data.gridInfo.selectionPolicy === 'none' || vg._status.activeGrid.data.variables.activeCells.length <= 0) return;
            const startCell = vg._status.activeGrid.data.variables.activeCells[0];
            const endCell = vg._status.activeGrid.data.variables.activeCells[vg._status.activeGrid.data.variables.activeCells.length - 1];
            let newTargetCell: Cell;
            Object.keys(vg.dataType).forEach((key) => {
                if(vg._status.activeGrid!.data.variables.targetCell!.dataType === key) {
                    if(vg.dataType[key].onSelectedAndKeyDown) {
                        if(typeof vg.dataType[key].onSelectedAndKeyDown !== 'function') throw new Error('onSelectedAndKeyDown must be a function.');
                        if(vg.dataType[key].onSelectedAndKeyDown(e, handler.__getData(vg._status.activeGrid!.data.variables.targetCell!)!) === false) {
                            return;
                        }
                    }
                }
            });
            switch (e.key) {
                case 'Tab':
                    newTargetCell = handler.getTabCell(vg._status.activeGrid.data.variables.targetCell!, e.shiftKey)!;
                    handler.selectCell(newTargetCell);
                    e.preventDefault();
                    break;
                case 'F2':
                    handler.createGridEditor(vg._status.activeGrid.data.variables.targetCell!);
                    e.preventDefault();
                    break;
                case 'Enter':
                    if (vg._status.activeGrid.data.variables.targetCell!.dataType === 'select') {
                        vg._status.editOldValue = (vg._status.activeGrid.data.variables.targetCell as any).firstChild.value;
                        (vg._status.activeGrid.data.variables.targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid.data.variables.targetCell!.dataType === 'checkbox') {
                        vg._status.editOldValue = vg._status.activeGrid.data.variables.targetCell!.value;
                        (vg._status.activeGrid.data.variables.targetCell as any).firstChild.checked = !(vg._status.activeGrid.data.variables.targetCell as any).firstChild.checked;
                        handler.selectAndCheckboxOnChange(vg._status.activeGrid.data.variables.targetCell!.firstChild);
                        
                        newTargetCell = handler.getMoveRowCell(vg._status.activeGrid.data.variables.targetCell!, 1)!;
                        handler.selectCell(newTargetCell);
                        e.preventDefault();
                    }
                    else if (['text','number','date','month','mask','code'].indexOf(vg._status.activeGrid.data.variables.targetCell!.dataType!) >= 0) {
                        handler.createGridEditor(vg._status.activeGrid.data.variables.targetCell!, true);
                        e.preventDefault();
                    }
                    break;
                case ' ':
                    if (vg._status.activeGrid.data.variables.targetCell!.dataType === 'select') {
                        if (vg._status.activeGrid.data.variables.targetCell!.untarget || vg._status.activeGrid.data.variables.targetCell!.locked) {
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = (vg._status.activeGrid.data.variables.targetCell as any).firstChild.value;
                        (vg._status.activeGrid.data.variables.targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid.data.variables.targetCell!.dataType === 'button') {
                        (vg._status.activeGrid.data.variables.targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid.data.variables.targetCell!.dataType === 'checkbox') {
                        if (vg._status.activeGrid.data.variables.targetCell!.untarget || vg._status.activeGrid.data.variables.targetCell!.locked) {
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = vg._status.activeGrid.data.variables.targetCell!.value;
                        (vg._status.activeGrid.data.variables.targetCell as any).firstChild.checked = !(vg._status.activeGrid.data.variables.targetCell as any).firstChild.checked;
                        handler.selectAndCheckboxOnChange(vg._status.activeGrid.data.variables.targetCell!.firstChild);
                        e.preventDefault();
                    }
                    else if (['text','number','date','month','mask','code'].indexOf(vg._status.activeGrid.data.variables.targetCell!.dataType!) >= 0) {
                        handler.createGridEditor(vg._status.activeGrid.data.variables.targetCell!);
                        e.preventDefault();
                    }
                    break;
                case 'ArrowUp':
                    if (vg._status.activeGrid.data.gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        handler.unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid.data.variables.targetCell!._row >= endCell._row) {
                            newTargetCell = handler.getMoveRowCell(startCell, -1)!;
                            handler.selectCells(newTargetCell, endCell, newTargetCell);
                        }
                        else {
                            newTargetCell = handler.getMoveRowCell(endCell, -1)!;
                            handler.selectCells(startCell, newTargetCell);
                        }
                    }
                    else {
                        newTargetCell = handler.getMoveRowCell(vg._status.activeGrid.data.variables.targetCell!, -1)!;
                        handler.selectCell(newTargetCell);
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (vg._status.activeGrid.data.gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        handler.unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid.data.variables.targetCell!._row <= startCell._row) {
                            newTargetCell = handler.getMoveRowCell(endCell, 1)!;
                            handler.selectCells(startCell, newTargetCell);
                        }
                        else {
                            newTargetCell = handler.getMoveRowCell(startCell, 1)!;
                            handler.selectCells(newTargetCell, endCell, newTargetCell);
                        }
                    }
                    else {
                        newTargetCell = handler.getMoveRowCell(vg._status.activeGrid.data.variables.targetCell!, 1)!;
                        handler.selectCell( newTargetCell);
                    }
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (vg._status.activeGrid.data.gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        handler.unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid.data.variables.targetCell!._col >= endCell._col) {
                            newTargetCell = handler.getMoveColCell(startCell, -1)!;
                            handler.selectCells(newTargetCell, endCell, newTargetCell);
                        }
                        else {
                            newTargetCell = handler.getMoveColCell(endCell, -1)!;
                            handler.selectCells(startCell, newTargetCell);
                        }
                    }
                    else {
                        newTargetCell = handler.getMoveColCell(vg._status.activeGrid.data.variables.targetCell!, -1)!;
                        handler.selectCell(newTargetCell);
                    }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (vg._status.activeGrid.data.gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        handler.unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid.data.variables.targetCell!._col <= startCell._col) {
                            newTargetCell = handler.getMoveColCell(endCell, 1)!;
                            handler.selectCells(startCell, newTargetCell);
                        }
                        else {
                            newTargetCell = handler.getMoveColCell(startCell, 1)!;
                            handler.selectCells(newTargetCell, endCell, newTargetCell)!;
                        }
                    }
                    else {
                        newTargetCell = handler.getMoveColCell(vg._status.activeGrid.data.variables.targetCell!, 1)!;
                        handler.selectCell(newTargetCell);
                    }
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        }
    };
    document.removeEventListener('keydown', vg.documentEvent.keydown);
    document.addEventListener('keydown', vg.documentEvent.keydown);
    vg.documentEvent.copy = function (e: any) {
        if (vg._status.activeGrid && !vg._status.activeGridEditor) {
            const currentActiveCells = vg._status.activeGrid.data.variables.activeCells;
            if (currentActiveCells.length > 0) {
                e.preventDefault();
                handler.copyGrid(currentActiveCells);
            }
        }
    };
    document.removeEventListener('copy', vg.documentEvent.copy);
    document.addEventListener('copy', vg.documentEvent.copy);

    vg.documentEvent.paste = function (e: any) {
        if (vg._status.activeGrid && !vg._status.activeGridEditor) {
            if (vg._status.activeGrid.data.variables.activeCells.length > 0) {
                e.preventDefault();
                handler.pasteGrid(e, vg._status.activeGrid);
            }
        }
    };
    document.removeEventListener('paste', vg.documentEvent.paste);
    document.addEventListener('paste', vg.documentEvent.paste);

    injectCustomElement(vg, gridList, handler);
    vg._initialized = true;
}

const destroyVanillagrid = () => {
    if(!singletonVanillagrid) return;
    Object.values(gridList).forEach((grid: Grid | null) => {
        const vanillagrid = document.getElementById(grid!.data.id);
        const stylesSheet = document.getElementById(grid!.data.id + '_styles-sheet');
        if (vanillagrid) (vanillagrid as any).parentNode.removeChild(vanillagrid);
        if (stylesSheet) (stylesSheet as any).parentNode.removeChild(stylesSheet);
        delete gridList[grid!.data.id];
        grid = null;
    });
    document.removeEventListener('mousedown', singletonVanillagrid.documentEvent.mousedown!);
    document.removeEventListener('mouseup', singletonVanillagrid.documentEvent.mouseup!);
    document.removeEventListener('keydown', singletonVanillagrid.documentEvent.keydown!);
    document.removeEventListener('copy', singletonVanillagrid.documentEvent.copy!);
    document.removeEventListener('paste', singletonVanillagrid.documentEvent.paste!);
    
    singletonVanillagrid.unmountGrid();
    singletonVanillagrid = null;
}
