import type { Grid, Vanillagrid, VanillagridConfig } from "../types/vanillagrid";
import type { DefaultGridCssInfo, DefaultGridInfo } from "../types/gridInfo";
import type { DefaultColInfo } from "../types/colInfo";
import type { Cell } from "../types/cell";
import { SelectionPolicy, VerticalAlign } from "../types/enum";
import { modifyCell } from "../utils/handleElement";
import { copyGrid, getMoveColCell, getMoveRowCell, getTabCell, pasteGrid, redoundo, selectAndCheckboxOnChange, selectCell, selectCells, stopScrolling, unselectCells } from "../utils/handleActive";
import { ___getDatasWithoutExceptedProperty, __getData, _getCell } from "../utils/handleGrid";
import { createGridEditor } from "../utils/handleCell";
import { injectCustomElement } from "../utils/createElement";
import { mountVanillagrid } from "./mountVanillagrid";
import { unmountVanillagrid } from "./unmountVanillagrid";

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
        init() { initVanillagrid(); },
        mount(element?: HTMLElement) { mountVanillagrid(singletonVanillagrid!, element) },
        destroy() { destroyVanillagrid() },
        unmount(element?: HTMLElement) { unmountVanillagrid(singletonVanillagrid!, element) },
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

const initVanillagrid = () => {
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
                if(vg._status.activeGrid!._variables._targetCell!.dataType === key) {
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
                    if (vg._status.activeGrid._variables._targetCell!.dataType === 'select') {
                        vg._status.editOldValue = (vg._status.activeGrid._variables._targetCell as any).firstChild.value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid._variables._targetCell!.dataType === 'checkbox') {
                        vg._status.editOldValue = vg._status.activeGrid._variables._targetCell!.value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.checked = !(vg._status.activeGrid._variables._targetCell as any).firstChild.checked;
                        selectAndCheckboxOnChange(vg._status.activeGrid._variables._targetCell!.firstChild);
                        
                        newTargetCell = getMoveRowCell(vg._status.activeGrid._variables._targetCell!, 1)!;
                        selectCell(newTargetCell);
                        e.preventDefault();
                    }
                    else if (['text','number','date','month','mask','code'].indexOf(vg._status.activeGrid._variables._targetCell!.dataType!) >= 0) {
                        createGridEditor(vg._status.activeGrid._variables._targetCell!, true);
                        e.preventDefault();
                    }
                    break;
                case ' ':
                    if (vg._status.activeGrid._variables._targetCell!.dataType === 'select') {
                        if (vg._status.activeGrid._variables._targetCell!.untarget || vg._status.activeGrid._variables._targetCell!.locked) {
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = (vg._status.activeGrid._variables._targetCell as any).firstChild.value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid._variables._targetCell!.dataType === 'button') {
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.focus();
                    }
                    else if (vg._status.activeGrid._variables._targetCell!.dataType === 'checkbox') {
                        if (vg._status.activeGrid._variables._targetCell!.untarget || vg._status.activeGrid._variables._targetCell!.locked) {
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = vg._status.activeGrid._variables._targetCell!.value;
                        (vg._status.activeGrid._variables._targetCell as any).firstChild.checked = !(vg._status.activeGrid._variables._targetCell as any).firstChild.checked;
                        selectAndCheckboxOnChange(vg._status.activeGrid._variables._targetCell!.firstChild);
                        e.preventDefault();
                    }
                    else if (['text','number','date','month','mask','code'].indexOf(vg._status.activeGrid._variables._targetCell!.dataType!) >= 0) {
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

    injectCustomElement(vg);
    vg._initialized = true;
}

const destroyVanillagrid = () => {
    if(!singletonVanillagrid) return;
    Object.values(singletonVanillagrid.grids).forEach((grid: Grid | null) => {
        const vanillagrid = document.getElementById(grid!._id);
        const stylesSheet = document.getElementById(grid!._id + '_styles-sheet');
        if (vanillagrid) (vanillagrid as any).parentNode.removeChild(vanillagrid);
        if (stylesSheet) (stylesSheet as any).parentNode.removeChild(stylesSheet);
        delete singletonVanillagrid!.grids[grid!._id];
        grid = null;
    });
    document.removeEventListener('mousedown', singletonVanillagrid.documentEvent.mousedown!);
    document.removeEventListener('mouseup', singletonVanillagrid.documentEvent.mouseup!);
    document.removeEventListener('keydown', singletonVanillagrid.documentEvent.keydown!);
    document.removeEventListener('copy', singletonVanillagrid.documentEvent.copy!);
    document.removeEventListener('paste', singletonVanillagrid.documentEvent.paste!);

    singletonVanillagrid = null;
}