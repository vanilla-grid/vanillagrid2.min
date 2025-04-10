import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { Cell } from "../types/cell";
import type { Handler } from "../types/handler";
import { footerUnit } from "../types/enum";
import { extractNumberAndUnit, getCssTextFromObject, getOnlyNumberWithNaNToNull, getOnlyNumberWithNaNToZero, removeAllChild } from "./utils";

export const getGridCssStyle = (grid: Grid) => {
    const gId = grid.data.id;
    const csses: any = {};
    csses['.' + gId + '_vanillagrid'] = {
        'width': grid.data.gridCssInfo.width,
        'height': grid.data.gridCssInfo.height,
        'display': grid.data.gridInfo.visible ? 'block' : 'none',
        'border': '1px solid ' + grid.data.gridCssInfo.gridBorderColor,
        'overflow': 'auto',
        'background-color': '#fff',
        'margin': grid.data.gridCssInfo.margin,
        'padding': grid.data.gridCssInfo.padding,
        'font-family': grid.data.gridCssInfo.gridFontFamily,
    };
    csses['.' + gId + '_v-g'] = {
        'background-color': grid.data.gridCssInfo.bodyBackColor,
        'display': 'flex',
        'position': 'relative',
        'flex-direction': 'column',
        'height': '100%',
        'overflow-x': 'auto',
        'overflow-y': 'auto',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
    };
    csses['.' + gId + '_v-g-h'] = {
        //'position': '-webkit-sticky',
        'position': 'sticky',
        'top': '0',
        'z-index': '250',
        'display': grid.data.gridInfo.headerVisible ? 'grid' : 'none',
    };
    csses['.' + gId + '_v-g-b'] = {
        'margin-bottom': '22px',
        'display': 'grid',
        'position': 'relative',
    };
    csses['.' + gId + '_v-g-f'] = {
        //'position': '-webkit-sticky',
        'position': 'sticky',
        'bottom': '0',
        'z-index': '250',
        'display': 'grid',
        'margin-top': 'auto',
    };
    csses['.' + gId + '_h-v-g-d'] = {
        'background-color': grid.data.gridCssInfo.headerCellBackColor,
        'justify-content': 'center',
        'text-align': 'center',
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.headerCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.headerCellBorderColor,
        'color': grid.data.gridCssInfo.headerCellFontColor,
    };
    csses['.' + gId + '_h-v-g-d select'] = {
        'color': '#333',
    };
    csses['.' + gId + '_h-v-g-d option'] = {
        'color': '#333',
    };
    csses['.' + gId + '_b-v-g-d'] = {
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'background-color': grid.data.gridCssInfo.bodyCellBackColor,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'color': grid.data.gridCssInfo.bodyCellFontColor,
    };
    csses['.' + gId + '_f-v-g-d'] = {
        'justify-content': 'center',
        'text-align': 'center',
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'background-color': grid.data.gridCssInfo.footerCellBackColor,
        'border-top': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.footerCellBorderColor,
        'color': grid.data.gridCssInfo.footerCellFontColor,
    };
    csses['.' + gId + '_f-v-g-d-value'] = {
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
    };
    csses['.' + gId + '_b-v-g-d-alter'] = {
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'background-color': grid.data.gridCssInfo.alterRowBackColor,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'color': grid.data.gridCssInfo.alterRowFontColor,
    };
    csses['.' + gId + '_b-v-g-d-locked'] = {
        'background-color': grid.data.gridCssInfo.lockCellBackColor,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'color': grid.data.gridCssInfo.lockCellFontColor,
    };
    csses['.' + gId + '_v-g-d'] = {
        'font-size': grid.data.gridCssInfo.cellFontSize,
        'display': 'flex',
        'min-height': grid.data.gridCssInfo.cellMinHeight,
        'overflow': 'hidden',
        'white-space': 'nowrap',
        'padding-left': '5px',
        'padding-right': '5px',
    };
    if (grid.data.gridCssInfo.overflowWrap) csses['.' + gId + '_v-g-d']['overflow-wrap'] = grid.data.gridCssInfo.overflowWrap;
    if (grid.data.gridCssInfo.wordBreak) csses['.' + gId + '_v-g-d']['word-break'] = grid.data.gridCssInfo.wordBreak;
    if (grid.data.gridCssInfo.whiteSpace) csses['.' + gId + '_v-g-d']['white-space'] = grid.data.gridCssInfo.whiteSpace;

    csses['.' + gId + '_editor'] = {
        'font-size': grid.data.gridCssInfo.cellFontSize,
        'background-color': grid.data.gridCssInfo.editorBackColor,
        'border': 'none',
        'color': grid.data.gridCssInfo.editorFontColor,
        'overflow' : 'hidden',
        'resize': 'none',
        'box-sizing': 'border-box',
        'font-family': grid.data.gridCssInfo.gridFontFamily,
        'text-align': 'inherit',
    };
    csses['.' + gId + '_editor:focus'] = {
        'outline': 'none',
    };
    csses['.' + gId + '_mouseover-cell'] = {
        'background-color': grid.data.gridCssInfo.mouseoverCellBackColor + ' !important',
        'color': grid.data.gridCssInfo.mouseoverCellFontColor + ' !important',
    };
    csses['.' + gId + '_selected-cell'] = {
        'background-color': grid.data.gridCssInfo.selectCellBackColor + ' !important',
        'color': grid.data.gridCssInfo.selectCellFontColor + ' !important',
    };
    csses['.' + gId + '_selected-col'] = {
        'background-color': grid.data.gridCssInfo.selectColBackColor,
        'color': grid.data.gridCssInfo.selectColFontColor,
    };
    csses['.' + gId + '_selected-row'] = {
        'background-color': grid.data.gridCssInfo.selectRowBackColor,
        'color': grid.data.gridCssInfo.selectRowFontColor,
    };
    csses['.' + gId + '_filterSpan'] = {
        'display': 'block',
        'font-size': '0.8em',
        'padding-right': '8px',
        'cursor': 'pointer',
    };
    csses['.' + gId + '_filterSelect'] = {
        'position': 'absolute',
        'z-index': '300',
        'margin': '5px',
    };
    csses['.' + gId + '_data-value-select'] = {
        'font-size': grid.data.gridCssInfo.cellFontSize,
        'cursor': 'pointer',
        'border': 'none',
        'background': 'none',
        'color': 'inherit'
    }
    csses['.' + gId + '_data-value-select:focus'] = {
        'outline': 'none',
    }
    csses['.' + gId + '_data-value-checkbox'] = {
        'cursor': 'pointer',
    }
    csses['.' + gId + '_data-value-button'] = {
        'min-width': '95%',
        'height': (extractNumberAndUnit(grid.data.gridCssInfo.cellMinHeight)!.number * 0.85) + 'px',
        'line-height': (extractNumberAndUnit(grid.data.gridCssInfo.cellMinHeight)!.number * 0.85) + 'px',
        'font-size': grid.data.gridCssInfo.cellFontSize,
        'cursor': 'pointer',
        'border': 'none',
        'color': grid.data.gridCssInfo.buttonFontColor,
        'background-color': grid.data.gridCssInfo.buttonBackColor,
        'box-shadow': '0.75px 0.75px 1px 0.25px ' + grid.data.gridCssInfo.buttonBorderColor,
    }
    csses['.' + gId + '_data-value-button:hover'] = {
        'color': grid.data.gridCssInfo.buttonHoverFontColor,
        'background-color': grid.data.gridCssInfo.buttonHoverBackColor,
    }
    csses['.' + gId + '_data-value-button:active'] = {
        'color': grid.data.gridCssInfo.buttonActiveFontColor,
        'background-color': grid.data.gridCssInfo.buttonActiveBackColor,
        'box-shadow': '0px 0px 0.5px 0.25px ' + grid.data.gridCssInfo.buttonBorderColor,
    }
    csses['.' + gId + '_data-value-button:focus'] = {
        'outline': 'none',
    }
    csses['.' + gId + '_data-value-button:disabled'] = {
        'opacity': '0.7',
    }
    csses['.' + gId + '_data-value-link'] = {
        'color': grid.data.gridCssInfo.linkFontColor,
        'text-decoration': grid.data.gridCssInfo.linkHasUnderLine ? 'underline' : 'none',
    }
    csses['.' + gId + '_data-value-link:visited'] = {
        'color': grid.data.gridCssInfo.linkVisitedFontColor,
    }
    csses['.' + gId + '_data-value-link:hover'] = {
        'color': grid.data.gridCssInfo.linkHoverFontColor + ' !important',
    }
    csses['.' + gId + '_data-value-link:active'] = {
        'color': grid.data.gridCssInfo.linkActiveFontColor + ' !important',
    }
    csses['.' + gId + '_data-value-link:focus'] = {
        'color': grid.data.gridCssInfo.linkFocusFontColor + ' !important',
    }
    return csses;
}

export const setGridCssStyle = (grid: Grid) => {
    const gId = grid.data.id;
    let cssText = '';
    const csses = getGridCssStyle(grid);
    const cssKeys = Object.keys(csses);
    for(let i = 0; i < cssKeys.length; i++) {
        cssText = cssText + cssKeys[i] + ' {' + getCssTextFromObject(csses[cssKeys[i]]) + '}\n';
    }

    let styleElement: any = document.getElementById(gId + '_styles-sheet');
    if (styleElement) {
        removeAllChild(styleElement);
        styleElement.appendChild(document.createTextNode(cssText));
    }
    else {
        styleElement = document.createElement('style');
        styleElement.setAttribute('id', gId + '_styles-sheet');
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssText;
        }
        else {
            styleElement.appendChild(document.createTextNode(cssText));
        }
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
}

export const injectCustomElement = (vg: Vanillagrid, gridList: Record<string, Grid>, handler: Handler) => {
    vg._VanillaGrid = class extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
        }
    }
    if (!customElements.get('v-g')) customElements.define('v-g', vg._VanillaGrid);
    
    vg._GridHeader = class extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            if (!this.style.gridTemplateColumns.includes('%')) {
                const _grid = gridList[(this as any)._gridId];
                let totalWidth = 0;
                for(let col = 1; col < _grid.methods.getColCount(); col++) {
                    totalWidth += extractNumberAndUnit(_grid.methods.getColOriginWidth(col))!.number;
                }
                this.style.width = totalWidth + 'px';
            }
        }
    }
    if (!customElements.get('v-g-h')) customElements.define('v-g-h', vg._GridHeader);
    
    vg._GridBody = class extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            if (!this.style.gridTemplateColumns.includes('%')) {
                const _grid = gridList[(this as any)._gridId];
                let totalWidth = 0;
                for(let col = 1; col < _grid.methods.getColCount(); col++) {
                    totalWidth += extractNumberAndUnit(_grid.methods.getColOriginWidth(col))!.number;
                }
                this.style.width = totalWidth + 'px';
            }
        }
    }
    if (!customElements.get('v-g-b')) customElements.define('v-g-b', vg._GridBody);
    
    vg._GridFooter = class extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            if (!this.style.gridTemplateColumns.includes('%')) {
                const _grid = gridList[(this as any)._gridId];
                let totalWidth = 0;
                if(!handler._getFooterCells(_grid) || handler._getFooterCells(_grid).length <= 0) return;
                for(let col = 1; col < _grid.methods.getColCount(); col++) {
                    totalWidth += extractNumberAndUnit(_grid.methods.getColOriginWidth(col))!.number;
                }
                this.style.width = totalWidth + 'px';
            }
        }
    }
    if (!customElements.get('v-g-f')) customElements.define('v-g-f', vg._GridFooter);
    
    vg._GridData = class extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            const _cell: Cell = this as any;

            const _grid = _cell._grid;
            const _gridInfo = _grid.getGridInfo();
            
            _cell.style.removeProperty('display');
            _cell.style.removeProperty('align-items');
            _cell.style.removeProperty('justify-content');
            _cell.style.removeProperty('text-align');
            _cell.style.removeProperty('z-index');
    
            switch (_cell._type) {
                case 'ghd': 
                    _cell.innerText = _cell.value;
                    
                    if (_gridInfo.frozenRowCount! <= 0 && _cell._col <= _gridInfo.frozenColCount!) {
                        let leftElement;
                        let leftElementOffsetWidth = 0
    
                        for(let c = _cell._col - 1; c > 0; c--) {
                            leftElement = handler._getHeaderCell(_grid, _cell._row, c);
                            if (!leftElement) {
                                leftElementOffsetWidth = leftElementOffsetWidth + 0;
                            }
                            else if (leftElement.isRowMerge) {
                                let r = _cell._row - 1;
                                let spanNode = handler._getHeaderCell(_grid, r, c);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode.isRowMerge) {
                                        break;
                                    }
                                    r--;
                                    spanNode = handler._getHeaderCell(_grid, r, c);
                                }
                                leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                            }
                            else {
                                leftElementOffsetWidth = leftElementOffsetWidth + handler._getHeaderCell(_grid, _cell._row, c).offsetWidth;
                            }
                        }
                        _cell.style.position = 'sticky',
                        _cell.style.zIndex = String(300 + _grid.getColCount() - _cell._col),
                        _cell.style.left = leftElementOffsetWidth + 'px';
                        _cell._frozenCol = true;
                    }
                    
                    if (_cell.isRowMerge) {
                        let r = _cell._row - 1;
                        let spanNode = handler._getHeaderCell(_grid, r, _cell._col);
                        while(spanNode) {
                            if (r < 0) break;
                            if (!spanNode.isRowMerge) {
                                
                                spanNode.style.gridRowEnd = _cell.style.gridRowEnd;
                                spanNode.rowSpan = spanNode.rowSpan ? spanNode.rowSpan + 1 : 1;
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                break;
                            }
                            r--;
                            spanNode = handler._getHeaderCell(_grid, r, _cell._col);
                        }
                        _cell.style.display = 'none';
                    }
                    
                    if (_cell.isColMerge) {
                        let c = _cell._col - 1;
                        let spanNode = handler._getHeaderCell(_grid, _cell._row, c);
                        while(spanNode) {
                            if (c < 0) break;
                            if (!spanNode.isColMerge) {
                                if (spanNode.colId === 'v-g-rownum' || spanNode.colId === 'v-g-status') break;
                                spanNode.style.gridColumnEnd = _cell.style.gridColumnEnd;
                                spanNode.style.width = extractNumberAndUnit(spanNode.style.width)!.number + _cell.offsetWidth + 'px';
                                spanNode.colSpan = spanNode.colSpan ? spanNode.colSpan + 1 : 1;
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                break;
                            }
                            c--;
                            spanNode = handler._getHeaderCell(_grid, _cell._row, c);
                        }
                        _cell.style.display = 'none';
                    }
                    
                    if (!_cell.colVisible || !_cell.rowVisible) {
                        _cell.style.display = 'none';
                    }
                    
                    if (_grid.getHeaderRowCount() === _cell._row) {
                        let targetCell: any = this;
                        if (_cell.isRowMerge) {
                            for(let r = _cell._row - 1; r > 0; r--) {
                                targetCell = handler._getHeaderCell(_grid, r, _cell._col);
                                if (targetCell.rowSpan) break;
                            }
                        }
                        if (targetCell) targetCell._isLastCell = true;
                    }
                    if (_gridInfo.filterable === true && _grid.getColInfo(_cell.colId).filterable &&
                        _grid.getHeaderRowCount() === _cell._row && _cell.colId !== 'v-g-rownum' && _cell.colId !== 'v-g-status') {
                        let filterSpan: any;
                        const vgFilterSpan = handler._getFilterSpan();
                        if(vgFilterSpan && vgFilterSpan instanceof HTMLElement && vgFilterSpan.nodeType === 1) {
                            filterSpan = vgFilterSpan.cloneNode(true);
                        }
                        else {
                            filterSpan = document.createElement('span');
                            filterSpan.innerText = 'σ';
                        }
                        filterSpan._gridId = _cell._gridId;
                        filterSpan.isChild = true;
                        filterSpan._type = 'filter';
                        filterSpan.classList.add(_cell._gridId + '_filterSpan'); 
    
                        const filterSelect: any = document.createElement('select');
                        filterSelect.classList.add(_cell._gridId + '_filterSelect'); 
                        filterSelect.style.display = 'none';
                        filterSelect._grid = _cell._grid;
                        filterSelect.colId = _cell.colId;

                        filterSelect.addEventListener('mousedown', function (e: any) {
                            this.filterOldValue = e.target.value;
                        })

                        filterSelect.addEventListener('change', function (e: any) {
                            const filterNewValue = e.target.value;
                            if ((window as any)[e.target.parentNode.parentNode.gId + '_onChooseFilter'](e.target.parentNode.parentNode.row, e.target.parentNode.parentNode.colId, this.filterOldValue, filterNewValue) === false) {
                                e.stopPropagation();
                                e.preventDefault();
                                return;
                            }
                            this._grid._doFilter();
                            if (filterNewValue === '$$ALL') {
                                this.style.display = 'none';
                            }
                        });
    
                        filterSpan.append(filterSelect);
    
                        let targetCell: any = this;
                        if (_cell.isRowMerge) {
                            for(let r = _cell._row - 1; r > 0; r--) {
                                targetCell = handler._getHeaderCell(_grid, r, _cell._col);
                                if (targetCell.rowSpan) break;
                            }
                        }
                        if (targetCell) targetCell.insertBefore(filterSpan, targetCell.firstChild);  
                    }
    
                    _cell.classList.add(_cell._gridId + '_h-v-g-d');
                    break;
                case 'gfd': 
                    
                    if (_gridInfo.frozenRowCount! <= 0 && _cell._col <= _gridInfo.frozenColCount!) {
                        let leftElement;
                        let leftElementOffsetWidth = 0
    
                        for(let c = _cell._col - 1; c > 0; c--) {
                            leftElement = handler._getFooterCell(_grid, _cell._row, c);
                            if (!leftElement) {
                                leftElementOffsetWidth = leftElementOffsetWidth + 0;
                            }
                            else if (leftElement.isRowMerge) {
                                let r = _cell._row - 1;
                                let spanNode = handler._getFooterCell(_grid, r, c);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode.isRowMerge) {
                                        break;
                                    }
                                    r--;
                                    spanNode = handler._getFooterCell(_grid, r, c);
                                }
                                leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                            }
                            else {
                                leftElementOffsetWidth = leftElementOffsetWidth + handler._getFooterCell(_grid, _cell._row, c).offsetWidth;
                            }
                        }
                        _cell.style.position = '-webkit-sticky',
                        _cell.style.zIndex = '300',
                        _cell.style.left = leftElementOffsetWidth + 'px';
                        _cell._frozenCol = true;
                    }
                    
                    if (_cell.footer) {
                        _cell.classList.add(_cell._gridId + '_f-v-g-d-value');
                        let preSibling;
                        try {
                            preSibling = handler._getFooterCell(_grid, _cell._row, _cell._col - 1);
                        } catch (error) {
                            preSibling = null;
                        }
                        if (preSibling) {
                            preSibling.classList.add(_cell._gridId + '_f-v-g-d-value');
                        }
                        if (Object.values(footerUnit).includes((_cell as any).footer)) {
                            let footerNumber;
                            let tempNumber;
                            let tempCell;
                            switch (_cell.footer) {
                                case '$$MAX':
                                    _cell.style.justifyContent = 'right';
                                    _cell.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        tempNumber = handler.getFirstCellValidNumber((this as any));
                                        footerNumber = tempNumber;
                                        for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = handler._getCell(_grid, r, _cell._col);
                                            if (!handler.isCellVisible(tempCell!)) continue;
                                            tempNumber = getOnlyNumberWithNaNToNull(tempCell!.value);
                                            if (tempNumber !== null && tempNumber > footerNumber!) {
                                                footerNumber = tempNumber;
                                            }
                                        }
                                    }
                                    break;
                                case '$$MIN':
                                    _cell.style.justifyContent = 'right';
                                    _cell.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        tempNumber = handler.getFirstCellValidNumber((this as any));
                                        footerNumber = tempNumber;
                                        for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = handler._getCell(_grid, r, _cell._col);
                                            if (!handler.isCellVisible(tempCell!)) continue;
                                            tempNumber = getOnlyNumberWithNaNToNull(tempCell!.value);
                                            if (tempNumber !== null && tempNumber < footerNumber!) {
                                                footerNumber = tempNumber;
                                            }
                                        }
                                    }
                                    break;
                                case '$$SUM':
                                    _cell.style.justifyContent = 'right';
                                    _cell.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        footerNumber = 0;
                                        for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = handler._getCell(_grid, r, _cell._col);
                                            if (!handler.isCellVisible(tempCell!)) continue;
                                            footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell!.value)) * 100000) / 100000;
                                        }
                                    }
                                    break;
                                case '$$AVG':
                                    _cell.style.justifyContent = 'right';
                                    _cell.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        footerNumber = 0;
                                        tempNumber = 0;
                                        let count = 0;
                                        for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = handler._getCell(_grid, r, _cell._col);
                                            if (!handler.isCellVisible(tempCell!)) continue;
                                            footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell!.value)) * 100000) / 100000;
                                            if (tempCell!.value !== null && tempCell!.value !== undefined && !isNaN(tempCell!.value)) {
                                                count++;
                                            }
                                        }
                                        if (count === 0) {
                                            footerNumber = null
                                        }
                                        else  {
                                            footerNumber = (footerNumber/count).toFixed(2);
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                            if (footerNumber === null || footerNumber === undefined) {
                                footerNumber = '-'
                            }
                            else {
                                footerNumber = handler.getFormatNumber(_grid.getColFormat(_cell._col)!, footerNumber)
                            }
                            _cell.innerText = footerNumber;
                            _cell.value = footerNumber;
                        }
                        else if (typeof _cell.footer === 'function') {
                            const functionResult = _cell.footer(_grid.getValues());
                            _cell.innerText = functionResult;
                            _cell.value = functionResult;
                        }
                        else {
                            _cell.innerText = _cell.footer;
                            _cell.value = _cell.footer;
    
                            const vgFooterFormula = handler._getFooterFormula()!;
                            if(vgFooterFormula && vgFooterFormula.constructor === Object) {
                                Object.keys(vgFooterFormula).forEach(key => {
                                    if(_cell.footer === key) {
                                        const result = vgFooterFormula[key](_grid.getColValues(_cell.index!));
                                        _cell.innerText = result;
                                        _cell.value = result;
                                    }
                                });
                            }
                        }
                    }
                    if (_cell.align) {
                        _cell.style.justifyContent = _cell.align;
                        _cell.style.textAlign = _cell.align;
                    }
                    if (_cell._col === _grid.getColCount()) {
                        _cell.classList.add(_cell._gridId + '_f-v-g-d-value');
                    }
                    if (!_cell.colVisible || !_cell.rowVisible) {
                        _cell.style.display = 'none';
                    }
                    _cell.classList.add(_cell._gridId + '_f-v-g-d');
                    break;
                case 'gbd': 
                    switch (_cell.dataType) {
                        case 'text':
                        case 'mask':
                            _cell.style.justifyContent = 'left';
                            _cell.style.textAlign = 'left';
                            break;
                        case 'number':
                            _cell.style.justifyContent = 'right';
                            _cell.style.textAlign = 'right';
                            break;
                        case 'date':
                        case 'month':
                        case 'code':
                        case 'select':
                        case 'checkbox':
                        case 'button':
                        case 'link':
                            _cell.style.justifyContent = 'center';
                            _cell.style.textAlign = 'center';
                            break;
                        default:
                            _cell.style.justifyContent = 'center';
                            _cell.style.textAlign = 'center';
    
                            const dataTypeStyle = handler._getDataTypeStyle(_grid);
                            Object.keys(dataTypeStyle).forEach((key) => {
                                if(_cell.dataType === key) {
                                    if(dataTypeStyle[key].constructor !== Object) throw new Error('Cellstyle can only be inserted in object type.');
                                    Object.keys(dataTypeStyle[key]).forEach((styleKey) => {
                                        (_cell as any).style[styleKey] = dataTypeStyle[key][styleKey];
                                    });
                                }
                            });
                            break;
                    }
                    while (_cell.firstChild) {
                        _cell.removeChild(_cell.firstChild);
                    }
                    _cell.append(handler._getCellChildNode(_cell)!);
                    
                    if (_cell._row <= _gridInfo.frozenRowCount!) {
                        let headerOffsetHeight = _grid.gridHeader.offsetHeight;
                        let topElement;
                        let topElementOffsetHeight = 0;
                        for(let r = _cell._row - 1; r > 0; r--) {
                            topElement = handler._getCell(_grid, r, _cell._col);
                            if (!topElement) {
                                topElementOffsetHeight = topElementOffsetHeight + 0;
                            }
                            else if (topElement.isColMerge) {
                                let c = _cell._col - 1;
                                let spanNode = handler._getCell(_grid, r, c)!;
                                while(spanNode) {
                                    if (c < 0) break;
                                    if (!spanNode.isColMerge) {
                                        break;
                                    }
                                    c--;
                                    spanNode = handler._getCell(_grid, r, c)!;
                                }
                                topElementOffsetHeight = topElementOffsetHeight + spanNode.offsetHeight;
                            }
                            else {
                                topElementOffsetHeight = topElementOffsetHeight + handler._getCell(_grid, r, _cell._col)!.offsetHeight;
                            }
                        }
                        _cell.style.position = 'sticky';
                        _cell.style.zIndex = '200';
                        _cell.style.top = headerOffsetHeight + topElementOffsetHeight + 'px';
                        if (_cell._row === _gridInfo.frozenRowCount) _cell.style.borderBottom = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                        _cell._frozenCol = true;
                    }
                    
                    if (_gridInfo.frozenRowCount! <= 0 && _cell._col <= _gridInfo.frozenColCount!) {
                        let leftElement;
                        let leftElementOffsetWidth = 0
    
                        for(let c = _cell._col - 1; c > 0; c--) {
                            leftElement = handler._getCell(_grid, _cell._row, c);
                            if (!leftElement) {
                                leftElementOffsetWidth = leftElementOffsetWidth + 0;
                            }
                            else if (leftElement.isRowMerge) {
                                let r = _cell._row - 1;
                                let spanNode = handler._getCell(_grid, r, c);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode.isRowMerge) {
                                        break;
                                    }
                                    r--;
                                    spanNode = handler._getCell(_grid, r, c);
                                }
                                leftElementOffsetWidth = leftElementOffsetWidth + spanNode!.offsetWidth;
                            }
                            else {
                                leftElementOffsetWidth = leftElementOffsetWidth + handler._getCell(_grid, _cell._row, c)!.offsetWidth;
                            }
                        }
                        _cell.style.position = 'sticky';
                        _cell.style.zIndex = '200';
                        if (_cell._col === _gridInfo.frozenColCount) _cell.style.borderRight = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                        _cell.style.left = leftElementOffsetWidth + 'px';
                        _cell._frozenRow = true;
                    }
                    
                    if (_cell.isRowMerge) {
                        let r = _cell._row - 1;
                        let spanNode = handler._getCell(_grid, r, _cell._col);
                        while(spanNode) {
                            if (r < 0) break;
                            if (!spanNode.isRowMerge) {
                                spanNode.style.gridRowEnd = _cell.style.gridRowEnd;
                                if (!spanNode.verticalAlign) spanNode.style.alignItems = 'center';
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                break;
                            }
                            r--;
                            spanNode = handler._getCell(_grid, r, _cell._col);
                        }
                        
                        if (handler.isCellVisible(spanNode!)) {
                            _cell.style.display = 'none';
                        }
                    }
                    
                    if (_cell.isColMerge) {
                        let c = _cell._col - 1;
                        let spanNode = handler._getCell(_grid, _cell._row, c);
                        while(spanNode) {
                            if (c < 0) break;
                            if (!spanNode.isColMerge) {
                                spanNode.style.gridColumnEnd = _cell.style.gridColumnEnd;
                                
                                if (!spanNode.align) spanNode.style.justifyContent = 'center';
                                if (!spanNode.align) spanNode.style.textAlign = 'center';
                                if (!spanNode.verticalAlign) spanNode.style.alignItems = 'center';
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                break;
                            }
                            c--;
                            spanNode = handler._getCell(_grid, _cell._row, c);
                        }
                        _cell.style.display = 'none';
                    }
                    
                    if (_cell.align) {
                        _cell.style.justifyContent = _cell.align;
                        _cell.style.textAlign = _cell.align;
                    }
    
                    if (_cell.verticalAlign) {
                        switch (_cell.verticalAlign.toLowerCase()) {
                            case 'top':
                                _cell.style.alignItems = 'flex-start';
                                break;
                            case 'bottom':
                                _cell.style.alignItems = 'flex-end';
                                break;
                            default:
                                _cell.style.alignItems = 'center';
                                break;
                        }
                    }
                    if (_cell.overflowWrap) _cell.style.overflowWrap = _cell.overflowWrap;
                    if (_cell.wordBreak) _cell.style.wordBreak = _cell.wordBreak;
                    if (_cell.whiteSpace) _cell.style.whiteSpace = _cell.whiteSpace;
                    if (_cell.backColor) _cell.style.backgroundColor = _cell.backColor;
                    if (_cell.fontColor) (_cell.firstChild as any).style._color = _cell.fontColor;
                    if (_cell.fontBold) (_cell.firstChild as any).fontWeight = 'bold';
                    if (_cell.fontItalic) (_cell.firstChild as any).fontStyle = 'italic';
                    if (_cell.fontThruline) (_cell.firstChild as any).textDecoration = 'line-through';
                    if (_cell.fontUnderline) (_cell.firstChild as any).textDecoration = 'underline';
                    if (!_cell.colVisible || !_cell.rowVisible) {
                        _cell.style.display = 'none';
                    }
                    if (_cell.filter) {
                        _cell.style.display = 'none';
                    }
                    if (_gridInfo.alterRow && _cell._row % 2 === 0) {
                        _cell.classList.add(_cell._gridId + '_b-v-g-d-alter');
                        _cell.classList.remove(_cell._gridId + '_b-v-g-d');
                    }
                    else {
                        _cell.classList.add(_cell._gridId + '_b-v-g-d');
                        _cell.classList.remove(_cell._gridId + '_b-v-g-d-alter');
                    }
                    if (_cell.locked && _cell.lockedColor) {
                        _cell.classList.add(_cell._gridId + '_b-v-g-d-locked');
                    }
                    else {
                        _cell.classList.remove(_cell._gridId + '_b-v-g-d-locked');
                    }
                    if(_cell.locked) {
                        if (_cell.dataType === 'select' && _cell.firstChild && (_cell.firstChild as any).nType == 'select') {
                            (_cell.firstChild as any).disabled = true;
                            (_cell.firstChild as any).style.pointerEvents = 'none';
                        }
                        else if (_cell.dataType === 'checkbox' && _cell.firstChild && (_cell.firstChild as any).nType == 'checkbox') {
                            (_cell.firstChild as any).disabled = true;
                            (_cell.firstChild as any).style.pointerEvents = 'none';
                        }
                    }
                    if (_cell.untarget) {
                        if (_cell.dataType === 'button' && _cell.firstChild && (_cell.firstChild as any).nType == 'button') {
                            (_cell.firstChild as any).disabled = true;
                            (_cell.firstChild as any).style.pointerEvents = 'none';
                        }
                        else if (_cell.dataType === 'link' && _cell.firstChild && (_cell.firstChild as any).nType == 'link') {
                            (_cell.firstChild as any).style.opacity = '0.8';
                            (_cell.firstChild as any).style.pointerEvents = 'none';
                        }
                    }
                    break;
                default:
                    break;
            }
            _cell.classList.add(_cell._gridId + '_v-g-d');
    
            _cell.addEventListener('mouseover', function (e) {
                if (!_cell.untarget && _cell._type === 'gbd') {
                    _cell.classList.add(_cell._gridId + '_mouseover-cell');
                    if (_cell.dataType === 'link') {
                        const childList = _cell.querySelectorAll('*');
                        childList.forEach(child => {
                            child.classList.add(_cell._gridId + '_mouseover-cell');
                        });
                    }
                }
            });
    
            _cell.addEventListener('mouseout', function (e) {
                if (!_cell.untarget && _cell._type === 'gbd') {
                    _cell.classList.remove(_cell._gridId + '_mouseover-cell');
                    if (_cell.dataType === 'link') {
                        const childList = _cell.querySelectorAll('*');
                        childList.forEach(child => {
                            child.classList.remove(_cell._gridId + '_mouseover-cell');
                        });
                    }
                }
            });
        }
    }
    if (!customElements.get('v-g-d')) customElements.define('v-g-d', vg._GridData);
}
