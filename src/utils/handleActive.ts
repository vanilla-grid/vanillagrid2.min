import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { Cell, CellRecord } from "../types/cell";
import type { Handler } from "../types/handler";

export const setHandleActive = (vg: Vanillagrid, gridList: Record<string, Grid>, handler: Handler) => {
    handler.reConnectedCallbackElement = (cell: Cell) => {
        if (['ghd','gbd','gfd'].indexOf(cell._type) < 0) return;
        const parent = cell.parentNode;
        if (parent) {
            handler.setGridDataPosition(cell);
            parent.removeChild(cell);
            parent.appendChild(cell);
        }
    };
    handler.selectCell = (targetCell: Cell) => {
        const gridId = targetCell._gridId;
        if(gridList[gridId].events.onActiveCell(targetCell._row, targetCell.colId) === false) return false;
        if(gridList[gridId].events.onActiveRow(targetCell._row) === false) return false;
        if(gridList[gridId].events.onActiveCol(targetCell.colId) === false) return false;
        if (gridList[gridId].data.gridInfo.selectionPolicy === 'none') return false;
        handler.resetSelection(gridId);
        gridList[gridId].data.variables.targetCell = targetCell;
        handler.selectCells(targetCell, targetCell);
        handler.focusCell(targetCell);
        return true;
    };
    handler.focusCell = (targetCell: Cell) => {
        const gridId = targetCell._gridId;
        const gridRect = gridList[gridId].elements.grid.getBoundingClientRect();
        const header = gridList[gridId].elements.gridHeader;
        const footer = gridList[gridId].elements.gridFooter;
        const cellBRect = targetCell.getBoundingClientRect();
        const cellTopPosition = cellBRect.top - gridRect.top - header.clientHeight;
        const cellBottomPosition = cellBRect.bottom - gridRect.top + footer.clientHeight;
        const cellLeftPosition = cellBRect.left - gridRect.left;
        const cellRightPosition = cellBRect.right - gridRect.left;
        if (cellTopPosition < 0) {
            gridList[gridId].elements.grid.scrollTop += cellTopPosition;
        } else if (cellBottomPosition > gridList[gridId].elements.grid.clientHeight) {
            gridList[gridId].elements.grid.scrollTop += cellBottomPosition - gridList[gridId].elements.grid.clientHeight;
        }
        if (cellLeftPosition < 0) {
            gridList[gridId].elements.grid.scrollLeft += cellLeftPosition;
        } else if (cellRightPosition > gridList[gridId].elements.grid.clientWidth) {
            gridList[gridId].elements.grid.scrollLeft += cellRightPosition - gridList[gridId].elements.grid.clientWidth;
        }
    };
    handler.resetSelection = (gridId: string) => {
        if (!gridList[gridId]) return;
        if (gridList[gridId].data.variables.activeRows) gridList[gridId].data.variables.activeRows = [];
        if (gridList[gridId].data.variables.activeCols) gridList[gridId].data.variables.activeCols = [];
        if (gridList[gridId].data.variables.activeCells) gridList[gridId].data.variables.activeCells = [];
        if (gridList[gridId].data.variables.targetCell) gridList[gridId].data.variables.targetCell = null;
        
        handler.unselectCells(gridId);
    };
    handler.unselectCells = (gridId: string) => {
        const selectedCells: NodeListOf<Cell> = gridList[gridId].elements.grid.querySelectorAll('.' + gridId + '_selected-cell');
        for(const cell of selectedCells) {
            cell.classList.remove(gridId + '_selected-cell');
            if (cell.dataType === 'link' || cell.dataType === 'select') {
                const childList = cell.querySelectorAll('*');
                childList.forEach((child: Element) => {
                    child.classList.remove(gridId + '_selected-cell');
                });
            }
            if(vg.dataType) {
                Object.keys(vg.dataType).forEach((key) => {
                    if(cell.dataType === key) {
                        if(vg.dataType[key].onUnselected) {
                            if(typeof vg.dataType[key].onUnselected !== 'function') throw new Error('onSelected must be a function.');
                            vg.dataType[key].onUnselected(cell, handler.__getData(cell));
                        }
                    }
                });
            }
        }
        const selectedCols = gridList[gridId].elements.grid.querySelectorAll('.' + gridId + '_selected-col');
        for(const cell of selectedCols) {
            cell.classList.remove(gridId + '_selected-col');
        }
        const selectedRows = gridList[gridId].elements.grid.querySelectorAll('.' + gridId + '_selected-row');
        for(const cell of selectedRows) {
            cell.classList.remove(gridId + '_selected-row');
        }
    };
    handler.selectCells = (startCell: Cell, endCell: Cell, _focusCell?: Cell) => {
        const gridId = startCell._gridId;
        if(gridList[gridId].events.onActiveCells(startCell._row, startCell.colId, endCell._row, endCell.colId) === false) return false;
        if(gridList[gridId].events.onActiveRows(startCell._row, endCell._row) === false) return false;
        if(gridList[gridId].events.onActiveCols(startCell.colId, endCell.colId) === false) return false;
    
        if (gridList[gridId].data.gridInfo.selectionPolicy !== 'range' && startCell !== endCell) {
            return false;
        }
        const startRow = startCell._row < endCell._row ? startCell._row : endCell._row;
        const endRow = startCell._row > endCell._row ? startCell._row : endCell._row;
        const startCol = startCell._col < endCell._col ? startCell._col : endCell._col;
        const endCol = startCell._col > endCell._col ? startCell._col : endCell._col;
    
        gridList[gridId].data.variables.activeCells = [];
        gridList[gridId].data.variables.activeRows = [];
        gridList[gridId].data.variables.activeCols = [];
        
        let tempCell: Cell;
        for(let r = startRow; r <= endRow; r++) {
            for(let c = startCol; c <= endCol; c++) {
                if (r === startRow) gridList[gridId].data.variables.activeCols.push(c);
                tempCell = handler._getCell(gridId, r, c)!;
                if (!tempCell.untarget && handler.isCellVisible(tempCell)) {
                    gridList[gridId].data.variables.activeCells.push(tempCell);
                    tempCell.classList.add(gridId + '_selected-cell');
                    if (tempCell.dataType === 'link' || tempCell.dataType === 'select') {
                        const childList = tempCell.querySelectorAll('*');
                        childList.forEach(child => {
                            child.classList.add(gridId + '_selected-cell');
                        });
                    }
                    if(vg.dataType) {
                        Object.keys(vg.dataType).forEach((key) => {
                            if(tempCell.dataType === key) {
                                if(vg.dataType[key].onSelected) {
                                    if(typeof vg.dataType[key].onSelected !== 'function') throw new Error('onSelected must be a function.');
                                    vg.dataType[key].onSelected(tempCell, handler.__getData(tempCell));
                                }
                            }
                        });
                    }
                }
            }
            gridList[gridId].data.variables.activeRows.push(r);
        }
        handler.setActiveCol(gridId);
        handler.setActiveRow(gridId);
    
        handler.focusCell(_focusCell ? _focusCell : endCell);
        return true;
    };
    handler.setActiveCol = (gridId: string) => {
        for(const colIdx of gridList[gridId].data.variables.activeCols) {
            for(let r = 1; r <= gridList[gridId].methods.getHeaderRowCount(); r++) {
                handler._getHeaderCell(gridId, r, colIdx).classList.add(gridId + '_selected-col');
            }
        }
    };
    handler.setActiveRow = (gridId: string) => {
        for(const rowIdx of gridList[gridId].data.variables.activeRows) {
            for(const cell of handler._getRow(gridId, rowIdx)) {
                cell.classList.add(gridId + '_selected-row');
            }
        }
    };
    handler.startScrolling = (gridId: string, action: string) => {
        if (vg._status.scrollInterval) return;
        vg._status.scrollInterval = setInterval(() => {
            if (gridList[gridId].data.gridInfo.selectionPolicy !== 'range') return;
            if (gridList[gridId].data.variables.activeCells.length <= 0) return;
            const startCell = gridList[gridId].data.variables.activeCells[0];
            const endCell = gridList[gridId].data.variables.activeCells[gridList[gridId].data.variables.activeCells.length - 1];
            let newTargetCell;
            switch (action) {
                case 'up':
                    newTargetCell = handler.getMoveRowCell(startCell, -1);
                    handler.unselectCells(gridId);
                    handler.selectCells(newTargetCell!, endCell, newTargetCell!);
                    break;
                case 'down':
                    newTargetCell = handler.getMoveRowCell(endCell, 1);
                    handler.unselectCells(gridId);
                    handler.selectCells(startCell, newTargetCell!);
                    break;
                case 'left':
                    newTargetCell = handler.getMoveColCell(startCell, -1);
                    handler.unselectCells(gridId);
                    handler.selectCells(newTargetCell!, endCell, newTargetCell!);
                    break;
                case 'right':
                    newTargetCell = handler.getMoveColCell(endCell, 1);
                    handler.unselectCells(gridId);
                    handler.selectCells(startCell, newTargetCell!);
                    break;
                default:
                    break;
            }
        }, 100); 
    };
    handler.stopScrolling = (vg: Vanillagrid) => {
        if (vg._status.scrollInterval) clearInterval(vg._status.scrollInterval);
        vg._status.scrollInterval = null;
    };
    handler.copyGrid = (copyCells: Cell[]) => {
        const gridId = copyCells[0]._gridId;
        const copyText = handler.getCopyText(copyCells);
        if(gridList[gridId].events.onCopy(copyCells[0]._row, copyCells[0].colId, copyCells[copyCells.length - 1]._row, copyCells[copyCells.length - 1].colId, copyText) === false) return;
        navigator.clipboard.writeText(copyText).then(() => {
        }, () => {
        });
    };
    handler.getCopyText = (copyCells: Cell[]) => {
        let copyText = '';
        let lastRow: number | null = null;
        if(copyCells.length <= 0) return '';
        copyCells.forEach((cell) => {
            let cellRow = cell._row;
            let cellText = String(handler.getTextFromCell(cell));
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
    handler.pasteGrid = (e: ClipboardEvent, gridId: string) => {
        const clipboardData = e.clipboardData || (window as any).clipboardData;
        if(gridList[gridId].data.variables.activeCells.length <= 0) return;
        const startCell = gridList[gridId].data.variables.activeCells[0];
        const text = clipboardData.getData('text');
    
        if(gridList[gridId].events.onPaste(startCell._row, startCell.colId, text) === false) {
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
        
        const maxRow = gridList[gridId].methods.getRowCount(); 
        const maxCol = gridList[gridId].methods.getColCount(); 
    
        let unvisibleRowCount = 0;
        let rowIndex = 0;
        for(let r = 0; r < pasteRows.length; r++) {
            const currentRowIndex = startRowIndex + rowIndex + unvisibleRowCount;
            
            if (currentRowIndex > maxRow) return;
            const currentRow = handler._getRow(gridId, currentRowIndex);
            
            if (!currentRow[0].rowVisible || currentRow[0].filter) {
                unvisibleRowCount++;
                let nextRow = 1;
                let nextRowCell = handler._getCell(gridId, currentRow[0]._row + nextRow, 1);
                while(nextRowCell) {
                    if (!nextRowCell.rowVisible || nextRowCell.filter) {
                        unvisibleRowCount++;
                    }
                    else {
                        break;
                    }
                    nextRow++;
                    nextRowCell = handler._getCell(gridId, currentRow[0]._row + nextRow, 1);
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
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.dataType === key) {
                            if(vg.dataType[key].getPasteValue) {
                                if(typeof vg.dataType[key].getPasteValue !== 'function') throw new Error('getPasteValue must be a function.');
                                colText = vg.dataType[key].getPasteValue(handler.__getData(cell), colText);
                            }
                            else {
                                doPaste = false;
                            }
                        }
                    });
    
                    if(doPaste) records.push(...handler.getRecordsWithModifyValue(cell, colText));
                }
                colIndex++;
            }
            rowIndex++;
        }
        if (records.length > 0) handler.recordGridModify(gridId, records);
    };
    handler.getRecordsWithModifyValue = (cell: Cell, value: any, isMethodCalled = false) => {
        const records: CellRecord[] = [];
        handler.modifyCellValue(cell, value, records, isMethodCalled);
    
        return records;
    };
    handler.getTabCell = (targetCell: Cell, isNegative: boolean) => {
        if (!targetCell) return null;
        const gridId = targetCell._gridId;
        let row = targetCell._row;
        let col = isNegative ? targetCell._col - 1 : targetCell._col + 1;
        let newTargetCell;
    
        while(!newTargetCell
            && row >= 1
            && row <= gridList[gridId].methods.getRowCount()) {
            while(!newTargetCell
                && col >= 1
                && col <= gridList[gridId].methods.getColCount()) {
                newTargetCell = handler._getCell(gridId, row, col);
                if (!newTargetCell) {
                }
                else if (newTargetCell.isRowMerge || newTargetCell.isColMerge) {
                    newTargetCell = null;
                }
                else if (newTargetCell.untarget) {
                    newTargetCell = null;
                }
                else if (!handler.isCellVisible(newTargetCell)) {
                    newTargetCell = null;
                }
                col = isNegative ? col - 1 : col + 1;
            }
            row = isNegative ? row - 1 : row + 1;
            col = isNegative ? gridList[gridId].methods.getColCount() : 1;
        }
        if (!newTargetCell) newTargetCell = targetCell;
        return newTargetCell;
    };
    handler.getMoveRowCell = (targetCell: Cell, mRow: number) => {
        if (!targetCell) return null;
        const gridId = targetCell._gridId;
        let row = targetCell._row;
        let col = targetCell._col;
        let newTargetCell;
        if (!mRow) return targetCell;
        while(!newTargetCell) {
            row = row + mRow;
            if (row < 1 || row > gridList[gridId].methods.getRowCount()) break;
            newTargetCell = handler._getCell(gridId, row, col);
            if (!newTargetCell) {
            }
            else if (newTargetCell.isRowMerge || newTargetCell.isColMerge) {
                newTargetCell = null;
            }
            else if (newTargetCell.untarget) {
                newTargetCell = null;
            }
            else if (!handler.isCellVisible(newTargetCell)) {
                newTargetCell = null;
            }
        }
        if (!newTargetCell) newTargetCell = targetCell;
    
        return newTargetCell;
    };
    handler.getMoveColCell = (targetCell: Cell, mCol: number) => {
        if (!targetCell) return null;
        const gridId = targetCell._gridId;
        let row = targetCell._row;
        let col = targetCell._col;
        let newTargetCell;
        if (!mCol) return targetCell;
        while(!newTargetCell) {
            col = col + mCol;
            if (col < 1 || col > gridList[gridId].methods.getColCount()) break;
            newTargetCell = handler._getCell(gridId, row, col);
            if (!newTargetCell) {
            }
            else if (newTargetCell.isRowMerge || newTargetCell.isColMerge) {
                newTargetCell = null;
            }
            else if (newTargetCell.untarget) {
                newTargetCell = null;
            }
            else if (!handler.isCellVisible(newTargetCell)) {
                newTargetCell = null;
            }
        }
        if (!newTargetCell) newTargetCell = targetCell;
    
        return newTargetCell;
    };
    handler.recordGridModify = (gridId: string, records: CellRecord[]) => {
        if (records.length <= 0) return;
        if (gridList[gridId].data.variables.recordseq < gridList[gridId].data.variables.records.length) {
            gridList[gridId].data.variables.records.splice(gridList[gridId].data.variables.recordseq);
            
        }
        gridList[gridId].data.variables.records.push(records);
        gridList[gridId].data.variables.recordseq = gridList[gridId].data.variables.recordseq + 1;
    
        if (gridList[gridId].data.variables.recordseq > gridList[gridId].data.gridInfo.redoCount!){
            gridList[gridId].data.variables.records.shift();
            gridList[gridId].data.variables.recordseq = gridList[gridId].data.variables.recordseq - 1;
        }
    };
    handler.redoundo = (gridId: string, isRedo?: boolean) => {
        if (!gridList[gridId].data.gridInfo.redoable) return false;
        const _isRedo = isRedo === false ? false : true;
        if (_isRedo && gridList[gridId].data.variables.recordseq <= 0) return false;
        if (!_isRedo && gridList[gridId].data.variables.recordseq + 1 > gridList[gridId].data.variables.records.length) return false;
        gridList[gridId].data.variables.recordseq = _isRedo ? gridList[gridId].data.variables.recordseq - 1 : gridList[gridId].data.variables.recordseq + 1
        const redoCellDatas = _isRedo ? gridList[gridId].data.variables.records[gridList[gridId].data.variables.recordseq] : gridList[gridId].data.variables.records[gridList[gridId].data.variables.recordseq - 1];
        if (!redoCellDatas || !Array.isArray(redoCellDatas)) return false;
        handler.selectCell(redoCellDatas[0].cell);
        for(const redoCellData of redoCellDatas) {
            redoCellData.cell.value = _isRedo ? redoCellData.oldValue : redoCellData.newValue;
            handler.reConnectedCallbackElement(redoCellData.cell);
            handler.reloadGridWithModifyCell(gridId, redoCellData.cell.index!);
        }
        return true;
    };
    handler.selectAndCheckboxOnChange = (target: any) => {
        if (!target.nType) return;
        const cell: Cell = target.parentNode;
        const gridId = cell._gridId;

        let beforeEventResult = true;
        if (target.nType === 'select') vg._status.editNewValue = target.value;
        else if (target.nType === 'checkbox') vg._status.editNewValue = target.checked ? gridList[gridId].data.gridInfo.checkedValue : gridList[gridId].data.gridInfo.uncheckedValue;
        if(gridList[gridId].events.onBeforeChange(cell._row, cell.colId, vg._status.editOldValue, vg._status.editNewValue) === false) {
            beforeEventResult = false;
        }
        if (!beforeEventResult || cell.untarget || cell.locked) {
            switch (target.nType) {
                case 'select':
                    target.value = vg._status.editOldValue;
                    break;                    
                case 'checkbox':
                    target.checked = !target.checked;
                    break;
                default:
                    break;                    
            }
            vg._status.editOldValue = null;
            return false;
        }
        switch (target.nType) {
            case 'select':
                
                handler.recordGridModify(gridId, handler.getRecordsWithModifyValue(cell, handler.getSelectOptions(target)));
                break;
            case 'checkbox':
                
                handler.recordGridModify(gridId, handler.getRecordsWithModifyValue(cell, vg._status.editNewValue));
                break;
            default:
                break;
        }
        gridList[gridId].events.onAfterChange(cell._row, cell.colId, vg._status.editOldValue, vg._status.editNewValue);
    };
}
