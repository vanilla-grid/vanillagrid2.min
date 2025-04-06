import { Cell, CellRecord } from "../types/cell";
import { Grid, Vanillagrid } from "../types/vanillagrid";
import { getSelectOptions, isCellVisible } from "./handleCell";
import { setGridDataPosition } from "./handleElement";
import { __getData, _getCell, _getHeaderCell, _getRow } from "./handleGrid";

export const reConnectedCallbackElement = (cell: Cell) => {
    if (['ghd','gbd','gfd'].indexOf(cell._type) < 0) return;
    const parent = cell.parentNode;
    if (parent) {
        setGridDataPosition(cell);
        parent.removeChild(cell);
        parent.appendChild(cell);
    }
};
export const selectCell = (targetCell: Cell) => {
    const grid = targetCell._grid;
    if (grid._gridInfo.selectionPolicy === 'none') return false;
    resetSelection(grid);
    grid._variables._targetCell = targetCell;
    (this as any).selectCells(targetCell, targetCell);
    (this as any).focusCell(targetCell);
    return true;
};
export const focusCell = (targetCell: Cell) => {
    const grid = targetCell._grid;
    const gridRect = grid.getBoundingClientRect();
    const header = grid.gridHeader;
    const footer = grid.gridFooter;
    const cellBRect = targetCell.getBoundingClientRect();
    const cellTopPosition = cellBRect.top - gridRect.top - header.clientHeight;
    const cellBottomPosition = cellBRect.bottom - gridRect.top + footer.clientHeight;
    const cellLeftPosition = cellBRect.left - gridRect.left;
    const cellRightPosition = cellBRect.right - gridRect.left;
    if (cellTopPosition < 0) {
        grid.scrollTop += cellTopPosition;
    } else if (cellBottomPosition > grid.clientHeight) {
        grid.scrollTop += cellBottomPosition - grid.clientHeight;
    }
    if (cellLeftPosition < 0) {
        grid.scrollLeft += cellLeftPosition;
    } else if (cellRightPosition > grid.clientWidth) {
        grid.scrollLeft += cellRightPosition - grid.clientWidth;
    }
};
export const resetSelection = (grid: Grid) => {
    if (!grid) return;
    if (grid._variables._activeRows) grid._variables._activeRows = [];
    if (grid._variables._activeCols) grid._variables._activeCols = [];
    if (grid._variables._activeCells) grid._variables._activeCells = [];
    if (grid._variables._targetCell) grid._variables._targetCell = null;
    
    unselectCells(grid);
};
export const unselectCells = (grid: Grid) => {
    const selectedCells: Cell[] = (this as any)[gId].querySelectorAll('.' + gId + '_selected-cell');
    for(const cell of selectedCells) {
        cell.classList.remove(gId + '_selected-cell');
        if (cell._colInfo.dataType === 'link' || cell._colInfo.dataType === 'select') {
            const childList = cell.querySelectorAll('*');
            childList.forEach((child: Element) => {
                child.classList.remove(gId + '_selected-cell');
            });
        }
        if(vg.dataType) {
            Object.keys(vg.dataType).forEach((key) => {
                if(cell._colInfo.dataType === key) {
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
};
export const selectCells = (grid: Grid, startCell: Cell, endCell: Cell, focusCell?: Cell) => {
    if (grid._gridInfo.selectionPolicy !== 'range' && startCell !== endCell) {
        return false;
    }
    const startRow = startCell._row < endCell._row ? startCell._row : endCell._row;
    const endRow = startCell._row > endCell._row ? startCell._row : endCell._row;
    const startCol = startCell._col < endCell._col ? startCell._col : endCell._col;
    const endCol = startCell._col > endCell._col ? startCell._col : endCell._col;

    grid._variables._activeCells = [];
    grid._variables._activeRows = [];
    grid._variables._activeCols = [];
    
    let tempCell: Cell;
    for(let r = startRow; r <= endRow; r++) {
        for(let c = startCol; c <= endCol; c++) {
            if (r === startRow) grid._variables._activeCols.push(c);
            tempCell = _getCell(grid, r, c)!;
            if (!tempCell._colInfo.untarget && isCellVisible(tempCell)) {
                grid._variables._activeCells.push(tempCell);
                tempCell.classList.add(grid._id + '_selected-cell');
                if (tempCell._colInfo.dataType === 'link' || tempCell._colInfo.dataType === 'select') {
                    const childList = tempCell.querySelectorAll('*');
                    childList.forEach(child => {
                        child.classList.add(grid._id + '_selected-cell');
                    });
                }
                if(grid._vg.dataType) {
                    Object.keys(grid._vg.dataType).forEach((key) => {
                        if(tempCell._colInfo.dataType === key) {
                            if(grid._vg.dataType[key].onSelected) {
                                if(typeof grid._vg.dataType[key].onSelected !== 'function') throw new Error('onSelected must be a function.');
                                grid._vg.dataType[key].onSelected(tempCell, __getData(tempCell));
                            }
                        }
                    });
                }
            }
        }
        grid._variables._activeRows.push(r);
    }
    (this as any).setActiveCol(grid);
    (this as any).setActiveRow(grid);

    (this as any).focusCell(focusCell ? focusCell : endCell);
    return true;
};
export const setActiveCol = (grid: Grid) => {
    for(const colIdx of grid._variables._activeCols) {
        for(let r = 1; r <= grid.getHeaderRowCount(); r++) {
            _getHeaderCell(grid, r, colIdx).classList.add(grid._id + '_selected-col');
        }
    }
};
export const setActiveRow = (grid: Grid) => {
    for(const rowIdx of grid._variables._activeRows) {
        for(const cell of _getRow(grid, rowIdx)) {
            cell.classList.add(grid._id + '_selected-row');
        }
    }
};
export const startScrolling = (gId: string, action: string) => {
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
};
export const stopScrolling = (vg: Vanillagrid) => {
    if (vg._status.scrollInterval) clearInterval(vg._status.scrollInterval);
    vg._status.scrollInterval = null;
};
export const copyGrid = (copyCells: Cell[]) => {
    const copyText = (this as any).getCopyText(copyCells);
    navigator.clipboard.writeText(copyText).then(() => {
    }, () => {
    });
};
export const getCopyText = (copyCells: Cell[]) => {
    let copyText = '';
    let lastRow: number | null = null;
    copyCells.forEach((cell) => {
        let cellRow = cell.row;
        let cellText = String((this as any).getCellText(cell));
        Object.keys(vg.dataType).forEach((key) => {
            if(cell._colInfo.dataType === key) {
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
};
export const pasteGrid = (e: ClipboardEvent, grid: any) => {
    const this = (this as any);
    const gId = grid.gId
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const startCell = this[gId].variables._activeCells[0];
    const text = clipboardData.getData('text');

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
            if (['select','checkbox','button','link'].indexOf(cell._colInfo.dataType!) < 0
                && !cell._colInfo.untarget && !cell.cLocked) {
                colText = colText.replaceAll('"', '');
                
                let doPaste = true;
                Object.keys(vg.dataType).forEach((key) => {
                    if(cell._colInfo.dataType === key) {
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
};
export const getRecordsWithModifyValue = (cell: Cell, value: any, isMethodCalled = false) => {
    const records: CellRecord[] = [];
    (this as any).modifyCellValue(cell, value, records, isMethodCalled);

    return records;
};
export const getTabCell = (targetCell: Cell, isNegative: boolean) => {
    if (!targetCell) return null;
    let row = targetCell._row;
    let col = isNegative ? targetCell._col - 1 : targetCell._col + 1;
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
            else if (newTargetCell._colInfo.untarget) {
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
};
export const getMoveRowCell = (targetCell: Cell, mRow: number) => {
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
        else if (newTargetCell._colInfo.untarget) {
            newTargetCell = null;
        }
        else if (!(this as any).isCellVisible(newTargetCell)) {
            newTargetCell = null;
        }
    }
    if (!newTargetCell) newTargetCell = targetCell;

    return newTargetCell;
};
export const getMoveColCell = (targetCell: Cell, mCol: number) => {
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
        else if (newTargetCell._colInfo.untarget) {
            newTargetCell = null;
        }
        else if (!(this as any).isCellVisible(newTargetCell)) {
            newTargetCell = null;
        }
    }
    if (!newTargetCell) newTargetCell = targetCell;

    return newTargetCell;
};
export const recordGridModify = (grid: Grid, records: CellRecord[]) => {
    if (records.length <= 0) return;
    if (grid._variables._recordseq < grid._variables._records.length) {
        grid._variables._records.splice(grid._variables._recordseq);
        
    }
    grid._variables._records.push(records);
    grid._variables._recordseq = grid._variables._recordseq + 1;

    if (grid._variables._recordseq > grid._gridInfo.redoCount!){
        grid._variables._records.shift();
        grid._variables._recordseq = grid._variables._recordseq - 1;
    }
};
export const redoundo = (grid: Grid, isRedo?: boolean) => {
    if (!grid._gridInfo.redoable) return false;
    const _isRedo = isRedo === false ? false : true;
    if (_isRedo && grid._variables._recordseq <= 0) return false;
    if (!_isRedo && grid._variables._recordseq + 1 > grid._variables._records.length) return false;
    grid._variables._recordseq = _isRedo ? grid._variables._recordseq - 1 : grid._variables._recordseq + 1
    const redoCellDatas = _isRedo ? grid._variables._records[grid._variables._recordseq] : grid._variables._records[grid._variables._recordseq - 1];
    if (!redoCellDatas || !Array.isArray(redoCellDatas)) return false;
    (this as any).selectCell(redoCellDatas[0].cell);
    for(const redoCellData of redoCellDatas) {
        redoCellData.cell._value = _isRedo ? redoCellData.oldValue : redoCellData.newValue;
        (this as any).reConnectedCallbackElement(redoCellData.cell);
        (this as any).reloadGridWithModifyCell(redoCellData.cell._gridId, redoCellData.cell._colInfo.index);
    }
    return true;
};
export const selectAndCheckboxOnChange = (grid: Grid, target: any) => {
    if (!target.nType) return;
    const cell = target.parentNode;
    if (target.nType === 'select') grid._vg._status.editNewValue = target.value;
    else if (target.nType === 'checkbox') grid._vg._status.editNewValue = target.checked ? grid._gridInfo.checkedValue : grid._gridInfo.uncheckedValue;
    if (cell._colInfo.untarget || cell.cLocked) {
        switch (target.nType) {
            case 'select':
                target.value = grid._vg._status.editOldValue;
                break;                    
            case 'checkbox':
                target.checked = !target.checked;
                break;
            default:
                break;                    
        }
        grid._vg._status.editOldValue = null;
        return false;
    }
    switch (target.nType) {
        case 'select':
            
            recordGridModify(cell.gId, getRecordsWithModifyValue(cell, getSelectOptions(target)));
            break;
        case 'checkbox':
            
            recordGridModify(cell.gId, getRecordsWithModifyValue(cell, grid._vg._status.editNewValue));
            break;
        default:
            break;
    }
};
