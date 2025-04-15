import type { Grid } from "../types/grid";
import type { Cell } from "../types/cell";
import type { Handler } from "../types/handler";
import { footerUnit } from "../types/enum";
import { extractNumberAndUnit, getOnlyNumberWithNaNToNull, getOnlyNumberWithNaNToZero } from "./utils";

export const setElementConnected = (gridList: Record<string, Grid>, handler: Handler) => {
    handler.connectedGridHeader = (gridId: string) => {
        const grid = gridList[gridId];
        if(!grid) return;
        const header = gridList[gridId].elements.gridHeader;
        if (!header.style.gridTemplateColumns.includes('%')) {
            let totalWidth = 0;
            for(let col = 1; col < grid.methods.getColCount(); col++) {
                totalWidth += extractNumberAndUnit(grid.methods.getColOriginWidth(col))!.number;
            }
            header.style.width = totalWidth + 'px';
        }
    }
    handler.connectedGridBody = (gridId: string) => {
        const grid = gridList[gridId];
        if(!grid) return;
        const body = gridList[gridId].elements.gridBody;
        if (!body.style.gridTemplateColumns.includes('%')) {
            let totalWidth = 0;
            for(let col = 1; col < grid.methods.getColCount(); col++) {
                totalWidth += extractNumberAndUnit(grid.methods.getColOriginWidth(col))!.number;
            }
            body.style.width = totalWidth + 'px';
        }
    }
    handler.connectedGridFooter = (gridId: string) => {
        const grid = gridList[gridId];
        if(!grid) return;
        const footer = gridList[gridId].elements.gridFooter;
        if (!footer.style.gridTemplateColumns.includes('%')) {
            let totalWidth = 0;
            if(!handler._getFooterCells(gridId) || handler._getFooterCells(gridId).length <= 0) return;
            for(let col = 1; col < grid.methods.getColCount(); col++) {
                totalWidth += extractNumberAndUnit(grid.methods.getColOriginWidth(col))!.number;
            }
            footer.style.width = totalWidth + 'px';
        }
    }
    handler.connectedGridData = (cell: Cell) => {
        const gridId = cell._gridId;
        const grid = gridList[gridId];
        const gridInfo = grid.methods.getGridInfo();
        
        cell.style.removeProperty('display');
        cell.style.removeProperty('align-items');
        cell.style.removeProperty('justify-content');
        cell.style.removeProperty('text-align');
        cell.style.removeProperty('z-index');

        switch (cell._type) {
            case 'ghd': 
                cell.innerText = cell.value;
                
                if (gridInfo.frozenRowCount! <= 0 && cell.colIndex <= gridInfo.frozenColCount!) {
                    let leftElement;
                    let leftElementOffsetWidth = 0

                    for(let c = cell.colIndex - 1; c > 0; c--) {
                        leftElement = handler._getHeaderCell(gridId, cell.rowIndex, c);
                        if (!leftElement) {
                            leftElementOffsetWidth = leftElementOffsetWidth + 0;
                        }
                        else if (leftElement.isRowMerge) {
                            let r = cell.rowIndex - 1;
                            let spanNode = handler._getHeaderCell(gridId, r, c);
                            while(spanNode) {
                                if (r < 0) break;
                                if (!spanNode.isRowMerge) {
                                    break;
                                }
                                r--;
                                spanNode = handler._getHeaderCell(gridId, r, c);
                            }
                            leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                        }
                        else {
                            leftElementOffsetWidth = leftElementOffsetWidth + handler._getHeaderCell(gridId, cell.rowIndex, c).offsetWidth;
                        }
                    }
                    cell.style.position = 'sticky',
                    cell.style.zIndex = String(300 + grid.methods.getColCount() - cell.colIndex),
                    cell.style.left = leftElementOffsetWidth + 'px';
                    cell._frozenCol = true;
                }
                
                if (cell.isRowMerge) {
                    let r = cell.rowIndex - 1;
                    let spanNode = handler._getHeaderCell(gridId, r, cell.colIndex);
                    while(spanNode) {
                        if (r < 0) break;
                        if (!spanNode.isRowMerge) {
                            
                            spanNode.style.gridRowEnd = cell.style.gridRowEnd;
                            spanNode.rowSpan = spanNode.rowSpan ? spanNode.rowSpan + 1 : 1;
                            spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                            break;
                        }
                        r--;
                        spanNode = handler._getHeaderCell(gridId, r, cell.colIndex);
                    }
                    cell.style.display = 'none';
                }
                
                if (cell.isColMerge) {
                    let c = cell.colIndex - 1;
                    let spanNode = handler._getHeaderCell(gridId, cell.rowIndex, c);
                    while(spanNode) {
                        if (c < 0) break;
                        if (!spanNode.isColMerge) {
                            if (spanNode.colId === 'v-g-rownum' || spanNode.colId === 'v-g-status') break;
                            spanNode.style.gridColumnEnd = cell.style.gridColumnEnd;
                            spanNode.colSpan = spanNode.colSpan ? spanNode.colSpan + 1 : 1;
                            spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                            break;
                        }
                        c--;
                        spanNode = handler._getHeaderCell(gridId, cell.rowIndex, c);
                    }
                    cell.style.display = 'none';
                }
                
                if (!cell.colVisible || !cell.rowVisible) {
                    cell.style.display = 'none';
                }
                
                if (grid.methods.getHeaderRowCount() === cell.rowIndex) {
                    let targetCell: Cell = cell;
                    if (cell.isRowMerge) {
                        for(let r = cell.rowIndex - 1; r > 0; r--) {
                            targetCell = handler._getHeaderCell(gridId, r, cell.colIndex);
                            if (targetCell.rowSpan) break;
                        }
                    }
                    if (targetCell) targetCell._isLastCell = true;
                }
                if (gridInfo.filterable === true && grid.methods.getColInfo(cell.colId).filterable &&
                    grid.methods.getHeaderRowCount() === cell.rowIndex && cell.colId !== 'v-g-rownum' && cell.colId !== 'v-g-status') {
                    let filterSpan: any;
                    const vgFilterSpan = handler._getFilterSpan();
                    if(vgFilterSpan && vgFilterSpan instanceof HTMLElement && vgFilterSpan.nodeType === 1) {
                        filterSpan = vgFilterSpan.cloneNode(true);
                    }
                    else {
                        filterSpan = document.createElement('span');
                        filterSpan.innerText = 'σ';
                    }
                    filterSpan._gridId = cell._gridId;
                    filterSpan.isChild = true;
                    filterSpan._type = 'filter';
                    filterSpan.classList.add(cell._gridId + '_filterSpan'); 

                    const filterSelect: any = document.createElement('select');
                    filterSelect.classList.add(cell._gridId + '_filterSelect'); 
                    filterSelect.style.display = 'none';
                    filterSelect._gridId = cell._gridId;
                    filterSelect.colId = cell.colId;

                    filterSelect.addEventListener('mousedown', function (e: any) {
                        e.target.filterOldValue = e.target.value;
                    })

                    filterSelect.addEventListener('change', function (e: any) {
                        const filterNewValue = e.target.value;
                        const gridId = e.target._gridId;
                        if(gridList[gridId].events.onChooseFilter(e.target.parentNode.parentNode.row, e.target.parentNode.parentNode.colId, e.target.filterOldValue, filterNewValue) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        handler._doFilter(gridId);
                        if (filterNewValue === '$$ALL') {
                            e.target.style.display = 'none';
                        }
                    });

                    filterSpan.append(filterSelect);

                    let targetCell: Cell = cell;
                    if (cell.isRowMerge) {
                        for(let r = cell.rowIndex - 1; r > 0; r--) {
                            targetCell = handler._getHeaderCell(gridId, r, cell.colIndex);
                            if (targetCell.rowSpan) break;
                        }
                    }
                    if (targetCell) {
                        targetCell.insertBefore(filterSpan, targetCell.firstChild);
                        targetCell._filterSelector = filterSelect;
                    }
                }

                cell.classList.add(cell._gridId + '_h-v-g-d');
                break;
            case 'gfd':     
                if (gridInfo.frozenRowCount! <= 0 && cell.colIndex <= gridInfo.frozenColCount!) {
                    let leftElement;
                    let leftElementOffsetWidth = 0

                    for(let c = cell.colIndex - 1; c > 0; c--) {
                        leftElement = handler._getFooterCell(gridId, cell.rowIndex, c);
                        if (!leftElement) {
                            leftElementOffsetWidth = leftElementOffsetWidth + 0;
                        }
                        else if (leftElement.isRowMerge) {
                            let r = cell.rowIndex - 1;
                            let spanNode = handler._getFooterCell(gridId, r, c);
                            while(spanNode) {
                                if (r < 0) break;
                                if (!spanNode.isRowMerge) {
                                    break;
                                }
                                r--;
                                spanNode = handler._getFooterCell(gridId, r, c);
                            }
                            leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                        }
                        else {
                            leftElementOffsetWidth = leftElementOffsetWidth + handler._getFooterCell(gridId, cell.rowIndex, c).offsetWidth;
                        }
                    }
                    cell.style.position = '-webkit-sticky',
                    cell.style.zIndex = '300',
                    cell.style.left = leftElementOffsetWidth + 'px';
                    cell._frozenCol = true;
                }

                let footerArr = grid.data.colInfos[cell.colIndex - 1].footer;
                if(!Array.isArray(footerArr)) footerArr = null;
                const footer = footerArr && footerArr.length >= cell.rowIndex - 1 ? footerArr[cell.rowIndex - 1] : null;
                if (footer) {
                    cell.classList.add(cell._gridId + '_f-v-g-d-value');
                    let preSibling;
                    try {
                        preSibling = handler._getFooterCell(gridId, cell.rowIndex, cell.colIndex - 1);
                    } catch (error) {
                        preSibling = null;
                    }
                    if (preSibling) {
                        preSibling.classList.add(cell._gridId + '_f-v-g-d-value');
                    }
                    if (Object.values(footerUnit).includes(footer)) {
                        let footerNumber;
                        let tempNumber;
                        let tempCell;
                        switch (footer) {
                            case '$$MAX':
                                cell.style.justifyContent = 'right';
                                cell.style.textAlign = 'right';
                                if (grid.methods.getRowCount() > 0) {
                                    tempNumber = handler.getFirstCellValidNumber(cell);
                                    footerNumber = tempNumber;
                                    for(let r = 2; r <= grid.methods.getRowCount(); r++ ) {
                                        tempCell = handler._getCell(gridId, r, cell.colIndex);
                                        if (!handler.isCellVisible(tempCell!)) continue;
                                        tempNumber = getOnlyNumberWithNaNToNull(tempCell!.value);
                                        if (tempNumber !== null && tempNumber > footerNumber!) {
                                            footerNumber = tempNumber;
                                        }
                                    }
                                }
                                break;
                            case '$$MIN':
                                cell.style.justifyContent = 'right';
                                cell.style.textAlign = 'right';
                                if (grid.methods.getRowCount() > 0) {
                                    tempNumber = handler.getFirstCellValidNumber(cell);
                                    footerNumber = tempNumber;
                                    for(let r = 2; r <= grid.methods.getRowCount(); r++ ) {
                                        tempCell = handler._getCell(gridId, r, cell.colIndex);
                                        if (!handler.isCellVisible(tempCell!)) continue;
                                        tempNumber = getOnlyNumberWithNaNToNull(tempCell!.value);
                                        if (tempNumber !== null && tempNumber < footerNumber!) {
                                            footerNumber = tempNumber;
                                        }
                                    }
                                }
                                break;
                            case '$$SUM':
                                cell.style.justifyContent = 'right';
                                cell.style.textAlign = 'right';
                                if (grid.methods.getRowCount() > 0) {
                                    footerNumber = 0;
                                    for(let r = 1; r <= grid.methods.getRowCount(); r++ ) {
                                        tempCell = handler._getCell(gridId, r, cell.colIndex);
                                        if (!handler.isCellVisible(tempCell!)) continue;
                                        footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell!.value)) * 100000) / 100000;
                                    }
                                }
                                break;
                            case '$$AVG':
                                cell.style.justifyContent = 'right';
                                cell.style.textAlign = 'right';
                                if (grid.methods.getRowCount() > 0) {
                                    footerNumber = 0;
                                    tempNumber = 0;
                                    let count = 0;
                                    for(let r = 1; r <= grid.methods.getRowCount(); r++ ) {
                                        tempCell = handler._getCell(gridId, r, cell.colIndex);
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
                            footerNumber = handler.getFormatNumber(grid.methods.getColFormat(cell.colIndex)!, footerNumber)
                        }
                        cell.innerText = footerNumber;
                        cell.value = footerNumber;
                    }
                    else if (typeof footer === 'function') {
                        const functionResult = footer(grid.methods.getValues());
                        cell.innerText = functionResult;
                        cell.value = functionResult;
                    }
                    else {
                        cell.innerText = footer;
                        cell.value = footer;

                        const vgFooterFormula = handler._getFooterFormula()!;
                        if(vgFooterFormula && vgFooterFormula.constructor === Object) {
                            Object.keys(vgFooterFormula).forEach(key => {
                                if(footer === key) {
                                    const result = vgFooterFormula[key](grid.methods.getColValues(cell.colIndex!));
                                    cell.innerText = result;
                                    cell.value = result;
                                }
                            });
                        }
                    }
                }
                if (cell.align) {
                    cell.style.justifyContent = cell.align;
                    cell.style.textAlign = cell.align;
                }
                if (cell.colIndex === grid.methods.getColCount()) {
                    cell.classList.add(cell._gridId + '_f-v-g-d-value');
                }
                if (!cell.colVisible || !cell.rowVisible) {
                    cell.style.display = 'none';
                }
                cell.classList.add(cell._gridId + '_f-v-g-d');
                break;
            case 'gbd': 
                switch (cell.dataType) {
                    case 'text':
                    case 'mask':
                        cell.style.justifyContent = 'left';
                        cell.style.textAlign = 'left';
                        break;
                    case 'number':
                        cell.style.justifyContent = 'right';
                        cell.style.textAlign = 'right';
                        break;
                    case 'date':
                    case 'month':
                    case 'code':
                    case 'select':
                    case 'checkbox':
                    case 'button':
                    case 'link':
                        cell.style.justifyContent = 'center';
                        cell.style.textAlign = 'center';
                        break;
                    default:
                        cell.style.justifyContent = 'center';
                        cell.style.textAlign = 'center';

                        const dataTypeStyle = handler._getDataTypeStyle();
                        Object.keys(dataTypeStyle).forEach((key) => {
                            if(cell.dataType === key) {
                                if(dataTypeStyle[key].constructor !== Object) throw new Error('Cellstyle can only be inserted in object type.');
                                Object.keys(dataTypeStyle[key]).forEach((styleKey) => {
                                    (cell as any).style[styleKey] = dataTypeStyle[key][styleKey];
                                });
                            }
                        });
                        break;
                }
                while (cell.firstChild) {
                    cell.removeChild(cell.firstChild);
                }
                cell.append(handler._getCellChildNode(cell)!);
                
                if (cell.rowIndex <= gridInfo.frozenRowCount!) {
                    let headerOffsetHeight = grid.elements.gridHeader.offsetHeight;
                    let topElement;
                    let topElementOffsetHeight = 0;
                    for(let r = cell.rowIndex - 1; r > 0; r--) {
                        topElement = handler._getCell(gridId, r, cell.colIndex);
                        if (!topElement) {
                            topElementOffsetHeight = topElementOffsetHeight + 0;
                        }
                        else if (topElement.isColMerge) {
                            let c = cell.colIndex - 1;
                            let spanNode = handler._getCell(gridId, r, c)!;
                            while(spanNode) {
                                if (c < 0) break;
                                if (!spanNode.isColMerge) {
                                    break;
                                }
                                c--;
                                spanNode = handler._getCell(gridId, r, c)!;
                            }
                            topElementOffsetHeight = topElementOffsetHeight + spanNode.offsetHeight;
                        }
                        else {
                            topElementOffsetHeight = topElementOffsetHeight + handler._getCell(gridId, r, cell.colIndex)!.offsetHeight;
                        }
                    }
                    cell.style.position = 'sticky';
                    cell.style.zIndex = '200';
                    cell.style.top = headerOffsetHeight + topElementOffsetHeight + 'px';
                    if (cell.rowIndex === gridInfo.frozenRowCount) cell.style.borderBottom = gridInfo.cssInfo.verticalBorderSize + 'px solid ' + gridInfo.cssInfo.headerCellBorderColor;
                    cell._frozenCol = true;
                }
                
                if (gridInfo.frozenRowCount! <= 0 && cell.colIndex <= gridInfo.frozenColCount!) {
                    let leftElement;
                    let leftElementOffsetWidth = 0

                    for(let c = cell.colIndex - 1; c > 0; c--) {
                        leftElement = handler._getCell(gridId, cell.rowIndex, c);
                        if (!leftElement) {
                            leftElementOffsetWidth = leftElementOffsetWidth + 0;
                        }
                        else if (leftElement.isRowMerge) {
                            let r = cell.rowIndex - 1;
                            let spanNode = handler._getCell(gridId, r, c);
                            while(spanNode) {
                                if (r < 0) break;
                                if (!spanNode.isRowMerge) {
                                    break;
                                }
                                r--;
                                spanNode = handler._getCell(gridId, r, c);
                            }
                            leftElementOffsetWidth = leftElementOffsetWidth + spanNode!.offsetWidth;
                        }
                        else {
                            leftElementOffsetWidth = leftElementOffsetWidth + handler._getCell(gridId, cell.rowIndex, c)!.offsetWidth;
                        }
                    }
                    cell.style.position = 'sticky';
                    cell.style.zIndex = '200';
                    if (cell.colIndex === gridInfo.frozenColCount) cell.style.borderRight = gridInfo.cssInfo.verticalBorderSize + 'px solid ' + gridInfo.cssInfo.headerCellBorderColor;
                    cell.style.left = leftElementOffsetWidth + 'px';
                    cell._frozenRow = true;
                }
                
                if (cell.isRowMerge) {
                    let r = cell.rowIndex - 1;
                    let spanNode = handler._getCell(gridId, r, cell.colIndex);
                    while(spanNode) {
                        if (r < 0) break;
                        if (!spanNode.isRowMerge) {
                            spanNode.style.gridRowEnd = cell.style.gridRowEnd;
                            if (!spanNode.verticalAlign) spanNode.style.alignItems = 'center';
                            spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                            break;
                        }
                        r--;
                        spanNode = handler._getCell(gridId, r, cell.colIndex);
                    }
                    
                    if (handler.isCellVisible(spanNode!)) {
                        cell.style.display = 'none';
                    }
                }
                
                if (cell.isColMerge) {
                    let c = cell.colIndex - 1;
                    let spanNode = handler._getCell(gridId, cell.rowIndex, c);
                    while(spanNode) {
                        if (c < 0) break;
                        if (!spanNode.isColMerge) {
                            spanNode.style.gridColumnEnd = cell.style.gridColumnEnd;
                            
                            if (!spanNode.align) spanNode.style.justifyContent = 'center';
                            if (!spanNode.align) spanNode.style.textAlign = 'center';
                            if (!spanNode.verticalAlign) spanNode.style.alignItems = 'center';
                            spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                            break;
                        }
                        c--;
                        spanNode = handler._getCell(gridId, cell.rowIndex, c);
                    }
                    cell.style.display = 'none';
                }
                
                if (cell.align) {
                    cell.style.justifyContent = cell.align;
                    cell.style.textAlign = cell.align;
                }

                if (cell.verticalAlign) {
                    switch (cell.verticalAlign.toLowerCase()) {
                        case 'top':
                            cell.style.alignItems = 'flex-start';
                            break;
                        case 'bottom':
                            cell.style.alignItems = 'flex-end';
                            break;
                        default:
                            cell.style.alignItems = 'center';
                            break;
                    }
                }
                if (cell.overflowWrap) cell.style.overflowWrap = cell.overflowWrap;
                if (cell.wordBreak) cell.style.wordBreak = cell.wordBreak;
                if (cell.whiteSpace) cell.style.whiteSpace = cell.whiteSpace;
                if (cell.backColor) cell.style.backgroundColor = cell.backColor;
                if (cell.fontColor) (cell.firstChild as any).style.colIndexor = cell.fontColor;
                if (cell.fontBold) (cell.firstChild as any).fontWeight = 'bold';
                if (cell.fontItalic) (cell.firstChild as any).fontStyle = 'italic';
                if (cell.fontThruline) (cell.firstChild as any).textDecoration = 'line-through';
                if (cell.fontUnderline) (cell.firstChild as any).textDecoration = 'underline';
                if (!cell.colVisible || !cell.rowVisible) {
                    cell.style.display = 'none';
                }
                if (cell.filter) {
                    cell.style.display = 'none';
                }
                if (gridInfo.alterRow && cell.rowIndex % 2 === 0) {
                    cell.classList.add(cell._gridId + '_b-v-g-d-alter');
                    cell.classList.remove(cell._gridId + '_b-v-g-d');
                }
                else {
                    cell.classList.add(cell._gridId + '_b-v-g-d');
                    cell.classList.remove(cell._gridId + '_b-v-g-d-alter');
                }
                if (cell.locked && cell.lockedColor) {
                    cell.classList.add(cell._gridId + '_b-v-g-d-locked');
                }
                else {
                    cell.classList.remove(cell._gridId + '_b-v-g-d-locked');
                }
                if(cell.locked) {
                    if (cell.dataType === 'select' && cell.firstChild && (cell.firstChild as any).nType == 'select') {
                        (cell.firstChild as any).disabled = true;
                        (cell.firstChild as any).style.pointerEvents = 'none';
                    }
                    else if (cell.dataType === 'checkbox' && cell.firstChild && (cell.firstChild as any).nType == 'checkbox') {
                        (cell.firstChild as any).disabled = true;
                        (cell.firstChild as any).style.pointerEvents = 'none';
                    }
                }
                if (cell.untarget) {
                    if (cell.dataType === 'button' && cell.firstChild && (cell.firstChild as any).nType == 'button') {
                        (cell.firstChild as any).disabled = true;
                        (cell.firstChild as any).style.pointerEvents = 'none';
                    }
                    else if (cell.dataType === 'link' && cell.firstChild && (cell.firstChild as any).nType == 'link') {
                        (cell.firstChild as any).style.opacity = '0.8';
                        (cell.firstChild as any).style.pointerEvents = 'none';
                    }
                }
                break;
            default:
                break;
        }
        cell.classList.add(cell._gridId + '_v-g-d');
    
        cell.addEventListener('mouseover', function (e) {
            if (!cell.untarget && cell._type === 'gbd') {
                cell.classList.add(cell._gridId + '_mouseover-cell');
                if (cell.dataType === 'link') {
                    const childList = cell.querySelectorAll('*');
                    childList.forEach(child => {
                        child.classList.add(cell._gridId + '_mouseover-cell');
                    });
                }
            }
        });

        cell.addEventListener('mouseout', function (e) {
            if (!cell.untarget && cell._type === 'gbd') {
                cell.classList.remove(cell._gridId + '_mouseover-cell');
                if (cell.dataType === 'link') {
                    const childList = cell.querySelectorAll('*');
                    childList.forEach(child => {
                        child.classList.remove(cell._gridId + '_mouseover-cell');
                    });
                }
            }
        });
    }
}
