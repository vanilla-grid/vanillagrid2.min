import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { ColInfo } from "../types/colInfo";
import type { Cell, CellData, CellRecord } from "../types/cell";
import type { Handler } from "../types/handler";
import { deepCopy, extractNumberAndUnit, nvl, removeAllChild } from "./utils";
import { basicDataType } from "../types/enum";

export const setHandleElement = (vg: Vanillagrid, gridList: Record<string, Grid>, handler: Handler) => {
    handler.modifyColSize = (targetCell: Cell, modifySize: number) => {
        if (!targetCell) return;
        if (!targetCell.resizable) return;
        if (targetCell.colId === 'v-g-rownum' || targetCell.colId === 'v-g-status') return;
        const grid = gridList[targetCell._gridId];
        if(grid.events.onResize(targetCell.colId) === false) return;
    
        const styleGridTemplateColumnsArr = grid.elements.gridHeader.style.gridTemplateColumns.split(' ');
        const oldColWidth = styleGridTemplateColumnsArr[targetCell.colIndex - 1];
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
        styleGridTemplateColumnsArr[targetCell.colIndex - 1] = newColWidth;
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
        
        if(!gridList[cell._gridId].methods.getRowStatus(cell.rowIndex)) gridList[cell._gridId].methods.setRowStatus(cell.rowIndex, 'U');
        cell.value  = value;
        handler.reConnectedCallbackElement(cell);
        handler.reloadGridWithModifyCell(cell._gridId, cell.colIndex!);
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
                    vg._status.editNewValue = vg.dataType[key].getEditedValue(vg._status.activeGridEditor!, cell._gridId, handler.__getData(cell));
                }
                else {
                    vg._status.editNewValue = vg._status.editOldValue;
                }
            }
        });
        handler.removeGridEditor();
        if(gridList[cell._gridId].events.onBeforeChange(cell.rowIndex, cell.colId, vg._status.editOldValue, vg._status.editNewValue) === false) return;
        const value = vg._status.editNewValue;
        const records = handler.getRecordsWithModifyValue(cell, value);
        handler.recordGridModify(cell._gridId, records);
        gridList[cell._gridId].events.onAfterChange(cell.rowIndex, cell.colId, vg._status.editOldValue, vg._status.editNewValue);
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
                            aValue = vg.dataType[key].getSortValue(gridId, aValue);
                        }
                        else {
                            aValue = aItem!.text
                        }
                    }
                    if(bDataType === key) {
                        if(vg.dataType[key].getSortValue) {
                            if(typeof vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                            bValue = vg.dataType[key].getSortValue(gridId, bValue);
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
        grid.data.variables.sortToggle = {};
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
            let tempCell = handler._getCell(gridId, r, colInfo!.colIndex!);
            if (!tempCell || !tempCell.rowVisible || !tempCell.colVisible) continue;
            filterValue = handler.getTextFromCell(tempCell);
    
            Object.keys(vg.dataType).forEach((key) => {
                if(tempCell.dataType === key) {
                    if(vg.dataType[key].getFilterValue) {
                        if(typeof vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                        filterValue = vg.dataType[key].getFilterValue(gridId, tempCell.value);
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
    handler.getDatasWithClearFilterValue = (gridId: string, datas: CellData[][]) => {
        datas.forEach((row) => {
            row.forEach((cellData) => {
                cellData.filter = false;
            });
        });
        gridList[gridId].data.variables.filters = [];
        return datas;
    };
    handler.reloadColForMerge = (gridId: string, colIndex: number) => {
        const colInfo = handler.__getColInfo(gridId, colIndex);
        if(!colInfo) return;
        const grid = gridList[gridId];
        let preCell, nowCell;
        let r, c;
        
        if (colInfo.rowMerge) {
            c = colInfo.colIndex;
            
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
                    for(let rSpan = preCell.rowIndex - 1; rSpan > 0; rSpan--) {
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
                for(c = colInfo.colIndex! - 1; c <= colInfo.colIndex!; c++) {
                    nowCell = handler._getCell(gridId, r, c!);
                    delete nowCell!.rowSpan;
                    delete nowCell!.isRowMerge;
                    delete nowCell!.colSpan;
                    delete nowCell!.isColMerge;
                }
            }
            
            c = colInfo.colIndex!;
            for(r = 1; r <= grid.methods.getRowCount(); r++) {
                preCell = cells[r - 1][c - 2]
                nowCell = cells[r - 1][c - 1]
                if (preCell
                    && handler.isCellVisible(preCell)
                    && preCell.dataType === nowCell.dataType
                    && handler.getTextFromCell(preCell) === handler.getTextFromCell(nowCell)
                ) {
                    for(let cSpan = preCell.colIndex - 1; cSpan > 2; cSpan--) {
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
                for(c = colInfo.colIndex! - 1; c <= colInfo.colIndex!; c++) {
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
                const footer = gridList[gridId].data.colInfos[footerCell.colIndex - 1];
                if (footer !== null && footer !== undefined) {
                    handler.reConnectedCallbackElement(footerCell);
                }
            }
        }
    };
    handler.setGridDataRowCol = (el: Cell, row: number, col: number) => {
        el.rowIndex = row;
        el.colIndex = col;
        handler.setGridDataPosition(el);
    };
    handler.setGridDataPosition = (el: Cell) => {
        const row = el.rowIndex;
        const col = el.colIndex;
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
    
        const tempGridData = document.createElement('div') as Cell;
        tempGridData._gridId = gridId;
        tempGridData._type = 'gbd';
        handler.setCellDataFromColInfo(tempGridData, colInfo);
        tempGridData.rowVisible = data.rowVisible !== undefined ? data.rowVisible : true;
        tempGridData.filter = data.filter !== undefined ? data.filter : false;
        
        if(data.colId !== undefined) tempGridData.colId = data.colId;
        if(data.colIndex !== undefined) tempGridData.colIndex = data.colIndex;
        if(data.name !== undefined) tempGridData.name = data.name;
        if(data.untarget !== undefined) tempGridData.untarget = data.untarget;
        if(data.rowMerge !== undefined) tempGridData.rowMerge = data.rowMerge;
        if(data.colMerge !== undefined) tempGridData.colMerge = data.colMerge;
        if(data.colVisible !== undefined) tempGridData.colVisible = data.colVisible;
        if(data.required !== undefined) tempGridData.required = data.required;
        if(data.resizable !== undefined) tempGridData.resizable = data.resizable;
        if(data.sortable !== undefined) tempGridData.sortable = data.sortable;
        if(data.filterable !== undefined) tempGridData.filterable = data.filterable;
        if(data.originWidth !== undefined) tempGridData.originWidth = data.originWidth;
        if(data.dataType !== undefined) {
            tempGridData.dataType = data.dataType;
            if (![...Object.keys(basicDataType), ...Object.keys(vg.dataType)].includes(tempGridData.dataType!)) throw new Error('Please insert a valid dataType.');
        }
        if(data.selectSize !== undefined) tempGridData.selectSize = data.selectSize;
        if(data.locked !== undefined) tempGridData.locked = data.locked;
        if(data.lockedColor !== undefined) tempGridData.lockedColor = data.lockedColor;
        if(data.format !== undefined) tempGridData.format = data.format;
        if(data.codes !== undefined) tempGridData.codes = deepCopy(data.codes);
        if(data.defaultCode !== undefined) tempGridData.defaultCode = data.defaultCode;
        if(data.maxLength !== undefined) tempGridData.maxLength = data.maxLength;
        if(data.maxByte !== undefined) tempGridData.maxByte = data.maxByte;
        if(data.maxNumber !== undefined) tempGridData.maxNumber = data.maxNumber;
        if(data.minNumber !== undefined) tempGridData.minNumber = data.minNumber;
        if(data.roundNumber !== undefined) tempGridData.roundNumber = data.roundNumber;
        if(data.align !== undefined) tempGridData.align = data.align;
        if(data.verticalAlign !== undefined) tempGridData.verticalAlign = data.verticalAlign;
        if(data.overflowWrap !== undefined) tempGridData.overflowWrap = data.overflowWrap;
        if(data.wordBreak !== undefined) tempGridData.wordBreak = data.wordBreak;
        if(data.whiteSpace !== undefined) tempGridData.whiteSpace = data.whiteSpace;
        if(data.backColor !== undefined) tempGridData.backColor = data.backColor;
        if(data.fontColor !== undefined) tempGridData.fontColor = data.fontColor;
        if(data.fontBold !== undefined) tempGridData.fontBold = data.fontBold;
        if(data.fontItalic !== undefined) tempGridData.fontItalic = data.fontItalic;
        if(data.fontThruline !== undefined) tempGridData.fontThruline = data.fontThruline;
        if(data.fontUnderline !== undefined) tempGridData.fontUnderline = data.fontUnderline;

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
    handler.setCellDataFromColInfo = (cellDataOrCell: CellData | Cell, colInfo: ColInfo) => {
        cellDataOrCell.colId = colInfo.colId;
        cellDataOrCell.colIndex = colInfo.colIndex;
        cellDataOrCell.name = colInfo.name;
        cellDataOrCell.untarget = colInfo.untarget;
        cellDataOrCell.rowMerge = colInfo.rowMerge;
        cellDataOrCell.colMerge = colInfo.colMerge;
        cellDataOrCell.colVisible = colInfo.colVisible;
        cellDataOrCell.required = colInfo.required;
        cellDataOrCell.resizable = colInfo.resizable;
        cellDataOrCell.sortable = colInfo.sortable;
        cellDataOrCell.filterable = colInfo.filterable;
        cellDataOrCell.originWidth = colInfo.originWidth;
        cellDataOrCell.dataType = colInfo.dataType;
        if (![...Object.keys(basicDataType), ...Object.keys(vg.dataType)].includes(cellDataOrCell.dataType!)) throw new Error('Please insert a valid dataType.');
        cellDataOrCell.selectSize = colInfo.selectSize;
        cellDataOrCell.locked = colInfo.locked;
        cellDataOrCell.lockedColor = colInfo.lockedColor;
        cellDataOrCell.format = colInfo.format;
        cellDataOrCell.codes = deepCopy(colInfo.codes);
        cellDataOrCell.defaultCode = colInfo.defaultCode;
        cellDataOrCell.maxLength = colInfo.maxLength;
        cellDataOrCell.maxByte = colInfo.maxByte;
        cellDataOrCell.maxNumber = colInfo.maxNumber;
        cellDataOrCell.minNumber = colInfo.minNumber;
        cellDataOrCell.roundNumber = colInfo.roundNumber;
        cellDataOrCell.align = colInfo.align;
        cellDataOrCell.verticalAlign = colInfo.verticalAlign;
        cellDataOrCell.overflowWrap = colInfo.overflowWrap;
        cellDataOrCell.wordBreak = colInfo.wordBreak;
        cellDataOrCell.whiteSpace = colInfo.whiteSpace;
        cellDataOrCell.backColor = colInfo.backColor;
        cellDataOrCell.fontColor = colInfo.fontColor;
        cellDataOrCell.fontBold = colInfo.fontBold;
        cellDataOrCell.fontItalic = colInfo.fontItalic;
        cellDataOrCell.fontThruline = colInfo.fontThruline;
        cellDataOrCell.fontUnderline = colInfo.fontUnderline;
    }
    handler.getSortSpan = (gridId: string, colId: string) => {
        let sortSpan: any;
        if(gridList[gridId].data.variables.sortToggle[colId]) {
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
        sortSpan._gridId = gridId;
        sortSpan.isChild = true;
        sortSpan._type = 'sort';
        sortSpan.classList.add(gridId + '_sortSpan');
        sortSpan.classList.add(gridList[gridId].data.variables.sortToggle[colId] ? gridId + '_ascSpan' : gridId + '_descSpan');
        return sortSpan
    }
}
