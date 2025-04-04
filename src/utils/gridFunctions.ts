grid.__getDefaultColInfo = (newColInfo: ColInfo, isAdd = false): CellColInfo => {
    if (!newColInfo || !newColInfo.id) throw new Error('Column ID is required.');
    if (isAdd) {
        for(const colInfo of colInfos) {
            if (newColInfo.id === colInfo.cId)  throw new Error('Column ID is primary key.');
        }
    }

    const resultnewColInfo: CellColInfo = {
        cId: newColInfo.id,
        cName : newColInfo.name ? newColInfo.name : newColInfo.id,
        cIndex : null,
        cHeader : null,
        cFooter : null,
        cFilterValue : null,

        cUntarget : newColInfo.untarget ?  newColInfo.untarget : grid.info.gSelectionPolicy === 'none',
        cRowMerge : newColInfo.rowMerge ?  newColInfo.rowMerge : vg.defaultColInfo.rowMerge,
        cColMerge : newColInfo.colMerge ?  newColInfo.colMerge : vg.defaultColInfo.colMerge,
        cColVisible : newColInfo.colVisible ?  newColInfo.colVisible : vg.defaultColInfo.colVisible,
        cRequired : newColInfo.required ?  newColInfo.required : vg.defaultColInfo.required,
        cResizable : newColInfo.resizable ?  newColInfo.resizable : vg.defaultColInfo.resizable,
        cSortable : newColInfo.sortable ?  newColInfo.sortable : vg.defaultColInfo.sortable,
        cFilterable : newColInfo.filterable ?  newColInfo.filterable : vg.defaultColInfo.filterable,
        cOriginWidth : newColInfo.originWidth ?  newColInfo.originWidth : vg.defaultColInfo.originWidth,
        cDataType : newColInfo.dataType ?  newColInfo.dataType : vg.defaultColInfo.dataType,
        cSelectSize : newColInfo.selectSize ?  newColInfo.selectSize : vg.defaultColInfo.selectSize,
        cLocked : newColInfo.locked ?  newColInfo.locked : grid.info.gLocked,
        cLockedColor : newColInfo.lockedColor ?  newColInfo.lockedColor : grid.info.gLockedColor,
        cFormat : newColInfo.format ?  newColInfo.format : vg.defaultColInfo.format,
        cCodes : newColInfo.codes ?  newColInfo.codes : vg.defaultColInfo.codes,
        cDefaultCode : newColInfo.defaultCode ?  newColInfo.defaultCode : vg.defaultColInfo.defaultCode,
        cMaxLength : newColInfo.maxLength ?  newColInfo.maxLength : vg.defaultColInfo.maxLength,
        cMaxByte : newColInfo.maxByte ?  newColInfo.maxByte : vg.defaultColInfo.maxByte,
        cMaxNumber : newColInfo.maxNumber ?  newColInfo.maxNumber : vg.defaultColInfo.maxNumber,
        cMinNumber : newColInfo.minNumber ?  newColInfo.minNumber : vg.defaultColInfo.minNumber,
        cRoundNumber : newColInfo.roundNumber ?  newColInfo.roundNumber : vg.defaultColInfo.roundNumber,

        cAlign : newColInfo.align ?  newColInfo.align : vg.defaultColInfo.align,
        cVerticalAlign : newColInfo.verticalAlign ?  newColInfo.verticalAlign : vg.defaultColInfo.verticalAlign,
        cOverflowWrap : newColInfo.overflowWrap ?  newColInfo.overflowWrap : vg.defaultColInfo.overflowWrap,
        cWordBreak : newColInfo.wordBreak ?  newColInfo.wordBreak : vg.defaultColInfo.wordBreak,
        cWhiteSpace : newColInfo.whiteSpace ?  newColInfo.whiteSpace : vg.defaultColInfo.whiteSpace,
        cBackColor : newColInfo.backColor ?  newColInfo.backColor : vg.defaultColInfo.backColor,
        cFontColor : newColInfo.fontColor ?  newColInfo.fontColor : vg.defaultColInfo.fontColor,
        cFontBold : newColInfo.fontBold ?  newColInfo.fontBold : vg.defaultColInfo.fontBold,
        cFontItalic : newColInfo.fontItalic ?  newColInfo.fontItalic : vg.defaultColInfo.fontItalic,
        cFontThruline : newColInfo.fontThruline ?  newColInfo.fontThruline : vg.defaultColInfo.fontThruline,
        cFontUnderline : newColInfo.fontUnderline ?  newColInfo.fontUnderline : vg.defaultColInfo.fontUnderline,
        
        cRowVisible : true,
        cFilterValues : new Set(),
        cFilter : false,
    };
    if (newColInfo.header && (typeof newColInfo.header === 'string')) {
        resultnewColInfo.cHeader = (newColInfo.header as string).split(';');
    }
    else {
        resultnewColInfo.cHeader = new Array(grid.getHeaderRowCount());
        resultnewColInfo.cHeader[0] = newColInfo.id;
    }
    if (newColInfo.footer && (typeof newColInfo.footer === 'string')) {
        resultnewColInfo.cFooter = (newColInfo.footer as string).split(';');
    }
    resultnewColInfo.cFilterValue = resultnewColInfo.cFilterable ? '$$ALL' : null;
    
    return resultnewColInfo;
};
grid.__getColInfo = (colIndexOrColId: string | number, useError = false): CellColInfo | null => {
    let returncolInfo;
    if (typeof colIndexOrColId === 'number') {
        returncolInfo = colInfos[colIndexOrColId - 1];
    }
    else {
        for(const colInfo of colInfos) {
            if (colInfo.cId === colIndexOrColId) {
                returncolInfo = colInfo;
            }
        }
    }
    if (!returncolInfo) {
        if (useError) {
            throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
        }
        else {
            return null;
        }
    }
    return returncolInfo;
};
grid.__getColIndex = (colIndexOrColId: number | string, useError = false): number | null => {
    if (typeof colIndexOrColId === 'number') {
        if(useError) grid.__checkColIndex(colIndexOrColId);
        return colIndexOrColId;
    }
    for(const colInfo of colInfos) {
        if (colInfo.cId === colIndexOrColId) {
            return colInfo.cIndex;
        }
    }
    if (useError) {
        throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
    }
    else {
        return null;
    }
}
grid.__setGridColSize = () => {
    const styleGridTemplateColumnsArr = [];
    
    for(const colInfo of colInfos) {
        styleGridTemplateColumnsArr.push(colInfo.cColVisible ? colInfo.cOriginWidth : '0px');
    }
    const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
    if (styleGridTemplateColumns.includes('%') && grid.info.gFrozenColCount !== 0) {
        throw new Error(gId + ' has error. If you set the horizontal size to a percentage, property A is not available.');
    }
    gridHeader.style.gridTemplateColumns = styleGridTemplateColumns;
    gridBody.style.gridTemplateColumns = styleGridTemplateColumns;
    gridFooter.style.gridTemplateColumns = styleGridTemplateColumns;
};
grid._getCellChildNode = (cell: Cell): HTMLElement | null => {
    if (!cell) return null;
    let childNode: any;
    switch (cell.cDataType) {
        case 'text':
            childNode = document.createElement('span');
            childNode.classList.add(gId + '_data-value-text');
            childNode.innerText = cell.cValue;
            childNode.nType = 'text';
            break;
        case 'number':
            childNode = document.createElement('span');
            childNode.classList.add(gId + '_data-value-number');
            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) childNode.innerText = grid.info.gNullValue;
            else childNode.innerText = utils.getFormatNumberFromCell(cell);
            childNode.nType = 'number';
            break;
        case 'mask':
            childNode = document.createElement('span');
            childNode.classList.add(gId + '_data-value-mask');
            childNode.innerText = cell.cValue;
            childNode.nType = 'mask';
            break;
        case 'date':
            childNode = document.createElement('span');
            childNode.classList.add(gId + '_data-value-date');
            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) childNode.innerText = grid.info.gNullValue;
            else childNode.innerText = utils.getDateWithGridDateFormat(cell);
            childNode.nType = 'date';
            break;
        case 'month':
            childNode = document.createElement('span');
            childNode.classList.add(gId + '_data-value-month');
            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) childNode.innerText = grid.info.gNullValue;
            else childNode.innerText = utils.getDateWithGridMonthFormat(cell);
            childNode.nType = 'month';
            break;
        case 'select':
            if (Array.isArray(cell.cValue) && cell.cValue.length > 0) {
                childNode = document.createElement('select');
                childNode.classList.add(gId + '_data-value-select');
                childNode.addEventListener('change', function (e: any) { utils.selectAndCheckboxOnChange(e.target); });
                utils.setSelectOptions(childNode, cell.cValue);
                childNode.nType = 'select';
                if (cell.cSelectSize) childNode.style.width = cell.cSelectSize;
            }
            else {
                childNode = document.createElement('span');
                childNode.classList.add(gId + '_data-value-text');
                childNode.innerText = grid.info.gNullValue;
                childNode.nType = 'text';
            }
            break;
        case 'checkbox':
            childNode = document.createElement('input');
            childNode.classList.add(gId + '_data-value-checkbox');
            childNode.addEventListener('change', function (e: any) { utils.selectAndCheckboxOnChange(e.target); });
            childNode.type = 'checkbox';
            childNode.nType = 'checkbox';
            if (utils.getCheckboxCellTrueOrFalse(cell)) childNode.setAttribute('checked','');
            break;
        case 'button':
            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) {
                childNode = document.createElement('span');
                childNode.classList.add(gId + '_data-value-text');
                childNode.innerText = grid.info.gNullValue;
                childNode.nType = 'text';
            }
            else {
                childNode = document.createElement('button');
                childNode.classList.add(gId + '_data-value-button');
                childNode.innerText = cell.cValue;
                childNode.nType = 'button';
                childNode.addEventListener('touchstart', function() {
                    childNode.classList.add('active');
                });
                childNode.addEventListener('touchend', function() {
                    childNode.classList.remove('active');
                });
            }
            break;
        case 'link':
            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) {
                childNode = document.createElement('span');
                childNode.classList.add(gId + '_data-value-text');
                childNode.innerText = grid.info.gNullValue;
                childNode.nType = 'text';
            }
            else {
                childNode = document.createElement('a');
                childNode.classList.add(gId + '_data-value-link');
                childNode.innerText = cell.cValue.text;
                childNode.setAttribute('href', cell.cValue.value);
                childNode.setAttribute('target', cell.cValue.target ? cell.cValue.target : '_blank');
                childNode.nType = 'link';
            }
            break;
        case 'code':
            childNode = document.createElement('span');
            childNode.classList.add(gId + '_data-value-code');
            childNode.innerText = cell.cValue;
            childNode.nType = 'code';
            break;
        default:
            if(vg.dataType) {
                Object.keys(vg.dataType).forEach((key) => {
                    if(key === cell.cDataType) {
                        if(vg.dataType[key].getChildNode) {
                            if(typeof vg.dataType[key].getChildNode !== 'function') throw new Error('getChildNode must be a function.');
                            childNode = vg.dataType[key].getChildNode(grid.__getData(cell));
                            if(childNode) {
                                if(!(childNode instanceof HTMLElement) || childNode.nodeType !== 1)  throw new Error('getChildNode must return an html element.');
                            }
                            else {
                                childNode = document.createElement('span');
                                childNode.innerText = cell.cValue;
                            }
                        }
                        else {
                            childNode = document.createElement('span');
                            childNode.innerText = cell.cValue;
                        }
                        childNode.classList.add(gId + '_data-value-' + key);
                        childNode.nType = key;
                    }
                });
            }
            break;
    }
    childNode.classList.add(gId + '_data-value');
    childNode.gType = 'gbdv';
    return childNode;
};
grid.__loadHeader = () => {
    grid.__setGridColSize();
    utils.removeAllChild(gridHeader);
    gridHeaderCells.length = 0;

    for(let rowCount = 1; rowCount <= grid.getHeaderRowCount(); rowCount++) {
        tempRows = [];
        colCount = 1;
        for(const colInfo of colInfos) {
            tempGridData = document.createElement('v-g-d') as any;
            tempGridData.gId = gId;
            tempGridData.gType = 'ghd';
            Object.keys(colInfo).forEach(key => {
                if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue','cIndex'].indexOf(key) < 0) {
                    (tempGridData as any)[key] = colInfo[key as keyof CellColInfo];
                }
            });
            if (Array.isArray(colInfo.cHeader)) {
                tempGridData.cValue = colInfo.cHeader[rowCount - 1] ? colInfo.cHeader[rowCount - 1].replaceAll('\\n','\n') : '';
            }
            else {
                tempGridData.cValue = colInfo.cHeader;
            }
            utils.setGridDataRowCol(tempGridData, rowCount, colCount);
            if (colCount !== 1) {
                if (!colInfo.cHeader![rowCount - 1]) { 
                    
                    for(let r = rowCount - 2; r >= 0; r--) {
                        if (colInfo.cHeader![r]) tempGridData.rowMerge = true;
                    }
                    
                    if (!tempGridData.rowMerge) {
                        for(let c = colCount - 2; c >= 0; c--) {
                            if (colInfos[c].cHeader![rowCount - 1]) tempGridData.colMerge = true;
                        }
                    }
                }
            }
            else { 
                if (rowCount !== 1) tempGridData.rowMerge = true;
            }
            tempGridData.addEventListener('mousemove', function (e: any) {
                if (e.target.style.cursor) this.style.removeProperty('cursor');
                if (!(utils as any)[e.target.gId] || !(utils as any)[e.target.gId].info.gResizable) return;
                if (e.target.gType !== 'ghd') return;
                const { left, right } = e.target.getBoundingClientRect();
                const mouseX = e.clientX;
                let deltaX;
                let targetCell;
                if (mouseX - left < 20) {
                    if (e.target.col <= 3) return;
                    if (e.target.frozenCol) return;
                    for(let col = e.target.col - 1; col > 1; col--) {
                        targetCell = (utils as any)[gId]._getHeaderCell(1, col);
                        if (targetCell.cColVisible === true) break;
                    }
                    if (!targetCell.cResizable) return;

                    e.target.style.cursor = 'ew-resize';
                    utils.onHeaderDragging = true;

                    if (utils.isHeaderDragging) {
                        deltaX = mouseX - utils.mouseX;
                        utils.modifyColSize(e.target.gId, targetCell, deltaX);
                        utils.mouseX = mouseX;
                    }
                }
                else if (right - mouseX < 20) {
                    
                    if (e.target.col < 3) return;
                    if (e.target.frozenCol) return;
                    for(let col = e.target.col; col > 1; col--) {
                        targetCell = (utils as any)[gId]._getHeaderCell(1, col);
                        if (targetCell.cColVisible === true) break;
                    }
                    if (!targetCell.cResizable) return;
                    
                    e.target.style.cursor = 'ew-resize';
                    utils.onHeaderDragging = true;
                    if (utils.isHeaderDragging) {
                        deltaX = mouseX - utils.mouseX;
                        utils.modifyColSize(e.target.gId, targetCell, deltaX);
                        utils.mouseX = mouseX;
                    }
                } else {
                    
                    e.target.style.cursor = '';
                    utils.onHeaderDragging = false;
                }
            });

            tempGridData.addEventListener('mousedown', function (e) {
                utils.mouseX = e.clientX;
                if (utils.onHeaderDragging) {
                    utils.isHeaderDragging = true;
                }
            });

            tempRows.push(tempGridData);
            colCount++;
        }
        gridHeaderCells.push(tempRows);
    }

    for(const row of gridHeaderCells) {
        for(const cell of row) {
            gridHeader.append(cell);
        }
    }
}
grid._getHeaderRow = (rowIndex: number): Cell[] => {
    return utils.getArrayElementWithBoundCheck(gridHeaderCells, rowIndex - 1);
};
grid._getHeaderCell = (rowIndex: number, colIndexOrColId: number | string): Cell => {
    if (typeof colIndexOrColId === 'number') {
        return utils.getArrayElementWithBoundCheck(grid._getHeaderRow(rowIndex), colIndexOrColId - 1);
    }
    else {
        for(const cell of grid._getHeaderRow(rowIndex)) {
            if (cell.cId === colIndexOrColId) return cell;
        }
    }
    throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
};
grid._getHeaderCells = () => {
    return gridHeaderCells;
};
grid.__getHeaderFilter = (colIndexOrColId: number | string): any => {
    const colIndex = grid.__getColIndex(colIndexOrColId);
    if (!colInfos[colIndex - 1].cFilterable)  return null;
    let headerCell;
    let filterSelect;
    for(let r = 1; r <= grid.getHeaderRowCount(); r++) {
        headerCell = grid._getHeaderCell(r, colIndex);
        if (headerCell) {
            filterSelect = headerCell.querySelectorAll('.' + grid.gId + '_filterSelect');
            if (filterSelect[0]) {
                return filterSelect[0];
            }
        }
    }
    return null;
};
grid.__loadFooter = () => {
    utils.removeAllChild(gridFooter);
    gridFooterCells.length = 0;
    for(let rowCount = 1; rowCount <= grid.getFooterRowCount(); rowCount++) {
        tempRows = [];
        colCount = 1;
        for(colInfo of colInfos) {
            tempGridData = document.createElement('v-g-d') as any;
            tempGridData.gId = gId;
            tempGridData.gType = 'gfd';
            Object.keys(colInfo).forEach(key => {
                if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue','cIndex'].indexOf(key) < 0) {
                    (tempGridData as any)[key] = colInfo[key as keyof CellColInfo];
                }
            });
            if (colInfo.cFooter && colInfo.cFooter[rowCount - 1]) {
                tempGridData.cFooter = colInfo.cFooter[rowCount - 1];
            }
            
            utils.setGridDataRowCol(tempGridData, rowCount, colCount);
            tempRows.push(tempGridData);
            colCount++;
        }
        gridFooterCells.push(tempRows);
    }

    for(const row of gridFooterCells) {
        for(const cell of row) {
            gridFooter.append(cell);
        }
    }
}
grid._getFooterRow = (rowIndex: number) => {
    return utils.getArrayElementWithBoundCheck(gridFooterCells, rowIndex - 1);
};
grid._getFooterCell = (rowIndex: number, colIndexOrColId: number | string) => {
    if (typeof colIndexOrColId === 'number') {
        return utils.getArrayElementWithBoundCheck(grid._getFooterRow(rowIndex), colIndexOrColId - 1);
    }
    else {
        for(const cell of grid._getFooterRow(rowIndex)) {
            if (cell.cId === colIndexOrColId) return cell;
        }
    }
    throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
};
grid._getFooterCells = () => {
    return gridFooterCells;
};
grid._getRow = (rowIndex: number) => {
    return gridBodyCells[rowIndex - 1];
};
grid._getCell = (rowIndex: number, colIndexOrColId: number | string) => {
    try {
        if (typeof colIndexOrColId === 'number') {
            return gridBodyCells[rowIndex - 1][colIndexOrColId - 1];
        }
        else {
            for(const cell of gridBodyCells[rowIndex - 1]) {
                if (cell.cId === colIndexOrColId) return cell;
            }
        }
    } catch (error) {
        return null;
    }
    return null;
};
grid._getCells = () => {
    return gridBodyCells;
};
grid.__gridBodyCellsReConnected = () => {
    if (!grid.variables._isDrawable) return;
    for(const row of gridBodyCells) {
        for(const cell of row) {
            utils.reConnectedCallbackElement(cell);
        }
    }
};
grid.__mountGridBodyCell = () => {
    if (!grid.variables._isDrawable) return;
    utils.removeAllChild(gridBody);
    for(const row of gridBodyCells) {
        for(const cell of row) {
            gridBody.append(cell);
        }
    }
    
    utils.reloadGridForMerge(gId);
    
    grid.reloadFilterValue();
    
    grid.reloadFooterValue();
};
grid.__clear = () => {
    gridBodyCells.length = 0;
    grid.variables._activeRows = [];
    grid.variables._activeCols = [];
    grid.variables._activeCells = [];
    grid.variables._targetCell = null;
    grid.variables._recodes = [];
    grid.variables._recodeseq = 0;
};
grid.__checkRowIndex = (row: number) => {
    row = utils.validatePositiveIntegerAndZero(row);
    if (!row || row < 1 || row > grid.getRowCount()) throw new Error('Please insert a row of valid range.');
}
grid.__checkColRownumOrStatus = (colIndexOrColId: number | string) => {
    if(typeof colIndexOrColId === 'number') {
        if (colIndexOrColId <= 2) throw new Error('The row number or status columns info cannot be modified.');
    }
    else {
        if(colIndexOrColId === 'v-g-rownum' || colIndexOrColId === 'v-g-status') throw new Error('The row number or status columns info cannot be modified.');
    }
}
grid.__checkColIndex = (col: number) => {
    col = utils.validatePositiveIntegerAndZero(col);
    if (!col || col < 1 || col > grid.getColCount()) throw new Error('Please insert a col of valid range.');
}
grid.___getDatasWithoutExceptedProperty = (exceptedProperty = []) => {
    const datas = [];
    let cols;
    for(const rows of gridBodyCells) {
        cols = [];
        for(const cell of rows) {
            const data = grid.__getData(cell, exceptedProperty);
            cols.push(data);
        }
        datas.push(cols);
    }
    return datas;
};
grid._doFilter = () => {
    grid.variables._filters = [];
    let filter;
    grid._getHeader().querySelectorAll('.' + gId + '_filterSelect').forEach(function (filterSelect: any) {
        if (filterSelect.value !== '$$ALL') {
            filter = {
                cId : filterSelect.cId,
                value : filterSelect.value,
            };
            grid.__getColInfo(filterSelect.parentNode.parentNode.cIndex).cFilterValue = filterSelect.value;
            if (filter.value === '$$NULL' || filter.value === null || filter.value === undefined || filter.value === '') filter.value = grid.info.gNullValue;
            grid.variables._filters.push(filter);
        }
    });

    if (grid.variables._filters.length === 0) {
        grid._getCells().forEach(function (cells: any) {
            cells.forEach(function (cell: any) {
                cell.cFilter = false;
            })
        })
    }
    else {
        let rowCount = 1;
        grid._getCells().forEach(function (cells: any) {
            let _isFilter = false;
            cells.forEach(function (cell: any) {
                grid.variables._filters.forEach(function (filter: any) {
                    if (cell.cId === filter.cId) {
                        let cellValue: any = utils.getCellText(cell);

                        Object.keys(vg.dataType).forEach((key) => {
                            if(cell.cDataType === key) {
                                if(vg.dataType[key].getFilterValue) {
                                    if(typeof vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                                    cellValue = vg.dataType[key].getFilterValue(cell.cValue);
                                }
                            }
                        });
                        
                        if (cellValue != filter.value) _isFilter = true;
                    }
                });
            });
            grid._getRow(rowCount).forEach(function (filterCell: any) {
                filterCell.cFilter = _isFilter;
            })
            rowCount++;
        });
    }
    grid.load(grid.getDatas());
};
grid.__gridCellReConnectedWithControlSpan = (cell: Cell) => {
    utils.reConnectedCallbackElement(cell);
    if(cell.rowSpan) {
        for(let row = cell.row + 1; row < cell.row + cell.rowSpan; row++) {
            grid.__gridCellReConnectedWithControlSpan(grid._getCell(row, cell.col));
        }
    }
    if(cell.colSpan) {
        for(let col = cell.col + 1; col < cell.col + cell.colSpan; col++) {
            grid.__gridCellReConnectedWithControlSpan(grid._getCell(cell.row, col));
        }
    }
};
grid.__getData = (cell: Cell, exceptedProperty: string[] = []): CellData => {
    const data: any = {};
    data.gridId = gId;
    data.gridName = grid.info.gName;
    data.id = cell.cId;
    data.index = cell.cIndex;
    data.name = cell.cName;
    data.row = cell.row;
    data.col = cell.col;
    data.untarget = cell.cUntarget;
    data.colVisible = cell.cColVisible;
    data.rowVisible = cell.cRowVisible;
    data.required = cell.cRequired;
    data.resizable = cell.cResizable;
    data.originWidth = cell.cOriginWidth;
    data.dataType = cell.cDataType;
    data.selectSize = cell.cSelectSize;
    data.locked = cell.cLocked;
    data.lockedColor = cell.cLockedColor;
    data.format = cell.cFormat;
    data.codes = utils.deepCopy(cell.cCodes);
    data.defaultCode = cell.cDefaultCode;
    data.maxLength = cell.cMaxLength;
    data.maxByte = cell.cMaxByte;
    data.maxNumber = cell.cMaxNumber;
    data.minNumber = cell.cMinNumber;
    data.roundNumber = cell.cRoundNumber;
    data.align = cell.cAlign;
    data.verticalAlign = cell.cVerticalAlign;
    data.overflowWrap = cell.cOverflowWrap;
    data.wordBreak = cell.cWordBreak;
    data.whiteSpace = cell.cWhiteSpace;
    data.backColor = cell.cBackColor;
    data.fontColor = cell.cFontColor;
    data.fontBold = cell.cFontBold;
    data.fontItalic = cell.cFontItalic;
    data.fontThruline = cell.cFontThruline;
    data.fontUnderline = cell.cFontUnderline;
    data.value = utils.deepCopy(cell.cValue);
    data.filter = utils.deepCopy(cell.cFilter);

    if (exceptedProperty) {
        if (exceptedProperty.indexOf('untarget') >= 0) delete data.untarget;
        if (exceptedProperty.indexOf('colVisible') >= 0) delete data.colVisible;
        if (exceptedProperty.indexOf('rowVisible') >= 0) delete data.rowVisible;
        if (exceptedProperty.indexOf('required') >= 0) delete data.required;
        if (exceptedProperty.indexOf('resizable') >= 0) delete data.resizable;
        if (exceptedProperty.indexOf('originWidth') >= 0) delete data.originWidth;
        if (exceptedProperty.indexOf('dataType') >= 0) delete data.dataType;
        if (exceptedProperty.indexOf('selectSize') >= 0) delete data.selectSize;
        if (exceptedProperty.indexOf('locked') >= 0) delete data.locked;
        if (exceptedProperty.indexOf('lockedColor') >= 0) delete data.lockedColor;
        if (exceptedProperty.indexOf('format') >= 0) delete data.format;
        if (exceptedProperty.indexOf('codes') >= 0) delete data.codes;
        if (exceptedProperty.indexOf('defaultCode') >= 0) delete data.defaultCode;
        if (exceptedProperty.indexOf('maxLength') >= 0) delete data.maxLength;
        if (exceptedProperty.indexOf('maxByte') >= 0) delete data.maxByte;
        if (exceptedProperty.indexOf('maxNumber') >= 0) delete data.maxNumber;
        if (exceptedProperty.indexOf('minNumber') >= 0) delete data.minNumber;
        if (exceptedProperty.indexOf('roundNumber') >= 0) delete data.roundNumber;
        if (exceptedProperty.indexOf('align') >= 0) delete data.align;
        if (exceptedProperty.indexOf('verticalAlign') >= 0) delete data.verticalAlign;
        if (exceptedProperty.indexOf('backColor') >= 0) delete data.backColor;
        if (exceptedProperty.indexOf('fontColor') >= 0) delete data.fontColor;
        if (exceptedProperty.indexOf('fontBold') >= 0) delete data.fontBold;
        if (exceptedProperty.indexOf('fontItalic') >= 0) delete data.fontItalic;
        if (exceptedProperty.indexOf('fontThruline') >= 0) delete data.fontThruline;
        if (exceptedProperty.indexOf('fontUnderline') >= 0) delete data.fontUnderline;
        if (exceptedProperty.indexOf('value') >= 0) delete data.value;
        if (exceptedProperty.indexOf('filter') >= 0) delete data.filter;
    }
    data.text = utils.getCellText(cell);
    return data;
};
grid.__setCellData = (row: number, colIndexOrColId: number | string, cellData: CellData, isImmutableColCheck = true) => {
    grid.__checkRowIndex(row);
    const colIndex = grid.__getColIndex(colIndexOrColId, true);
    if (colIndex <= 2) {
        if (isImmutableColCheck) throw new Error('The row number or status columns are immutable.');
        return false;
    }
    const cell = grid._getCell(row, colIndex);
    if (cellData.untarget) cell.cUntarget = cellData.untarget;
    if (cellData.dataType) cell.cDataType = cellData.dataType;
    if (cellData.selectSize) cell.cSelectSize = cellData.selectSize;
    if (cellData.locked) cell.cLocked = cellData.locked;
    if (cellData.lockedColor) cell.cLockedColor = cellData.lockedColor;
    if (cellData.format) cell.cFormat = cellData.format;
    if (cellData.codes) cell.cCodes = cellData.codes;
    if (cellData.defaultCode) cell.cDefaultCode = cellData.defaultCode;
    if (cellData.maxLength) cell.cMaxLength = cellData.maxLength;
    if (cellData.maxByte) cell.cMaxByte = cellData.maxByte;
    if (cellData.maxNumber) cell.cMaxNumber = cellData.maxNumber;
    if (cellData.minNumber) cell.cMinNumber = cellData.minNumber;
    if (cellData.roundNumber) cell.cRoundNumber = cellData.roundNumber;
    if (cellData.value) cell.cValue = cellData.value;
    if (cellData.align) cell.cAlign = cellData.align;
    if (cellData.verticalAlign) cell.cVerticalAlign = cellData.verticalAlign;
    if (cellData.overflowWrap) cell.cOverflowWrap = cellData.overflowWrap;
    if (cellData.wordBreak) cell.cWordBreak = cellData.wordBreak;
    if (cellData.whiteSpace) cell.cWhiteSpace = cellData.whiteSpace;
    if (cellData.backColor) cell.cBackColor = cellData.backColor;
    if (cellData.fontColor) cell.cFontColor = cellData.fontColor;
    if (cellData.fontBold) cell.cFontBold = cellData.fontBold;
    if (cellData.fontItalic) cell.cFontItalic = cellData.fontItalic;
    if (cellData.fontThruline) cell.cFontThruline = cellData.fontThruline;
    if (cellData.fontUnderline) cell.cFontUnderline = cellData.fontUnderline;
    utils.reConnectedCallbackElement(cell);
    utils.reloadGridWithModifyCell(cell.gId, cell.cIndex);
    return true;
};
grid._getDataTypeStyle = () => {
    const dataTypeStyle = {};
    Object.keys(vg.dataType).forEach((key) => {
        if(vg.dataType[key].cellStyle) {
            (dataTypeStyle as any)[key] = vg.dataType[key].cellStyle;
        }
    });
    return dataTypeStyle;
}
grid._getFilterSpan = () => {
    return vg.filterSpan;
}
grid._getFooterFormula = () => {
    return utils.deepCopy(vg.footerFormula);
}
grid._getHeader = () => {
    return gridHeader;
};
grid._getBody = () => {
    return gridBody;
};
grid._getFooter = () => {
    return gridFooter;
};
grid.__loadHeader();
grid.__loadFooter();
