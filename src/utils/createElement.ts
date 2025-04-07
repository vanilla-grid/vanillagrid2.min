import { Cell } from "../types/cell";
import { footerUnit } from "../types/enum";
import { GridInfo } from "../types/gridInfo";
import type { Grid, Vanillagrid } from "../types/vanillagrid";
import { getFirstCellValidNumber, getFormatNumber, isCellVisible } from "./handleCell";
import { _doFilter, _getCell, _getDataTypeStyle, _getFilterSpan, _getFooterCell, _getFooterCells, _getFooterFormula, _getHeaderCell } from "./handleGrid";
import { extractNumberAndUnit, getCssTextFromObject, getOnlyNumberWithNaNToNull, getOnlyNumberWithNaNToZero, removeAllChild } from "./utils";

export const getGridCssStyle = (grid: Grid) => {
    const gId = grid._id;
    const csses: any = {};
    csses['.' + gId + '_vanillagrid'] = {
        'width': grid._gridCssInfo.width,
        'height': grid._gridCssInfo.height,
        'display': grid._gridInfo.visible ? 'block' : 'none',
        'border': '1px solid ' + grid._gridCssInfo.gridBorderColor,
        'overflow': 'auto',
        'background-color': '#fff',
        'margin': grid._gridCssInfo.margin,
        'padding': grid._gridCssInfo.padding,
        'font-family': grid._gridCssInfo.gridFontFamily,
    };
    csses['.' + gId + '_v-g'] = {
        'background-color': grid._gridCssInfo.bodyBackColor,
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
        'display': grid._gridInfo.headerVisible ? 'grid' : 'none',
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
        'background-color': grid._gridCssInfo.headerCellBackColor,
        'justify-content': 'center',
        'text-align': 'center',
        'align-items' : grid._gridCssInfo.verticalAlign,
        'border-bottom': grid._gridCssInfo.horizenBorderSize + 'px solid ' + grid._gridCssInfo.headerCellBorderColor,
        'border-right': grid._gridCssInfo.verticalBorderSize + 'px solid ' + grid._gridCssInfo.headerCellBorderColor,
        'color': grid._gridCssInfo.headerCellFontColor,
    };
    csses['.' + gId + '_h-v-g-d select'] = {
        'color': '#333',
    };
    csses['.' + gId + '_h-v-g-d option'] = {
        'color': '#333',
    };
    csses['.' + gId + '_b-v-g-d'] = {
        'align-items' : grid._gridCssInfo.verticalAlign,
        'background-color': grid._gridCssInfo.bodyCellBackColor,
        'border-bottom': grid._gridCssInfo.horizenBorderSize + 'px solid ' + grid._gridCssInfo.bodyCellBorderColor,
        'border-right': grid._gridCssInfo.verticalBorderSize + 'px solid ' + grid._gridCssInfo.bodyCellBorderColor,
        'color': grid._gridCssInfo.bodyCellFontColor,
    };
    csses['.' + gId + '_f-v-g-d'] = {
        'justify-content': 'center',
        'text-align': 'center',
        'align-items' : grid._gridCssInfo.verticalAlign,
        'background-color': grid._gridCssInfo.footerCellBackColor,
        'border-top': grid._gridCssInfo.horizenBorderSize + 'px solid ' + grid._gridCssInfo.footerCellBorderColor,
        'color': grid._gridCssInfo.footerCellFontColor,
    };
    csses['.' + gId + '_f-v-g-d-value'] = {
        'border-right': grid._gridCssInfo.verticalBorderSize + 'px solid ' + grid._gridCssInfo.bodyCellBorderColor,
    };
    csses['.' + gId + '_b-v-g-d-alter'] = {
        'align-items' : grid._gridCssInfo.verticalAlign,
        'background-color': grid._gridCssInfo.alterRowBackColor,
        'border-bottom': grid._gridCssInfo.horizenBorderSize + 'px solid ' + grid._gridCssInfo.bodyCellBorderColor,
        'border-right': grid._gridCssInfo.verticalBorderSize + 'px solid ' + grid._gridCssInfo.bodyCellBorderColor,
        'color': grid._gridCssInfo.alterRowFontColor,
    };
    csses['.' + gId + '_b-v-g-d-locked'] = {
        'background-color': grid._gridCssInfo.lockCellBackColor,
        'border-bottom': grid._gridCssInfo.horizenBorderSize + 'px solid ' + grid._gridCssInfo.bodyCellBorderColor,
        'border-right': grid._gridCssInfo.verticalBorderSize + 'px solid ' + grid._gridCssInfo.bodyCellBorderColor,
        'color': grid._gridCssInfo.lockCellFontColor,
    };
    csses['.' + gId + '_v-g-d'] = {
        'font-size': grid._gridCssInfo.cellFontSize,
        'display': 'flex',
        'min-height': grid._gridCssInfo.cellMinHeight,
        'overflow': 'hidden',
        'white-space': 'nowrap',
        'padding-left': '5px',
        'padding-right': '5px',
    };
    if (grid._gridCssInfo.overflowWrap) csses['.' + gId + '_v-g-d']['overflow-wrap'] = grid._gridCssInfo.overflowWrap;
    if (grid._gridCssInfo.wordBreak) csses['.' + gId + '_v-g-d']['word-break'] = grid._gridCssInfo.wordBreak;
    if (grid._gridCssInfo.whiteSpace) csses['.' + gId + '_v-g-d']['white-space'] = grid._gridCssInfo.whiteSpace;

    csses['.' + gId + '_editor'] = {
        'font-size': grid._gridCssInfo.cellFontSize,
        'background-color': grid._gridCssInfo.editorBackColor,
        'border': 'none',
        'color': grid._gridCssInfo.editorFontColor,
        'overflow' : 'hidden',
        'resize': 'none',
        'box-sizing': 'border-box',
        'font-family': grid._gridCssInfo.gridFontFamily,
        'text-align': 'inherit',
    };
    csses['.' + gId + '_editor:focus'] = {
        'outline': 'none',
    };
    csses['.' + gId + '_mouseover-cell'] = {
        'background-color': grid._gridCssInfo.mouseoverCellBackColor + ' !important',
        'color': grid._gridCssInfo.mouseoverCellFontColor + ' !important',
    };
    csses['.' + gId + '_selected-cell'] = {
        'background-color': grid._gridCssInfo.selectCellBackColor + ' !important',
        'color': grid._gridCssInfo.selectCellFontColor + ' !important',
    };
    csses['.' + gId + '_selected-col'] = {
        'background-color': grid._gridCssInfo.selectColBackColor,
        'color': grid._gridCssInfo.selectColFontColor,
    };
    csses['.' + gId + '_selected-row'] = {
        'background-color': grid._gridCssInfo.selectRowBackColor,
        'color': grid._gridCssInfo.selectRowFontColor,
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
        'font-size': grid._gridCssInfo.cellFontSize,
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
        'height': (extractNumberAndUnit(grid._gridCssInfo.cellMinHeight)!.number * 0.85) + 'px',
        'line-height': (extractNumberAndUnit(grid._gridCssInfo.cellMinHeight)!.number * 0.85) + 'px',
        'font-size': grid._gridCssInfo.cellFontSize,
        'cursor': 'pointer',
        'border': 'none',
        'color': grid._gridCssInfo.buttonFontColor,
        'background-color': grid._gridCssInfo.buttonBackColor,
        'box-shadow': '0.75px 0.75px 1px 0.25px ' + grid._gridCssInfo.buttonBorderColor,
    }
    csses['.' + gId + '_data-value-button:hover'] = {
        'color': grid._gridCssInfo.buttonHoverFontColor,
        'background-color': grid._gridCssInfo.buttonHoverBackColor,
    }
    csses['.' + gId + '_data-value-button:active'] = {
        'color': grid._gridCssInfo.buttonActiveFontColor,
        'background-color': grid._gridCssInfo.buttonActiveBackColor,
        'box-shadow': '0px 0px 0.5px 0.25px ' + grid._gridCssInfo.buttonBorderColor,
    }
    csses['.' + gId + '_data-value-button:focus'] = {
        'outline': 'none',
    }
    csses['.' + gId + '_data-value-button:disabled'] = {
        'opacity': '0.7',
    }
    csses['.' + gId + '_data-value-link'] = {
        'color': grid._gridCssInfo.linkFontColor,
        'text-decoration': grid._gridCssInfo.linkHasUnderLine ? 'underline' : 'none',
    }
    csses['.' + gId + '_data-value-link:visited'] = {
        'color': grid._gridCssInfo.linkVisitedFontColor,
    }
    csses['.' + gId + '_data-value-link:hover'] = {
        'color': grid._gridCssInfo.linkHoverFontColor + ' !important',
    }
    csses['.' + gId + '_data-value-link:active'] = {
        'color': grid._gridCssInfo.linkActiveFontColor + ' !important',
    }
    csses['.' + gId + '_data-value-link:focus'] = {
        'color': grid._gridCssInfo.linkFocusFontColor + ' !important',
    }
    return csses;
}

export const setGridCssStyle = (grid: Grid) => {
    const gId = grid._id;
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

export const injectCustomElement = (vg: Vanillagrid) => {
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
                const _grid = vg.grids[(this as any)._gridId];
                let totalWidth = 0;
                for(let col = 1; col < _grid.getColCount(); col++) {
                    totalWidth += extractNumberAndUnit(_grid.getColOriginWidth(col))!.number;
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
                const _grid = vg.grids[(this as any)._gridId];
                let totalWidth = 0;
                for(let col = 1; col < _grid.getColCount(); col++) {
                    totalWidth += extractNumberAndUnit(_grid.getColOriginWidth(col))!.number;
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
                const _grid = vg.grids[(this as any)._gridId];
                let totalWidth = 0;
                if(!_getFooterCells(_grid) || _getFooterCells(_grid).length <= 0) return;
                for(let col = 1; col < _grid.getColCount(); col++) {
                    totalWidth += extractNumberAndUnit(_grid.getColOriginWidth(col))!.number;
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
            const _grid = vg.grids[(this as any)._gridId];
            const _gridInfo: GridInfo = _grid.getGridInfo();
            
            this.style.removeProperty('display');
            this.style.removeProperty('align-items');
            this.style.removeProperty('justify-content');
            this.style.removeProperty('text-align');
            this.style.removeProperty('z-index');
    
            switch ((this as any)._type) {
                case 'ghd': 
                    this.innerText = (this as any)._value;
                    
                    if (_gridInfo.frozenRowCount! <= 0 && (this as any)._col <= _gridInfo.frozenColCount!) {
                        let leftElement;
                        let leftElementOffsetWidth = 0
    
                        for(let c = (this as any)._col - 1; c > 0; c--) {
                            leftElement = _getHeaderCell(_grid, (this as any)._row, c);
                            if (!leftElement) {
                                leftElementOffsetWidth = leftElementOffsetWidth + 0;
                            }
                            else if (leftElement._isRowMerge) {
                                let r = (this as any)._row - 1;
                                let spanNode = _getHeaderCell(_grid, r, c);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode._isRowMerge) {
                                        break;
                                    }
                                    r--;
                                    spanNode = _getHeaderCell(_grid, r, c);
                                }
                                leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                            }
                            else {
                                leftElementOffsetWidth = leftElementOffsetWidth + _getHeaderCell(_grid, (this as any)._row, c).offsetWidth;
                            }
                        }
                        this.style.position = 'sticky',
                        this.style.zIndex = String(300 + _grid.getColCount() - (this as any)._col),
                        this.style.left = leftElementOffsetWidth + 'px';
                        (this as any)._frozenCol = true;
                    }
                    
                    if ((this as any)._isRowMerge) {
                        let r = (this as any)._row - 1;
                        let spanNode = _getHeaderCell(_grid, r, (this as any)._col);
                        while(spanNode) {
                            if (r < 0) break;
                            if (!spanNode._isRowMerge) {
                                
                                spanNode.style.gridRowEnd = this.style.gridRowEnd;
                                spanNode._rowSpan = spanNode._rowSpan ? spanNode._rowSpan + 1 : 1;
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                break;
                            }
                            r--;
                            spanNode = _getHeaderCell(_grid, r, (this as any)._col);
                        }
                        this.style.display = 'none';
                    }
                    
                    if ((this as any)._isColMerge) {
                        let c = (this as any)._col - 1;
                        let spanNode = _getHeaderCell(_grid, (this as any)._row, c);
                        while(spanNode) {
                            if (c < 0) break;
                            if (!spanNode._isColMerge) {
                                if (spanNode._colInfo.id === 'v-g-rownum' || spanNode._colInfo.id === 'v-g-status') break;
                                spanNode.style.gridColumnEnd = this.style.gridColumnEnd;
                                spanNode.style.width = extractNumberAndUnit(spanNode.style.width)!.number + this.offsetWidth + 'px';
                                spanNode._colSpan = spanNode._colSpan ? spanNode._colSpan + 1 : 1;
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                break;
                            }
                            c--;
                            spanNode = _getHeaderCell(_grid, (this as any)._row, c);
                        }
                        this.style.display = 'none';
                    }
                    
                    if (!(this as any)._colInfo.colVisible || !(this as any)._colInfo.rowVisible) {
                        this.style.display = 'none';
                    }
                    
                    if (_grid.getHeaderRowCount() === (this as any)._row) {
                        let targetCell: any = this;
                        if ((this as any)._isRowMerge) {
                            for(let r = (this as any)._row - 1; r > 0; r--) {
                                targetCell = _getHeaderCell(_grid, r, (this as any)._col);
                                if (targetCell._rowSpan) break;
                            }
                        }
                        if (targetCell) targetCell._isLastCell = true;
                    }
                    
                    if (_gridInfo.filterable === true && _grid.getColInfo((this as any)._colInfo.id).filterable &&
                        _grid.getHeaderRowCount() === (this as any)._row && (this as any)._colInfo.id !== 'v-g-rownum' && (this as any)._colInfo.id !== 'v-g-status') {
                        let filterSpan: any;
                        const vgFilterSpan = _getFilterSpan(_grid);
                        if(vgFilterSpan && vgFilterSpan instanceof HTMLElement && vgFilterSpan.nodeType === 1) {
                            filterSpan = vgFilterSpan.cloneNode(true);
                        }
                        else {
                            filterSpan = document.createElement('span');
                            filterSpan.innerText = 'σ';
                        }
                        filterSpan._gridId = (this as any)._gridId;
                        filterSpan.isChild = true;
                        filterSpan._type = 'filter';
                        filterSpan.classList.add((this as any)._gridId + '_filterSpan'); 
    
                        const filterSelect: any = document.createElement('select');
                        filterSelect.classList.add((this as any)._gridId + '_filterSelect'); 
                        filterSelect.style.display = 'none';
                        filterSelect._gridId = (this as any)._gridId;
                        filterSelect._colInfo.id = (this as any)._colInfo.id;
    
                        filterSelect.addEventListener('mousedown', function (e: any) {
                            this.filterOldValue = e.target.value;
                        })
    
                        filterSelect.addEventListener('change', function (e: any) {
                            const filterNewValue = e.target.value;
                            if ((window as any)[e.target.parentNode.parentNode._gridId + '_onChooseFilter'](e.target.parentNode.parentNode._row, e.target.parentNode.parentNode._colInfo.id, this.filterOldValue, filterNewValue) === false) {
                                e.stopPropagation();
                                e.preventDefault();
                                return;
                            }
                            _doFilter(_grid);
                            if (filterNewValue === '$$ALL') {
                                this.style.display = 'none';
                            }
                        });
    
                        filterSpan.append(filterSelect);
    
                        let targetCell: any = this;
                        if ((this as any)._isRowMerge) {
                            for(let r = (this as any)._row - 1; r > 0; r--) {
                                targetCell = _getHeaderCell(_grid, r, (this as any)._col);
                                if (targetCell._rowSpan) break;
                            }
                        }
                        if (targetCell) targetCell.insertBefore(filterSpan, targetCell.firstChild);  
                    }
    
                    this.classList.add((this as any)._gridId + '_h-v-g-d');
                    break;
                case 'gfd': 
                    
                    if (_gridInfo.frozenRowCount! <= 0 && (this as any)._col <= _gridInfo.frozenColCount!) {
                        let leftElement;
                        let leftElementOffsetWidth = 0
    
                        for(let c = (this as any)._col - 1; c > 0; c--) {
                            leftElement = _getFooterCell(_grid, (this as any)._row, c);
                            if (!leftElement) {
                                leftElementOffsetWidth = leftElementOffsetWidth + 0;
                            }
                            else if (leftElement._isRowMerge) {
                                let r = (this as any)._row - 1;
                                let spanNode = _getFooterCell(_grid, r, c);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode._isRowMerge) {
                                        break;
                                    }
                                    r--;
                                    spanNode = _getFooterCell(_grid, r, c);
                                }
                                leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                            }
                            else {
                                leftElementOffsetWidth = leftElementOffsetWidth + _getFooterCell(_grid, (this as any)._row, c).offsetWidth;
                            }
                        }
                        this.style.position = '-webkit-sticky',
                        this.style.zIndex = '300',
                        this.style.left = leftElementOffsetWidth + 'px';
                        (this as any)._frozenCol = true;
                    }
                    
                    if ((this as any)._colInfo.footer) {
                        this.classList.add((this as any)._gridId + '_f-v-g-d-value');
                        let preSibling;
                        try {
                            preSibling = _getFooterCell(_grid, (this as any)._row, (this as any)._col - 1);
                        } catch (error) {
                            preSibling = null;
                        }
                        if (preSibling) {
                            preSibling.classList.add((this as any)._gridId + '_f-v-g-d-value');
                        }
                        if (Object.values(footerUnit).includes((this as any)._colInfo.footer)) {
                            let footerNumber;
                            let tempNumber;
                            let tempCell;
                            switch ((this as any)._colInfo.footer) {
                                case '$$MAX':
                                    this.style.justifyContent = 'right';
                                    this.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        tempNumber = getFirstCellValidNumber((this as any));
                                        footerNumber = tempNumber;
                                        for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = _getCell(_grid, r, (this as any)._col);
                                            if (!isCellVisible(tempCell!)) continue;
                                            tempNumber = getOnlyNumberWithNaNToNull(tempCell!._value);
                                            if (tempNumber !== null && tempNumber > footerNumber!) {
                                                footerNumber = tempNumber;
                                            }
                                        }
                                    }
                                    break;
                                case '$$MIN':
                                    this.style.justifyContent = 'right';
                                    this.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        tempNumber = getFirstCellValidNumber((this as any));
                                        footerNumber = tempNumber;
                                        for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = _getCell(_grid, r, (this as any)._col);
                                            if (!isCellVisible(tempCell!)) continue;
                                            tempNumber = getOnlyNumberWithNaNToNull(tempCell!._value);
                                            if (tempNumber !== null && tempNumber < footerNumber!) {
                                                footerNumber = tempNumber;
                                            }
                                        }
                                    }
                                    break;
                                case '$$SUM':
                                    this.style.justifyContent = 'right';
                                    this.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        footerNumber = 0;
                                        for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = _getCell(_grid, r, (this as any)._col);
                                            if (!isCellVisible(tempCell!)) continue;
                                            footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell!._value)) * 100000) / 100000;
                                        }
                                    }
                                    break;
                                case '$$AVG':
                                    this.style.justifyContent = 'right';
                                    this.style.textAlign = 'right';
                                    if (_grid.getRowCount() > 0) {
                                        footerNumber = 0;
                                        tempNumber = 0;
                                        let count = 0;
                                        for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                            tempCell = _getCell(_grid, r, (this as any)._col);
                                            if (!isCellVisible(tempCell!)) continue;
                                            footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell!._value)) * 100000) / 100000;
                                            if (tempCell!._value !== null && tempCell!._value !== undefined && !isNaN(tempCell!._value)) {
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
                                footerNumber = getFormatNumber(_grid.getColFormat((this as any)._col)!, footerNumber)
                            }
                            (this as any).innerText = footerNumber;
                            (this as any)._value = footerNumber;
                        }
                        else if (typeof (this as any)._colInfo.footer === 'function') {
                            const functionResult = (this as any)._colInfo.footer(_grid.getValues());
                            this.innerText = functionResult;
                            (this as any)._value = functionResult;
                        }
                        else {
                            this.innerText = (this as any)._colInfo.footer;
                            (this as any)._value = (this as any)._colInfo.footer;
    
                            const vgFooterFormula = _getFooterFormula(_grid);
                            if(vgFooterFormula.constructor === Object) {
                                Object.keys(vgFooterFormula).forEach(key => {
                                    if((this as any)._colInfo.footer === key) {
                                        const result = vgFooterFormula[key](_grid.getColValues((this as any)._colInfo.index));
                                        this.innerText = result;
                                        (this as any)._value = result;
                                    }
                                });
                            }
                        }
                    }
                    if ((this as any).cAlign) {
                        this.style.justifyContent = (this as any).cAlign;
                        this.style.textAlign = (this as any).cAlign;
                    }
                    if ((this as any)._col === _grid.getColCount()) {
                        this.classList.add((this as any)._gridId + '_f-v-g-d-value');
                    }
                    if (!(this as any)._colInfo.colVisible || !(this as any)._colInfo.rowVisible) {
                        this.style.display = 'none';
                    }
                    this.classList.add((this as any)._gridId + '_f-v-g-d');
                    break;
                case 'gbd': 
                    
                    switch ((this as any)._colInfo.dataType) {
                        case 'text':
                        case 'mask':
                            this.style.justifyContent = 'left';
                            this.style.textAlign = 'left';
                            break;
                        case 'number':
                            this.style.justifyContent = 'right';
                            this.style.textAlign = 'right';
                            break;
                        case 'date':
                        case 'month':
                        case 'code':
                        case 'select':
                        case 'checkbox':
                        case 'button':
                        case 'link':
                            this.style.justifyContent = 'center';
                            this.style.textAlign = 'center';
                            break;
                        default:
                            this.style.justifyContent = 'center';
                            this.style.textAlign = 'center';
    
                            const dataTypeStyle = _getDataTypeStyle(_grid);
                            Object.keys(dataTypeStyle).forEach((key) => {
                                if((this as any)._colInfo.dataType === key) {
                                    if(dataTypeStyle[key].constructor !== Object) throw new Error('Cellstyle can only be inserted in object type.');
                                    Object.keys(dataTypeStyle[key]).forEach((styleKey) => {
                                        (this as any).style[styleKey] = dataTypeStyle[key][styleKey];
                                    });
                                }
                            });
                            break;
                    }
                    while (this.firstChild) {
                        this.removeChild(this.firstChild);
                    }
                    this.append(_grid._getCellChildNode(this));
                    
                    if ((this as any)._row <= _gridInfo.frozenRowCount) {
                        let headerOffsetHeight = _grid._getHeader().offsetHeight;
                        let topElement;
                        let topElementOffsetHeight = 0;
                        for(let r = (this as any)._row - 1; r > 0; r--) {
                            topElement = _grid._getCell(r, (this as any)._col);
                            if (!topElement) {
                                topElementOffsetHeight = topElementOffsetHeight + 0;
                            }
                            else if (topElement._isColMerge) {
                                let c = (this as any)._col - 1;
                                let spanNode = _grid._getCell(r, c);
                                while(spanNode) {
                                    if (c < 0) break;
                                    if (!spanNode._isColMerge) {
                                        break;
                                    }
                                    c--;
                                    spanNode = _grid._getCell(r, c);
                                }
                                topElementOffsetHeight = topElementOffsetHeight + spanNode.offsetHeight;
                            }
                            else {
                                topElementOffsetHeight = topElementOffsetHeight + _grid._getCell(r, (this as any)._col).offsetHeight;
                            }
                        }
                        this.style.position = 'sticky';
                        this.style.zIndex = '200';
                        this.style.top = headerOffsetHeight + topElementOffsetHeight + 'px';
                        if ((this as any)._row === _gridInfo.frozenRowCount) this.style.borderBottom = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                        (this as any)._frozenCol = true;
                    }
                    
                    if (_gridInfo.frozenRowCount! <= 0 && (this as any)._col <= _gridInfo.frozenColCount!) {
                        let leftElement;
                        let leftElementOffsetWidth = 0
    
                        for(let c = (this as any)._col - 1; c > 0; c--) {
                            leftElement = _grid._getCell((this as any)._row, c);
                            if (!leftElement) {
                                leftElementOffsetWidth = leftElementOffsetWidth + 0;
                            }
                            else if (leftElement._isRowMerge) {
                                let r = (this as any)._row - 1;
                                let spanNode = _grid._getCell(r, c);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode._isRowMerge) {
                                        break;
                                    }
                                    r--;
                                    spanNode = _grid._getCell(r, c);
                                }
                                leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                            }
                            else {
                                leftElementOffsetWidth = leftElementOffsetWidth + _grid._getCell((this as any)._row, c).offsetWidth;
                            }
                        }
                        this.style.position = 'sticky';
                        this.style.zIndex = '200';
                        if ((this as any)._col === _gridInfo.frozenColCount) this.style.borderRight = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                        this.style.left = leftElementOffsetWidth + 'px';
                        (this as any)._frozenRow = true;
                    }
                    
                    if ((this as any)._isRowMerge) {
                        let r = (this as any)._row - 1;
                        let spanNode = _grid._getCell(r, (this as any)._col);
                        while(spanNode) {
                            if (r < 0) break;
                            if (!spanNode._isRowMerge) {
                                spanNode.style.gridRowEnd = this.style.gridRowEnd;
                                if (!spanNode.cVerticalAlign) spanNode.style.alignItems = 'center';
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                break;
                            }
                            r--;
                            spanNode = _grid._getCell(r, (this as any)._col);
                        }
                        
                        if (isCellVisible(spanNode)) {
                            this.style.display = 'none';
                        }
                    }
                    
                    if ((this as any)._isColMerge) {
                        let c = (this as any)._col - 1;
                        let spanNode = _grid._getCell((this as any)._row, c);
                        while(spanNode) {
                            if (c < 0) break;
                            if (!spanNode._isColMerge) {
                                spanNode.style.gridColumnEnd = this.style.gridColumnEnd;
                                
                                if (!spanNode.cAlign) spanNode.style.justifyContent = 'center';
                                if (!spanNode.cAlign) spanNode.style.textAlign = 'center';
                                if (!spanNode.cVerticalAlign) spanNode.style.alignItems = 'center';
                                spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                break;
                            }
                            c--;
                            spanNode = _grid._getCell((this as any)._row, c);
                        }
                        this.style.display = 'none';
                    }
                    
                    if ((this as any).cAlign) {
                        this.style.justifyContent = (this as any).cAlign;
                        this.style.textAlign = (this as any).cAlign;
                    }
    
                    if ((this as any).cVerticalAlign) {
                        switch ((this as any).cVerticalAlign.toLowerCase()) {
                            case 'top':
                                this.style.alignItems = 'flex-start';
                                break;
                            case 'bottom':
                                this.style.alignItems = 'flex-end';
                                break;
                            default:
                                this.style.alignItems = 'center';
                                break;
                        }
                    }
                    if ((this as any).cOverflowWrap) this.style.overflowWrap = (this as any).cOverflowWrap;
                    if ((this as any).cWordBreak) this.style.wordBreak = (this as any).cWordBreak;
                    if ((this as any).cWhiteSpace) this.style.whiteSpace = (this as any).cWhiteSpace;
                    if ((this as any).cBackColor) this.style.backgroundColor = (this as any).cBackColor;
                    if ((this as any).cFontColor) (this as any).firstChild.style._color = (this as any).cFontColor;
                    if ((this as any).cFontBold) (this as any).firstChild.style.fontWeight = 'bold';
                    if ((this as any).cFontItalic) (this as any).firstChild.style.fontStyle = 'italic';
                    if ((this as any).cFontThruline) (this as any).firstChild.style.textDecoration = 'line-through';
                    if ((this as any).cFontUnderline) (this as any).firstChild.style.textDecoration = 'underline';
                    if (!(this as any)._colInfo.colVisible || !(this as any)._colInfo.rowVisible) {
                        this.style.display = 'none';
                    }
                    if ((this as any)._colInfo.filter) {
                        this.style.display = 'none';
                    }
                    
                    if (_gridInfo.alterRow && (this as any)._row % 2 === 0) {
                        this.classList.add((this as any)._gridId + '_b-v-g-d-alter');
                        this.classList.remove((this as any)._gridId + '_b-v-g-d');
                    }
                    else {
                        this.classList.add((this as any)._gridId + '_b-v-g-d');
                        this.classList.remove((this as any)._gridId + '_b-v-g-d-alter');
                    }
                    if ((this as any).cLocked && (this as any).cLockedColor) {
                        this.classList.add((this as any)._gridId + '_b-v-g-d-locked');
                    }
                    else {
                        this.classList.remove((this as any)._gridId + '_b-v-g-d-locked');
                    }
                    if((this as any).cLocked) {
                        if ((this as any)._colInfo.dataType === 'select' && this.firstChild && (this as any).firstChild.nType == 'select') {
                            (this as any).firstChild.disabled = true;
                            (this as any).firstChild.style.pointerEvents = 'none';
                        }
                        else if ((this as any)._colInfo.dataType === 'checkbox' && this.firstChild && (this as any).firstChild.nType == 'checkbox') {
                            (this as any).firstChild.disabled = true;
                            (this as any).firstChild.style.pointerEvents = 'none';
                        }
                    }
                    if ((this as any).cUntarget) {
                        if ((this as any)._colInfo.dataType === 'button' && this.firstChild && (this as any).firstChild.nType == 'button') {
                            (this as any).firstChild.disabled = true;
                            (this as any).firstChild.style.pointerEvents = 'none';
                        }
                        else if ((this as any)._colInfo.dataType === 'link' && this.firstChild && (this as any).firstChild.nType == 'link') {
                            (this as any).firstChild.style.opacity = '0.8';
                            (this as any).firstChild.style.pointerEvents = 'none';
                        }
                    }
                    break;
                default:
                    break;
            }
            this.classList.add((this as any)._gridId + '_v-g-d');
    
            this.addEventListener('mouseover', function (e) {
                if (!(this as any).cUntarget && (this as any)._type === 'gbd') {
                    this.classList.add((this as any)._gridId + '_mouseover-cell');
                    if ((this as any)._colInfo.dataType === 'link') {
                        const childList = this.querySelectorAll('*');
                        childList.forEach(child => {
                            child.classList.add((this as any)._gridId + '_mouseover-cell');
                        });
                    }
                }
            });
    
            this.addEventListener('mouseout', function (e) {
                if (!(this as any).cUntarget && (this as any)._type === 'gbd') {
                    this.classList.remove((this as any)._gridId + '_mouseover-cell');
                    if ((this as any)._colInfo.dataType === 'link') {
                        const childList = this.querySelectorAll('*');
                        childList.forEach(child => {
                            child.classList.remove((this as any)._gridId + '_mouseover-cell');
                        });
                    }
                }
            });
        }
    }
    if (!customElements.get('v-g-d')) customElements.define('v-g-d', vg._GridData); 
}
