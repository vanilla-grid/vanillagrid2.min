import type { Grid, Vanillagrid } from "../types/vanillagrid";
import type { ColInfo } from "../types/colInfo";
import type { Cell, CellData, CellRecord } from "../types/cell";
import { getRecordsWithModifyValue, reConnectedCallbackElement, recordGridModify } from "./handleActive";
import { getCellText, getCodeValue, getValidValue, isCellVisible, removeGridEditor } from "./handleCell";
import { __getColInfo, __getData, __getHeaderFilter, _getCell, _getCells, _getFooterCell, _getFooterCells, _getHeaderCell } from "./handleGrid";
import { deepCopy, extractNumberAndUnit, nvl, removeAllChild } from "./utils";

export const modifyColSize = (grid: Grid, targetCell: Cell, modifySize: number) => {
    if (!targetCell) return;
    if (!targetCell.resizable) return;
    if (targetCell.colId === 'v-g-rownum' || targetCell.colId === 'v-g-status') return;
    if(targetCell._grid._events.onResize(targetCell.colId) === false) return;

    const styleGridTemplateColumnsArr = grid.gridHeader.style.gridTemplateColumns.split(' ');
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
    grid.gridHeader.style.gridTemplateColumns = styleGridTemplateColumns;
    grid.gridBody.style.gridTemplateColumns = styleGridTemplateColumns;
    grid.gridFooter.style.gridTemplateColumns = styleGridTemplateColumns;
};
export const changeColSize = (grid: Grid, targetCol: number, changeSize: number) => {
    if (typeof changeSize !== 'number' || changeSize < 0) throw new Error('The format of size is only zero or positive integers.');

    if (_getHeaderCell(grid, 1, targetCol)!._frozenCol) return;
    const isVisible = changeSize !== 0;
    for(let row = 1; row <= grid.getHeaderRowCount(); row++) {
        const tempHeaderCell = _getHeaderCell(grid, row, targetCol);
        tempHeaderCell.colVisible = isVisible;
        reConnectedCallbackElement(tempHeaderCell);
    }
    for(let row = 1; row <= grid.getRowCount(); row++) {
        _getCell(grid, row, targetCol)!.colVisible = isVisible;
    }
    for(let row = 1; row <= grid.getFooterRowCount(); row++) {
        const tempFooterCell = _getFooterCell(grid, row, targetCol);
        tempFooterCell.colVisible = isVisible;
        reConnectedCallbackElement(tempFooterCell);
    }
    
    const header = grid.gridHeader;
    const body = grid.gridBody;
    const footer = grid.gridFooter;

    const styleGridTemplateColumnsArr = header.style.gridTemplateColumns.split(' ');
    const oldColWidth = styleGridTemplateColumnsArr[targetCol - 1];
    const newColWidth = changeSize + extractNumberAndUnit(oldColWidth)!.unit!;
    styleGridTemplateColumnsArr[targetCol - 1] = newColWidth;
    const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
    header.style.gridTemplateColumns = styleGridTemplateColumns;
    body.style.gridTemplateColumns = styleGridTemplateColumns;
    footer.style.gridTemplateColumns = styleGridTemplateColumns;
};
export const modifyCellValue = (cell: Cell, value: any, records: CellRecord[], isMethodCalled = false) => {
    if (!isMethodCalled) {
        if (!isCellVisible(cell)) return;
        if (cell.untarget || cell.locked) return;
    }
    value = getValidValue(cell, value);
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
    
    if(!cell._grid.getRowStatus(cell._row)) cell._grid.setRowStatus(cell._row, 'U');
    cell.value  = value;
    reConnectedCallbackElement(cell);
    reloadGridWithModifyCell(cell._grid, cell.index!);
};
export const modifyCell = (vg: Vanillagrid) => {
    if (!vg._status.activeGridEditor) return;
    let cell = vg._status.activeGridEditor.parentNode as Cell;
    if (cell.untarget || cell.locked) return;
    vg._status.editNewValue = (vg._status.activeGridEditor as any).value;
    Object.keys(vg.dataType).forEach((key) => {
        if(cell.dataType === key) {
            if(vg.dataType[key].getEditedValue) {
                if(typeof vg.dataType[key].getEditedValue !== 'function') throw new Error('getEditedValue must be a function.');
                vg._status.editNewValue = vg.dataType[key].getEditedValue(vg._status.activeGridEditor!, __getData(cell));
            }
            else {
                vg._status.editNewValue = vg._status.editOldValue;
            }
        }
    });
    removeGridEditor(vg._status.activeGridEditor);
    if(cell._grid._events.onBeforeChange(cell._row, cell.colId, vg._status.editOldValue, vg._status.editNewValue) === false) return;
    const value = vg._status.editNewValue;
    const records = getRecordsWithModifyValue(cell, value);
    recordGridModify(cell._grid, records);
    cell._grid._events.onAfterChange(cell._row, cell.colId, vg._status.editOldValue, vg._status.editNewValue);
    return;
};
export const sort = (grid: Grid, arr: CellData[][], id: string, isAsc = true, isNumSort = false) => {
    const copiedArr = deepCopy(arr);
    
    copiedArr.sort((a: CellData[], b: CellData[]) => {
        const aItem = a.find((item: CellData) => item.colId === id);
        const bItem = b.find((item: CellData) => item.colId === id);
        let aValue = aItem ? aItem.value : null
        const aDataType = aItem ? aItem.dataType : null
        let bValue = bItem ? bItem.value : null
        const bDataType = bItem ? bItem.dataType : null
        
        let _isNumSort = isNumSort;
        if (typeof aValue === 'number' || typeof bValue === 'number') _isNumSort = true;

        if (aValue === grid._gridInfo.nullValue) aValue = null;
        if (bValue === grid._gridInfo.nullValue) bValue = null;

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

        if(grid._vg.dataType) {
            Object.keys(grid._vg.dataType).forEach((key) => {
                if(aDataType === key) {
                    if(grid._vg.dataType[key].getSortValue) {
                        if(typeof grid._vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                        aValue = grid._vg.dataType[key].getSortValue(aValue);
                    }
                    else {
                        aValue = aItem!.text
                    }
                }
                if(bDataType === key) {
                    if(grid._vg.dataType[key].getSortValue) {
                        if(typeof grid._vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                        bValue = grid._vg.dataType[key].getSortValue(bValue);
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
    grid._variables._sortToggle[id] = isAsc;
    return copiedArr;
};
export const setFilterOptions = (select: any, options: any) => {
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
export const reloadFilterValue = (grid: Grid, colId: number | string) => {
    if (!grid || !grid._gridInfo.filterable) return;
    const colInfo = __getColInfo(grid, colId);
    if (!colInfo!.filterable) return;

    colInfo!.filterValues = new Set();
    for(let r = 1; r <= grid.getRowCount(); r++) {
        let filterValue;
        let tempCell = _getCell(grid, r, colInfo!.index!);
        if (!tempCell || !tempCell.rowVisible || !tempCell.colVisible) continue;
        filterValue = getCellText(tempCell);

        Object.keys(grid._vg.dataType).forEach((key) => {
            if(tempCell.dataType === key) {
                if(grid._vg.dataType[key].getFilterValue) {
                    if(typeof grid._vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                    filterValue = grid._vg.dataType[key].getFilterValue(tempCell.value);
                }
            }
        });

        if(filterValue === '' || filterValue === null || filterValue === undefined || filterValue === grid._gridInfo.nullValue) filterValue = '$$NULL';
        colInfo!.filterValues.add(filterValue);
    }
    reloadFilter(grid, colId);
};
export const reloadFilter = (grid: Grid, colId: number | string) => {
    const filterSelect = __getHeaderFilter(grid, colId);
    if (!filterSelect) return;
    const colInfo = __getColInfo(grid, colId);
    const filterValues = colInfo!.filterValues;
    const dataType = colInfo!.dataType;
    if (!filterValues) return;
    let options = [];
    let option = {
        value: '$$ALL',
        text: '*',
    };
    options.push(option);

    filterValues.forEach((value: any) => {
        const option = {
            value : value,
            text : value
        };
        if (value === '$$NULL') option.text = grid._gridInfo.nullValue;
        if (dataType === 'checkbox') {
            option.text = value === grid._gridInfo.checkedValue ? '☑' : '☐';
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
export const reloadColForMerge = (grid: Grid, colIndex: number) => {
    const colInfo = __getColInfo(grid, colIndex);
    if(!colInfo) return;
    let preCell, nowCell;
    let r, c;
    
    if (colInfo.rowMerge) {
        c = colInfo.index;
        
        for(r = 1; r <= grid.getRowCount(); r++) {
            nowCell = _getCell(grid, r, c!);
            delete nowCell!.rowSpan;
            delete nowCell!.isRowMerge;
            delete nowCell!.colSpan;
            delete nowCell!.isColMerge;
        }
        
        for(r = 2; r <= grid.getRowCount(); r++) {
            preCell = _getCell(grid, r - 1, c!);
            nowCell = _getCell(grid, r, c!);
            if (preCell
                && isCellVisible(preCell)
                && preCell.dataType === nowCell!.dataType
                && getCellText(preCell) === getCellText(nowCell!)
            ) {
                for(let rSpan = preCell._row - 1; rSpan > 0; rSpan--) {
                    preCell = _getCell(grid, rSpan, c!);
                    if (preCell!.isRowMerge !== true) {
                        preCell!.rowSpan = nvl(preCell!.rowSpan, 1) + 1;
                        break;
                    }
                }
                nowCell!.isRowMerge = true;
            }
        }
        
        for(r = 1; r <= grid.getRowCount(); r++) {
            nowCell = _getCell(grid, r, c!);
            reConnectedCallbackElement(nowCell!);
        }
    }
    if (colInfo.colMerge && !__getColInfo(grid, colIndex - 1)!.rowMerge) {
        const cells = _getCells(grid);
        
        for(r = 1; r <= grid.getRowCount(); r++) {
            for(c = colInfo.index! - 1; c <= colInfo.index!; c++) {
                nowCell = _getCell(grid, r, c!);
                delete nowCell!.rowSpan;
                delete nowCell!.isRowMerge;
                delete nowCell!.colSpan;
                delete nowCell!.isColMerge;
            }
        }
        
        c = colInfo.index!;
        for(r = 1; r <= grid.getRowCount(); r++) {
            preCell = cells[r - 1][c - 2]
            nowCell = cells[r - 1][c - 1]
            if (preCell
                && isCellVisible(preCell)
                && preCell.dataType === nowCell.dataType
                && getCellText(preCell) === getCellText(nowCell)
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
        
        for(r = 1; r <= grid.getRowCount(); r++) {
            for(c = colInfo.index! - 1; c <= colInfo.index!; c++) {
                nowCell = _getCell(grid, r, c!);
                reConnectedCallbackElement(nowCell!);
            }
        }
    }
};
export const reloadGridWithModifyCell = (grid: Grid, colIndex: number) => {
    reloadFooterValue(grid);
    reloadFilterValue(grid, colIndex);
    const nextColInfo = __getColInfo(grid, colIndex + 1);
    if (nextColInfo && nextColInfo.colMerge) {
        reloadColForMerge(grid, colIndex + 1);
    }
    else {
        reloadColForMerge(grid, colIndex);
    }
};
export const reloadGridForMerge = (grid: Grid) => {
    for(let c = 3; c <= grid.getColCount(); c++) {
        reloadColForMerge(grid, c);
    }
};
export const reloadFooterValue = (grid: Grid) => {
    const footerCells = _getFooterCells(grid);
    for(const footers of footerCells) {
        for(const footerCell of footers) {
            if (footerCell.footer !== null && footerCell.footer !== undefined) {
                reConnectedCallbackElement(footerCell);
            }
        }
    }

    
};
export const setGridDataRowCol = (el: Cell, row: number, col: number) => {
    el._row = row;
    el._col = col;
    el.index = col;
    setGridDataPosition(el);
};
export const setGridDataPosition = (el: Cell) => {
    const row = el._row;
    const col = el._col;
    el.style.gridRowStart = String(row);
    el.style.gridRowEnd = String(row + 1);
    el.style.gridColumnStart = String(col);
    el.style.gridColumnEnd = String(col + 1);
};
//수정필요 cell data 형태
export const getGridCell = (grid: Grid, colInfo: ColInfo, valueOrData: any, rowCount: number, colCount: number) => {
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
    tempGridData._gridId = grid._id;
    tempGridData._grid = grid;
    tempGridData._type = 'gbd';

    Object.keys(colInfo).forEach(key => {
        if (['header', 'footer', 'rowMerge', 'colMerge', 'filterValue','index'].indexOf(key) < 0) {
            (tempGridData as any)[key] = key in data ? data[key] : colInfo[key as keyof ColInfo];
        }
    });
    switch (tempGridData.colId) {
        case 'v-g-rownum':
            tempGridData.value = rowCount;
            break;
        case 'v-g-status':
            tempGridData.value = getCodeValue(['C','U','D'], null, data.value);
            break;
        default:
            tempGridData.value = getValidValue(tempGridData, data.value);
            break;
    }
    if (colInfo.filterable && tempGridData.colVisible) colInfo.filterValues!.add(tempGridData.textContent!);
    setGridDataRowCol(tempGridData, rowCount, colCount);
    return tempGridData as Cell;
};
