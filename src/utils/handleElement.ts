import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { ColInfo } from "../types/colInfo";
import type { Cell, CellData, CellRecord } from "../types/cell";
import type { Handler } from "../types/handler";
import { deepCopy, extractNumberAndUnit, nvl, removeAllChild } from "./utils";

export const setHandleElement = (vg: Vanillagrid, gridList: Record<string, Grid>, handler: Handler) => {
    handler.modifyColSize = (targetCell: Cell, modifySize: number) => {
        if (!targetCell) return;
        if (!targetCell.resizable) return;
        if (targetCell.colId === 'v-g-rownum' || targetCell.colId === 'v-g-status') return;
        const grid = gridList[targetCell._gridId];
        if(grid.events.onResize(targetCell.colId) === false) return;
    
        const styleGridTemplateColumnsArr = grid.elements.gridHeader.style.gridTemplateColumns.split(' ');
        const oldColWidth = styleGridTemplateColumnsArr[targetCell._col - 1];
        if (extractNumberAndUnit(oldColWidth)!.unit === '%') {
            if (modifySize > 0) {
                modifySize = 1;
            }
            else if (modifySize < 0) {
                modifySize = -1;
            }
            else {
                modifySize = 0;
            }
        }
        const newColWidth = (extractNumberAndUnit(oldColWidth)!.number + modifySize) + extractNumberAndUnit(oldColWidth)!.unit!;
        styleGridTemplateColumnsArr[targetCell._col - 1] = newColWidth;
        const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
        grid.elements.gridHeader.style.gridTemplateColumns = styleGridTemplateColumns;
        grid.elements.gridBody.style.gridTemplateColumns = styleGridTemplateColumns;
        grid.elements.gridFooter.style.gridTemplateColumns = styleGridTemplateColumns;
    };
    handler.changeColSize = (gridId: string, targetCol: number, changeSize: number) => {
        if (typeof changeSize !== 'number' || changeSize < 0) throw new Error('The format of size is only zero or positive integers.');
        const grid = gridList[gridId];
    
        if (handler._getHeaderCell(gridId, 1, targetCol)!._frozenCol) return;
        const isVisible = changeSize !== 0;
        for(let row = 1; row <= grid.methods.getHeaderRowCount(); row++) {
            const tempHeaderCell = handler._getHeaderCell(gridId, row, targetCol);
            tempHeaderCell.colVisible = isVisible;
            handler.reConnectedCallbackElement(tempHeaderCell);
        }
        for(let row = 1; row <= grid.methods.getRowCount(); row++) {
            handler._getCell(gridId, row, targetCol)!.colVisible = isVisible;
        }
        for(let row = 1; row <= grid.methods.getFooterRowCount(); row++) {
            const tempFooterCell = handler._getFooterCell(gridId, row, targetCol);
            tempFooterCell.colVisible = isVisible;
            handler.reConnectedCallbackElement(tempFooterCell);
        }
        
        const header = grid.elements.gridHeader;
        const body = grid.elements.gridBody;
        const footer = grid.elements.gridFooter;
    
        const styleGridTemplateColumnsArr = header.style.gridTemplateColumns.split(' ');
        const oldColWidth = styleGridTemplateColumnsArr[targetCol - 1];
        const newColWidth = changeSize + extractNumberAndUnit(oldColWidth)!.unit!;
        styleGridTemplateColumnsArr[targetCol - 1] = newColWidth;
        const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
        header.style.gridTemplateColumns = styleGridTemplateColumns;
        body.style.gridTemplateColumns = styleGridTemplateColumns;
        footer.style.gridTemplateColumns = styleGridTemplateColumns;
    };
    handler.modifyCellValue = (cell: Cell, value: any, records: CellRecord[], isMethodCalled = false) => {
        if (!isMethodCalled) {
            if (!handler.isCellVisible(cell)) return;
            if (cell.untarget || cell.locked) return;
        }
        value = handler.getValidValue(cell, value);
        if (cell.value === value) return;
    
        const oldValue = cell.value;
        const newValue = value;
        
        if (records && Array.isArray(records)) {
            records.push({
                'cell' : cell,
                'oldValue' : oldValue,
                'newValue' : newValue,
            })
        }
        
        if(!gridList[cell._gridId].methods.getRowStatus(cell._row)) gridList[cell._gridId].methods.setRowStatus(cell._row, 'U');
        cell.value  = value;
        handler.reConnectedCallbackElement(cell);
        handler.reloadGridWithModifyCell(cell._gridId, cell.index!);
    };
    handler.modifyCell = (vg: Vanillagrid) => {
        if (!vg._status.activeGridEditor) return;
        const cell = vg._status.activeGridEditor.parentNode as Cell;
        if (cell.untarget || cell.locked) return;
        vg._status.editNewValue = (vg._status.activeGridEditor as any).value;
        Object.keys(vg.dataType).forEach((key) => {
            if(cell.dataType === key) {
                if(vg.dataType[key].getEditedValue) {
                    if(typeof vg.dataType[key].getEditedValue !== 'function') throw new Error('getEditedValue must be a function.');
                    vg._status.editNewValue = vg.dataType[key].getEditedValue(vg._status.activeGridEditor!, handler.__getData(cell));
                }
                else {
                    vg._status.editNewValue = vg._status.editOldValue;
                }
            }
        });
        handler.removeGridEditor();
        if(gridList[cell._gridId].events.onBeforeChange(cell._row, cell.colId, vg._status.editOldValue, vg._status.editNewValue) === false) return;
        const value = vg._status.editNewValue;
        const records = handler.getRecordsWithModifyValue(cell, value);
        handler.recordGridModify(cell._gridId, records);
        gridList[cell._gridId].events.onAfterChange(cell._row, cell.colId, vg._status.editOldValue, vg._status.editNewValue);
        return;
    };
    handler.sort = (gridId: string, arr: CellData[][], id: string, isAsc = true, isNumSort = false) => {
        const copiedArr = deepCopy(arr);
        const grid = gridList[gridId];
        
        copiedArr.sort((a: CellData[], b: CellData[]) => {
            const aItem = a.find((item: CellData) => item.colId === id);
            const bItem = b.find((item: CellData) => item.colId === id);
            let aValue = aItem ? aItem.value : null
            const aDataType = aItem ? aItem.dataType : null
            let bValue = bItem ? bItem.value : null
            const bDataType = bItem ? bItem.dataType : null
            
            let _isNumSort = isNumSort;
            if (typeof aValue === 'number' || typeof bValue === 'number') _isNumSort = true;
    
            if (aValue === grid.data.gridInfo.nullValue) aValue = null;
            if (bValue === grid.data.gridInfo.nullValue) bValue = null;
    
            if (aDataType === 'select' && aValue !== null && Array.isArray(aValue)) {
                let aSelectOption = aValue.find(item => item.selected);
                if (aSelectOption) {
                    aValue = aSelectOption.text;
                }
                else {
                    if (aValue.length > 0) {
                        aValue = aValue[0].text !== undefined ? aValue[0].text : null; 
                    }
                    else {
                        aValue = null;
                    }
                }
            }
            else if (aDataType === 'link' && aValue !== null && aValue.constructor === Object) {
                aValue = aValue.text;
            }
    
            if (bDataType === 'select' && bValue !== null && Array.isArray(bValue)) {
                let bSelectOption = bValue.find(item => item.selected);
                if (bSelectOption) {
                    bValue = bSelectOption.text;
                }
                else {
                    if (bValue.length > 0) {
                        bValue = bValue[0].text !== undefined ? bValue[0].text : null; 
                    }
                    else {
                        bValue = null;
                    }
                }
            }
            else if (bDataType === 'link' && bValue !== null && bValue.constructor === Object) {
                bValue = bValue.text;
            }
    
            if(vg.dataType) {
                Object.keys(vg.dataType).forEach((key) => {
                    if(aDataType === key) {
                        if(vg.dataType[key].getSortValue) {
                            if(typeof vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                            aValue = vg.dataType[key].getSortValue(aValue);
                        }
                        else {
                            aValue = aItem!.text
                        }
                    }
                    if(bDataType === key) {
                        if(vg.dataType[key].getSortValue) {
                            if(typeof vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                            bValue = vg.dataType[key].getSortValue(bValue);
                        }
                        else {
                            bValue = bItem!.text
                        }
                    }
                });
            }
            
            if (_isNumSort) {
                const aNumber = aValue === null ? NaN : Number(aValue);
                const bNumber = bValue === null ? NaN : Number(bValue);
    
                if (!isNaN(aNumber) && !isNaN(bNumber)) {
                    return isAsc !== false ? aNumber - bNumber : bNumber - aNumber;
                }
                if (isNaN(aNumber)) aValue = null;
                if (isNaN(bNumber)) bValue = null;
            }
            
            if (aValue === null && bValue === null) return 0; 
            if (aValue === null) return isAsc !== false ? 1 : -1; 
            if (bValue === null) return isAsc !== false ? -1 : 1;
    
            if (!aValue.localeCompare && !bValue.localeCompare) return 0
            if (!aValue.localeCompare) return isAsc !== false ? 1 : -1;
            if (!bValue.localeCompare) return isAsc !== false ? -1 : 1;
    
            if (_isNumSort) {
                return isAsc !== false ? 
                    aValue.localeCompare(bValue, undefined, {numeric: true}) : 
                    bValue.localeCompare(aValue, undefined, {numeric: true});
            } else {
                return isAsc !== false ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
        });
        grid.data.variables.sortToggle[id] = isAsc;
        return copiedArr;
    };
    handler.setFilterOptions = (select: any, options: any) => {
        const selectedValue = select.value;
        removeAllChild(select);
        options.forEach((opt: any) => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option); 
        });
        if (selectedValue) {
            select.value = selectedValue;
        }
    };
    handler.reloadColFilterValue = (gridId: string, colId: number | string) => {
        const grid = gridList[gridId];
        if (!grid || !grid.data.gridInfo.filterable) return;
        const colInfo = handler.__getColInfo(gridId, colId);
        if (!colInfo!.filterable) return;
    
        colInfo!.filterValues = new Set();
        for(let r = 1; r <= grid.methods.getRowCount(); r++) {
            let filterValue;
            let tempCell = handler._getCell(gridId, r, colInfo!.index!);
            if (!tempCell || !tempCell.rowVisible || !tempCell.colVisible) continue;
            filterValue = handler.getTextFromCell(tempCell);
    
            Object.keys(vg.dataType).forEach((key) => {
                if(tempCell.dataType === key) {
                    if(vg.dataType[key].getFilterValue) {
                        if(typeof vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                        filterValue = vg.dataType[key].getFilterValue(tempCell.value);
                    }
                }
            });
    
            if(filterValue === '' || filterValue === null || filterValue === undefined || filterValue === grid.data.gridInfo.nullValue) filterValue = '$$NULL';
            colInfo!.filterValues.add(filterValue);
        }
        handler.reloadFilter(gridId, colId);
    };
    handler.reloadFilter = (gridId: string, colId: number | string) => {
        const filterSelect = handler.__getHeaderFilter(gridId, colId);
        if (!filterSelect) return;
        const colInfo = handler.__getColInfo(gridId, colId);
        const filterValues = colInfo!.filterValues;
        const dataType = colInfo!.dataType;
        if (!filterValues) return;
        let options = [];
        let option = {
            value: '$$ALL',
            text: '*',
        };
        options.push(option);

        const grid = gridList[gridId];
    
        filterValues.forEach((value: any) => {
            const option = {
                value : value,
                text : value
            };
            if (value === '$$NULL') option.text = grid.data.gridInfo.nullValue;
            if (dataType === 'checkbox') {
                option.text = value === grid.data.gridInfo.checkedValue ? '☑' : '☐';
            }
            options.push(option);
        });
    
        const selectedValue = filterSelect.value;
        removeAllChild(filterSelect);
        options.forEach((opt: any) => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            filterSelect.appendChild(option); 
        });
        if (selectedValue) {
            filterSelect.value = selectedValue;
            colInfo!.filterValue = selectedValue;
        }
    };
    handler.reloadColForMerge = (gridId: string, colIndex: number) => {
        const colInfo = handler.__getColInfo(gridId, colIndex);
        if(!colInfo) return;
        const grid = gridList[gridId];
        let preCell, nowCell;
        let r, c;
        
        if (colInfo.rowMerge) {
            c = colInfo.index;
            
            for(r = 1; r <= grid.methods.getRowCount(); r++) {
                nowCell = handler._getCell(gridId, r, c!);
                delete nowCell!.rowSpan;
                delete nowCell!.isRowMerge;
                delete nowCell!.colSpan;
                delete nowCell!.isColMerge;
            }
            
            for(r = 2; r <= grid.methods.getRowCount(); r++) {
                preCell = handler._getCell(gridId, r - 1, c!);
                nowCell = handler._getCell(gridId, r, c!);
                if (preCell
                    && handler.isCellVisible(preCell)
                    && preCell.dataType === nowCell!.dataType
                    && handler.getTextFromCell(preCell) === handler.getTextFromCell(nowCell!)
                ) {
                    for(let rSpan = preCell._row - 1; rSpan > 0; rSpan--) {
                        preCell = handler._getCell(gridId, rSpan, c!);
                        if (preCell!.isRowMerge !== true) {
                            preCell!.rowSpan = nvl(preCell!.rowSpan, 1) + 1;
                            break;
                        }
                    }
                    nowCell!.isRowMerge = true;
                }
            }
            
            for(r = 1; r <= grid.methods.getRowCount(); r++) {
                nowCell = handler._getCell(gridId, r, c!);
                handler.reConnectedCallbackElement(nowCell!);
            }
        }
        if (colInfo.colMerge && !handler.__getColInfo(gridId, colIndex - 1)!.rowMerge) {
            const cells = handler._getCells(gridId);
            
            for(r = 1; r <= grid.methods.getRowCount(); r++) {
                for(c = colInfo.index! - 1; c <= colInfo.index!; c++) {
                    nowCell = handler._getCell(gridId, r, c!);
                    delete nowCell!.rowSpan;
                    delete nowCell!.isRowMerge;
                    delete nowCell!.colSpan;
                    delete nowCell!.isColMerge;
                }
            }
            
            c = colInfo.index!;
            for(r = 1; r <= grid.methods.getRowCount(); r++) {
                preCell = cells[r - 1][c - 2]
                nowCell = cells[r - 1][c - 1]
                if (preCell
                    && handler.isCellVisible(preCell)
                    && preCell.dataType === nowCell.dataType
                    && handler.getTextFromCell(preCell) === handler.getTextFromCell(nowCell)
                ) {
                    for(let cSpan = preCell._col - 1; cSpan > 2; cSpan--) {
                        preCell = cells[r - 1][cSpan];
                        if (preCell.isColMerge !== true) {
                            preCell.colSpan = nvl(preCell.colSpan, 1) + 1;
                            break;
                        }
                    }
                    nowCell.isColMerge = true;
                }
            }
            
            for(r = 1; r <= grid.methods.getRowCount(); r++) {
                for(c = colInfo.index! - 1; c <= colInfo.index!; c++) {
                    nowCell = handler._getCell(gridId, r, c!);
                    handler.reConnectedCallbackElement(nowCell!);
                }
            }
        }
    };
    handler.reloadGridWithModifyCell = (gridId: string, colIndex: number) => {
        handler.reloadFooterValue(gridId);
        handler.reloadColFilterValue(gridId, colIndex);
        const nextColInfo = handler.__getColInfo(gridId, colIndex + 1);
        if (nextColInfo && nextColInfo.colMerge) {
            handler.reloadColForMerge(gridId, colIndex + 1);
        }
        else {
            handler.reloadColForMerge(gridId, colIndex);
        }
    };
    handler.reloadGridForMerge = (gridId: string) => {
        const grid = gridList[gridId];
        for(let c = 3; c <= grid.methods.getColCount(); c++) {
            handler.reloadColForMerge(gridId, c);
        }
    };
    handler.reloadFooterValue = (gridId: string) => {
        const footerCells = handler._getFooterCells(gridId);
        for(const footers of footerCells) {
            for(const footerCell of footers) {
                if (footerCell.footer !== null && footerCell.footer !== undefined) {
                    handler.reConnectedCallbackElement(footerCell);
                }
            }
        }
    };
    handler.setGridDataRowCol = (el: Cell, row: number, col: number) => {
        el._row = row;
        el._col = col;
        el.index = col;
        handler.setGridDataPosition(el);
    };
    handler.setGridDataPosition = (el: Cell) => {
        const row = el._row;
        const col = el._col;
        el.style.gridRowStart = String(row);
        el.style.gridRowEnd = String(row + 1);
        el.style.gridColumnStart = String(col);
        el.style.gridColumnEnd = String(col + 1);
    };
    handler.getGridCell = (gridId: string, colInfo: ColInfo, valueOrData: any, rowCount: number, colCount: number) => {
        let data;
    
        if (valueOrData && valueOrData.constructor === Object) {
            data = {
                value : valueOrData[colInfo.colId]
            };
        }
        else if (valueOrData && Array.isArray(valueOrData)) {
            for(const tempData of valueOrData) {
                if (tempData.colId === colInfo.colId) {
                    data = tempData;
                    break;
                }
            }
        }
    
        if (!data) {
            data = {
                value : null
            };
        }
    
        const tempGridData = document.createElement('v-g-d') as Cell;
        tempGridData._gridId = gridId;
        tempGridData._type = 'gbd';
    
        Object.keys(colInfo).forEach(key => {
            if (['header', 'footer', 'rowMerge', 'colMerge', 'filterValue', 'index'].indexOf(key) < 0) {
                (tempGridData as any)[key] = key in data ? data[key] : colInfo[key as keyof ColInfo];
            }
        });
        switch (tempGridData.colId) {
            case 'v-g-rownum':
                tempGridData.value = rowCount;
                break;
            case 'v-g-status':
                tempGridData.value = handler.getCodeValue(['C','U','D'], null, data.value);
                break;
            default:
                tempGridData.value = handler.getValidValue(tempGridData, data.value);
                break;
        }
        if (colInfo.filterable && tempGridData.colVisible) colInfo.filterValues!.add(tempGridData.textContent!);
        handler.setGridDataRowCol(tempGridData, rowCount, colCount);
        return tempGridData as Cell;
    };
}
