import { Grid, Vanillagrid, VanillagridConfig } from "../types/vanillagrid";
import { DefaultGridCssInfo, DefaultGridInfo, GridInfo } from "../types/gridInfo";
import { DefaultColInfo } from "../types/colInfo";
import { SelectionPolicy, VerticalAlign } from "../types/enum";
import { deepFreeze } from "../utils/utils";
import { Cell, CellData } from "../types/cell";
import { modifyCell, sort } from "../utils/handleElement";
import { copyGrid, getMoveColCell, getMoveRowCell, getTabCell, pasteGrid, redoundo, selectAndCheckboxOnChange, selectCell, selectCells, stopScrolling, unselectCells } from "../utils/handleActive";
import { ___getDatasWithoutExceptedProperty, __getData, _getCell } from "../utils/handleGrid";
import { createGridEditor } from "../utils/handleCell";

let singletonVanillagrid: Vanillagrid | null = null;

export const getVanillagrid = (config?: VanillagridConfig): Vanillagrid => {
    if(singletonVanillagrid) return singletonVanillagrid;

    if(!config) config = getVanillagridConfig();

    const vanillagrid = {
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
        grids: {},
        getGrid: (gridId: string) => {},
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
        init() {},
        mount(element?: HTMLElement) {},
        destroy() {},
        unmount(element?: HTMLElement) {},
    }

    return vanillagrid as Vanillagrid;
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

export const initVanillagrid = () => {
    /*
    const dataTypeUnit = {
        TEXT: 'text',
        NUMBER: 'number',
        DATE: 'date',
        MONTH: 'month',
        MASK: 'mask',
        SELECT : 'select',
        CHECKBOX : 'checkbox',
        BUTTON : 'button',
        LINK : 'link',
        CODE : 'code',
    };
    if(vg.dataType) {
        Object.keys(vg.dataType).forEach((key) => {
            (dataTypeUnit as any)[toUpperCase(key)] = key;
        });
    }
    Object.freeze(dataTypeUnit);
    */
    const vg: Vanillagrid = singletonVanillagrid!;

    vg.documentEvent.mousedown = function (e: any) {
        if (vg._status.activeGridEditor && vg._status.activeGridEditor !== e.target) {
            modifyCell(vg);
        }
        
        if (vg._status.activeGrid && !vg._status.activeGrid.contains(e.target)) {
            vg._status.activeGrid = null;
        }
    };
    document.removeEventListener('mousedown', vg.documentEvent.mousedown);
    document.addEventListener('mousedown', vg.documentEvent.mousedown);
    
    vg.documentEvent.mouseup = function (e: any) {
        vg._status.mouseX = 0;
        vg._status.mouseY = 0;
        stopScrolling(vg);

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
            const gId = vg._status.activeGrid._id;
            
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                    case 'Z': 
                        redoundo(vg._status.activeGrid);
                        e.preventDefault();
                        break;
                    case 'y':
                    case 'Y': 
                        redoundo(vg._status.activeGrid, false);
                        e.preventDefault();
                        break;
                    case 'a':
                    case 'A': 
                        vg._status.activeGrid._variables._targetCell = _getCell(vg._status.activeGrid, 1, 3);
                        selectCells(_getCell(vg._status.activeGrid, 1, 1)!, _getCell(vg._status.activeGrid, vg._status.activeGrid.getRowCount(), vg._status.activeGrid.getColCount())!);
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            }
            if (vg._status.activeGrid._gridInfo.selectionPolicy === 'none' || vg._status.activeGrid._variables._activeCells.length <= 0) return;
            const startCell = vg._status.activeGrid._variables._activeCells[0];
            const endCell = vg._status.activeGrid._variables._activeCells[vg._status.activeGrid._variables._activeCells.length - 1];
            let newTargetCell: Cell;
            Object.keys(vg.dataType).forEach((key) => {
                if(vg._status.activeGrid!._variables._targetCell!._colInfo.dataType === key) {
                    if(vg.dataType[key].onSelectedAndKeyDown) {
                        if(typeof vg.dataType[key].onSelectedAndKeyDown !== 'function') throw new Error('onSelectedAndKeyDown must be a function.');
                        if(vg.dataType[key].onSelectedAndKeyDown(e, __getData(vg._status.activeGrid!._variables._targetCell!)) === false) {
                            return;
                        }
                    }
                }
            });
            switch (e.key) {
                case 'Tab':
                    newTargetCell = getTabCell(vg._status.activeGrid._variables._targetCell!, e.shiftKey)!;
                    selectCell(newTargetCell);
                    e.preventDefault();
                    break;
                case 'F2':
                    createGridEditor(vg._status.activeGrid._variables._targetCell!);
                    e.preventDefault();
                    break;
                case 'Enter':
                    if (vg._status.activeGrid._variables._targetCell!._colInfo.dataType === 'select') {
                        vg._status.editOldValue = (vg._status.activeGrid._variables._targetCell as any).firstChild.value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid._variables._targetCell!._colInfo.dataType === 'checkbox') {
                        vg._status.editOldValue = vg._status.activeGrid._variables._targetCell!._value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.checked = !(vg._status.activeGrid._variables._targetCell as any).firstChild.checked;
                        selectAndCheckboxOnChange(vg._status.activeGrid._variables._targetCell!.firstChild);
                        
                        newTargetCell = getMoveRowCell(vg._status.activeGrid._variables._targetCell!, 1)!;
                        selectCell(newTargetCell);
                        e.preventDefault();
                    }
                    else if (['text','number','date','month','mask','code'].indexOf(vg._status.activeGrid._variables._targetCell!._colInfo.dataType!) >= 0) {
                        createGridEditor(vg._status.activeGrid._variables._targetCell!, true);
                        e.preventDefault();
                    }
                    break;
                case ' ':
                    if (vg._status.activeGrid._variables._targetCell!._colInfo.dataType === 'select') {
                        if (vg._status.activeGrid._variables._targetCell!._colInfo.untarget || vg._status.activeGrid._variables._targetCell!._colInfo.locked) {
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = (vg._status.activeGrid._variables._targetCell as any).firstChild.value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid._variables._targetCell!._colInfo.dataType === 'button') {
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid._variables._targetCell!._colInfo.dataType === 'checkbox') {
                        if (vg._status.activeGrid._variables._targetCell!._colInfo.untarget || vg._status.activeGrid._variables._targetCell!._colInfo.locked) {
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = vg._status.activeGrid._variables._targetCell!._value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.checked = !(vg._status.activeGrid._variables._targetCell as any).firstChild.checked;
                        selectAndCheckboxOnChange(vg._status.activeGrid._variables._targetCell!.firstChild);
                        e.preventDefault();
                    }
                    else if (['text','number','date','month','mask','code'].indexOf(vg._status.activeGrid._variables._targetCell!._colInfo.dataType!) >= 0) {
                        createGridEditor(vg._status.activeGrid._variables._targetCell!);
                        e.preventDefault();
                    }
                    break;
                case 'ArrowUp':
                    if (vg._status.activeGrid._gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid._variables._targetCell!._row >= endCell._row) {
                            newTargetCell = getMoveRowCell(startCell, -1)!;
                            selectCells(newTargetCell, endCell, newTargetCell);
                        }
                        else {
                            newTargetCell = getMoveRowCell(endCell, -1)!;
                            selectCells(startCell, newTargetCell);
                        }
                    }
                    else {
                        newTargetCell = getMoveRowCell(vg._status.activeGrid._variables._targetCell!, -1)!;
                        selectCell(newTargetCell);
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (vg._status.activeGrid._gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid._variables._targetCell!._row <= startCell._row) {
                            newTargetCell = getMoveRowCell(endCell, 1)!;
                            selectCells(startCell, newTargetCell);
                        }
                        else {
                            newTargetCell = getMoveRowCell(startCell, 1)!;
                            selectCells(newTargetCell, endCell, newTargetCell);
                        }
                    }
                    else {
                        newTargetCell = getMoveRowCell(vg._status.activeGrid._variables._targetCell!, 1)!;
                        selectCell( newTargetCell);
                    }
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (vg._status.activeGrid._gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid._variables._targetCell!._col >= endCell._col) {
                            newTargetCell = getMoveColCell(startCell, -1)!;
                            selectCells(newTargetCell, endCell, newTargetCell);
                        }
                        else {
                            newTargetCell = getMoveColCell(endCell, -1)!;
                            selectCells(startCell, newTargetCell);
                        }
                    }
                    else {
                        newTargetCell = getMoveColCell(vg._status.activeGrid._variables._targetCell!, -1)!;
                        selectCell(newTargetCell);
                    }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (vg._status.activeGrid._gridInfo.selectionPolicy === 'range' && e.shiftKey) {
                        unselectCells(vg._status.activeGrid);
                        if (vg._status.activeGrid._variables._targetCell!._col <= startCell._col) {
                            newTargetCell = getMoveColCell(endCell, 1)!;
                            selectCells(startCell, newTargetCell);
                        }
                        else {
                            newTargetCell = getMoveColCell(startCell, 1)!;
                            selectCells(newTargetCell, endCell, newTargetCell)!;
                        }
                    }
                    else {
                        newTargetCell = getMoveColCell(vg._status.activeGrid._variables._targetCell!, 1)!;
                        selectCell(newTargetCell);
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
            const currentActiveCells = vg._status.activeGrid._variables._activeCells;
            if (currentActiveCells.length > 0) {
                e.preventDefault();
                copyGrid(currentActiveCells);
            }
        }
    };
    document.removeEventListener('copy', vg.documentEvent.copy);
    document.addEventListener('copy', vg.documentEvent.copy);

    vg.documentEvent.paste = function (e: any) {
        if (vg._status.activeGrid && !vg._status.activeGridEditor) {
            if (vg._status.activeGrid._variables._activeCells.length > 0) {
                e.preventDefault();
                pasteGrid(e, vg._status.activeGrid);
            }
        }
    };
    document.removeEventListener('paste', vg.documentEvent.paste);
    document.addEventListener('paste', vg.documentEvent.paste);
}

const setGridMethod = (grid: Grid) => {
    grid.getHeaderRowCount = (): number => {
        let count = 0;
        for(const colInfo of colInfos) {
            if (colInfo.cHeader!.length > count) count = colInfo.cHeader!.length;
        }
        return count;
    };
    grid.getHeaderText = (colIndexOrColId: number | string): string => {
        return grid.__getColInfo(colIndexOrColId, true).cHeader.join(';');
    };
    grid.setHeaderText = (colIndexOrColId: number | string, value: string): boolean => {
        const headerTextArr = value.split(';');
        for(let r = headerTextArr.length; r < grid.getHeaderRowCount(); r++) {
            headerTextArr.push('');
        }
        for(let r = headerTextArr.length; r > grid.getHeaderRowCount(); r--) {
            colInfos.forEach((colInfo) => {
                colInfo.cHeader!.push('');
            })
        }
        grid.__getColInfo(colIndexOrColId, true).cHeader = headerTextArr;
        grid.__loadHeader();
        grid.reloadFilterValue();
        return true;
    };
    grid.reloadFilterValue = (): boolean => {
        for(const colInfo of colInfos) {
            grid.reloadColFilter(colInfo.cIndex);
        }
        return true;
    }
    grid.reloadColFilter = (colIndexOrColId: number | string): boolean => {
        utils.reloadFilterValue(grid.gId, colIndexOrColId);
        return true;
    }
    grid.getFooterRowCount = (): number => {
        let count = 0;
        for(const colInfo of colInfos) {
            if (colInfo.cFooter && colInfo.cFooter.length > count) count = colInfo.cFooter.length;
        }
        return count;
    };
    grid.reloadFooterValue = (): boolean => {
        utils.reloadFooterValue(grid.gId);
        return true;
    };
    grid.setFooterValue = (row: number, colId: number | string, value: string): boolean => {
        const footerCell = grid._getFooterCell(row, colId);
        footerCell._value = value;
        footerCell.innerText = value;
        return true;
    };
    grid.getFooterValue = (row: number, colId: number | string): string => {
        return grid._getFooterCell(row, colId)._value;
    };
    grid.setFooterFormula = (colId: number | string, formula: string): boolean => {
        grid.__getColInfo(colId, true).cFooter = formula.split(';');
        grid.__loadFooter();
        return true;
    };
    grid.getFooterFormula = (colId: number | string): string | null => {
        const footerFormulas = utils.deepCopy(grid.__getColInfo(colId, true).cFooter);
        if (footerFormulas && Array.isArray(footerFormulas)) {
            for(let i = 0; i < footerFormulas.length; i++) {
                if (typeof footerFormulas[i] === 'function') footerFormulas[i] = '$$FUNC';
            }
            return footerFormulas.join(';');
        }
        return null;
    };
    grid.setFooterFunction = (row: number, colId: number | string, func: Function): boolean => {
        const footerFormulas = grid.__getColInfo(colId, true).cFooter;
        if (footerFormulas) {
            utils.getArrayElementWithBoundCheck(footerFormulas, row - 1); 
            footerFormulas[row - 1] = func;
        }
        else {
            grid.__getColInfo(colId, true).cFooter = new Array(grid.getFooterRowCount()).fill('');
            grid.__getColInfo(colId, true).cFooter[row - 1] = func;
        }
        grid.__loadFooter();
        return true;
    };
    grid.getGridInfo = (): GridInfo => {
        const gridInfo = grid.info;
        const resultInfo: any = {};
        Object.keys(gridInfo).forEach(key => {
            const dataKey = key.charAt(1).toLowerCase() + key.slice(2);
            if (dataKey !== 'type') resultInfo[dataKey] = utils.deepCopy(gridInfo[key]);
        });
        resultInfo.id = gId;
        resultInfo.cssInfo = utils.deepCopy(grid.cssInfo);
        return resultInfo;
    };
    grid.load = (keyValueOrDatas: Record<string, any> | Record<string, any>[]): boolean => {
        if (!keyValueOrDatas) return false;
        if (!Array.isArray(keyValueOrDatas)) throw new Error('Please insert valid datas.');
        
        const isKeyValue = utils.checkIsValueOrData(keyValueOrDatas);
        grid.__clear();

        if (isKeyValue) {    
            const keyValues = keyValueOrDatas;
            for(let rowCount = 1; rowCount <= keyValues.length; rowCount++) {
                tempRows = [];
                const keyValue = keyValues[rowCount - 1];
                for(let colCount = 1; colCount <= colInfos.length; colCount++) {
                    tempGridData = utils.getGridCell(gId, colInfos[colCount - 1], keyValue, rowCount, colCount);
                    tempRows.push(tempGridData);
                }
                gridBodyCells.push(tempRows);
            }
        }
        else {
            const datas = keyValueOrDatas;
            for(let rowCount = 1; rowCount <= datas.length; rowCount++) {
                tempRows = [];
                const colDatas = datas[rowCount - 1];
                for(let colCount = 1; colCount <= colInfos.length; colCount++) {
                    tempGridData = utils.getGridCell(gId, colInfos[colCount - 1], colDatas, rowCount, colCount);
                    tempRows.push(tempGridData);
                }
            gridBodyCells.push(tempRows);
            }
        }
        grid.__mountGridBodyCell();
        return true;
    };
    grid.clear = (): boolean => {
        utils.removeAllChild(gridBody);
        grid.variables._sortToggle = {};
        grid.variables._filters = [];
        grid.__clear();
        return true;
    };
    grid.clearStatus = (): boolean => {
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, 2);
            cell._value = null;
            utils.reConnectedCallbackElement(cell);
        }
        return true;
    };
    grid.getRowCount = (): number => {
        return gridBodyCells.length;
    };
    grid.getColCount = (): number => {
        return grid._colInfos.length;
    };
    grid.getValues = (): Record<string, any>[] => {
        const keyValues = [];
        let cols;
        for(const rows of gridBodyCells) {
            cols = {};
            for(const cell of rows) {
                (cols as any)[cell.cId] = utils.deepCopy(cell._value);
            }
            keyValues.push(cols);
        }
        return keyValues;
    };
    //수정필요 cell data 형태
    grid.getDatas = () => {
        return ___getDatasWithoutExceptedProperty(grid);
    };
    grid.sort = (colId: string, isAsc = true, isNumSort = false): boolean => {
        const datas = grid.getDatas();
        const sortDatas = sort(grid, datas, colId, isAsc, isNumSort);
        const sortToggle = grid.variables._sortToggle[colId];
        grid.load(sortDatas);
        grid.variables._sortToggle[colId] = sortToggle;
        return true;
    };
    grid.checkRequired = (func: Function) => {
        if (func && typeof func !== 'function') throw new Error('Please insert a valid function.');
        for(const rows of gridBodyCells) {
            for(const cell of rows) {
                if(cell.cRequired
                    && ['select','checkbox','button','link'].indexOf(cell._colInfo.dataType!) < 0
                    && (cell._value === '' || cell._value === null || cell._value === undefined || cell._value === grid.info.gNullValue)) {
                    if(func) {
                        func(grid.__getData(cell));
                    }
                    return grid.__getData(cell);
                }
            }
        }
        return null;
    }
    grid.setGridMount = (isDrawable: boolean): boolean => {
        isDrawable = isDrawable === true;
        grid.variables._isDrawable = isDrawable;
        if (isDrawable) {
            grid.__mountGridBodyCell();        
        }
        return true;
    };
    grid.getGridFilter = (): Record<string, any>[] => {
        return grid.variables._filters;
    }
    grid.setGridWidth = (cssTextWidth: string): boolean => {
        if (!cssTextWidth) throw new Error('Please insert cssText of width.');
        grid.cssInfo.width = cssTextWidth;
        grid._setGridCssStyle();
        return true;
    };
    grid.setGridHeight = (cssTextHeight: string): boolean => {
        if (!cssTextHeight) throw new Error('Please insert cssText of height.');
        grid.cssInfo.height = cssTextHeight;
        grid._setGridCssStyle();
        return true;
    };
    grid.setGridSizeLevel = (sizeLevel: number) => {
        sizeLevel = utils.getOnlyNumberWithNaNToNull(sizeLevel)!;
        if (!sizeLevel) throw new Error('Please insert number of size level.');
        grid.cssInfo.sizeLevel = sizeLevel;
        grid.cssInfo.cellFontSize = ((grid.cssInfo.sizeLevel + 15) / 20) * 14 + 'px';    
        grid.cssInfo.cellMinHeight = ((grid.cssInfo.sizeLevel + 15) / 20) * 21 + 'px';    
        grid._setGridCssStyle();
        return true;
    };
    grid.setGridVerticalAlign = (verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
        if (!verticalAlign) throw new Error('Please insert vertical align.');
        if (!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
        const cssTextVerticalAlign = utils.getVerticalAlign(verticalAlign)
        grid.cssInfo.verticalAlign = cssTextVerticalAlign;
        grid._setGridCssStyle();
        return true;
    };
    grid.setCellFontSize = (cssTextFontSize: string): boolean => {
        if (!cssTextFontSize) throw new Error('Please insert cssText of cell font size.');
        grid.cssInfo.cellFontSize = cssTextFontSize;
        grid._setGridCssStyle();
        return true;
    };
    grid.setCellMinHeight = (cssTextMinHeight: string): boolean => {
        if (!cssTextMinHeight) throw new Error('Please insert cssText of cell min height.');
        grid.cssInfo.cellMinHeight = cssTextMinHeight;
        grid._setGridCssStyle();
        return true;
    };
    grid.setHorizenBorderSize = (pxHorizenBorderSize: number): boolean => {
        utils.validatePositiveIntegerAndZero(pxHorizenBorderSize);
        grid.cssInfo.horizenBorderSize = pxHorizenBorderSize;
        grid._setGridCssStyle();
        return true;
    };
    grid.setVerticalBorderSize = (pxVerticalBorderSize: number): boolean => {
        utils.validatePositiveIntegerAndZero(pxVerticalBorderSize);
        grid.cssInfo.verticalBorderSize = pxVerticalBorderSize;
        grid._setGridCssStyle();
        return true;
    };
    grid.setGridColor = (cssTextHexColor: string): boolean => {
        if (!/^#[0-9a-fA-F]{6}$/.test(cssTextHexColor)) {
            throw new Error('Please insert valid cssText of hexadecimal color. (#ffffff)');
        }
        grid.cssInfo.color = cssTextHexColor;
        utils.setColorSet(grid.cssInfo);
        grid._setGridCssStyle();
        return true;
    };
    grid.setGridColorSet = (colorName: string): boolean => {
        const hexColor = utils.getColorFromColorSet(colorName);
        grid.cssInfo.color = hexColor;
        utils.setColorSet(grid.cssInfo);
        grid._setGridCssStyle();
        return true;
    };
    grid.invertColor = (doInvert: boolean): boolean => {
        doInvert = doInvert === true;
        if (doInvert) utils.setInvertColor(grid.cssInfo);
        else utils.setColorSet(grid.cssInfo);
        grid._setGridCssStyle();
        return true;
    };
    grid.setGridName = (gridName: string): boolean => {
        if (!gridName) throw new Error('Please insert a gridName.');
        grid.info.gName = String(gridName);
        return true;
    };
    grid.getGridName = (): string => {
        return grid.info.gName;
    };
    //수정필요 cell data 형태
    grid.setGridLocked = (isLocked: boolean): boolean => {
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gLocked = isLocked;
        colInfos.forEach((colInfo, idx) => {
            if (idx >= 2) {  
                colInfo.cLocked = isLocked;
            }
        })
        const datas = grid.___getDatasWithoutExceptedProperty(['locked']);
        grid.load(datas);
        return true;
    };
    grid.isGridLocked = (): boolean => {
        return grid.info.gLocked;
    };
    //수정필요 cell data 형태
    grid.setGridLockedColor = (isLockedColor: boolean): boolean => {
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gLockedColor = isLockedColor;
        colInfos.forEach((colInfo, idx) => {
            if (idx >= 2) {  
                colInfo.cLockedColor = isLockedColor;
            }
        })
        const datas = grid.___getDatasWithoutExceptedProperty(['lockedColor']);
        grid.load(datas);
        return true;
    };
    grid.setGridResizable = (isResizable: boolean): boolean => {
        if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gResizable = isResizable;
        return true;
    };
    grid.isGridResizable = () => {
        return grid.info.gResizable;
    };
    grid.setGridRecordCount = (recordCount: number): boolean => {
        recordCount = utils.validatePositiveIntegerAndZero(recordCount);
        grid.info.gRedoCount = recordCount;
        return true;
    };
    grid.getGridRecordCount = (): number => {
        return grid.info.gRedoCount;
    };
    grid.setGridRedoable = (isRedoable: boolean): boolean => {
        if (typeof isRedoable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gRedoable = isRedoable;
        return true;
    };
    grid.isGridRedoable = (): boolean => {
        return grid.info.gRedoable;
    };
    grid.setGridVisible = (isVisible: boolean): boolean => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gVisible = isVisible;
        grid._setGridCssStyle();
        return true;
    };
    grid.isGridVisible = (): boolean => {
        return grid.info.gVisible;
    };
    grid.setHeaderVisible = (isVisible: boolean): boolean => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gHeaderVisible = isVisible;
        grid._setGridCssStyle();
        return true;
    };
    grid.isHeaderVisible = (): boolean => {
        return grid.info.gHeaderVisible;
    };
    grid.setGridRownumLockedColor = (isRownumLockedColor: boolean): boolean => {
        if (typeof isRownumLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gRownumLockedColor = isRownumLockedColor;
        colInfos[0].cLockedColor = isRownumLockedColor;

        for(const row of gridBodyCells) {
            row[0].cLockedColor = isRownumLockedColor;
            utils.reConnectedCallbackElement(row[0]);
        }
        return true;
    };
    grid.isGridRownumLockedColor = (): boolean => {
        return grid.info.gRownumLockedColor;
    };
    grid.setGridRownumSize = (rownumSize: number): boolean => {
        rownumSize = utils.validatePositiveIntegerAndZero(rownumSize);
        const colInfo = colInfos[0];
        colInfo.cOriginWidth = String(rownumSize) + utils.extractNumberAndUnit(colInfo.cOriginWidth).unit
        utils.changeColSize(gId, colInfo.cIndex!, rownumSize);
        colInfo.cColVisible = rownumSize !== 0;
        utils.reloadGridWithModifyCell(gId, colInfo.cIndex!);
        return true;
    };
    grid.getGridRownumSize = (): string => {
        return colInfos[0].cOriginWidth!;
    };
    grid.setGridStatusLockedColor = (isStatusLockedColor: boolean): boolean => {
        if (typeof isStatusLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gStatusLockedColor = isStatusLockedColor;
        colInfos[1].cLockedColor = isStatusLockedColor;

        for(const row of gridBodyCells) {
            row[1].cLockedColor = isStatusLockedColor;
            utils.reConnectedCallbackElement(row[1]);
        }
        return true;
    };
    grid.isGridStatusLockedColor = (): boolean => {
        return grid.info.gStatusLockedColor;
    };
    grid.setGridSelectionPolicy = (selectionPolicy: SelectionPolicy.RANGE | SelectionPolicy.SINGLE | SelectionPolicy.NONE): boolean => {
        if (!utils.isIncludeEnum(selectionPolicyUnit, selectionPolicy)) throw new Error('Please insert the correct selectionPolicy properties. (single, range, none)');
        grid._gridInfo.selectionPolicy = selectionPolicy;
        return true
    };
    grid.getGridSelectionPolicy = (): string => {
        return grid._gridInfo.selectionPolicy;
    };
    grid.setGridNullValue = (nullValue: any): boolean => {
        grid.info.gNullValue = nullValue;
        grid.__gridBodyCellsReConnected();
        return true;
    };
    grid.getGridNullValue = (): any => {
        return utils.deepCopy(grid.info.gNullValue);
    };
    grid.setGridDateFormat = (dateFormat: string): boolean => {
        grid.info.gDateFormat = dateFormat;
        grid.__gridBodyCellsReConnected();
        return true;
    };
    grid.getGridDateFormat = (): string => {
        return grid.info.gDateFormat;
    };
    grid.setGridMonthFormat = (monthFormat: string): boolean => {
        grid.info.gMonthFormat = monthFormat;
        grid.__gridBodyCellsReConnected();
        return true;
    };
    grid.getGridMonthFormat = (): string => {
        return grid.info.gMonthFormat;
    };
    grid.setGridAlterRow = (isAlterRow: boolean): boolean => {
        if (typeof isAlterRow !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gAlterRow = isAlterRow;
        grid.__gridBodyCellsReConnected();
        return true;
    };
    grid.setGridFrozenColCount = (frozenColCount: number): boolean => {
        frozenColCount = utils.validatePositiveIntegerAndZero(frozenColCount);
        const styleGridTemplateColumns = gridHeader.style.gridTemplateColumns;
        if (styleGridTemplateColumns.includes('%') && grid.info.gFrozenColCount !== 0) {
            throw new Error(gId + ' has error. If you set the horizontal size to a percentage, property A is not available.');
        }

        grid.info.gFrozenColCount = frozenColCount;
        const datas = grid.getDatas();
        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);
        return true;
    };
    grid.getGridFrozenColCount = (): number => {
        return grid.info.gFrozenColCount;
    };
    grid.setGridFrozenRowCount = (frozenRowCount: number): boolean => {
        frozenRowCount = utils.validatePositiveIntegerAndZero(frozenRowCount);
        grid.info.gFrozenRowCount = frozenRowCount;
        const datas = grid.getDatas();
        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);
        return true;
    };
    grid.getGridFrozenRowCount = (): number => {
        return grid.info.gFrozenRowCount;
    };
    grid.setGridSortable = (isSortable: boolean): boolean => {
        if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gSortable = isSortable;
        return true;
    };
    grid.isGridSortable = (): boolean => {
        return grid.info.gSortable;
    };
    grid.setGridFilterable = (isFilterable: boolean): boolean => {
        if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gFilterable = isFilterable;
        const datas = grid.getDatas();
        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);
        return true;
    };
    grid.isGridFilterable = (): boolean => {
        return grid.info.gFilterable;
    };
    grid.setGridAllCheckable = (isAllCheckable: boolean): boolean => {
        if (typeof isAllCheckable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid.info.gAllCheckable = isAllCheckable;
        return true;
    };
    grid.isGridAllCheckable = (): boolean => {
        return grid.info.gAllCheckable;
    };
    grid.setGridCheckedValue = (checkeValue: string): boolean => {
        if (typeof checkeValue !== 'string') throw new Error('Please insert a string type.');
        if (grid.info.gUncheckedValue === checkeValue) throw new Error('Checked and unchecked values cannot be the same.');
        const datas = grid.getDatas();
        for(const rows of datas) {
            for(const data of rows) {
                if (data.dataType === 'checkbox') {
                    if (data.value === grid.info.gCheckedValue) {
                        data.value = checkeValue;
                    }
                } 
            }
        }
        grid.info.gCheckedValue = checkeValue;
        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);
        return true;
    };
    grid.getGridCheckedValue = (): string => {
        return grid.info.gCheckedValue;
    };
    grid.setGridUncheckedValue = (unCheckedValue: string): boolean => {
        if (typeof unCheckedValue !== 'string') throw new Error('Please insert a string type.');
        if (grid.info.gCheckedValue === unCheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
        const datas = grid.getDatas();
        for(const rows of datas) {
            for(const data of rows) {
                if (data.dataType === 'checkbox') {
                    if (data.value !== grid.info.gCheckedValue) {
                        data.value = unCheckedValue;
                    }
                } 
            }
        }
        grid.info.gUncheckedValue = unCheckedValue;
        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);
        return true;
    };
    grid.getGridUncheckedValue = (): string => {
        return grid.info.gUncheckedValue;
    };
    grid.addCol = (colIndexOrColId: number | string, colInfo: ColInfo): boolean => {
        let colIndex = grid.__getColIndex(colIndexOrColId);
        if (colIndex < 2) throw new Error('You cannot add new columns between the row number and status columns.');
        if (!colIndex || colIndex > grid.getColCount()) colIndex = grid.getColCount();

        const newColInfo = grid.__getDefaultColInfo(colInfo, true);
        const datas = grid.getDatas();
        
        colInfos.splice(colIndex, 0, newColInfo);
        colInfos.forEach((colInfo, idx) => {
            colInfo.cIndex = idx + 1;
        });

        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);
        return true;
    };
    grid.removeCol = (colIndexOrColId: number | string): any[] => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (colIndex <= 2) throw new Error('The row number or status columns cannot be removed.');
        const result = grid.getColValues(colIndex);

        colInfos.splice(colIndex - 1, 1);
        colInfos.forEach((colInfo, idx) => {
            colInfo.cIndex = idx + 1;
        });

        const datas = grid.getDatas();
        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);

        return result;
    };
    grid.setColInfo = (colInfo: ColInfo): boolean => {
        if (!colInfo) throw new Error('Column info is required.');
        if (colInfo.constructor !== Object) throw new Error('Please insert a valid column info');
        let colIndexOrColId;
        if (colInfo.index) colIndexOrColId = colInfo.index;
        if (colInfo.id) colIndexOrColId = colInfo.id;
        if (!colIndexOrColId) throw new Error('Column id is required.');
        
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (colIndex <= 2) throw new Error('The row number or status columns are immutable.');

        const newColInfo = colInfos[colIndex - 1];
        Object.keys(newColInfo).forEach((key)=>{
            if(['cId', 'cIndex'].indexOf(key) === -1) {
                const newColInfoKey = key.charAt(1).toLowerCase() + key.slice(2);
                Object.keys(colInfo).forEach((colInfoKey) => {
                    if(newColInfoKey === colInfoKey) {
                        (newColInfo as any)[key] = colInfo[colInfoKey as keyof ColInfo];
                    }
                });
            }
        });

        const datas = grid.getDatas();
        datas.forEach((row: any) => {
            for(const data of row) {
                if (data.id === newColInfo.cId) {
                    Object.keys(newColInfo).forEach(key => {
                        if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue'].indexOf(key) < 0) {
                            const dataKey = key.charAt(1).toLowerCase() + key.slice(2);
                            data[dataKey] = (newColInfo as any)[key];
                        }
                    });
                }
            }
        })

        grid.__loadHeader();
        grid.__loadFooter();
        grid.load(datas);
        return true;
    };
    grid.getColInfo = (colIndexOrColId: number | string): ColInfo => {
        colInfo = grid.__getColInfo(colIndexOrColId);

        const info: ColInfo = {
            id : colInfo.cId,
            index : colInfo.cIndex,
            name : colInfo.cName,
            untarget : colInfo.cUntarget,
            colVisible : colInfo.cColVisible,
            required : colInfo.cRequired,
            resizable : colInfo.cResizable,
            originWidth : colInfo.cOriginWidth,
            dataType : colInfo._colInfo.dataType,
            selectSize : colInfo.cSelectSize,
            locked : colInfo.cLocked,
            lockedColor : colInfo.cLockedColor,
            format : colInfo.cFormat,
            codes : utils.deepCopy(colInfo.cCodes),
            defaultCode : colInfo.cDefaultCode,
            maxLength : colInfo.cMaxLength,
            maxByte : colInfo.cMaxByte,
            maxNumber : colInfo.cMaxNumber,
            minNumber : colInfo.cMinNumber,
            roundNumber : colInfo.cRoundNumber,
            align : colInfo.cAlign,
            verticalAlign : colInfo.cVerticalAlign,
            overflowWrap : colInfo.cOverflowWrap,
            wordBreak : colInfo.cWordBreak,
            whiteSpace : colInfo.cWhiteSpace,
            backColor : colInfo.cBackColor,
            fontColor : colInfo.cFontColor,
            fontBold : colInfo.cFontBold,
            fontItalic : colInfo.cFontItalic,
            fontThruline : colInfo.cFontThruline,
            fontUnderline : colInfo.cFontUnderline,
            rowMerge : colInfo.cRowMerge,
            colMerge : colInfo.cColMerge,
            sortable : colInfo.cSortable,
            filterable : colInfo.cFilterable,
            filterValues : utils.deepCopy(colInfo.cFilterValues),
            filterValue : utils.deepCopy(colInfo.cFilterValue),
            filter : colInfo.cFilter,
            rowVisible : colInfo.cRowVisible,
            header : null,
            footer : null,
        };
        
        if (colInfo.cHeader && Array.isArray(colInfo.cHeader)) info.header = colInfo.cHeader.join(';');
        if (colInfo.cFooter && Array.isArray(colInfo.cFooter)) info.footer = colInfo.cFooter.join(';');
        return info;
    };
    grid.getColDatas = (colIndexOrColId: number | string): CellData[] => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colDatas = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            colDatas.push(grid.getCellData(row, colIndex));
        }
        return colDatas;
    };
    grid.setColSameValue = (colIndexOrColId: number | string, value: any, doRecord = false) : boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColRownumOrStatus(colIndex);
        if (doRecord) {
            const records = [];
            for(let row = 1; row <= grid.getRowCount(); row++) {
                let cell = _getCell(grid, row, colIndex);
                let record = utils.getRecordsWithModifyValue(cell, value, true);
                if (Array.isArray(record) && record.length > 0) records.push(record[0]);
            }
            utils.recordGridModify(grid.gId, records);
        }
        else {
            for(let row = 1; row <= grid.getRowCount(); row++) {
                let cell = _getCell(grid, row, colIndex);
                cell._value = utils.getValidValue(cell, value);
                utils.reConnectedCallbackElement(cell);
            }
            utils.reloadGridWithModifyCell(gId, colIndex);
        }
        return true;
    };
    grid.getColValues = (colIndexOrColId: number | string): any[] => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colValues = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            let cell = _getCell(grid, row, colIndex);
            colValues.push(utils.deepCopy(cell._value));
        }
        return colValues;
    };
    grid.getColTexts = (colIndexOrColId: number | string): string[] => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colTexts = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            colTexts.push(grid.getCellText(row, colIndex));
        }
        return colTexts;
    };
    grid.isColUnique = (colIndexOrColId: number | string): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colValues = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            let cell = _getCell(grid, row, colIndex);
            switch (cell._colInfo.dataType) {
                case 'select':
                case 'checkbox':
                case 'button':
                case 'link':
                    colValues.push(utils.getCellText(cell));
                    break;
                default:
                    colValues.push(cell._value);
                    break;
            }
        }
        return colValues.length === new Set(colValues).size;
    };
    grid.openFilter = (colIndexOrColId: number | string): boolean => {
        grid.__getHeaderFilter(colIndexOrColId).style.display = 'block';
        return true;
    };
    grid.closeFilter = (colIndexOrColId: number | string): boolean => {
        grid.__getHeaderFilter(colIndexOrColId).style.display = 'none';
        return true;
    };
    grid.setColFilterValue = (colIndexOrColId: number | string, filterValue: string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        if(!colInfo.cFilterValues!.has(filterValue))  throw new Error('Please insert a valid filterValue. ' + Array.from(colInfo.cFilterValues!).join(', '));

        let headerCell;
        let modifyFilterSelect;
        for(let row = 1; row <= grid.getHeaderRowCount(); row++) {
            headerCell = grid._getHeaderCell(row, colInfo.cIndex);
            modifyFilterSelect = headerCell.querySelectorAll('.' + gId + '_filterSelect');
            if(modifyFilterSelect.length > 0) {
                modifyFilterSelect = modifyFilterSelect[0]
                break;
            }
        }
        modifyFilterSelect.value = filterValue;
        if(modifyFilterSelect.value !== '$$ALL') modifyFilterSelect.style.display = 'block';

        grid._doFilter();
        return true;
    };
    grid.getColFilterValues = (colIndexOrColId: number | string): string[]  => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return Array.from(colInfo.cFilterValues!);
    };
    grid.getColFilterValue = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFilterValue;
    };
    grid.getColId = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo  = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cId;
    };
    grid.getColIndex = (colIndexOrColId: number | string): number => {
        return grid.__getColIndex(colIndexOrColId, true);
    };
    grid.setColName = (colIndexOrColId: number | string, colName: string): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (!colName) throw new Error('Column Name is required');
        if (typeof colName !== 'string') throw new Error('Please insert a string type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cName = colName;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex).cName = colName;
        }
        return true;
    };
    grid.getColName = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId);
        return colInfo.cName!;
    };
    grid.setColUntarget = (colIndexOrColId: number | string, isUntarget: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isUntarget !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cUntarget = isUntarget;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex).cUntarget = isUntarget;
        }
        return true;
    };
    grid.setColRowMerge = (colIndexOrColId: number | string, isRowMerge: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isRowMerge !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cRowMerge = isRowMerge;
    
        const datas = grid.getDatas();
        grid.load(datas);
        return true;
    };
    grid.isColRowMerge = (colIndexOrColId: number | string): boolean | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cRowMerge;
    };
    grid.setColColMerge = (colIndexOrColId: number | string, isColMerge: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isColMerge !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cColMerge = isColMerge;
    
        const datas = grid.getDatas();
        grid.load(datas);
        return true;
    };
    grid.isColColMerge = (colIndexOrColId: number | string): boolean | null  => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cColMerge;
    };
    grid.setColVisible = (colIndexOrColId: number | string, isVisible: boolean): boolean => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        if (isVisible) {
            utils.changeColSize(gId, colInfo.cIndex!, utils.extractNumberAndUnit(colInfo.cOriginWidth).number);
        }
        else {
            utils.changeColSize(gId, colInfo.cIndex!, 0)
        }
        colInfo.cColVisible = isVisible;
        grid.__loadHeader();
        utils.reloadGridWithModifyCell(gId, colInfo.cIndex!);
        return true;
    };
    grid.isColVisible = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cColVisible!;
    };
    grid.setColRequired = (colIndexOrColId: number | string, isRequired: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex, true);
        colInfo.cRequired = isRequired;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex).cRequired = isRequired;
        }
        return true;
    };
    grid.isColRequired = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cRequired!;
    };
    grid.setColResizable = (colIndexOrColId: number | string, isResizable: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        colInfo.cResizable = isResizable;
        grid.__loadHeader();
        return true;
    };
    grid.isColResizable = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cResizable!;
    };
    grid.setColSortable = (colIndexOrColId: number | string, isSortable: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        colInfo.cSortable = isSortable;
        return true;
    };
    grid.isColSortable = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cSortable!;
    };
    grid.setColFilterable = (colIndexOrColId: number | string, isFilterable: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex, true);
        colInfo.cFilterable = isFilterable;
        grid.__loadHeader();
        utils.reloadFilterValue(gId, colIndex);
        return true;
    };
    grid.isColFilterable = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFilterable!;
    };
    grid.setColOriginWidth = (colIndexOrColId: number | string, originWidth: string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        const newOriginWidth = utils.extractNumberAndUnit(originWidth);
        if (!utils.isIncludeEnum(enumWidthUnit, newOriginWidth.unit)) throw new Error('Width units can only be pixel or %.');
        colInfo.cOriginWidth = newOriginWidth.number + newOriginWidth.unit;
        utils.changeColSize(gId, colInfo.cIndex!, newOriginWidth.number);
        if(newOriginWidth.number === 0) colInfo.cColVisible = false;
        else colInfo.cColVisible = true;
        grid.__loadHeader();
        utils.reloadGridWithModifyCell(gId, colInfo.cIndex!);
        return true;
    };
    grid.getColOriginWidth = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cOriginWidth!;
    };
    grid.setColDataType = (colIndexOrColId: number | string, dataType: string): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo._colInfo.dataType = dataType;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell._colInfo.dataType = dataType;
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColDataType = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo._colInfo.dataType!;
    };
    grid.setColSelectSize = (colIndexOrColId: number | string, cssTextSelectSize: string): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cSelectSize = cssTextSelectSize;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cSelectSize = cssTextSelectSize;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColSelectSize = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cSelectSize;
    };
    grid.setColLocked = (colIndexOrColId: number | string, isLocked: boolean): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cLocked = isLocked;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cLocked = isLocked;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColLocked = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cLocked!;
    };
    grid.setColLockedColor = (colIndexOrColId: number | string, isLockedColor: boolean): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cLockedColor = isLockedColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cLockedColor = isLockedColor;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColLockedColor = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cLockedColor!;
    };
    grid.setColFormat = (colIndexOrColId: number | string, format: string): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof format !== 'string') throw new Error('Please insert a string type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cFormat = format;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cFormat = format;
            if(cell._colInfo.dataType === 'mask') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColFormat = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFormat;
    };
    grid.setColCodes = (colIndexOrColId: number | string, codes: string[]): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cCodes = codes;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cCodes = codes;
            if(cell._colInfo.dataType === 'code') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColCodes = (colIndexOrColId: number | string): string[] | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cCodes;
    };
    grid.setColDefaultCode = (colIndexOrColId: number | string, defaultCode: string): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cDefaultCode = defaultCode;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cDefaultCode = defaultCode;
            if(cell._colInfo.dataType === 'code') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColDefaultCode = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cDefaultCode;
    };
    grid.setColMaxLength = (colIndexOrColId: number | string, maxLength: number): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        maxLength = utils.validatePositiveIntegerAndZero(maxLength);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cMaxLength = maxLength;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cMaxLength = maxLength;
            if(cell._colInfo.dataType === 'text') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColMaxLength = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cMaxLength;
    };
    grid.setColMaxByte = (colIndexOrColId: number | string, maxByte: number): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        maxByte = utils.validatePositiveIntegerAndZero(maxByte);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cMaxByte = maxByte;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cMaxByte = maxByte;
            if(cell._colInfo.dataType === 'text') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColMaxByte = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cMaxByte;
    };
    grid.setColMaxNumber = (colIndexOrColId: number | string, maxNumber: number): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        maxNumber = utils.validateNumber(maxNumber);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cMaxNumber = maxNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cMaxNumber = maxNumber;
            if(cell._colInfo.dataType === 'number') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColMaxNumber = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cMaxNumber;
    };
    grid.setColMinNumber = (colIndexOrColId: number | string, minNumber: number): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        minNumber = utils.validateNumber(minNumber);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cMinNumber = minNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cMinNumber = minNumber;
            if(cell._colInfo.dataType === 'number') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColMinNumber = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cMinNumber;
    };
    grid.setColRoundNumber = (colIndexOrColId: number | string, roundNumber: number): boolean => {
        grid.__checkColRownumOrStatus(colIndexOrColId);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        roundNumber = utils.validateIntegerAndZero(roundNumber);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cRoundNumber = roundNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cRoundNumber = roundNumber;
            if(cell._colInfo.dataType === 'number') {
                cell._value = utils.getValidValue(cell, cell._value);
            }
            utils.reConnectedCallbackElement(cell);
        }
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getColRoundNumber = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cRoundNumber;
    };
    grid.setColAlign = (colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if(!utils.isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cAlign = align;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cAlign = align;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColAlign = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cAlign;
    };
    grid.setColVerticalAlign = (colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if(!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cVerticalAlign = verticalAlign;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cVerticalAlign = verticalAlign;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColVerticalAlign = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cVerticalAlign;
    };
    grid.setColOverflowWrap = (colIndexOrColId: number | string, overflowWrap: string): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cOverflowWrap = overflowWrap;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cOverflowWrap = overflowWrap;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColOverflowWrap = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cOverflowWrap;
    };
    grid.setColWordBreak = (colIndexOrColId: number | string, wordBreak: string): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cWordBreak = wordBreak;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cWordBreak = wordBreak;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColWordBreak = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cWordBreak;
    };
    grid.setColWhiteSpace = (colIndexOrColId: number | string, whiteSpace: string): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cWhiteSpace = whiteSpace;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cWhiteSpace = whiteSpace;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColWhiteSpace = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cWhiteSpace;
    };
    grid.setColBackColor = (colIndexOrColId: number | string, hexadecimalBackColor: string): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cBackColor = hexadecimalBackColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cBackColor = hexadecimalBackColor;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColBackColor = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cBackColor;
    };
    grid.setColFontColor = (colIndexOrColId: number | string, hexadecimalFontColor: string): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cFontColor = hexadecimalFontColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cFontColor = hexadecimalFontColor;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColFontColor = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFontColor;
    };
    grid.setColFontBold = (colIndexOrColId: number | string, isFontBold: boolean): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cFontBold = isFontBold;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cFontBold = isFontBold;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontBold = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFontBold!;
    };
    grid.setColFontItalic = (colIndexOrColId: number | string, isFontItalic: boolean): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cFontItalic = isFontItalic;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cFontItalic = isFontItalic;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontItalic = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFontItalic!;
    };
    grid.setColFontThruline = (colIndexOrColId: number | string, isFontThruline: boolean): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cFontThruline = isFontThruline;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cFontThruline = isFontThruline;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontThruline = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFontThruline!;
    };
    grid.setColFontUnderline = (colIndexOrColId: number | string, isFontUnderline: boolean): boolean => {
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = grid.__getColInfo(colIndex);
        colInfo.cFontUnderline = isFontUnderline;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            cell.cFontUnderline = isFontUnderline;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontUnderline = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
        return colInfo.cFontUnderline!;
    };
    grid.addRow = (rowOrValuesOrDatas?: number | Record<string, any> | Record<string, any>[], valuesOrDatas?: Record<string, any> | Record<string, any>[]): boolean => {
        let row, addKeyValueOrDatas;

        if (rowOrValuesOrDatas === 0) rowOrValuesOrDatas = 1
        if (rowOrValuesOrDatas) {
            if (typeof rowOrValuesOrDatas === 'number') {
                row = rowOrValuesOrDatas - 1;
                addKeyValueOrDatas = valuesOrDatas;
            }
            else {
                addKeyValueOrDatas = rowOrValuesOrDatas;
            }
        }
        else {
            addKeyValueOrDatas = valuesOrDatas;
        }
        if (row === null || row === undefined || row > grid.getRowCount()) row = grid.getRowCount();
        if (!addKeyValueOrDatas) addKeyValueOrDatas = [[{}]];
        else addKeyValueOrDatas = [addKeyValueOrDatas];
        if (addKeyValueOrDatas === null || !Array.isArray(addKeyValueOrDatas)) throw new Error('Please insert valid datas.');
        const isKeyValue = utils.checkIsValueOrData(addKeyValueOrDatas);
        const datas = grid.getDatas();
        let cnt = 0;
        for(const keyValueOrData of addKeyValueOrDatas) {
            if (isKeyValue) {
                const tempRow = [];
                let tempCol;
                for (const key in keyValueOrData) {
                    tempCol = {
                        id : key,
                        value : (keyValueOrData as any)[key],
                    };
                    tempRow.push(tempCol);
                }
                datas.splice(row + cnt, 0, tempRow);
            }
            else {
                datas.splice(row + cnt, 0, keyValueOrData);
            }
            cnt++;
        }
        grid.load(datas);
        for(let r = row; r < row + cnt; r++) {
            grid.setRowStatus(r + 1, 'C');
        }
        utils.focusCell(_getCell(grid, row + 1, 'v-g-status'));
        return true;
    };
    grid.removeRow = (row: number): Record<string, any> => {
        grid.__checkRowIndex(row);
        const result = grid.getRowValues(row);
        result['v-g-status'] = 'D';
        const datas = grid.getDatas();
        datas.splice(row - 1, 1);
        grid.load(datas);
        return result;
    };
    grid.setRowStatus = (row: number, status: string): boolean => {
        grid.__checkRowIndex(row);
        if (!utils.isIncludeEnum(statusUnit, status)) throw new Error('Please insert the correct status code. (C, U, D)');
        const statusCell = _getCell(grid, row, 'v-g-status');
        statusCell._value = status;
        utils.reConnectedCallbackElement(statusCell);
        return true;
    };
    grid.getRowStatus = (row: number): string => {
        grid.__checkRowIndex(row);
        return _getCell(grid, row, 'v-g-status')._value;
    };
    grid.setRowDatas = (row: number, cellDatas: Record<string, any>[]): boolean => {
        for(const cellData of cellDatas) {
            grid.__setCellData(row, cellData.id, cellData, false);
        }
        return true;
    };
    grid.getRowDatas = (row: number): Record<string, any>[] => {
        grid.__checkRowIndex(row);
        const rowDatas = [];
        for(const colInfo of colInfos) {
            rowDatas.push(grid.getCellData(row, colInfo.cIndex));
        }
        return rowDatas;
    };
    grid.setRowValues = (row: number, values: Record<string, any>, doRecord = false): boolean => {
        row = 2;
        grid.__checkRowIndex(row);
        if (!values || values.constructor !== Object) throw new Error('Please insert a valid value.');
        let value = null;
        let cell = null;

        if (doRecord) {
            const records = [];
            let record
            for(const colInfo of colInfos) {
                if (colInfo.cId === 'v-g-rownum' || colInfo.cId === 'v-g-status') continue;
                for(const key in values) {
                    if (colInfo.cId === key) value = values[key];
                }
                cell = _getCell(grid, row, colInfo.cIndex);
                record = utils.getRecordsWithModifyValue(cell, value, true);
                if (Array.isArray(record) && record.length > 0) records.push(record[0]);
            }
            utils.recordGridModify(grid.gId, records);
        }
        else {
            for(const colInfo of colInfos) {
                if (colInfo.cId === 'v-g-rownum' || colInfo.cId === 'v-g-status') continue;
                for(const key in values) {
                    if (colInfo.cId === key) value = values[key];
                }
                cell = _getCell(grid, row, colInfo.cIndex);
                cell._value = utils.getValidValue(cell, value);
                utils.reConnectedCallbackElement(cell);
                utils.reloadGridWithModifyCell(cell.gId, cell.cIndex);
            }
        }
        return true;
    };
    grid.getRowValues = (row: number): Record<string, any> => {
        grid.__checkRowIndex(row);
        const rowValues = {};
        for(const cell of gridBodyCells[row - 1]) {
            (rowValues as any)[cell.cId] = utils.deepCopy(cell._value);
        }
        return rowValues;
    };
    grid.getRowTexts = (row: number): Record<string, string> => {
        grid.__checkRowIndex(row);
        const rowTexts = {};
        for(const cell of gridBodyCells[row - 1]) {
            (rowTexts as any)[cell.cId] = utils.getCellText(cell);
        }
        return rowTexts;
    };
    grid.setRowVisible = (row: number, isVisible: boolean): boolean => {
        grid.__checkRowIndex(row);
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        for(let c = 1; c <= grid.getColCount(); c++) {
            const cell = _getCell(grid, row, c);
            cell.cRowVisible = isVisible;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isRowVisible = (row: number): boolean => {
        grid.__checkRowIndex(row);
        const cell = _getCell(grid, row, 1);
        return cell.cRowVisible;
    };
    grid.setRowDataType = (row: number, dataType: string): boolean => {
        grid.__checkRowIndex(row);
        if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell._colInfo.dataType = dataType;
            utils.reConnectedCallbackElement(cell);
        }
        
        utils.reloadGridForMerge(gId);
        
        grid.reloadFilterValue();
        
        grid.reloadFooterValue();
        return true;
    };
    grid.setRowLocked = (row: number, isRowLocked: boolean): boolean => {
        grid.__checkRowIndex(row);
        if (typeof isRowLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cLocked = isRowLocked;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowLockedColor = (row: number, isRowLockedColor: boolean): boolean => {
        grid.__checkRowIndex(row);
        if (typeof isRowLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cLockedColor = isRowLockedColor;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowAlign = (row: number, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
        grid.__checkRowIndex(row);
        if (!utils.isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cAlign = align;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowVerticalAlign = (row: number, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
        grid.__checkRowIndex(row);
        if (!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cVerticalAlign = verticalAlign;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowBackColor = (row: number, hexadecimalBackColor: string): boolean => {
        grid.__checkRowIndex(row);
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cBackColor = hexadecimalBackColor;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontColor = (row: number, hexadecimalFontColor: string): boolean => {
        grid.__checkRowIndex(row);
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cFontColor = hexadecimalFontColor;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontBold = (row: number, isRowFontBold: boolean): boolean => {
        grid.__checkRowIndex(row);
        if (typeof isRowFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cFontBold = isRowFontBold;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontItalic = (row: number, isRowFontItalic: boolean): boolean => {
        grid.__checkRowIndex(row);
        if (typeof isRowFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cFontItalic = isRowFontItalic;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontThruline = (row: number, isRowFontThruline: boolean): boolean => {
        grid.__checkRowIndex(row);
        if (typeof isRowFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cFontThruline = isRowFontThruline;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontUnderline = (row: number, isRowFontUnderline: boolean): boolean => {
        grid.__checkRowIndex(row);
        if (typeof isRowFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
            cell.cFontUnderline = isRowFontUnderline;
            grid.__gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.searchRowsWithMatched = (matches: Record<string, any>): number[] => {
        if (matches.constructor !== Object) throw new Error('Please insert a valid matches. (Object)');
        const matchedRows: number[] = [];
        let isMatched;
        gridBodyCells.forEach((row, rowIndex: number) => {
            isMatched = true;
            for(const cell of row) {
                for(const key of Object.keys(matches)) {
                    if (cell.cId === key && cell._value !== matches[key]) {
                        isMatched = false;
                        break;
                    }
                }
            }
            if(isMatched) matchedRows.push(rowIndex + 1);
        })
        return matchedRows;
    };
    grid.searchRowDatasWithMatched = (matches: Record<string, any>): Record<string, any>[][] => {
        const matchedRows = grid.searchRowsWithMatched(matches);
        const matchedRowDatas: Record<string, any>[][] = [];
        matchedRows.forEach((row: number) => {
            matchedRowDatas.push(grid.getRowDatas(row));
        })
        return matchedRowDatas;
    };
    grid.searchRowValuesWithMatched = (matches: Record<string, any>): Record<string, any>[] => {
        const matchedRows = grid.searchRowsWithMatched(matches);
        const matchedRowValues: Record<string, any>[] = [];
        matchedRows.forEach((row: number) => {
            matchedRowValues.push(grid.getRowValues(row));
        })
        return matchedRowValues;
    };
    grid.searchRowsWithFunction = (func: Function): number[] => {
        if (typeof func !== 'function') throw new Error('Please insert a valid function.');
        const matchedRows = [];
        let isMatched;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            isMatched = func(grid.getRowDatas(row));
            if(isMatched) matchedRows.push(row);
        }
        return matchedRows;
    };
    grid.searchRowDatasWithFunction = (func: Function): Record<string, any>[][] => {
        const matchedRows = grid.searchRowsWithFunction(func);
        const matchedRowDatas: Record<string, any>[][] = [];
        matchedRows.forEach((row: number) => {
            matchedRowDatas.push(grid.getRowDatas(row));
        })
        return matchedRowDatas;
    };
    grid.searchRowValuesWithFunction = (func: Function): Record<string, any>[] => {
        const matchedRows = grid.searchRowsWithFunction(func);
        const matchedRowValues: Record<string, any>[] = [];
        matchedRows.forEach((row: number) => {
            matchedRowValues.push(grid.getRowValues(row));
        })
        return matchedRowValues;
    };
    grid.setCellData = (row: number, colIndexOrColId: number | string, cellData: CellData): boolean => {
        return grid.__setCellData(row, colIndexOrColId, cellData);
    }
    grid.getCellData = (row: number, colIndexOrColId: number | string): CellData => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        
        const cell = _getCell(grid, row, colIndex);
        const data = grid.__getData(cell);
        return data;
    }
    grid.setCellValue = (row: number, colIndexOrColId: number | string, value: any, doRecord = false): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);

        const cell = _getCell(grid, row, colIndex);
        if (doRecord) {
            utils.recordGridModify(cell.gId, utils.getRecordsWithModifyValue(cell, value, true));
        }
        else {
            cell._value = utils.getValidValue(cell, value);
            utils.reConnectedCallbackElement(cell);
            utils.reloadGridWithModifyCell(cell.gId, cell.cIndex);
        }
        return true;
    };
    grid.getCellValue = (row: number, colIndexOrColId: number | string): any => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);

        return utils.deepCopy(_getCell(grid, row, colIndex)._value);
    };
    grid.getCellText = (row: number, colIndexOrColId: number | string): string => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);

        return utils.getCellText(_getCell(grid, row, colIndex));
    };
    grid.setCellRequired = (row: number, colIndexOrColId: number | string, isRequired: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');

        const cell = _getCell(grid, row, colIndex);
        cell.cRequired = isRequired;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    }
    grid.getCellRequired = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cRequired;
    }
    grid.setCellDataType = (row: number, colIndexOrColId: number | string, dataType: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        
        if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
        const cell = _getCell(grid, row, colIndex);
        cell._colInfo.dataType = dataType;
        utils.reConnectedCallbackElement(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellDataType = (row: number, colIndexOrColId: number | string): string => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        return _getCell(grid, row, colIndex)._colInfo.dataType;
    };
    grid.setCellLocked = (row: number, colIndexOrColId: number | string, isLocked: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');

        const cell = _getCell(grid, row, colIndex);
        cell.cLocked = isLocked;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellLocked = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cLocked;
    };
    grid.setCellLockedColor = (row: number, colIndexOrColId: number | string, isLockedColor: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.cLockedColor = isLockedColor;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellLockedColor = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cLockedColor;
    };
    grid.setCellFormat = (row: number, colIndexOrColId: number | string, format: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        if (typeof format !== 'string') throw new Error('Please insert a string type.');
        const cell = _getCell(grid, row, colIndex);
        cell.cFormat = format;
        if(cell._colInfo.dataType === 'mask') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellFormat = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFormat;
    };
    grid.setCellCodes = (row: number, colIndexOrColId: number | string, codes: string[]): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
        const cell = _getCell(grid, row, colIndex);
        cell.cCodes = codes;
        if(cell._colInfo.dataType === 'code') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellCodes = (row: number, colIndexOrColId: number | string): string[] | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cCodes;
    };
    grid.setCellDefaultCode = (row: number, colIndexOrColId: number | string, defaultCode: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cDefaultCode = defaultCode;
        if(cell._colInfo.dataType === 'code') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellDefaultCode = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cDefaultCode;
    };
    grid.setCellMaxLength = (row: number, colIndexOrColId: number | string, maxLength: number): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        maxLength = utils.validatePositiveIntegerAndZero(maxLength);
        const cell = _getCell(grid, row, colIndex);
        cell.cMaxLength = maxLength;
        if(cell._colInfo.dataType === 'text') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellMaxLength = (row: number, colIndexOrColId: number | string): number | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMaxLength;
    };
    grid.setCellMaxByte = (row: number, colIndexOrColId: number | string, maxByte: number): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        maxByte = utils.validatePositiveIntegerAndZero(maxByte);
        const cell = _getCell(grid, row, colIndex);
        cell.cMaxByte = maxByte;
        if(cell._colInfo.dataType === 'text') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellMaxByte = (row: number, colIndexOrColId: number | string): number | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMaxByte;
    };
    grid.setCellMaxNumber = (row: number, colIndexOrColId: number | string, maxNumber: number): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        maxNumber = utils.validateNumber(maxNumber);
        const cell = _getCell(grid, row, colIndex);
        cell.cMaxNumber = maxNumber;
        if(cell._colInfo.dataType === 'number') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellMaxNumber = (row: number, colIndexOrColId: number | string): number | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMaxNumber;
    };
    grid.setCellMinNumber = (row: number, colIndexOrColId: number | string, minNumber: number): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        minNumber = utils.validateNumber(minNumber);
        const cell = _getCell(grid, row, colIndex);
        cell.cMinNumber = minNumber;
        if(cell._colInfo.dataType === 'number') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellMinNumber = (row: number, colIndexOrColId: number | string): number | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMinNumber;
    };
    grid.setCellRoundNumber = (row: number, colIndexOrColId: number | string, roundNumber: number): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        roundNumber = utils.validateIntegerAndZero(roundNumber);
        const cell = _getCell(grid, row, colIndex);
        cell.cRoundNumber = roundNumber;
        if(cell._colInfo.dataType === 'number') {
            cell._value = utils.getValidValue(cell, cell._value);
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        utils.reloadGridWithModifyCell(gId, colIndex);
        return true;
    };
    grid.getCellRoundNumber = (row: number, colIndexOrColId: number | string): number | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cRoundNumber;
    };
    grid.setCellAlign = (row: number, colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if(!utils.isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        const cell = _getCell(grid, row, colIndex);
        cell.cAlign = align;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellAlign = (row: number, colIndexOrColId: number | string): string => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cAlign;
    };
    grid.setCellVerticalAlign = (row: number, colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if(!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
        const cell = _getCell(grid, row, colIndex);
        cell.cVerticalAlign = verticalAlign;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellVerticalAlign = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cVerticalAlign;
    };
    grid.setCellOverflowWrap = (row: number, colIndexOrColId: number | string, overflowWrap: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cOverflowWrap = overflowWrap;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellOverflowWrap = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cOverflowWrap;
    };
    grid.setCellWordBreak = (row: number, colIndexOrColId: number | string, wordBreak: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cWordBreak = wordBreak;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellWordBreak = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cWordBreak;
    };
    grid.setCellWhiteSpace = (row: number, colIndexOrColId: number | string, whiteSpace: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cWhiteSpace = whiteSpace;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellWhiteSpace = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cWhiteSpace;
    };
    grid.setCellVisible = (row: number, colIndexOrColId: number | string, isVisible: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');

        const cell = _getCell(grid, row, colIndex);
        if (isVisible) {
            if (cell.firstChild) cell.firstChild.style.removeProperty('display');
        }
        else {
            if (cell.firstChild) cell.firstChild.style.display = 'none'
        }
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellVisible = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        if(cell.firstChild) cell.firstChild.style.display !== 'none';
        return false;
    };
    grid.setCellBackColor = (row: number, colIndexOrColId: number | string, hexadecimalBackColor: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const cell = _getCell(grid, row, colIndex);
        cell.cBackColor = hexadecimalBackColor;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellBackColor = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cBackColor;
    };
    grid.setCellFontColor = (row: number, colIndexOrColId: number | string, hexadecimalFontColor: string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const cell = _getCell(grid, row, colIndex);
        cell.cFontColor = hexadecimalFontColor;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellFontColor = (row: number, colIndexOrColId: number | string): string | null => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontColor;
    };
    grid.setCellFontBold = (row: number, colIndexOrColId: number | string, isFontBold: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.cFontBold = isFontBold;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontBold = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontBold;
    };
    grid.setCellFontItalic = (row: number, colIndexOrColId: number | string, isFontItalic: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.cFontItalic = isFontItalic;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontItalic = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontItalic;
    };
    grid.setCellFontThruline = (row: number, colIndexOrColId: number | string, isFontThruline: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.cFontThruline = isFontThruline;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontThruline = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontThruline;
    };
    grid.setCellFontUnderline = (row: number, colIndexOrColId: number | string, isFontUnderline: boolean): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.cFontUnderline = isFontUnderline;
        grid.__gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontUnderline = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontUnderline;
    };
    grid.setTargetCell = (row:number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);

        const targetCell = _getCell(grid, row, colIndex);
        if (!utils.isCellVisible(targetCell)) return false;

        utils.activeGrid = grid;
        return utils.selectCell(targetCell);
    }
    grid.getTargetRow = (): number | null => {
        return grid.variables._targetCell ? grid.variables._targetCell.row : null;
    }
    grid.getTargetCol = (): string | null => {
        return grid.variables._targetCell ? grid.variables._targetCell.cId : null;
    }
    grid.setActiveCells = (startRow: number, startColIndexOrColId: number | string, endRow: number, endColIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(startRow);
        grid.__checkRowIndex(endRow);
        const startColIndex = grid.__getColIndex(startColIndexOrColId, true);
        const endColIndex = grid.__getColIndex(endColIndexOrColId, true);
        grid.__checkColIndex(startColIndex);
        grid.__checkColIndex(endColIndex);

        const startCell = _getCell(grid, startRow, startColIndex);
        const endCell = _getCell(grid, endRow, endColIndex);
        
        if (!utils.isCellVisible(startCell)) return false;
        if (!utils.isCellVisible(endCell)) return false;

        utils.activeGrid = grid;
        grid.variables._targetCell = startCell;
        utils.unselectCells(grid.gId);
        return utils.selectCells(startCell, endCell, startCell);
    }
    grid.getActiveRows = (): number[] => {
        return grid.variables._activeRows;
    }
    grid.getActiveCols = (): string[] => {
        const colIds: string[] = [];
        grid.variables._activeCols.forEach((colIndex: number) => {
            colIds.push(grid.__getColInfo(colIndex).cId);
        });
        return colIds;
    }
    grid.getActiveRange = (): {
        startRow: number | null;
        startColId : string | null;
        endRow : number | null;
        endColId : string | null;
    } => {
        const range = {
            startRow : null,
            startColId : null,
            endRow : null,
            endColId : null,
        };
        const activeCells = grid.variables._activeCells;
        if (activeCells.length > 0) {
        range.startRow = activeCells[0].row; 
        range.startColId = activeCells[0].cId; 
        range.endRow = activeCells[activeCells.length - 1].row; 
        range.endColId = activeCells[activeCells.length - 1].cId; 
        }
        return range;
    }
    grid.editCell = (row: number, colIndexOrColId: number | string): boolean => {
        grid.__checkRowIndex(row);
        const colIndex = grid.__getColIndex(colIndexOrColId, true);
        grid.__checkColIndex(colIndex);
        grid.__checkColRownumOrStatus(colIndex);
        const cell = _getCell(grid, row, colIndexOrColId);
        if (['select','checkbox','button','link'].indexOf(cell._colInfo.dataType) >= 0) return false;
        if (!grid.setTargetCell(row, colIndexOrColId)) return false;
        utils.createGridEditor(cell);
        return true;
    }
    grid.redo = (): boolean => {
        return utils.redoundo(gId);
    }
    grid.undo = (): boolean => {
        return utils.redoundo(gId, false);
    }
}
