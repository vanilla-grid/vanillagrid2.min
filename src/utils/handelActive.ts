reConnectedCallbackElement (cell: Cell) {
    if (['ghd','gbd','gfd'].indexOf(cell.gType) < 0) return;
    const parent = cell.parentNode;
    if (parent) {
        this.setGridDataPosition(cell);
        parent.removeChild(cell);
        parent.appendChild(cell);
    }
},
selectCell (targetCell: Cell): boolean {
    const gId = targetCell.gId;
    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCell', targetCell.row, targetCell.cId) === false) {
        return false;
    }
    if ((this as any).doEventWithCheckChanged(gId, '_onActiveRow', targetCell.row) === false) {
        return false;
    }
    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCol', targetCell.cId) === false) {
        return false;
    }
    if ((this as any)[gId].info.gSelectionPolicy === 'none') return false;
    (this as any).resetSelection(gId);
    (this as any)[gId].variables._targetCell = targetCell;
    (this as any).selectCells(targetCell, targetCell);
    (this as any).focusCell(targetCell);
    return true;
},
focusCell (targetCell: Cell) {
    const gId = targetCell.gId;
    const gridRect = (this as any)[gId].getBoundingClientRect();
    const header = (this as any)[gId]._getHeader();
    const footer = (this as any)[gId]._getFooter();
    const cellBRect = targetCell.getBoundingClientRect();
    const cellTopPosition = cellBRect.top - gridRect.top - header.clientHeight;
    const cellBottomPosition = cellBRect.bottom - gridRect.top + footer.clientHeight;
    const cellLeftPosition = cellBRect.left - gridRect.left;
    const cellRightPosition = cellBRect.right - gridRect.left;
    if (cellTopPosition < 0) {
        (this as any)[gId].scrollTop += cellTopPosition;
    } else if (cellBottomPosition > (this as any)[gId].clientHeight) {
        (this as any)[gId].scrollTop += cellBottomPosition - (this as any)[gId].clientHeight;
    }
    if (cellLeftPosition < 0) {
        (this as any)[gId].scrollLeft += cellLeftPosition;
    } else if (cellRightPosition > (this as any)[gId].clientWidth) {
        (this as any)[gId].scrollLeft += cellRightPosition - (this as any)[gId].clientWidth;
    }
},
resetSelection (gId: string) {
    if (!gId) return;
    if ((this as any)[gId].variables._activeRows) (this as any)[gId].variables._activeRows = [];
    if ((this as any)[gId].variables._activeCols) (this as any)[gId].variables._activeCols = [];
    if ((this as any)[gId].variables._activeCells) (this as any)[gId].variables._activeCells = [];
    if ((this as any)[gId].variables._targetCell) (this as any)[gId].variables._targetCell = [];
    
    this.unselectCells(gId);
},
unselectCells (gId: string) {
    const selectedCells: Cell[] = (this as any)[gId].querySelectorAll('.' + gId + '_selected-cell');
    for(const cell of selectedCells) {
        cell.classList.remove(gId + '_selected-cell');
        if (cell.cDataType === 'link' || cell.cDataType === 'select') {
            const childList = cell.querySelectorAll('*');
            childList.forEach((child: Element) => {
                child.classList.remove(gId + '_selected-cell');
            });
        }
        if(vg.dataType) {
            Object.keys(vg.dataType).forEach((key) => {
                if(cell.cDataType === key) {
                    if(vg.dataType[key].onUnselected) {
                        if(typeof vg.dataType[key].onUnselected !== 'function') throw new Error('onSelected must be a function.');
                        vg.dataType[key].onUnselected(cell, (this as any)[gId].__getData(cell));
                    }
                }
            });
        }
    }
    const selectedCols = (this as any)[gId].querySelectorAll('.' + gId + '_selected-col');
    for(const cell of selectedCols) {
        cell.classList.remove(gId + '_selected-col');
    }
    const selectedRows = (this as any)[gId].querySelectorAll('.' + gId + '_selected-row');
    for(const cell of selectedRows) {
        cell.classList.remove(gId + '_selected-row');
    }
},
selectCells (startCell: Cell, endCell: Cell, focusCell?: Cell): boolean {
    const gId = startCell.gId;
    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCells', startCell.row, startCell.cId, endCell.row, endCell.cId) === false) {
        return false;
    }
    if ((this as any).doEventWithCheckChanged(gId, '_onActiveRows', startCell.row, endCell.row) === false) {
        return false;
    }
    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCols', startCell.cId, endCell.cId) === false) {
        return false;
    }
    if ((this as any)[gId].info.gSelectionPolicy !== 'range' && startCell !== endCell) {
        return false;
    }
    const startRow = startCell.row < endCell.row ? startCell.row : endCell.row;
    const endRow = startCell.row > endCell.row ? startCell.row : endCell.row;
    const startCol = startCell.col < endCell.col ? startCell.col : endCell.col;
    const endCol = startCell.col > endCell.col ? startCell.col : endCell.col;

    (this as any)[gId].variables._activeCells = [];
    (this as any)[gId].variables._activeRows = [];
    (this as any)[gId].variables._activeCols = [];
    
    let tempCell: Cell;
    for(let r = startRow; r <= endRow; r++) {
        for(let c = startCol; c <= endCol; c++) {
            if (r === startRow) (this as any)[gId].variables._activeCols.push(c);
            tempCell = (this as any)[gId]._getCell(r,c);
            if (!tempCell.cUntarget && (this as any).isCellVisible(tempCell)) {
                (this as any)[gId].variables._activeCells.push(tempCell);
                tempCell.classList.add(gId + '_selected-cell');
                if (tempCell.cDataType === 'link' || tempCell.cDataType === 'select') {
                    const childList = tempCell.querySelectorAll('*');
                    childList.forEach(child => {
                        child.classList.add(gId + '_selected-cell');
                    });
                }
                if(vg.dataType) {
                    Object.keys(vg.dataType).forEach((key) => {
                        if(tempCell.cDataType === key) {
                            if(vg.dataType[key].onSelected) {
                                if(typeof vg.dataType[key].onSelected !== 'function') throw new Error('onSelected must be a function.');
                                vg.dataType[key].onSelected(tempCell, (this as any)[gId].__getData(tempCell));
                            }
                        }
                    });
                }
            }
        }
        (this as any)[gId].variables._activeRows.push(r);
    }
    (this as any).setActiveCol(gId);
    (this as any).setActiveRow(gId);

    (this as any).focusCell(focusCell ? focusCell : endCell);
    return true;
},
setActiveCol (gId: string) {
    const _grid = (this as any)[gId];
    for(const colIdx of (this as any)[gId].variables._activeCols) {
        for(let r = 1; r <= _grid.getHeaderRowCount(); r++) {
            _grid._getHeaderCell(r, colIdx).classList.add(gId + '_selected-col');
        }
    }
},
setActiveRow (gId: string) {
    for(const rowIdx of (this as any)[gId].variables._activeRows) {
        for(const cell of (this as any)[gId]._getRow(rowIdx)) {
            cell.classList.add(gId + '_selected-row');
        }
    }
},
startScrolling (gId: string, action: string) {
    if ((this as any).scrollInterval) return;
    (this as any).scrollInterval = setInterval(() => {
        if ((this as any)[gId].info.gSelectionPolicy !== 'range') return;
        const _grid = (this as any)[gId];
        if (_grid.variables._activeCells.length <= 0) return;
        const startCell = _grid.variables._activeCells[0];
        const endCell = _grid.variables._activeCells[_grid.variables._activeCells.length - 1];
        let newTargetCell;
        switch (action) {
            case 'up':
                newTargetCell = (this as any).getMoveRowCell(startCell, -1);
                (this as any).unselectCells(gId);
                (this as any).selectCells(newTargetCell, endCell, newTargetCell);
                break;
            case 'down':
                newTargetCell = (this as any).getMoveRowCell(endCell, 1);
                (this as any).unselectCells(gId);
                (this as any).selectCells(startCell, newTargetCell);
                break;
            case 'left':
                newTargetCell = (this as any).getMoveColCell(startCell, -1);
                (this as any).unselectCells(gId);
                (this as any).selectCells(newTargetCell, endCell, newTargetCell);
                break;
            case 'right':
                newTargetCell = (this as any).getMoveColCell(endCell, 1);
                (this as any).unselectCells(gId);
                (this as any).selectCells(startCell, newTargetCell);
                break;
            default:
                break;
        }
    }, 100); 
},
stopScrolling () {
    if ((this as any).scrollInterval) clearInterval((this as any).scrollInterval);
    (this as any).scrollInterval = null;
},
copyGrid (copyCells: Cell[]) {
    const copyText = (this as any).getCopyText(copyCells);
    if (utils.doEventWithCheckChanged(copyCells[0].gId, '_onCopy', copyCells[0].row, copyCells[0].cId, copyCells[copyCells.length - 1].row, copyCells[copyCells.length - 1].cId, copyText) === false) {
        return;
    }
    navigator.clipboard.writeText(copyText).then(() => {
    }, () => {
    });
},
getCopyText (copyCells: Cell[]): string {
    let copyText = '';
    let lastRow: number | null = null;
    copyCells.forEach((cell) => {
        let cellRow = cell.row;
        let cellText = String((this as any).getCellText(cell));
        Object.keys(vg.dataType).forEach((key) => {
            if(cell.cDataType === key) {
                if(vg.dataType[key].getCopyValue) {
                    if(typeof vg.dataType[key].getCopyValue !== 'function') throw new Error('getCopyValue must be a function.');
                    cellText = vg.dataType[key].getCopyValue(cell.cValue);
                }
            }
        });
        if (cellText.includes('\n')) cellText = '"' + cellText + '"';
        
        if (lastRow !== null && lastRow !== cellRow) {
            copyText += '\n'; 
        }
        else if (lastRow === cellRow) {
            copyText += '\t'; 
        }
        copyText += cellText;
        lastRow = cellRow;
    });
    return copyText;
},
pasteGrid (e: ClipboardEvent, grid: any) {
    const this = (this as any);
    const gId = grid.gId
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const startCell = this[gId].variables._activeCells[0];
    const text = clipboardData.getData('text');

    if (utils.doEventWithCheckChanged(startCell.gId, '_onPaste', startCell.row, startCell.cId, text) === false) {
        e.stopPropagation();
        e.preventDefault();
        return;
    }

    const pasteRows = [];
    const records = [];

    let row = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        let currentChar = text[i];
        let nextChar = text[i + 1];

        
        if (currentChar === '"') {
            inQuotes = !inQuotes;
        }

        if (!inQuotes && (currentChar === '\n' || (currentChar === '\r' && nextChar === '\n'))) {
            
            pasteRows.push(row);
            row = ''; 
            if (currentChar === '\r' && nextChar === '\n') i++; 
        } else {
            row += currentChar;
        }
    }
    if (row) {
        pasteRows.push(row);
    }

    const startRowIndex = startCell.row;
    const startColIndex = startCell.col;
    
    const maxRow = grid.getRowCount(); 
    const maxCol = grid.getColCount(); 

    let unvisibleRowCount = 0;
    let rowIndex = 0;
    for(let r = 0; r < pasteRows.length; r++) {
        const currentRowIndex = startRowIndex + rowIndex + unvisibleRowCount;
        
        if (currentRowIndex > maxRow) return;
        const currentRow = grid._getRow(currentRowIndex);
        
        if (!currentRow[0].cRowVisible || currentRow[0].cFilter) {
            unvisibleRowCount++;
            let nextRow = 1;
            let nextRowCell = this[gId]._getCell(currentRow[0].row + nextRow, 1);
            while(nextRowCell) {
                if (!nextRowCell.cRowVisible || nextRowCell.cFilter) {
                    unvisibleRowCount++;
                }
                else {
                    break;
                }
                nextRow++;
                nextRowCell = this[gId]._getCell(currentRow[0].row + nextRow, 1);
            }
            continue;
        }

        let unvisibleColCount = 0;
        let colIndex = 0;
        const pasteCols = pasteRows[rowIndex].split('\t');
        for(let c = 0; c < pasteCols.length; c++) {
            const currentColIndex = startColIndex + colIndex - 1 + unvisibleColCount;
            
            if (currentColIndex >= maxCol) break;
            const cell = currentRow[currentColIndex];
            
            if (!cell.cColVisible) {
                unvisibleColCount++;
                let nextCol = 1;
                let nextColCell = currentRow[currentColIndex + nextCol];
                while(nextColCell) {
                    if (!nextColCell.cColVisible) {
                        unvisibleColCount++;
                    }
                    else {
                        break;
                    }
                    nextCol++;
                    nextColCell = currentRow[currentColIndex + nextCol];
                }
                continue;
            }

            let colText = pasteCols[colIndex];
            if (['select','checkbox','button','link'].indexOf(cell.cDataType!) < 0
                && !cell.cUntarget && !cell.cLocked) {
                colText = colText.replaceAll('"', '');
                
                let doPaste = true;
                Object.keys(vg.dataType).forEach((key) => {
                    if(cell.cDataType === key) {
                        if(vg.dataType[key].getPasteValue) {
                            if(typeof vg.dataType[key].getPasteValue !== 'function') throw new Error('getPasteValue must be a function.');
                            colText = vg.dataType[key].getPasteValue(grid.__getData(cell), colText);
                        }
                        else {
                            doPaste = false;
                        }
                    }
                });

                if(doPaste) records.push(...this.getRecordsWithModifyValue(cell, colText));
            }
            colIndex++;
        }
        rowIndex++;
    }
    if (records.length > 0) this.recordGridModify(gId, records);
},
getRecordsWithModifyValue (cell: Cell, value: any, isMethodCalled = false): CellRecord[] {
    const records: CellRecord[] = [];
    (this as any).modifyCellValue(cell, value, records, isMethodCalled);

    return records;
},
getTabCell (targetCell: Cell, isNegative: boolean): Cell | null {
    if (!targetCell) return null;
    let row = targetCell.row;
    let col = isNegative ? targetCell.col - 1 : targetCell.col + 1;
    let newTargetCell;

    while(!newTargetCell
        && row >= 1
        && row <= (this as any).activeGrid.getRowCount()) {
        while(!newTargetCell
            && col >= 1
            && col <= (this as any).activeGrid.getColCount()) {
            newTargetCell = (this as any).activeGrid._getCell(row, col);
            if (!newTargetCell) {
            }
            else if (newTargetCell.rowMerge || newTargetCell.colMerge) {
                newTargetCell = null;
            }
            else if (newTargetCell.cUntarget) {
                newTargetCell = null;
            }
            else if (!(this as any).isCellVisible(newTargetCell)) {
                newTargetCell = null;
            }
            col = isNegative ? col - 1 : col + 1;
        }
        row = isNegative ? row - 1 : row + 1;
        col = isNegative ? (this as any).activeGrid.getColCount() : 1;
    }
    if (!newTargetCell) newTargetCell = targetCell;
    return newTargetCell;
},
getMoveRowCell (targetCell: Cell, mRow: number): Cell | null {
    if (!targetCell) return null;
    let row = targetCell.row;
    let col = targetCell.col;
    let newTargetCell;
    if (!mRow) return targetCell;
    while(!newTargetCell) {
        row = row + mRow;
        if (row < 1 || row > (this as any)[targetCell.gId].getRowCount()) break;
        newTargetCell = (this as any).activeGrid._getCell(row, col);
        if (!newTargetCell) {
        }
        else if (newTargetCell.rowMerge || newTargetCell.colMerge) {
            newTargetCell = null;
        }
        else if (newTargetCell.cUntarget) {
            newTargetCell = null;
        }
        else if (!(this as any).isCellVisible(newTargetCell)) {
            newTargetCell = null;
        }
    }
    if (!newTargetCell) newTargetCell = targetCell;

    return newTargetCell;
},
getMoveColCell (targetCell: Cell, mCol: number): Cell | null {
    if (!targetCell) return null;
    let row = targetCell.row;
    let col = targetCell.col;
    let newTargetCell;
    if (!mCol) return targetCell;
    while(!newTargetCell) {
        col = col + mCol;
        if (col < 1 || col > (this as any)[targetCell.gId].getColCount()) break;
        newTargetCell = (this as any).activeGrid._getCell(row, col);
        if (!newTargetCell) {
        }
        else if (newTargetCell.rowMerge || newTargetCell.colMerge) {
            newTargetCell = null;
        }
        else if (newTargetCell.cUntarget) {
            newTargetCell = null;
        }
        else if (!(this as any).isCellVisible(newTargetCell)) {
            newTargetCell = null;
        }
    }
    if (!newTargetCell) newTargetCell = targetCell;

    return newTargetCell;
},
recordGridModify (gId: string, records: CellRecord[]) {
    if (records.length <= 0) return;
    const _grid = (this as any)[gId];
    if (_grid.variables._recordseq < _grid.variables._records.length) {
        _grid.variables._records.splice(_grid.variables._recordseq);
        
    }
    _grid.variables._records.push(records);
    _grid.variables._recordseq = _grid.variables._recordseq + 1;

    if (_grid.variables._recordseq > _grid.info.gRedoCount){
        _grid.variables._records.shift();
        _grid.variables._recordseq = _grid.variables._recordseq - 1;
    }
},
redoundo (gId: string, isRedo?: boolean): boolean {
    const _grid = (this as any)[gId];
    if (!_grid.info.gRedoable) return false;
    const _isRedo = isRedo === false ? false : true;
    if (_isRedo && _grid.variables._recordseq <= 0) return false;
    if (!_isRedo && _grid.variables._recordseq + 1 > _grid.variables._records.length) return false;
    _grid.variables._recordseq = _isRedo ? _grid.variables._recordseq - 1 : _grid.variables._recordseq + 1
    const redoCellInfos = _isRedo ? _grid.variables._records[_grid.variables._recordseq] : _grid.variables._records[_grid.variables._recordseq - 1];
    if (!redoCellInfos || !Array.isArray(redoCellInfos)) return false;
    (this as any).selectCell(redoCellInfos[0].cell);
    for(const redoCellInfo of redoCellInfos) {
        redoCellInfo.cell.cValue = _isRedo ? redoCellInfo.oldValue : redoCellInfo.newValue;
        (this as any).reConnectedCallbackElement(redoCellInfo.cell);
        (this as any).reloadGridWithModifyCell(redoCellInfo.cell.gId, redoCellInfo.cell.cIndex);
    }
    return true;
},
selectAndCheckboxOnChange (target: any) {
    if (!target.nType) return;
    const cell = target.parentNode;
    let beforeEventResult = true;
    if (target.nType === 'select') utils.editNewValue = target.value;
    else if (target.nType === 'checkbox') utils.editNewValue = target.checked ? (utils as any)[target.parentNode.gId].info.gCheckedValue : (utils as any)[target.parentNode.gId].info.gUncheckedValue;
    if ((this as any).doEventWithCheckChanged(cell.gId, '_onBeforeChange', cell.row, cell.cId, utils.editOldValue, utils.editNewValue) === false) {
        beforeEventResult = false;
    }
    if (!beforeEventResult || cell.cUntarget || cell.cLocked) {
        switch (target.nType) {
            case 'select':
                target.value = utils.editOldValue;
                break;                    
            case 'checkbox':
                target.checked = !target.checked;
                break;
            default:
                break;                    
        }
        utils.editOldValue = null;
        return false;
    }
    switch (target.nType) {
        case 'select':
            
            utils.recordGridModify(cell.gId, utils.getRecordsWithModifyValue(cell, utils.getSelectOptions(target)));
            break;
        case 'checkbox':
            
            utils.recordGridModify(cell.gId, utils.getRecordsWithModifyValue(cell, utils.editNewValue));
            break;
        default:
            break;
    }
    (this as any).doEventWithCheckChanged(cell.gId, '_onAfterChange', cell.row, cell.cId, utils.editOldValue, utils.editNewValue);
},
