import type { Grid, GridBody, GridFooter, GridHeader, Vanillagrid } from "../types/vanillagrid";
import type { ColInfo } from "../types/colInfo";
import type { Cell } from "../types/cell";
import { alignUnit, enumWidthUnit, selectionPolicyUnit, verticalAlignUnit } from "../types/enum";
import { setGridCssStyle } from "../utils/createElement";
import { selectCell, selectCells, startScrolling, stopScrolling, unselectCells } from "../utils/handleActive";
import { createGridEditor, getCheckboxCellTrueOrFalse } from "../utils/handleCell";
import { __getColInfo, __getData, _getCell } from "../utils/handleGrid";
import { extractNumberAndUnit, getAttributeOnlyBoolean, getAttributeOnlyNumber, getAttributeOnlyNumberInteger, getAttributeOnlyNumberIntegerOrZero, getAttributeWithCheckRequired, getColorFromColorSet, isIncludeEnum, nvl, setColorSet, setInvertColor, toLowerCase } from "../utils/utils";
import { setGridMethod } from "./setGridMethod";

export const mountVanillagrid = (vg: Vanillagrid, targetElement?: HTMLElement) => {
    if(!vg._initialized) throw new Error('Please initialize vanillagrid');
    const targetEl = targetElement ? targetElement : document;

    const vanillagrids: NodeListOf<HTMLElement> = targetEl.querySelectorAll('vanilla-grid');
    for(const vanillagrid of vanillagrids) {
        const gId = getAttributeWithCheckRequired('id', vanillagrid)!;
        if(vg.grids[gId]) throw new Error('There is a duplicate grid ID.');

        vanillagrid.classList.add(gId + '_vanillagrid');
        const grid = document.createElement('v-g') as Grid;
        const colInfos: ColInfo[] = [];

        setGridInfo(gId, vg, vanillagrid, grid);
        setColInfo(vg, vanillagrid, grid, colInfos);
        setEvent(grid);
        setGridCssStyle(grid);

        grid.classList.add(gId + '_v-g');
        const gridHeader = document.createElement('v-g-h') as GridHeader;
        gridHeader._gridId = gId;
        gridHeader._type = 'gh';
        gridHeader.classList.add(gId + '_v-g-h');
        grid.gridHeader = gridHeader;
        grid.gridHeader._gridHeaderCells = [];
        const gridBody = document.createElement('v-g-b') as GridBody;
        gridBody._gridId = gId;
        gridBody._type = 'gb';
        gridBody.classList.add(gId + '_v-g-b');
        grid.gridBody = gridBody;
        grid.gridBody._gridBodyCells = [];
        const gridFooter = document.createElement('v-g-f') as GridFooter;
        gridFooter._gridId = gId;
        gridFooter._type = 'gf';
        gridFooter.classList.add(gId + '_v-g-f');
        grid.gridFooter = gridFooter;
        grid.gridFooter._gridFooterCells = [];
        
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
            /*
            if (doEventWithCheckChanged(headerCell.gId, '_onBeforeDblClickHeader', headerCell.row, headerCell.colId) === false) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            */
            if (e.target.dataType === 'checkbox' && grid._gridInfo.allCheckable && headerCell._isLastCell) {
                grid.setColSameValue(e.target.cIndex, !getCheckboxCellTrueOrFalse(_getCell(grid, 1, e.target.index)!), true);
                return;
            }

            if (!grid._gridInfo.sortable) return;
            if (!__getColInfo(grid, headerCell.colId)!.sortable) return;
            if (!headerCell._isLastCell) return;
            
            grid.sort(headerCell.colId, !grid._variables._sortToggle[headerCell.colId]);
            
            const removeSpans = headerCell.parentNode!.querySelectorAll('.' + headerCell._gridId + '_sortSpan');
            removeSpans.forEach((el: any) => {
                el.parentNode.removeChild(el);
            });
            let sortSpan: any;
            if(grid._variables._sortToggle[headerCell.colId]) {
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
            sortSpan.classList.add(grid._variables._sortToggle[headerCell.colId] ? headerCell._gridId + '_ascSpan' : headerCell._gridId + '_descSpan');
            headerCell.append(sortSpan);

            //doEventWithCheckChanged(headerCell._gridId, '_onAfterDblClickHeader', headerCell.row, headerCell.colId);
        });
        gridHeader.addEventListener('click', function (e: any) {
            let headerCell;
            if (e.target._type === 'ghd') {
                headerCell = e.target;
                /*
                if (doEventWithCheckChanged(headerCell._gridId, '_onBeforeClickHeader', headerCell.row, headerCell.colId) === false) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                */
                //doEventWithCheckChanged(headerCell._gridId, '_onAfterClickHeader', headerCell.row, headerCell.colId)
            }
            else if (e.target._type === 'filter'){
                headerCell = e.target.parentNode;
                /*
                if (doEventWithCheckChanged(headerCell._gridId, '_onClickFilter', headerCell.row, headerCell.colId, e.target) === false) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                */
                const removeSpans = headerCell.parentNode.querySelectorAll('.' + headerCell._gridId + '_filterSelect');
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
                startScrolling(grid, direction);
            }
        });
        gridBody.addEventListener('mouseenter', function (e) {
            if (vg._status.scrollInterval) {
                stopScrolling(vg);
            }
        });
        gridBody.addEventListener('dblclick', function (e: any) {
            let cell;
            if (e.target._type === 'gbdv') {
                cell = e.target.parentNode;
            }
            else {
                cell = e.target;
            }
            if (cell._type !== 'gbd') return;
            //if (doEventWithCheckChanged(cell._gridId, '_onBeforeDblClickCell', cell.row, cell.colId) === false) return;
            if (['select','checkbox','button','link'].indexOf(cell.dataType) >= 0) return;
            createGridEditor(cell);
            //doEventWithCheckChanged(cell._gridId, '_onAfterDblClickCell', cell.row, cell.colId)
        });
        grid.addEventListener('click', function (e: any) {
            if (!e.target._type) return;
            let cell
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
            if(cell.firstChild && cell.firstChild.nType !== 'select') {
                /*
                if (doEventWithCheckChanged(cell._gridId, '_onBeforeClickCell', cell.row, cell.colId) === false) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                */
            }
            if (e.target.nType) {
                switch (e.target.nType) {
                    case 'checkbox':
                        /*
                        if (doEventWithCheckChanged(cell._gridId, '_onClickCheckbox', cell.row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        */
                        vg._status.editOldValue = e.target.parentNode.cValue;
                        break;
                    case 'button':
                        /*
                        if (doEventWithCheckChanged(cell._gridId, '_onClickButton', cell.row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        */
                        break;
                    case 'link':
                        /*
                        if (doEventWithCheckChanged(cell._gridId, '_onClickLink', cell.row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        */
                        break;
                    default:
                        break;
                }
            }
            Object.keys(vg.dataType).forEach((key) => {
                if(cell.dataType === key) {
                    if(vg.dataType[key].onClick) {
                        if(typeof vg.dataType[key].onClick !== 'function') throw new Error('onClick must be a function.');
                        if((vg.dataType as any)[key].onClick(e, __getData(cell)) === false) {
                            return;
                        }
                    }
                }
            });
            //doEventWithCheckChanged(cell._gridId, '_onAfterClickCell', cell.row, cell.colId);
        })
        grid.addEventListener('mousedown', function (e: any) {
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
                        /*
                        if (doEventWithCheckChanged(cell._gridId, '_onBeforeClickCell', cell.row, cell.colId) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        if (doEventWithCheckChanged(cell._gridId, '_onClickSelect', cell.row, cell.colId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        */
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
                        if((vg.dataType as any)[key].onMousedown(e, __getData(cell)) === false) {
                            return;
                        }
                    }
                }
            });
            vg._status.activeGrid = cell._grid;
            vg._status.isDragging = true;
            if (cell._grid._gridInfo.selectionPolicy === 'range' && e.shiftKey && cell._grid._variables._targetCell) {
                unselectCells(cell._grid);
                selectCells(cell._grid._variables._targetCell, cell);
            }
            else {
                selectCell(cell);
            }
        });
        grid.addEventListener('mousemove', function (e: any) {
            let cell;
            if (e.target._type === 'gbdv') {
                cell = e.target.parentNode;
            }
            else if (e.target._type === 'gbd'){
                cell = e.target;
            }
            if (!cell) return;

            if (cell._grid._gridInfo.selectionPolicy !== 'range') return;
            if (vg._status.mouseoverCell === cell) return;
            vg._status.mouseoverCell = cell;
            
            if (vg._status.isDragging && cell._grid._variables._targetCell) {
                
                unselectCells(cell._grid);
                selectCells(cell._grid._variables._targetCell, cell);
            }
        });
        grid.addEventListener('mouseleave', function (e: any) {
            if (grid._gridInfo.selectionPolicy !== 'range') return;
            vg._status.mouseoverCell = null;

            if (vg._status.isDragging) {
                vg._status.isDragging = false;
            }
        });

        grid.append(gridHeader);
        grid.append(gridBody);
        grid.append(gridFooter);

        setGridMethod(vg, grid);
        vanillagrid.append(grid);
    }
}

const setGridInfo = (gId: string, vg: Vanillagrid, vanillagrid: HTMLElement, grid: Grid) => {
    grid._id = gId;
    grid._gridInfo = {
        name : nvl(vanillagrid.getAttribute('name'), gId) as string,
        locked : nvl(getAttributeOnlyBoolean('locked', vanillagrid), vg.attributes.defaultGridInfo.locked),
        lockedColor : nvl(getAttributeOnlyBoolean('locked-color', vanillagrid), vg.attributes.defaultGridInfo.lockedColor),
        resizable : nvl(getAttributeOnlyBoolean('resizable', vanillagrid), vg.attributes.defaultGridInfo.resizable),
        redoable : nvl(getAttributeOnlyBoolean('redoable', vanillagrid), vg.attributes.defaultGridInfo.redoable),
        redoCount : nvl(getAttributeOnlyNumberIntegerOrZero('redo-count', vanillagrid), vg.attributes.defaultGridInfo.redoCount),
        visible : nvl(getAttributeOnlyBoolean('visible', vanillagrid), vg.attributes.defaultGridInfo.visible),
        headerVisible : nvl(getAttributeOnlyBoolean('header-visible', vanillagrid), vg.attributes.defaultGridInfo.headerVisible),
        rownumVisible : nvl(getAttributeOnlyBoolean('rownum-visible', vanillagrid), vg.attributes.defaultGridInfo.rownumVisible),
        rownumSize : nvl(vanillagrid.getAttribute('rownum-size'), vg.attributes.defaultGridInfo.rownumSize),
        statusVisible : nvl(getAttributeOnlyBoolean('status-visible', vanillagrid), vg.attributes.defaultGridInfo.statusVisible),
        selectionPolicy : nvl((isIncludeEnum(selectionPolicyUnit, toLowerCase(vanillagrid.getAttribute('selection-policy'))) ? toLowerCase(vanillagrid.getAttribute('selectionPolicy')) : ''), vg.attributes.defaultGridInfo.selectionPolicy),
        nullValue : nvl(vanillagrid.getAttribute('null-value'), vg.attributes.defaultGridInfo.nullValue),
        dateFormat : nvl(vanillagrid.getAttribute('date-format'), vg.attributes.defaultGridInfo.dateFormat),
        monthFormat : nvl(vanillagrid.getAttribute('month-format'), vg.attributes.defaultGridInfo.monthFormat),
        alterRow : nvl(getAttributeOnlyBoolean('alter-row', vanillagrid), vg.attributes.defaultGridInfo.alterRow),
        frozenColCount : nvl(getAttributeOnlyNumberIntegerOrZero('frozen-col-count', vanillagrid), vg.attributes.defaultGridInfo.frozenColCount),
        frozenRowCount : nvl(getAttributeOnlyNumberIntegerOrZero('frozen-row-count', vanillagrid), vg.attributes.defaultGridInfo.frozenRowCount),
        sortable : nvl(getAttributeOnlyBoolean('sortable', vanillagrid), vg.attributes.defaultGridInfo.sortable),
        filterable : nvl(getAttributeOnlyBoolean('filterable', vanillagrid), vg.attributes.defaultGridInfo.filterable),
        allCheckable : nvl(getAttributeOnlyBoolean('all-checkable', vanillagrid), vg.attributes.defaultGridInfo.allCheckable),
        checkedValue : nvl(vanillagrid.getAttribute('checked-value'), vg.attributes.defaultGridInfo.checkedValue),
        uncheckedValue : nvl(vanillagrid.getAttribute('unchecked-value'), vg.attributes.defaultGridInfo.uncheckedValue),
        rownumLockedColor : null,
        statusLockedColor : null,
    }
    grid._gridInfo.rownumLockedColor = nvl(getAttributeOnlyBoolean('rownum-locked-color', vanillagrid), grid._gridInfo.locked);
    grid._gridInfo.statusLockedColor = nvl(getAttributeOnlyBoolean('status-locked-color', vanillagrid), grid._gridInfo.locked);
    if (grid._gridInfo.checkedValue === grid._gridInfo.uncheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
    
    grid._gridCssInfo = {
        width : nvl(vanillagrid.getAttribute('width'), vg.attributes.defaultGridCssInfo.width),
        height : nvl(vanillagrid.getAttribute('height'), vg.attributes.defaultGridCssInfo.height),
        margin : nvl(vanillagrid.getAttribute('margin'), vg.attributes.defaultGridCssInfo.margin),
        padding : nvl(vanillagrid.getAttribute('padding'), vg.attributes.defaultGridCssInfo.padding),
        sizeLevel : nvl(getAttributeOnlyNumberIntegerOrZero('size-level', vanillagrid), vg.attributes.defaultGridCssInfo.sizeLevel),
        verticalAlign : nvl((isIncludeEnum(verticalAlignUnit, toLowerCase(vanillagrid.getAttribute('vertical-align'))) ? toLowerCase(vanillagrid.getAttribute('vertical-align')) : ''), vg.attributes.defaultGridCssInfo.verticalAlign),
        horizenBorderSize : nvl(getAttributeOnlyNumberIntegerOrZero('horizen-border-size', vanillagrid), vg.attributes.defaultGridCssInfo.horizenBorderSize),
        verticalBorderSize : nvl(getAttributeOnlyNumberIntegerOrZero('vertical-border-size', vanillagrid), vg.attributes.defaultGridCssInfo.verticalBorderSize),
        gridFontFamily : nvl(vanillagrid.getAttribute('grid-font-family'), vg.attributes.defaultGridCssInfo.gridFontFamily),
        editorFontFamily : nvl(vanillagrid.getAttribute('editor-font-family'), vg.attributes.defaultGridCssInfo.editorFontFamily),
        color : nvl(vanillagrid.getAttribute('color'), vg.attributes.defaultGridCssInfo.color),
        colorSet : nvl(vanillagrid.getAttribute('color-set'), vg.attributes.defaultGridCssInfo.colorSet),
        overflowWrap : nvl(vanillagrid.getAttribute('overflow-wrap'), vg.attributes.defaultGridCssInfo.overflowWrap),
        wordBreak : nvl(vanillagrid.getAttribute('word-break'), vg.attributes.defaultGridCssInfo.wordBreak),
        whiteSpace : nvl(vanillagrid.getAttribute('white-space'), vg.attributes.defaultGridCssInfo.whiteSpace),
        linkHasUnderLine : nvl(getAttributeOnlyBoolean('link-has-under-line', vanillagrid), vg.attributes.defaultGridCssInfo.linkHasUnderLine),
        invertColor : nvl(getAttributeOnlyBoolean('invert-color', vanillagrid), vg.attributes.defaultGridCssInfo.invertColor),
        gridBorderColor : nvl(vanillagrid.getAttribute('grid-border-color'), vg.attributes.defaultGridCssInfo.gridBorderColor),
        headerCellBackColor : nvl(vanillagrid.getAttribute('header-cell-back-color'), vg.attributes.defaultGridCssInfo.headerCellBackColor),
        headerCellBorderColor : nvl(vanillagrid.getAttribute('header-cell-border-color'), vg.attributes.defaultGridCssInfo.headerCellBorderColor),
        headerCellFontColor : nvl(vanillagrid.getAttribute('header-cell-font-color'), vg.attributes.defaultGridCssInfo.headerCellFontColor),
        footerCellBackColor : nvl(vanillagrid.getAttribute('footer-cell-back-color'), vg.attributes.defaultGridCssInfo.footerCellBackColor),
        footerCellBorderColor : nvl(vanillagrid.getAttribute('footer-cell-border-color'), vg.attributes.defaultGridCssInfo.footerCellBorderColor),
        footerCellFontColor : nvl(vanillagrid.getAttribute('footer-cell-font-color'), vg.attributes.defaultGridCssInfo.footerCellFontColor),
        bodyBackColor : nvl(vanillagrid.getAttribute('body-back-color'), vg.attributes.defaultGridCssInfo.bodyBackColor),
        bodyCellBackColor : nvl(vanillagrid.getAttribute('body-cell-back-color'), vg.attributes.defaultGridCssInfo.bodyCellBackColor),
        bodyCellBorderColor : nvl(vanillagrid.getAttribute('body-cell-border-color'), vg.attributes.defaultGridCssInfo.bodyCellBorderColor),
        bodyCellFontColor : nvl(vanillagrid.getAttribute('body-cell-font-color'), vg.attributes.defaultGridCssInfo.bodyCellFontColor),
        editorBackColor : nvl(vanillagrid.getAttribute('editor-back-color'), vg.attributes.defaultGridCssInfo.editorBackColor),
        editorFontColor : nvl(vanillagrid.getAttribute('editor-font-color'), vg.attributes.defaultGridCssInfo.editorFontColor),
        selectCellBackColor : nvl(vanillagrid.getAttribute('select-cell-back-color'), vg.attributes.defaultGridCssInfo.selectCellBackColor),
        selectCellFontColor : nvl(vanillagrid.getAttribute('select-cell-font-color'), vg.attributes.defaultGridCssInfo.selectCellFontColor),
        selectColBackColor : nvl(vanillagrid.getAttribute('selectCol-back-color'), vg.attributes.defaultGridCssInfo.selectColBackColor),
        selectColFontColor : nvl(vanillagrid.getAttribute('selectCol-font-color'), vg.attributes.defaultGridCssInfo.selectColFontColor),
        selectRowBackColor : nvl(vanillagrid.getAttribute('selectRow-back-color'), vg.attributes.defaultGridCssInfo.selectRowBackColor),
        selectRowFontColor : nvl(vanillagrid.getAttribute('selectRow-font-color'), vg.attributes.defaultGridCssInfo.selectRowFontColor),
        mouseoverCellBackColor : nvl(vanillagrid.getAttribute('mouseover-cell-back-color'), vg.attributes.defaultGridCssInfo.mouseoverCellBackColor),
        mouseoverCellFontColor : nvl(vanillagrid.getAttribute('mouseover-cell-font-color'), vg.attributes.defaultGridCssInfo.mouseoverCellFontColor),
        lockCellBackColor : nvl(vanillagrid.getAttribute('lock-cell-back-color'), vg.attributes.defaultGridCssInfo.lockCellBackColor),
        lockCellFontColor : nvl(vanillagrid.getAttribute('lock-cell-font-color'), vg.attributes.defaultGridCssInfo.lockCellFontColor),
        alterRowBackColor : nvl(vanillagrid.getAttribute('alter-row-back-color'), vg.attributes.defaultGridCssInfo.alterRowBackColor),
        alterRowFontColor : nvl(vanillagrid.getAttribute('alter-row-font-color'), vg.attributes.defaultGridCssInfo.alterRowFontColor),
        buttonFontColor : nvl(vanillagrid.getAttribute('button-font-color'), vg.attributes.defaultGridCssInfo.buttonFontColor),
        buttonBorderColor : nvl(vanillagrid.getAttribute('buttonBorderColor'), vg.attributes.defaultGridCssInfo.buttonBorderColor),
        buttonBackColor : nvl(vanillagrid.getAttribute('button-back-color'), vg.attributes.defaultGridCssInfo.buttonBackColor),
        buttonHoverFontColor : nvl(vanillagrid.getAttribute('buttonHover-font-color'), vg.attributes.defaultGridCssInfo.buttonHoverFontColor),
        buttonHoverBackColor : nvl(vanillagrid.getAttribute('buttonHover-back-color'), vg.attributes.defaultGridCssInfo.buttonHoverBackColor),
        buttonActiveFontColor : nvl(vanillagrid.getAttribute('buttonActive-font-color'), vg.attributes.defaultGridCssInfo.buttonActiveFontColor),
        buttonActiveBackColor : nvl(vanillagrid.getAttribute('buttonActive-back-color'), vg.attributes.defaultGridCssInfo.buttonActiveBackColor),
        linkFontColor : nvl(vanillagrid.getAttribute('link-font-color'), vg.attributes.defaultGridCssInfo.linkFontColor),
        linkHoverFontColor : nvl(vanillagrid.getAttribute('linkHover-font-color'), vg.attributes.defaultGridCssInfo.linkHoverFontColor),
        linkActiveFontColor : nvl(vanillagrid.getAttribute('linkActive-font-color'), vg.attributes.defaultGridCssInfo.linkActiveFontColor),
        linkVisitedFontColor : nvl(vanillagrid.getAttribute('linkVisited-font-color'), vg.attributes.defaultGridCssInfo.linkVisitedFontColor),
        linkFocusFontColor : nvl(vanillagrid.getAttribute('linkFocus-font-color'), vg.attributes.defaultGridCssInfo.linkFocusFontColor),
        cellFontSize : null,
        cellMinHeight : null,
    };
    grid._gridCssInfo.cellFontSize = nvl(vanillagrid.getAttribute('cell-font-size'), ((grid._gridCssInfo.sizeLevel! + 15) / 20) * vg.attributes.defaultGridCssInfo.cellFontSize! + 'px');
    grid._gridCssInfo.cellMinHeight = nvl(vanillagrid.getAttribute('cell-min-height'), ((grid._gridCssInfo.sizeLevel! + 15) / 20) * vg.attributes.defaultGridCssInfo.cellMinHeight! + 'px');
    if (grid._gridCssInfo.colorSet){
        grid._gridCssInfo.color = getColorFromColorSet(grid._gridCssInfo.colorSet);
        setColorSet(grid._gridCssInfo);
    }
    else {
        setColorSet(grid._gridCssInfo);
    }
    if (grid._gridCssInfo.invertColor) {
        setInvertColor(grid._gridCssInfo);
    }
};

const setColInfo = (vg: Vanillagrid, vanillagrid: HTMLElement, grid: Grid, colInfos: ColInfo[]) => {
    let colCount = 0;
    let headerRowCount = 1;
    let styleWidth;
    let footerRowCount = 0;
    Array.from(vanillagrid.querySelectorAll('v-col')).forEach(col => {
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
    let rownumSize = grid._gridInfo.rownumVisible ? grid._gridInfo.rownumSize + ' ' : '0px ';
    let statusSize = grid._gridInfo.statusVisible ? '60px ' : '0px ';

    let colInfo: ColInfo ={
        colId : 'v-g-rownum',
        index : 1,
        name : 'rownum',
        header : new Array(headerRowCount),
        untarget : false,
        rowMerge : false,
        colMerge : false,
        colVisible : grid._gridInfo.rownumVisible,
        rowVisible : true,
        required : false,
        resizable : false,
        sortable : false,
        filterable : false,
        originWidth : rownumSize,
        dataType : 'text',
        selectSize : null,
        locked : true,
        lockedColor : grid._gridInfo.rownumLockedColor,
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
        colVisible : grid._gridInfo.statusVisible,
        rowVisible : true,
        required : false,
        resizable : false,
        sortable : false,
        filterable : false,
        originWidth : statusSize,
        dataType : 'code',
        selectSize : null,
        locked : true,
        lockedColor : grid._gridInfo.statusLockedColor,
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
    Array.from(vanillagrid.querySelectorAll('v-col') as NodeListOf<HTMLElement>).forEach(col => {
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
        colInfo.untarget = nvl(getAttributeOnlyBoolean('untarget', col), grid._gridInfo.selectionPolicy === 'none');
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
        colInfo.locked = nvl(getAttributeOnlyBoolean('locked', col), grid._gridInfo.locked);
        colInfo.lockedColor = nvl(getAttributeOnlyBoolean('locked-color', col), grid._gridInfo.lockedColor);
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
        vanillagrid.removeChild(col);
    });
};

const setEvent = (grid: Grid) => {
    grid._events = {
        onActiveCell(row: number, colId: string) {return true},
        onActiveCells(startRow: number, startColId: string, endRow: number, endColId: string) {return true},
        onActiveRow(row: number) {return true},
        onActiveRows(startRow: number, endRow: number) {return true},
        onActiveCol(colId: string) {return true},
        onActiveCols(startColId: string, endColId: string) {return true},
        onBeforeChange(row: number, colId: string, oldValue: any, newValue: any) {return true},
        onAfterChange(row: number, colId: string, oldValue: any, newValue: any) {return true},
        onBeforeClickCell(row: number, colId: string) {return true},
        onAfterClickCell(row: number, colId: string) {return true},
        onClickSelect(row: number, colId: string, selectNode: HTMLElement) {return true},
        onClickCheckbox(row: number, colId: string, checkboxNode: HTMLElement) {return true},
        onClickButton(row: number, colId: string, buttonNude: HTMLElement) {return true},
        onClickLink(row: number, colId: string, linkNode: HTMLElement) {return true},
        onBeforeDblClickCell(row: number, colId: string) {return true},
        onAfterDblClickCell(row: number, colId: string) {return true},
        onBeforeClickHeader(row: number, colId: string) {return true},
        onAfterClickHeader(row: number, colId: string) {return true},
        onBeforeDblClickHeader(row: number, colId: string) {return true},
        onAfterDblClickHeader(row: number, colId: string) {return true},
        onEditEnter(row: number, colId: string, editorNode: HTMLElement) {return true},
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
}
