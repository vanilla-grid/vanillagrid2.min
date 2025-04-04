
modifyColSize (gId: string, targetCell: Cell, modifySize: number) {
    if (!targetCell) return;
    if (!targetCell.cResizable) return;
    if (targetCell.cId === 'v-g-rownum' || targetCell.cId === 'v-g-status') return;
    if ((this as any).doEventWithCheckChanged(gId, '_onResize', targetCell.cId) === false) {
        return;
    }

    const gHeader = (this as any)[gId]._getHeader();
    const gBody = (this as any)[gId]._getBody();
    const gFooter = (this as any)[gId]._getFooter();

    const styleGridTemplateColumnsArr = gHeader.style.gridTemplateColumns.split(' ');
    const oldColWidth = styleGridTemplateColumnsArr[targetCell.col - 1];
    if ((this as any).extractNumberAndUnit(oldColWidth).unit === '%') {
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
    const newColWidth = ((this as any).extractNumberAndUnit(oldColWidth).number + modifySize) + (this as any).extractNumberAndUnit(oldColWidth).unit;
    styleGridTemplateColumnsArr[targetCell.col - 1] = newColWidth;
    const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
    gHeader.style.gridTemplateColumns = styleGridTemplateColumns;
    gBody.style.gridTemplateColumns = styleGridTemplateColumns;
    gFooter.style.gridTemplateColumns = styleGridTemplateColumns;
},
changeColSize (gId: string, targetCol: number, changeSize: number) {
    if (typeof changeSize !== 'number' || changeSize < 0) throw new Error('The format of size is only zero or positive integers.');

    const _grid = (this as any)[gId];
    if (_grid._getHeaderCell(1, targetCol).frozenCol) return;
    const isVisible = changeSize !== 0;
    for(let row = 1; row <= (this as any)[gId].getHeaderRowCount(); row++) {
        const tempHeaderCell = _grid._getHeaderCell(row, targetCol);
        tempHeaderCell.cColVisible = isVisible;
        (this as any).reConnectedCallbackElement(tempHeaderCell);
    }
    for(let row = 1; row <= (this as any)[gId].getRowCount(); row++) {
        _grid._getCell(row, targetCol).cColVisible = isVisible;
    }
    for(let row = 1; row <= (this as any)[gId].getFooterRowCount(); row++) {
        const tempFooterCell = _grid._getFooterCell(row, targetCol);
        tempFooterCell.cColVisible = isVisible;
        (this as any).reConnectedCallbackElement(tempFooterCell);
    }
    
    const header = _grid._getHeader();
    const body = _grid._getBody();
    const footer = _grid._getFooter();

    const styleGridTemplateColumnsArr = header.style.gridTemplateColumns.split(' ');
    const oldColWidth = styleGridTemplateColumnsArr[targetCol - 1];
    const newColWidth = changeSize + (this as any).extractNumberAndUnit(oldColWidth).unit;
    styleGridTemplateColumnsArr[targetCol - 1] = newColWidth;
    const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
    header.style.gridTemplateColumns = styleGridTemplateColumns;
    body.style.gridTemplateColumns = styleGridTemplateColumns;
    footer.style.gridTemplateColumns = styleGridTemplateColumns;
},
modifyCellValue (cell: Cell, value: any, records: CellRecord[], isMethodCalled = false) {
    const _grid = (this as any)[cell.gId];
    if (!isMethodCalled) {
        if (!(this as any).isCellVisible(cell)) return;
        if (cell.cUntarget || cell.cLocked) return;
    }
    value = (this as any).getValidValue(cell, value);
    if (cell.cValue === value) return;

    const oldValue = cell.cValue;
    const newValue = value;
    
    if (records && Array.isArray(records)) {
        records.push({
            'cell' : cell,
            'oldValue' : oldValue,
            'newValue' : newValue,
        })
    }
    
    if(!_grid.getRowStatus(cell.row)) _grid.setRowStatus(cell.row, 'U');
    cell.cValue  = value; 
    utils.reConnectedCallbackElement(cell);
    (this as any).reloadGridWithModifyCell(cell.gId, cell.cIndex);
},
modifyCell () {
    if (!(this as any).activeGridEditor) return;
    let cell = (this as any).activeGridEditor.parentNode;
    if (cell.cUntarget || cell.cLocked) return;
    (this as any).editNewValue = (this as any).activeGridEditor.value;
    Object.keys(vg.dataType).forEach((key) => {
        if(cell.cDataType === key) {
            if(vg.dataType[key].getEditedValue) {
                if(typeof vg.dataType[key].getEditedValue !== 'function') throw new Error('getEditedValue must be a function.');
                (this as any).editNewValue = vg.dataType[key].getEditedValue((this as any).activeGridEditor, (this as any)[cell.gId].__getData(cell));
            }
            else {
                (this as any).editNewValue = (this as any).editOldValue;
            }
        }
    });
    (this as any).removeGridEditor();
    if ((this as any).doEventWithCheckChanged(cell.gId, '_onBeforeChange', cell.row, cell.cId, (this as any).editOldValue, (this as any).editNewValue) === false) {
        return false;
    }
    const value = (this as any).editNewValue;
    const records = (this as any).getRecordsWithModifyValue(cell, value);
    (this as any).recordGridModify(cell.gId, records);
    (this as any).doEventWithCheckChanged(cell.gId, '_onAfterChange', cell.row, cell.cId, (this as any).editOldValue, (this as any).editNewValue);
    return;
},
sort (gId: string, arr: Record<string, any>[], id: string, isAsc = true, isNumSort = false): Record<string, any>[] {
    const copiedArr = (this as any).deepCopy(arr);
    const _grid = (this as any)[gId];
    
    copiedArr.sort((a: Record<string, any>, b: Record<string, any>) => {
        const aItem = a.find((item: Record<string, any>) => item.id === id);
        const bItem = b.find((item: Record<string, any>) => item.id === id);
        let aValue = aItem ? aItem.value : null
        const aDataType = aItem ? aItem.dataType : null
        let bValue = bItem ? bItem.value : null
        const bDataType = bItem ? bItem.dataType : null
        
        let _isNumSort = isNumSort;
        if (typeof aValue === 'number' || typeof bValue === 'number') _isNumSort = true;

        if (aValue === _grid.info.gNullValue) aValue = null;
        if (bValue === _grid.info.gNullValue) bValue = null;

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
                        aValue = aItem.text
                    }
                }
                if(bDataType === key) {
                    if(vg.dataType[key].getSortValue) {
                        if(typeof vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                        bValue = vg.dataType[key].getSortValue(bValue);
                    }
                    else {
                        bValue = bItem.text
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
    _grid.variables._sortToggle[id] = isAsc;
    return copiedArr;
},
setFilterOptions (select: any, options: any) {
    const selectedValue = select.value;
    (this as any).removeAllChild(select);
    options.forEach((opt: any) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        select.appendChild(option); 
    });
    if (selectedValue) {
        select.value = selectedValue;
    }
},
reloadFilterValue (gId: string, colId: number | string) {
    const _grid = (this as any)[gId];
    if (!_grid || !_grid.info.gFilterable) return;
    const colInfo = _grid.__getColInfo(colId);
    if (!colInfo.cFilterable) return;

    colInfo.cFilterValues = new Set();
    for(let r = 1; r <= _grid.getRowCount(); r++) {
        let filterValue;
        let tempCell = _grid._getCell(r, colInfo.cIndex);
        if (!tempCell || !tempCell.cRowVisible || !tempCell.cColVisible) continue;
        filterValue = (this as any).getCellText(tempCell);

        Object.keys(vg.dataType).forEach((key) => {
            if(tempCell.cDataType === key) {
                if(vg.dataType[key].getFilterValue) {
                    if(typeof vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                    filterValue = vg.dataType[key].getFilterValue(tempCell.cValue);
                }
            }
        });

        if(filterValue === '' || filterValue === null || filterValue === undefined || filterValue === _grid.info.gNullValue) filterValue = '$$NULL';
        colInfo.cFilterValues.add(filterValue);
    }
    (this as any).reloadFilter(gId, colId);
},
reloadFilter (gId: string, colId: string) {
    const _grid = (this as any)[gId];
    const filterSelect = _grid.__getHeaderFilter(colId);
    if (!filterSelect) return;
    const colInfo = _grid.__getColInfo(colId);
    const filterValues = colInfo.cFilterValues;
    const dataType = colInfo.cDataType;
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
        if (value === '$$NULL') option.text = _grid.info.gNullValue;
        if (dataType === 'checkbox') {
            option.text = value === _grid.info.gCheckedValue ? '☑' : '☐';
        }
        options.push(option);
    });

    const selectedValue = filterSelect.value;
    (this as any).removeAllChild(filterSelect);
    options.forEach((opt: any) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        filterSelect.appendChild(option); 
    });
    if (selectedValue) {
        filterSelect.value = selectedValue;
        colInfo.cFilterValue = selectedValue;
    }
},
reloadColForMerge (gId: string, colIndex: number) {
    const _grid = (this as any)[gId];
    const colInfo = _grid.__getColInfo(colIndex);
    let preCell, nowCell;
    let r, c;
    
    if (colInfo.cRowMerge) {
        c = colInfo.cIndex;
        
        for(r = 1; r <= _grid.getRowCount(); r++) {
            nowCell = _grid._getCell(r, c);
            delete nowCell.rowSpan;
            delete nowCell.rowMerge;
            delete nowCell.colSpan;
            delete nowCell.colMerge;
        }
        
        for(r = 2; r <= _grid.getRowCount(); r++) {
            preCell = _grid._getCell(r - 1, c);
            nowCell = _grid._getCell(r, c);
            if (preCell
                && (this as any).isCellVisible(preCell)
                && preCell.cDataType === nowCell.cDataType
                && (this as any).getCellText(preCell) === (this as any).getCellText(nowCell)
            ) {
                for(let rSpan = preCell.row - 1; rSpan > 0; rSpan--) {
                    preCell = _grid._getCell(rSpan, c);
                    if (preCell.rowMerge !== true) {
                        preCell.rowSpan = (this as any).nvl(preCell.rowSpan, 1) + 1;
                        break;
                    }
                }
                nowCell.rowMerge = true;
            }
        }
        
        for(r = 1; r <= _grid.getRowCount(); r++) {
            nowCell = _grid._getCell(r, c);
            (this as any).reConnectedCallbackElement(nowCell);
        }
    }
    if (colInfo.cColMerge && !_grid.__getColInfo(colIndex - 1).cRowMerge) {
        const cells = _grid._getCells();
        
        for(r = 1; r <= _grid.getRowCount(); r++) {
            for(c = colInfo.cIndex - 1; c <= colInfo.cIndex; c++) {
                nowCell = _grid._getCell(r, c);
                delete nowCell.rowSpan;
                delete nowCell.rowMerge;
                delete nowCell.colSpan;
                delete nowCell.colMerge;
            }
        }
        
        c = colInfo.cIndex;
        for(r = 1; r <= _grid.getRowCount(); r++) {
            preCell = cells[r - 1][c - 2]
            nowCell = cells[r - 1][c - 1]
            if (preCell
                && (this as any).isCellVisible(preCell)
                && preCell.cDataType === nowCell.cDataType
                && (this as any).getCellText(preCell) === (this as any).getCellText(nowCell)
            ) {
                for(let cSpan = preCell.col - 1; cSpan > 2; cSpan--) {
                    preCell = cells[r - 1][cSpan];
                    if (preCell.colMerge !== true) {
                        preCell.colSpan = (this as any).nvl(preCell.colSpan, 1) + 1;
                        break;
                    }
                }
                nowCell.colMerge = true;
            }
        }
        
        for(r = 1; r <= _grid.getRowCount(); r++) {
            for(c = colInfo.cIndex - 1; c <= colInfo.cIndex; c++) {
                nowCell = _grid._getCell(r, c);
                (this as any).reConnectedCallbackElement(nowCell);
            }
        }
    }
},
reloadGridWithModifyCell (gId: string, colIndex: number) {
    (this as any).reloadFooterValue(gId);
    (this as any).reloadFilterValue(gId, colIndex);
    const nextColInfo = (this as any)[gId].__getColInfo(colIndex + 1);
    if (nextColInfo && nextColInfo.cColMerge) {
        (this as any).reloadColForMerge(gId, colIndex + 1);
    }
    else {
        (this as any).reloadColForMerge(gId, colIndex);
    }
},
reloadGridForMerge (gId: string) {
    for(let c = 3; c <= (this as any)[gId].getColCount(); c++) {
        (this as any).reloadColForMerge(gId, c);
    }
},
reloadFooterValue (gId: string) {
    const _grid = (this as any)[gId];
    const footerCells = _grid._getFooterCells();
    for(const footers of footerCells) {
        for(const footerCell of footers) {
            if (footerCell.cFooter !== null && footerCell.cFooter !== undefined) {
                (this as any).reConnectedCallbackElement(footerCell);
            }
        }
    }
},
setGridDataRowCol (el: Cell, row: number, col: number) {
    el.row = row;
    el.col = col;
    el.cIndex = col;
    (this as any).setGridDataPosition(el);
},
setGridDataPosition (el: Cell) {
    const row = el.row;
    const col = el.col;
    el.style.gridRowStart = String(row);
    el.style.gridRowEnd = String(row + 1);
    el.style.gridColumnStart = String(col);
    el.style.gridColumnEnd = String(col + 1);
},
getGridCell (gId: string, colInfo: CellColInfo, valueOrData: any, rowCount: number, colCount: number): Cell {
    let data, dataKey, tempData;

    if (valueOrData && valueOrData.constructor === Object) {
        data = {
            value : valueOrData[colInfo.cId]
        };
    }
    else if (valueOrData && Array.isArray(valueOrData)) {
        for(tempData of valueOrData) {
            if (tempData.id === colInfo.cId) {
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

    const tempGridData = document.createElement('v-g-d') as any;
    tempGridData.gId = gId;
    tempGridData.gType = 'gbd';

    Object.keys(colInfo).forEach(key => {
        if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue','cIndex'].indexOf(key) < 0) {
            dataKey = key.charAt(1).toLowerCase() + key.slice(2);
            tempGridData[key] = dataKey in data ? data[dataKey] : colInfo[key as keyof CellColInfo];
        }
    });
    switch (tempGridData.cId) {
        case 'v-g-rownum':
            tempGridData.cValue = rowCount;
            break;
        case 'v-g-status':
            tempGridData.cValue = utils.getCodeValue(['C','U','D'], null, data.value);
            break;
        default:
            tempGridData.cValue = utils.getValidValue(tempGridData, data.value);
            break;
    }
    if (colInfo.cFilterable && tempGridData.cColVisible) colInfo.cFilterValues!.add(tempGridData.textContent);
    (this as any).setGridDataRowCol(tempGridData, rowCount, colCount);
    return tempGridData as Cell;
},
