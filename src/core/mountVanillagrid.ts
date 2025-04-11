import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid, GridBody, GridElements, GridFooter, GridHeader } from "../types/grid";
import type { ColInfo } from "../types/colInfo";
import type { Cell } from "../types/cell";
import type { Handler } from "../types/handler";
import { alignUnit, enumWidthUnit, selectionPolicyUnit, verticalAlignUnit } from "../types/enum";
import { setGridCssStyle } from "../utils/createElement";
import { extractNumberAndUnit, getAttributeOnlyBoolean, getAttributeOnlyNumber, getAttributeOnlyNumberInteger, getAttributeOnlyNumberIntegerOrZero, getAttributeWithCheckRequired, getColorFromColorSet, isIncludeEnum, nvl, setColorSet, setInvertColor, toLowerCase } from "../utils/utils";
import { getGridMethod } from "./getGridMethod";
import { GridCssInfo, GridInfo } from "../types/gridInfo";
import { GridMethods } from "../types/gridMethods";

const getGridInfo = (vg: Vanillagrid, vanillagridBox: HTMLElement) => {
    const gridInfo: GridInfo = {
        name : nvl(vanillagridBox.getAttribute('name'), vanillagridBox.getAttribute('data-id')) as string,
        locked : nvl(getAttributeOnlyBoolean('locked', vanillagridBox), vg.attributes.defaultGridInfo.locked),
        lockedColor : nvl(getAttributeOnlyBoolean('locked-color', vanillagridBox), vg.attributes.defaultGridInfo.lockedColor),
        resizable : nvl(getAttributeOnlyBoolean('resizable', vanillagridBox), vg.attributes.defaultGridInfo.resizable),
        redoable : nvl(getAttributeOnlyBoolean('redoable', vanillagridBox), vg.attributes.defaultGridInfo.redoable),
        redoCount : nvl(getAttributeOnlyNumberIntegerOrZero('redo-count', vanillagridBox), vg.attributes.defaultGridInfo.redoCount),
        visible : nvl(getAttributeOnlyBoolean('visible', vanillagridBox), vg.attributes.defaultGridInfo.visible),
        headerVisible : nvl(getAttributeOnlyBoolean('header-visible', vanillagridBox), vg.attributes.defaultGridInfo.headerVisible),
        rownumVisible : nvl(getAttributeOnlyBoolean('rownum-visible', vanillagridBox), vg.attributes.defaultGridInfo.rownumVisible),
        rownumSize : nvl(vanillagridBox.getAttribute('rownum-size'), vg.attributes.defaultGridInfo.rownumSize),
        statusVisible : nvl(getAttributeOnlyBoolean('status-visible', vanillagridBox), vg.attributes.defaultGridInfo.statusVisible),
        selectionPolicy : nvl((isIncludeEnum(selectionPolicyUnit, toLowerCase(vanillagridBox.getAttribute('selection-policy'))) ? toLowerCase(vanillagridBox.getAttribute('selectionPolicy')) : ''), vg.attributes.defaultGridInfo.selectionPolicy),
        nullValue : nvl(vanillagridBox.getAttribute('null-value'), vg.attributes.defaultGridInfo.nullValue),
        dateFormat : nvl(vanillagridBox.getAttribute('date-format'), vg.attributes.defaultGridInfo.dateFormat),
        monthFormat : nvl(vanillagridBox.getAttribute('month-format'), vg.attributes.defaultGridInfo.monthFormat),
        alterRow : nvl(getAttributeOnlyBoolean('alter-row', vanillagridBox), vg.attributes.defaultGridInfo.alterRow),
        frozenColCount : nvl(getAttributeOnlyNumberIntegerOrZero('frozen-col-count', vanillagridBox), vg.attributes.defaultGridInfo.frozenColCount),
        frozenRowCount : nvl(getAttributeOnlyNumberIntegerOrZero('frozen-row-count', vanillagridBox), vg.attributes.defaultGridInfo.frozenRowCount),
        sortable : nvl(getAttributeOnlyBoolean('sortable', vanillagridBox), vg.attributes.defaultGridInfo.sortable),
        filterable : nvl(getAttributeOnlyBoolean('filterable', vanillagridBox), vg.attributes.defaultGridInfo.filterable),
        allCheckable : nvl(getAttributeOnlyBoolean('all-checkable', vanillagridBox), vg.attributes.defaultGridInfo.allCheckable),
        checkedValue : nvl(vanillagridBox.getAttribute('checked-value'), vg.attributes.defaultGridInfo.checkedValue),
        uncheckedValue : nvl(vanillagridBox.getAttribute('unchecked-value'), vg.attributes.defaultGridInfo.uncheckedValue),
        rownumLockedColor : null,
        statusLockedColor : null,
    }
    gridInfo.rownumLockedColor = nvl(getAttributeOnlyBoolean('rownum-locked-color', vanillagridBox), gridInfo.locked);
    gridInfo.statusLockedColor = nvl(getAttributeOnlyBoolean('status-locked-color', vanillagridBox), gridInfo.locked);
    if (gridInfo.checkedValue === gridInfo.uncheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
    return gridInfo;
};

const getGridCssInfo = (vg: Vanillagrid, vanillagridBox: HTMLElement) => {
    const gridCssInfo: GridCssInfo = {
        width : nvl(vanillagridBox.getAttribute('width'), vg.attributes.defaultGridCssInfo.width),
        height : nvl(vanillagridBox.getAttribute('height'), vg.attributes.defaultGridCssInfo.height),
        margin : nvl(vanillagridBox.getAttribute('margin'), vg.attributes.defaultGridCssInfo.margin),
        padding : nvl(vanillagridBox.getAttribute('padding'), vg.attributes.defaultGridCssInfo.padding),
        sizeLevel : nvl(getAttributeOnlyNumberIntegerOrZero('size-level', vanillagridBox), vg.attributes.defaultGridCssInfo.sizeLevel),
        verticalAlign : nvl((isIncludeEnum(verticalAlignUnit, toLowerCase(vanillagridBox.getAttribute('vertical-align'))) ? toLowerCase(vanillagridBox.getAttribute('vertical-align')) : ''), vg.attributes.defaultGridCssInfo.verticalAlign),
        horizenBorderSize : nvl(getAttributeOnlyNumberIntegerOrZero('horizen-border-size', vanillagridBox), vg.attributes.defaultGridCssInfo.horizenBorderSize),
        verticalBorderSize : nvl(getAttributeOnlyNumberIntegerOrZero('vertical-border-size', vanillagridBox), vg.attributes.defaultGridCssInfo.verticalBorderSize),
        gridFontFamily : nvl(vanillagridBox.getAttribute('grid-font-family'), vg.attributes.defaultGridCssInfo.gridFontFamily),
        editorFontFamily : nvl(vanillagridBox.getAttribute('editor-font-family'), vg.attributes.defaultGridCssInfo.editorFontFamily),
        color : nvl(vanillagridBox.getAttribute('color'), vg.attributes.defaultGridCssInfo.color),
        colorSet : nvl(vanillagridBox.getAttribute('color-set'), vg.attributes.defaultGridCssInfo.colorSet),
        overflowWrap : nvl(vanillagridBox.getAttribute('overflow-wrap'), vg.attributes.defaultGridCssInfo.overflowWrap),
        wordBreak : nvl(vanillagridBox.getAttribute('word-break'), vg.attributes.defaultGridCssInfo.wordBreak),
        whiteSpace : nvl(vanillagridBox.getAttribute('white-space'), vg.attributes.defaultGridCssInfo.whiteSpace),
        linkHasUnderLine : nvl(getAttributeOnlyBoolean('link-has-under-line', vanillagridBox), vg.attributes.defaultGridCssInfo.linkHasUnderLine),
        invertColor : nvl(getAttributeOnlyBoolean('invert-color', vanillagridBox), vg.attributes.defaultGridCssInfo.invertColor),
        gridBorderColor : nvl(vanillagridBox.getAttribute('grid-border-color'), vg.attributes.defaultGridCssInfo.gridBorderColor),
        headerCellBackColor : nvl(vanillagridBox.getAttribute('header-cell-back-color'), vg.attributes.defaultGridCssInfo.headerCellBackColor),
        headerCellBorderColor : nvl(vanillagridBox.getAttribute('header-cell-border-color'), vg.attributes.defaultGridCssInfo.headerCellBorderColor),
        headerCellFontColor : nvl(vanillagridBox.getAttribute('header-cell-font-color'), vg.attributes.defaultGridCssInfo.headerCellFontColor),
        footerCellBackColor : nvl(vanillagridBox.getAttribute('footer-cell-back-color'), vg.attributes.defaultGridCssInfo.footerCellBackColor),
        footerCellBorderColor : nvl(vanillagridBox.getAttribute('footer-cell-border-color'), vg.attributes.defaultGridCssInfo.footerCellBorderColor),
        footerCellFontColor : nvl(vanillagridBox.getAttribute('footer-cell-font-color'), vg.attributes.defaultGridCssInfo.footerCellFontColor),
        bodyBackColor : nvl(vanillagridBox.getAttribute('body-back-color'), vg.attributes.defaultGridCssInfo.bodyBackColor),
        bodyCellBackColor : nvl(vanillagridBox.getAttribute('body-cell-back-color'), vg.attributes.defaultGridCssInfo.bodyCellBackColor),
        bodyCellBorderColor : nvl(vanillagridBox.getAttribute('body-cell-border-color'), vg.attributes.defaultGridCssInfo.bodyCellBorderColor),
        bodyCellFontColor : nvl(vanillagridBox.getAttribute('body-cell-font-color'), vg.attributes.defaultGridCssInfo.bodyCellFontColor),
        editorBackColor : nvl(vanillagridBox.getAttribute('editor-back-color'), vg.attributes.defaultGridCssInfo.editorBackColor),
        editorFontColor : nvl(vanillagridBox.getAttribute('editor-font-color'), vg.attributes.defaultGridCssInfo.editorFontColor),
        selectCellBackColor : nvl(vanillagridBox.getAttribute('select-cell-back-color'), vg.attributes.defaultGridCssInfo.selectCellBackColor),
        selectCellFontColor : nvl(vanillagridBox.getAttribute('select-cell-font-color'), vg.attributes.defaultGridCssInfo.selectCellFontColor),
        selectColBackColor : nvl(vanillagridBox.getAttribute('selectCol-back-color'), vg.attributes.defaultGridCssInfo.selectColBackColor),
        selectColFontColor : nvl(vanillagridBox.getAttribute('selectCol-font-color'), vg.attributes.defaultGridCssInfo.selectColFontColor),
        selectRowBackColor : nvl(vanillagridBox.getAttribute('selectRow-back-color'), vg.attributes.defaultGridCssInfo.selectRowBackColor),
        selectRowFontColor : nvl(vanillagridBox.getAttribute('selectRow-font-color'), vg.attributes.defaultGridCssInfo.selectRowFontColor),
        mouseoverCellBackColor : nvl(vanillagridBox.getAttribute('mouseover-cell-back-color'), vg.attributes.defaultGridCssInfo.mouseoverCellBackColor),
        mouseoverCellFontColor : nvl(vanillagridBox.getAttribute('mouseover-cell-font-color'), vg.attributes.defaultGridCssInfo.mouseoverCellFontColor),
        lockCellBackColor : nvl(vanillagridBox.getAttribute('lock-cell-back-color'), vg.attributes.defaultGridCssInfo.lockCellBackColor),
        lockCellFontColor : nvl(vanillagridBox.getAttribute('lock-cell-font-color'), vg.attributes.defaultGridCssInfo.lockCellFontColor),
        alterRowBackColor : nvl(vanillagridBox.getAttribute('alter-row-back-color'), vg.attributes.defaultGridCssInfo.alterRowBackColor),
        alterRowFontColor : nvl(vanillagridBox.getAttribute('alter-row-font-color'), vg.attributes.defaultGridCssInfo.alterRowFontColor),
        buttonFontColor : nvl(vanillagridBox.getAttribute('button-font-color'), vg.attributes.defaultGridCssInfo.buttonFontColor),
        buttonBorderColor : nvl(vanillagridBox.getAttribute('buttonBorderColor'), vg.attributes.defaultGridCssInfo.buttonBorderColor),
        buttonBackColor : nvl(vanillagridBox.getAttribute('button-back-color'), vg.attributes.defaultGridCssInfo.buttonBackColor),
        buttonHoverFontColor : nvl(vanillagridBox.getAttribute('buttonHover-font-color'), vg.attributes.defaultGridCssInfo.buttonHoverFontColor),
        buttonHoverBackColor : nvl(vanillagridBox.getAttribute('buttonHover-back-color'), vg.attributes.defaultGridCssInfo.buttonHoverBackColor),
        buttonActiveFontColor : nvl(vanillagridBox.getAttribute('buttonActive-font-color'), vg.attributes.defaultGridCssInfo.buttonActiveFontColor),
        buttonActiveBackColor : nvl(vanillagridBox.getAttribute('buttonActive-back-color'), vg.attributes.defaultGridCssInfo.buttonActiveBackColor),
        linkFontColor : nvl(vanillagridBox.getAttribute('link-font-color'), vg.attributes.defaultGridCssInfo.linkFontColor),
        linkHoverFontColor : nvl(vanillagridBox.getAttribute('linkHover-font-color'), vg.attributes.defaultGridCssInfo.linkHoverFontColor),
        linkActiveFontColor : nvl(vanillagridBox.getAttribute('linkActive-font-color'), vg.attributes.defaultGridCssInfo.linkActiveFontColor),
        linkVisitedFontColor : nvl(vanillagridBox.getAttribute('linkVisited-font-color'), vg.attributes.defaultGridCssInfo.linkVisitedFontColor),
        linkFocusFontColor : nvl(vanillagridBox.getAttribute('linkFocus-font-color'), vg.attributes.defaultGridCssInfo.linkFocusFontColor),
        cellFontSize : null,
        cellMinHeight : null,
    };
    gridCssInfo.cellFontSize = nvl(vanillagridBox.getAttribute('cell-font-size'), ((gridCssInfo.sizeLevel! + 15) / 20) * vg.attributes.defaultGridCssInfo.cellFontSize! + 'px');
    gridCssInfo.cellMinHeight = nvl(vanillagridBox.getAttribute('cell-min-height'), ((gridCssInfo.sizeLevel! + 15) / 20) * vg.attributes.defaultGridCssInfo.cellMinHeight! + 'px');
    if (gridCssInfo.colorSet){
        gridCssInfo.color = getColorFromColorSet(gridCssInfo.colorSet);
        setColorSet(gridCssInfo);
    }
    else {
        setColorSet(gridCssInfo);
    }
    if (gridCssInfo.invertColor) {
        setInvertColor(gridCssInfo);
    }
    return gridCssInfo;
};

const getColInfo = (vg: Vanillagrid, vanillagridBox: HTMLElement, gridInfo: GridInfo) => {
    const colInfos: ColInfo[] = [];
    let colCount = 0;
    let headerRowCount = 1;
    let styleWidth;
    let footerRowCount = 0;
    Array.from(vanillagridBox.querySelectorAll('[data-col]')).forEach(col => {
        let headers = col.getAttribute('header');
        if (!headers) headers = col.getAttribute('id')
        
        headerRowCount = headerRowCount > headers!.split(';').length ? headerRowCount : headers!.split(';').length;
        
        if (col.getAttribute('footer')) footerRowCount = footerRowCount > col.getAttribute('footer')!.split(';').length ? footerRowCount : col.getAttribute('footer')!.split(';').length;

        styleWidth = col.getAttribute('width') ? ' ' + col.getAttribute('width') : ' ' + vg.attributes.defaultColInfo.originWidth;
        let unit = extractNumberAndUnit(styleWidth)!.unit;
        if (!unit) {
            styleWidth = styleWidth + 'px';
            unit = 'px';
        }
        if (!isIncludeEnum(enumWidthUnit, unit)) throw new Error('Width units can only be pixel or %.');
        
    });
    let rownumSize = gridInfo.rownumVisible ? gridInfo.rownumSize + ' ' : '0px ';
    let statusSize = gridInfo.statusVisible ? '60px ' : '0px ';

    let colInfo: ColInfo ={
        colId : 'v-g-rownum',
        index : 1,
        name : 'rownum',
        header : new Array(headerRowCount),
        untarget : false,
        rowMerge : false,
        colMerge : false,
        colVisible : gridInfo.rownumVisible,
        rowVisible : true,
        required : false,
        resizable : false,
        sortable : false,
        filterable : false,
        originWidth : rownumSize,
        dataType : 'text',
        selectSize : null,
        locked : true,
        lockedColor : gridInfo.rownumLockedColor,
        format : null,
        codes : null,
        defaultCode : null,
        maxLength : null,
        maxByte : null,
        maxNumber : null,
        minNumber : null,
        roundNumber : null,
        filterValues : null,
        filterValue : null,
        filter : false,
        align : 'center',
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
        footer: null,
    };
    colInfo.header![0] = '',
    colInfos.push(colInfo);

    colInfo = {
        colId : 'v-g-status',
        index : 2,
        name : 'status',
        header : new Array(headerRowCount),
        untarget : true,
        rowMerge : false,
        colMerge : false,
        colVisible : gridInfo.statusVisible,
        rowVisible : true,
        required : false,
        resizable : false,
        sortable : false,
        filterable : false,
        originWidth : statusSize,
        dataType : 'code',
        selectSize : null,
        locked : true,
        lockedColor : gridInfo.statusLockedColor,
        format : null,
        codes : ['C','U','D'],
        defaultCode : null,
        maxLength : null,
        maxByte : null,
        maxNumber : null,
        minNumber : null,
        roundNumber : null,
        filterValues : null,
        filterValue : null,
        filter : false,
        align : 'center',
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
        footer: null,
    };
    colInfo.header![0] = 'status';
    colInfos.push(colInfo);

    colCount = 2;
    Array.from(vanillagridBox.querySelectorAll('[data-col]') as NodeListOf<HTMLElement>).forEach(col => {
        colCount++;
        if (!col.getAttribute('id')) throw new Error('Column ID is required.');
        if (colInfos.some(colInfo => colInfo.colId === col.getAttribute('id'))) throw new Error('Column ID is primary key.');
        colInfo = {
            colId : col.getAttribute('id')!,
            index : colCount,
            name : null,
            header : null,
            untarget : null,
            rowMerge : null,
            colMerge : null,
            colVisible : null,
            rowVisible : null,
            required : null,
            resizable : null,
            sortable : null,
            filterable : null,
            originWidth : null,
            dataType : null,
            selectSize : null,
            locked : null,
            lockedColor : null,
            format : null,
            codes : null,
            defaultCode : null,
            maxLength : null,
            maxByte : null,
            maxNumber : null,
            minNumber : null,
            roundNumber : null,
            filterValues : null,
            filterValue : null,
            filter : null,
            align : null,
            verticalAlign : null,
            overflowWrap : null,
            wordBreak : null,
            whiteSpace : null,
            backColor : null,
            fontColor : null,
            fontBold : null,
            fontItalic : null,
            fontThruline : null,
            fontUnderline : null,
            footer: null,
        };
        colInfo.name = nvl(toLowerCase(col.getAttribute('name')), colInfo.colId);

        if (col.getAttribute('header')) {
            colInfo.header = col.getAttribute('header')!.split(';');
            for(let i = colInfo.header.length; i < headerRowCount; i++) {
                colInfo.header.push('');
            }
        }
        else {
            colInfo.header = new Array(headerRowCount);
            colInfo.header[0] = colInfo.colId;
        }
        
        if (col.getAttribute('footer')) {
            colInfo.footer = col.getAttribute('footer')!.split(';');
            for(let i = colInfo.footer.length; i < footerRowCount; i++) {
                colInfo.footer.push('');
            }
        }
        
        let dataType = toLowerCase(col.getAttribute('data-type'));
        if (!dataType) dataType = vg.attributes.defaultColInfo.dataType!;
        colInfo.dataType = dataType;
        colInfo.untarget = nvl(getAttributeOnlyBoolean('untarget', col), gridInfo.selectionPolicy === 'none');
        colInfo.rowMerge = nvl(getAttributeOnlyBoolean('row-merge', col), vg.attributes.defaultColInfo.rowMerge);
        colInfo.colMerge = nvl(getAttributeOnlyBoolean('col-merge', col), vg.attributes.defaultColInfo.colMerge);
        colInfo.colVisible = nvl(getAttributeOnlyBoolean('visible', col), vg.attributes.defaultColInfo.colVisible);
        colInfo.rowVisible = true;
        colInfo.required = nvl(getAttributeOnlyBoolean('required', col), vg.attributes.defaultColInfo.required);
        colInfo.resizable = nvl(getAttributeOnlyBoolean('resizable', col), vg.attributes.defaultColInfo.resizable);
        colInfo.sortable = nvl(getAttributeOnlyBoolean('sortable', col), vg.attributes.defaultColInfo.sortable);
        colInfo.filterable = nvl(getAttributeOnlyBoolean('filterable', col), vg.attributes.defaultColInfo.filterable);
        if (colInfo.dataType === 'checkbox') colInfo.sortable = false;
        styleWidth = col.getAttribute('width') ? col.getAttribute('width') : vg.attributes.defaultColInfo.originWidth;
        if (!extractNumberAndUnit(styleWidth)!.unit) {
            styleWidth = styleWidth + 'px';
        }
        colInfo.originWidth = styleWidth;
        colInfo.selectSize = nvl((isIncludeEnum(enumWidthUnit, extractNumberAndUnit(col.getAttribute('select-size'))!.unit!) ? col.getAttribute('select-size') : ''), vg.attributes.defaultColInfo.selectSize);
        colInfo.locked = nvl(getAttributeOnlyBoolean('locked', col), gridInfo.locked);
        colInfo.lockedColor = nvl(getAttributeOnlyBoolean('locked-color', col), gridInfo.lockedColor);
        colInfo.format = nvl(col.getAttribute('format'), vg.attributes.defaultColInfo.format);
        colInfo.codes = col.getAttribute('codes') ? col.getAttribute('codes')!.split(';') : vg.attributes.defaultColInfo.codes;
        colInfo.defaultCode = nvl(col.getAttribute('default-code'), vg.attributes.defaultColInfo.defaultCode);
        colInfo.maxLength = nvl(getAttributeOnlyNumberIntegerOrZero('max-length', col), vg.attributes.defaultColInfo.maxLength);
        colInfo.maxByte = nvl(getAttributeOnlyNumberIntegerOrZero('max-byte', col), vg.attributes.defaultColInfo.maxByte);
        colInfo.maxNumber = nvl(getAttributeOnlyNumber('max-number', col), vg.attributes.defaultColInfo.maxNumber);
        colInfo.minNumber = nvl(getAttributeOnlyNumber('min-number', col), vg.attributes.defaultColInfo.minNumber);
        colInfo.roundNumber = nvl(getAttributeOnlyNumberInteger('round-number', col), vg.attributes.defaultColInfo.roundNumber);

        colInfo.filterValues = new Set();
        colInfo.filterValue = colInfo.filterable ? '$$ALL' : null;
        colInfo.filter = false;

        colInfo.align = nvl((isIncludeEnum(alignUnit, toLowerCase(col.getAttribute('align'))) ? toLowerCase(col.getAttribute('align')) : ''), vg.attributes.defaultColInfo.align);
        colInfo.verticalAlign = nvl((isIncludeEnum(verticalAlignUnit, toLowerCase(col.getAttribute('vertical-align'))) ? toLowerCase(col.getAttribute('vertical-align')) : ''), vg.attributes.defaultColInfo.verticalAlign);
        colInfo.overflowWrap = nvl(col.getAttribute('overflow-wrap'), vg.attributes.defaultColInfo.overflowWrap);
        colInfo.wordBreak = nvl(col.getAttribute('word-break'), vg.attributes.defaultColInfo.wordBreak);
        colInfo.whiteSpace = nvl(col.getAttribute('white-space'), vg.attributes.defaultColInfo.whiteSpace);
        colInfo.backColor = nvl(toLowerCase(col.getAttribute('back-color')), vg.attributes.defaultColInfo.backColor);
        colInfo.fontColor = nvl(toLowerCase(col.getAttribute('font-color')), vg.attributes.defaultColInfo.fontColor);
        colInfo.fontBold = nvl(getAttributeOnlyBoolean('font-bold', col), vg.attributes.defaultColInfo.fontBold);
        colInfo.fontItalic = nvl(getAttributeOnlyBoolean('font-italic', col), vg.attributes.defaultColInfo.fontItalic);
        colInfo.fontThruline = nvl(getAttributeOnlyBoolean('font-thruline', col), vg.attributes.defaultColInfo.fontThruline);
        colInfo.fontUnderline = nvl(getAttributeOnlyBoolean('font-underline', col), vg.attributes.defaultColInfo.fontUnderline);
        
        colInfos.push(colInfo);
        vanillagridBox.removeChild(col);
    });
    return colInfos;
};

const getEvent = () => {
    return {
        onActiveCell(row: number, colId: string) {return true},
        onActiveCells(startRow: number, startColId: string, endRow: number, endColId: string) {return true},
        onActiveRow(row: number) {return true},
        onActiveRows(startRow: number, endRow: number) {return true},
        onActiveCol(colId: string) {return true},
        onActiveCols(startColId: string, endColId: string) {return true},
        onBeforeChange(row: number, colId: string, oldValue: any, newValue: any) {return true},
        onAfterChange(row: number, colId: string, oldValue: any, newValue: any) {},
        onBeforeClickCell(row: number, colId: string) {return true},
        onAfterClickCell(row: number, colId: string) {},
        onClickSelect(row: number, colId: string, selectNode: HTMLElement) {return true},
        onClickCheckbox(row: number, colId: string, checkboxNode: HTMLElement) {return true},
        onClickButton(row: number, colId: string, buttonNude: HTMLElement) {return true},
        onClickLink(row: number, colId: string, linkNode: HTMLElement) {return true},
        onBeforeDblClickCell(row: number, colId: string) {return true},
        onAfterDblClickCell(row: number, colId: string) {},
        onBeforeClickHeader(row: number, colId: string) {return true},
        onAfterClickHeader(row: number, colId: string) {},
        onBeforeDblClickHeader(row: number, colId: string) {return true},
        onAfterDblClickHeader(row: number, colId: string) {},
        onBeforeEditEnter(row: number, colId: string, editorNode: HTMLElement) {return true},
        onAfterEditEnter(row: number, colId: string, editorNode: HTMLElement) {},
        onEditEnding(row: number, colId: string, oldValue: any, newValue: any) {return true},
        onClickFilter(row: number, colId: string, filterNode: HTMLElement) {return true},
        onChooseFilter(row: number, colId: string, oldValue: any, newValue: any) {return true},
        onPaste(startRow: number, startColId: string, clipboardText: string) {return true},
        onCopy(startRow: number, startColId: string, endRow: number, endColId: string) {return true},
        onResize(colId: string) {return true},
        onKeydownEditor(event: KeyboardEvent) {return true},
        onInputEditor(event: InputEvent) {return true},
        onKeydownGrid(event: KeyboardEvent) {return true},
    }
};

export const mountVanillagrid = (vg: Vanillagrid, gridList: Record<string, Grid>, handler: Handler, targetElement?: HTMLElement) => {
    if(!vg._initialized) throw new Error('Please initialize vanillagrid');
    const targetEl = targetElement ? targetElement : document;

    const vanillagridBoxList: NodeListOf<HTMLElement> = targetEl.querySelectorAll('[data-vanillagrid]');
    for(const vanillagridBox of vanillagridBoxList) {
        const gId = getAttributeWithCheckRequired('data-id', vanillagridBox)!;
        if(gridList[gId]) throw new Error('There is a duplicate grid ID.');
        vanillagridBox.classList.add(gId + '_vanillagrid');
        (vanillagridBox as any)._gridId = gId;

        const gridElement = document.createElement('v-g') as GridElements;
        gridElement.classList.add(gId + '_v-g');
        gridElement._gridId = gId;

        const gridHeader = document.createElement('v-g-h') as GridHeader;
        gridHeader._gridId = gId;
        gridHeader._type = 'gh';
        gridHeader.classList.add(gId + '_v-g-h');
        gridHeader._gridHeaderCells = [];

        const gridBody = document.createElement('v-g-b') as GridBody;
        gridBody._gridId = gId;
        gridBody._type = 'gb';
        gridBody.classList.add(gId + '_v-g-b');
        gridBody._gridBodyCells = [];
        
        const gridFooter = document.createElement('v-g-f') as GridFooter;
        gridFooter._gridId = gId;
        gridFooter._type = 'gf';
        gridFooter.classList.add(gId + '_v-g-f');
        gridFooter._gridFooterCells = [];

        const gridInfo = getGridInfo(vg, vanillagridBox);
        const grid: Grid = {
            data: {
                id: gId,
                gridInfo: gridInfo,
                gridCssInfo: getGridCssInfo(vg, vanillagridBox),
                colInfos: getColInfo(vg, vanillagridBox, gridInfo),
                variables: {
                    activeRows : [],
                    activeCols : [],
                    activeCells : [],
                    targetCell : null,
                    records : [],
                    recordseq : 0,
                    sortToggle : {},
                    filters : [],
                    isDrawable : true,
                },
            },
            events: getEvent(),
            methods: {} as GridMethods,
            elements: {
                grid: gridElement,
                gridHeader: gridHeader,
                gridBody: gridBody,
                gridFooter: gridFooter,
            }
        };
        gridList[gId] = grid;
        grid.methods = getGridMethod(vg, grid, handler);
        setGridCssStyle(grid);
                
        gridHeader.addEventListener('dblclick', function (e: any) {
            if (vg._status.onHeaderDragging) return;
            let headerCell: Cell;
            if (e.target._type === 'ghd') {
                headerCell = e.target;
            }
            else if (e.target._type === 'sort'){
                headerCell = e.target.parentNode;
            }
            else {
                return;
            }
            if(grid.events.onBeforeDblClickHeader(headerCell._row, headerCell.colId) === false) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            if (e.target.dataType === 'checkbox' && grid.data.gridInfo.allCheckable && headerCell._isLastCell) {
                grid.methods.setColSameValue(e.target.index, !handler.getCheckboxCellTrueOrFalse(handler._getCell(grid.data.id, 1, e.target.index)!), true);
                return;
            }

            if (!grid.data.gridInfo.sortable) return;
            if (!handler.__getColInfo(grid.data.id, headerCell.colId)!.sortable) return;
            if (!headerCell._isLastCell) return;
            
            grid.methods.sort(headerCell.colId, !grid.data.variables.sortToggle[headerCell.colId]);
            
            const removeSpans = headerCell.parentNode!.querySelectorAll('.' + headerCell._gridId + '_sortSpan');
            removeSpans.forEach((el: any) => {
                el.parentNode.removeChild(el);
            });
            let sortSpan: any;
            if(grid.data.variables.sortToggle[headerCell.colId]) {
                if(vg.elements.sortAscSpan && vg.elements.sortAscSpan instanceof HTMLElement && vg.elements.sortAscSpan.nodeType === 1) {
                    sortSpan = vg.elements.sortAscSpan.cloneNode(true);
                }
                else {
                    sortSpan = document.createElement('span');
                    sortSpan.style.fontSize = '0.5em';
                    sortSpan.style.paddingLeft = '5px';
                    sortSpan.innerText = '▲';
                }
            }
            else {
                if(vg.elements.sortDescSpan && vg.elements.sortDescSpan instanceof HTMLElement && vg.elements.sortDescSpan.nodeType === 1) {
                    sortSpan = vg.elements.sortDescSpan.cloneNode(true);
                }
                else {
                    sortSpan = document.createElement('span');
                    sortSpan.style.fontSize = '0.5em';
                    sortSpan.style.paddingLeft = '5px';
                    sortSpan.innerText = '▼';
                }
            }
            sortSpan._gridId = headerCell._gridId;
            sortSpan.isChild = true;
            sortSpan._type = 'sort';
            sortSpan.classList.add(headerCell._gridId + '_sortSpan');
            sortSpan.classList.add(grid.data.variables.sortToggle[headerCell.colId] ? headerCell._gridId + '_ascSpan' : headerCell._gridId + '_descSpan');
            headerCell.append(sortSpan);

            grid.events.onAfterDblClickHeader(headerCell._row, headerCell.colId);
        });
        gridHeader.addEventListener('click', function (e: any) {
            let headerCell: Cell;
            if (e.target._type === 'ghd') {
                headerCell = e.target;
                if(grid.events.onBeforeClickHeader(headerCell._row, headerCell.colId) === false) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                grid.events.onAfterClickHeader(headerCell._row, headerCell.colId);
            }
            else if (e.target._type === 'filter'){
                headerCell = e.target.parentNode;
                if(grid.events.onClickFilter(headerCell._row, headerCell.colId, e.target) === false) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                const removeSpans = headerCell.parentNode!.querySelectorAll('.' + headerCell._gridId + '_filterSelect');
                const filterSelect = e.target.querySelectorAll('.' + headerCell._gridId + '_filterSelect')[0];
                removeSpans.forEach((el: any) => {
                    if (filterSelect !== el && el.value === 'ALL') el.style.display = 'none';
                });
                if (filterSelect.style.display === 'none') {
                    filterSelect.style.display = 'block';
                }
                else {
                    filterSelect.style.display = 'none';
                }
            }
        });
        gridBody.addEventListener('mousemove', function (e) {
            if (vg._status.isDragging) {
                vg._status.mouseX = e.clientX;
                vg._status.mouseY = e.clientY;
            }
        });
        gridBody.addEventListener('mouseleave',function (e: any) {
            if (vg._status.isDragging) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                const deltaX = mouseX - mouseX;
                const deltaY = mouseY - mouseY;
                
                let direction = '';

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    
                    direction = deltaX > 0 ? 'right' : 'left';
                } else {
                    
                    direction = deltaY > 0 ? 'down' : 'up';
                }
                handler.startScrolling(grid.data.id, direction);
            }
        });
        gridBody.addEventListener('mouseenter', function (e) {
            if (vg._status.scrollInterval) {
                handler.stopScrolling(vg);
            }
        });
        gridBody.addEventListener('dblclick', function (e: any) {
            let cell: Cell;
            if (e.target._type === 'gbdv') {
                cell = e.target.parentNode;
            }
            else {
                cell = e.target;
            }
            if (cell._type !== 'gbd') return;
            if(grid.events.onBeforeDblClickCell(cell._row, cell.colId) === false) return;
            if (['select','checkbox','button','link'].indexOf(cell.dataType!) >= 0) return;
            handler.createGridEditor(cell);
            grid.events.onAfterDblClickCell(cell._row, cell.colId);
        });
        gridElement.addEventListener('click', function (e: any) {
            if (!e.target._type) return;
            let cell: Cell
            if (e.target._type === 'gbdv') {
                cell = e.target.parentNode;
            }
            else {
                cell = e.target;
            }
            if (!cell) return;
            if (cell.untarget || cell._type !== 'gbd') {
                return;
            }
            if(cell.firstChild && (cell.firstChild as any).nType !== 'select') {
                if(grid.events.onBeforeClickCell(cell._row, cell.colId) === false) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
            }
            if (e.target.nType) {
                switch (e.target.nType) {
                    case 'checkbox':
                        if(grid.events.onClickCheckbox(cell._row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = e.target.parentNode.value;
                        break;
                    case 'button':
                        if(grid.events.onClickButton(cell._row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        break;
                    case 'link':
                        if(grid.events.onClickLink(cell._row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        break;
                    default:
                        break;
                }
            }
            Object.keys(vg.dataType).forEach((key) => {
                if(cell.dataType === key) {
                    if(vg.dataType[key].onClick) {
                        if(typeof vg.dataType[key].onClick !== 'function') throw new Error('onClick must be a function.');
                        if((vg.dataType as any)[key].onClick(e, handler.__getData(cell)) === false) {
                            return;
                        }
                    }
                }
            });
            grid.events.onAfterClickCell(cell._row, cell.colId);
        })
        gridElement.addEventListener('mousedown', function (e: any) {
            if (!e.target._type) return;
            let cell: Cell;
            if (e.target._type === 'gbdv') {
                cell = e.target.parentNode;
            }
            else {
                cell = e.target;
            }
            if (cell.untarget || cell._type !== 'gbd') {
                return;
            }
            if (e.target.nType) {
                switch (e.target.nType) {
                    case 'select':
                        if(grid.events.onBeforeClickCell(cell._row, cell.colId) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        if(grid.events.onClickSelect(cell._row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        vg._status.editOldValue = e.target.value;
                        break;
                    default:
                        break;
                }
            }
            Object.keys(vg.dataType).forEach((key) => {
                if(cell.dataType === key) {
                    if(vg.dataType[key].onMousedown) {
                        if(typeof vg.dataType[key].onMousedown !== 'function') throw new Error('onMousedown must be a function.');
                        if((vg.dataType as any)[key].onMousedown(e, handler.__getData(cell)) === false) {
                            return;
                        }
                    }
                }
            });
            vg._status.activeGrid = grid;
            vg._status.isDragging = true;
            if (grid.data.gridInfo.selectionPolicy === 'range' && e.shiftKey && grid.data.variables.targetCell) {
                handler.unselectCells(grid.data.id);
                handler.selectCells(grid.data.variables.targetCell, cell);
            }
            else {
                handler.selectCell(cell);
            }
        });
        gridElement.addEventListener('mousemove', function (e: any) {
            let cell;
            if (e.target._type === 'gbdv') {
                cell = e.target.parentNode;
            }
            else if (e.target._type === 'gbd'){
                cell = e.target;
            }
            if (!cell) return;

            if (grid.data.gridInfo.selectionPolicy !== 'range') return;
            if (vg._status.mouseoverCell === cell) return;
            vg._status.mouseoverCell = cell;
            
            if (vg._status.isDragging && grid.data.variables.targetCell) {
                handler. unselectCells(grid.data.id);
                handler.selectCells(grid.data.variables.targetCell, cell);
            }
        });
        gridElement.addEventListener('mouseleave', function (e: any) {
            if (grid.data.gridInfo.selectionPolicy !== 'range') return;
            vg._status.mouseoverCell = null;

            if (vg._status.isDragging) {
                vg._status.isDragging = false;
            }
        });

        gridElement.append(gridHeader);
        gridElement.append(gridBody);
        gridElement.append(gridFooter);

        vanillagridBox.append(gridElement);
               
        handler.__loadHeader(grid.data.id);
        handler.__loadFooter(grid.data.id);
    }
}
