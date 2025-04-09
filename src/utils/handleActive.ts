import type { Grid, Vanillagrid } from "../types/vanillagrid";
import type { Cell, CellRecord } from "../types/cell";
import { getCellText, getSelectOptions, isCellVisible } from "./handleCell";
import { modifyCellValue, reloadGridWithModifyCell, setGridDataPosition } from "./handleElement";
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
    if(targetCell._grid._events.onActiveCell(targetCell._row, targetCell.colId) === false) return false;
    if(targetCell._grid._events.onActiveRow(targetCell._row) === false) return false;
    if(targetCell._grid._events.onActiveCol(targetCell.colId) === false) return false;
    if (targetCell._grid._gridInfo.selectionPolicy === 'none') return false;
    resetSelection(targetCell._grid);
    targetCell._grid._variables._targetCell = targetCell;
    selectCells(targetCell, targetCell);
    focusCell(targetCell);
    return true;
};
export const focusCell = (targetCell: Cell) => {
    const gridRect = targetCell._grid.getBoundingClientRect();
    const header = targetCell._grid.gridHeader;
    const footer = targetCell._grid.gridFooter;
    const cellBRect = targetCell.getBoundingClientRect();
    const cellTopPosition = cellBRect.top - gridRect.top - header.clientHeight;
    const cellBottomPosition = cellBRect.bottom - gridRect.top + footer.clientHeight;
    const cellLeftPosition = cellBRect.left - gridRect.left;
    const cellRightPosition = cellBRect.right - gridRect.left;
    if (cellTopPosition < 0) {
        targetCell._grid.scrollTop += cellTopPosition;
    } else if (cellBottomPosition > targetCell._grid.clientHeight) {
        targetCell._grid.scrollTop += cellBottomPosition - targetCell._grid.clientHeight;
    }
    if (cellLeftPosition < 0) {
        targetCell._grid.scrollLeft += cellLeftPosition;
    } else if (cellRightPosition > targetCell._grid.clientWidth) {
        targetCell._grid.scrollLeft += cellRightPosition - targetCell._grid.clientWidth;
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
    const selectedCells: NodeListOf<Cell> = grid.querySelectorAll('.' + grid._id + '_selected-cell');
    for(const cell of selectedCells) {
        cell.classList.remove(grid._id + '_selected-cell');
        if (cell.dataType === 'link' || cell.dataType === 'select') {
            const childList = cell.querySelectorAll('*');
            childList.forEach((child: Element) => {
                child.classList.remove(grid._id + '_selected-cell');
            });
        }
        if(grid._vg.dataType) {
            Object.keys(grid._vg.dataType).forEach((key) => {
                if(cell.dataType === key) {
                    if(grid._vg.dataType[key].onUnselected) {
                        if(typeof grid._vg.dataType[key].onUnselected !== 'function') throw new Error('onSelected must be a function.');
                        grid._vg.dataType[key].onUnselected(cell, __getData(cell));
                    }
                }
            });
        }
    }
    const selectedCols = grid.querySelectorAll('.' + grid._id + '_selected-col');
    for(const cell of selectedCols) {
        cell.classList.remove(grid._id + '_selected-col');
    }
    const selectedRows = grid.querySelectorAll('.' + grid._id + '_selected-row');
    for(const cell of selectedRows) {
        cell.classList.remove(grid._id + '_selected-row');
    }
};
export const selectCells = (startCell: Cell, endCell: Cell, _focusCell?: Cell) => {
    if(startCell._grid._events.onActiveCells(startCell._row, startCell.colId, endCell._row, endCell.colId) === false) return false;
    if(startCell._grid._events.onActiveRows(startCell._row, endCell._row) === false) return false;
    if(startCell._grid._events.onActiveCols(startCell.colId, endCell.colId) === false) return false;

    if (startCell._grid._gridInfo.selectionPolicy !== 'range' && startCell !== endCell) {
        return false;
    }
    const startRow = startCell._row < endCell._row ? startCell._row : endCell._row;
    const endRow = startCell._row > endCell._row ? startCell._row : endCell._row;
    const startCol = startCell._col < endCell._col ? startCell._col : endCell._col;
    const endCol = startCell._col > endCell._col ? startCell._col : endCell._col;

    startCell._grid._variables._activeCells = [];
    startCell._grid._variables._activeRows = [];
    startCell._grid._variables._activeCols = [];
    
    let tempCell: Cell;
    for(let r = startRow; r <= endRow; r++) {
        for(let c = startCol; c <= endCol; c++) {
            if (r === startRow) startCell._grid._variables._activeCols.push(c);
            tempCell = _getCell(startCell._grid, r, c)!;
            if (!tempCell.untarget && isCellVisible(tempCell)) {
                startCell._grid._variables._activeCells.push(tempCell);
                tempCell.classList.add(startCell._grid._id + '_selected-cell');
                if (tempCell.dataType === 'link' || tempCell.dataType === 'select') {
                    const childList = tempCell.querySelectorAll('*');
                    childList.forEach(child => {
                        child.classList.add(startCell._grid._id + '_selected-cell');
                    });
                }
                if(startCell._grid._vg.dataType) {
                    Object.keys(startCell._grid._vg.dataType).forEach((key) => {
                        if(tempCell.dataType === key) {
                            if(startCell._grid._vg.dataType[key].onSelected) {
                                if(typeof startCell._grid._vg.dataType[key].onSelected !== 'function') throw new Error('onSelected must be a function.');
                                startCell._grid._vg.dataType[key].onSelected(tempCell, __getData(tempCell));
                            }
                        }
                    });
                }
            }
        }
        startCell._grid._variables._activeRows.push(r);
    }
    setActiveCol(startCell._grid);
    setActiveRow(startCell._grid);

    focusCell(_focusCell ? _focusCell : endCell);
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
export const startScrolling = (grid: Grid, action: string) => {
    if (grid._vg._status.scrollInterval) return;
    grid._vg._status.scrollInterval = setInterval(() => {
        if (grid._gridInfo.selectionPolicy !== 'range') return;
        if (grid._variables._activeCells.length <= 0) return;
        const startCell = grid._variables._activeCells[0];
        const endCell = grid._variables._activeCells[grid._variables._activeCells.length - 1];
        let newTargetCell;
        switch (action) {
            case 'up':
                newTargetCell = getMoveRowCell(startCell, -1);
                unselectCells(grid);
                selectCells(newTargetCell!, endCell, newTargetCell!);
                break;
            case 'down':
                newTargetCell = getMoveRowCell(endCell, 1);
                unselectCells(grid);
                selectCells(startCell, newTargetCell!);
                break;
            case 'left':
                newTargetCell = getMoveColCell(startCell, -1);
                unselectCells(grid);
                selectCells(newTargetCell!, endCell, newTargetCell!);
                break;
            case 'right':
                newTargetCell = getMoveColCell(endCell, 1);
                unselectCells(grid);
                selectCells(startCell, newTargetCell!);
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
    const copyText = getCopyText(copyCells);
    if(copyCells[0]._grid._events.onCopy(copyCells[0]._row, copyCells[0].colId, copyCells[copyCells.length - 1]._row, copyCells[copyCells.length - 1].colId, copyText) === false) return;
    navigator.clipboard.writeText(copyText).then(() => {
    }, () => {
    });
};
export const getCopyText = (copyCells: Cell[]) => {
    let copyText = '';
    let lastRow: number | null = null;
    if(copyCells.length <= 0) return '';
    const vg = copyCells[0]._grid._vg;
    copyCells.forEach((cell) => {
        let cellRow = cell._row;
        let cellText = String(getCellText(cell));
        Object.keys(vg.dataType).forEach((key) => {
            if(cell.dataType === key) {
                if(vg.dataType[key].getCopyValue) {
                    if(typeof vg.dataType[key].getCopyValue !== 'function') throw new Error('getCopyValue must be a function.');
                    cellText = vg.dataType[key].getCopyValue(cell.value);
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
export const pasteGrid = (e: ClipboardEvent, grid: Grid) => {
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    if(grid._variables._activeCells.length <= 0) return;
    const startCell = grid._variables._activeCells[0];
    const text = clipboardData.getData('text');

    if(grid._events.onPaste(startCell._row, startCell.colId, text) === false) {
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

    const startRowIndex = startCell._row;
    const startColIndex = startCell._col;
    
    const maxRow = grid.getRowCount(); 
    const maxCol = grid.getColCount(); 

    let unvisibleRowCount = 0;
    let rowIndex = 0;
    for(let r = 0; r < pasteRows.length; r++) {
        const currentRowIndex = startRowIndex + rowIndex + unvisibleRowCount;
        
        if (currentRowIndex > maxRow) return;
        const currentRow = _getRow(grid, currentRowIndex);
        
        if (!currentRow[0].rowVisible || currentRow[0].filter) {
            unvisibleRowCount++;
            let nextRow = 1;
            let nextRowCell = _getCell(grid, currentRow[0]._row + nextRow, 1);
            while(nextRowCell) {
                if (!nextRowCell.rowVisible || nextRowCell.filter) {
                    unvisibleRowCount++;
                }
                else {
                    break;
                }
                nextRow++;
                nextRowCell = _getCell(grid, currentRow[0]._row + nextRow, 1);
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
            
            if (!cell.colVisible) {
                unvisibleColCount++;
                let nextCol = 1;
                let nextColCell = currentRow[currentColIndex + nextCol];
                while(nextColCell) {
                    if (!nextColCell.colVisible) {
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
            if (['select','checkbox','button','link'].indexOf(cell.dataType!) < 0
                && !cell.untarget && !cell.locked) {
                colText = colText.replaceAll('"', '');
                
                let doPaste = true;
                Object.keys(grid._vg.dataType).forEach((key) => {
                    if(cell.dataType === key) {
                        if(grid._vg.dataType[key].getPasteValue) {
                            if(typeof grid._vg.dataType[key].getPasteValue !== 'function') throw new Error('getPasteValue must be a function.');
                            colText = grid._vg.dataType[key].getPasteValue(__getData(cell), colText);
                        }
                        else {
                            doPaste = false;
                        }
                    }
                });

                if(doPaste) records.push(...getRecordsWithModifyValue(cell, colText));
            }
            colIndex++;
        }
        rowIndex++;
    }
    if (records.length > 0) recordGridModify(grid, records);
};
export const getRecordsWithModifyValue = (cell: Cell, value: any, isMethodCalled = false) => {
    const records: CellRecord[] = [];
    modifyCellValue(cell, value, records, isMethodCalled);

    return records;
};
export const getTabCell = (targetCell: Cell, isNegative: boolean) => {
    if (!targetCell) return null;
    let row = targetCell._row;
    let col = isNegative ? targetCell._col - 1 : targetCell._col + 1;
    let newTargetCell;

    while(!newTargetCell
        && row >= 1
        && row <= targetCell._grid.getRowCount()) {
        while(!newTargetCell
            && col >= 1
            && col <= targetCell._grid.getColCount()) {
            newTargetCell = _getCell(targetCell._grid, row, col);
            if (!newTargetCell) {
            }
            else if (newTargetCell.isRowMerge || newTargetCell.isColMerge) {
                newTargetCell = null;
            }
            else if (newTargetCell.untarget) {
                newTargetCell = null;
            }
            else if (!isCellVisible(newTargetCell)) {
                newTargetCell = null;
            }
            col = isNegative ? col - 1 : col + 1;
        }
        row = isNegative ? row - 1 : row + 1;
        col = isNegative ? targetCell._grid.getColCount() : 1;
    }
    if (!newTargetCell) newTargetCell = targetCell;
    return newTargetCell;
};
export const getMoveRowCell = (targetCell: Cell, mRow: number) => {
    if (!targetCell) return null;
    let row = targetCell._row;
    let col = targetCell._col;
    let newTargetCell;
    if (!mRow) return targetCell;
    while(!newTargetCell) {
        row = row + mRow;
        if (row < 1 || row > targetCell._grid.getRowCount()) break;
        newTargetCell = _getCell(targetCell._grid, row, col);
        if (!newTargetCell) {
        }
        else if (newTargetCell.isRowMerge || newTargetCell.isColMerge) {
            newTargetCell = null;
        }
        else if (newTargetCell.untarget) {
            newTargetCell = null;
        }
        else if (!isCellVisible(newTargetCell)) {
            newTargetCell = null;
        }
    }
    if (!newTargetCell) newTargetCell = targetCell;

    return newTargetCell;
};
export const getMoveColCell = (targetCell: Cell, mCol: number) => {
    if (!targetCell) return null;
    let row = targetCell._row;
    let col = targetCell._col;
    let newTargetCell;
    if (!mCol) return targetCell;
    while(!newTargetCell) {
        col = col + mCol;
        if (col < 1 || col > targetCell._grid.getColCount()) break;
        newTargetCell = _getCell(targetCell._grid, row, col);
        if (!newTargetCell) {
        }
        else if (newTargetCell.isRowMerge || newTargetCell.isColMerge) {
            newTargetCell = null;
        }
        else if (newTargetCell.untarget) {
            newTargetCell = null;
        }
        else if (!isCellVisible(newTargetCell)) {
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
    selectCell(redoCellDatas[0].cell);
    for(const redoCellData of redoCellDatas) {
        redoCellData.cell.value = _isRedo ? redoCellData.oldValue : redoCellData.newValue;
        reConnectedCallbackElement(redoCellData.cell);
        reloadGridWithModifyCell(grid, redoCellData.cell.index!);
    }
    return true;
};
export const selectAndCheckboxOnChange = (target: any) => {
    if (!target.nType) return;
    const cell: Cell = target.parentNode;
    let beforeEventResult = true;
    if (target.nType === 'select') cell._grid._vg._status.editNewValue = target.value;
    else if (target.nType === 'checkbox') cell._grid._vg._status.editNewValue = target.checked ? cell._grid._gridInfo.checkedValue : cell._grid._gridInfo.uncheckedValue;
    if(cell._grid._events.onBeforeChange(cell._row, cell.colId, cell._grid._vg._status.editOldValue, cell._grid._vg._status.editNewValue) === false) {
        beforeEventResult = false;
    }
    if (!beforeEventResult || cell.untarget || cell.locked) {
        switch (target.nType) {
            case 'select':
                target.value = cell._grid._vg._status.editOldValue;
                break;                    
            case 'checkbox':
                target.checked = !target.checked;
                break;
            default:
                break;                    
        }
        cell._grid._vg._status.editOldValue = null;
        return false;
    }
    switch (target.nType) {
        case 'select':
            
            recordGridModify(cell._grid, getRecordsWithModifyValue(cell, getSelectOptions(target)));
            break;
        case 'checkbox':
            
            recordGridModify(cell._grid, getRecordsWithModifyValue(cell, cell._grid._vg._status.editNewValue));
            break;
        default:
            break;
    }
    cell._grid._events.onAfterChange(cell._row, cell.colId, cell._grid._vg._status.editOldValue, cell._grid._vg._status.editNewValue);
};
