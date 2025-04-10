import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { ColInfo } from "../types/colInfo";
import type { Cell, CellData } from "../types/cell";
import type { Handler } from "../types/handler";
import { deepCopy, getArrayElementWithBoundCheck, removeAllChild, validatePositiveIntegerAndZero } from "./utils";

export const setHandleGrid = (vg: Vanillagrid, gridList: Record<string, Grid>, handler: Handler) => {
    handler.__getDefaultColInfo = (grid: Grid, newColInfo: ColInfo, isAdd = false) => {
        if (!newColInfo || !newColInfo.colId) throw new Error('Column ID is required.');
        if (isAdd) {
            for(const colInfo of grid._colInfos) {
                if (newColInfo.colId === colInfo.colId)  throw new Error('Column ID is primary key.');
            }
        }
    
        const resultnewColInfo: ColInfo = {
            colId: newColInfo.colId,
            name : newColInfo.name ? newColInfo.name : newColInfo.colId,
            index : null,
            header : null,
            footer : null,
    
            untarget : newColInfo.untarget ?  newColInfo.untarget : grid._gridInfo.selectionPolicy === 'none',
            rowMerge : newColInfo.rowMerge ?  newColInfo.rowMerge : grid._defaultColInfo.rowMerge,
            colMerge : newColInfo.colMerge ?  newColInfo.colMerge : grid._defaultColInfo.colMerge,
            colVisible : newColInfo.colVisible ?  newColInfo.colVisible : grid._defaultColInfo.colVisible,
            required : newColInfo.required ?  newColInfo.required : grid._defaultColInfo.required,
            resizable : newColInfo.resizable ?  newColInfo.resizable : grid._defaultColInfo.resizable,
            sortable : newColInfo.sortable ?  newColInfo.sortable : grid._defaultColInfo.sortable,
            filterable : newColInfo.filterable ?  newColInfo.filterable : grid._defaultColInfo.filterable,
            originWidth : newColInfo.originWidth ?  newColInfo.originWidth : grid._defaultColInfo.originWidth,
            dataType : newColInfo.dataType ?  newColInfo.dataType : grid._defaultColInfo.dataType,
            selectSize : newColInfo.selectSize ?  newColInfo.selectSize : grid._defaultColInfo.selectSize,
            locked : newColInfo.locked ?  newColInfo.locked : grid._gridInfo.locked,
            lockedColor : newColInfo.lockedColor ?  newColInfo.lockedColor : grid._gridInfo.lockedColor,
            format : newColInfo.format ?  newColInfo.format : grid._defaultColInfo.format,
            codes : newColInfo.codes ?  newColInfo.codes : grid._defaultColInfo.codes,
            defaultCode : newColInfo.defaultCode ?  newColInfo.defaultCode : grid._defaultColInfo.defaultCode,
            maxLength : newColInfo.maxLength ?  newColInfo.maxLength : grid._defaultColInfo.maxLength,
            maxByte : newColInfo.maxByte ?  newColInfo.maxByte : grid._defaultColInfo.maxByte,
            maxNumber : newColInfo.maxNumber ?  newColInfo.maxNumber : grid._defaultColInfo.maxNumber,
            minNumber : newColInfo.minNumber ?  newColInfo.minNumber : grid._defaultColInfo.minNumber,
            roundNumber : newColInfo.roundNumber ?  newColInfo.roundNumber : grid._defaultColInfo.roundNumber,
    
            align : newColInfo.align ?  newColInfo.align : grid._defaultColInfo.align,
            verticalAlign : newColInfo.verticalAlign ?  newColInfo.verticalAlign : grid._defaultColInfo.verticalAlign,
            overflowWrap : newColInfo.overflowWrap ?  newColInfo.overflowWrap : grid._defaultColInfo.overflowWrap,
            wordBreak : newColInfo.wordBreak ?  newColInfo.wordBreak : grid._defaultColInfo.wordBreak,
            whiteSpace : newColInfo.whiteSpace ?  newColInfo.whiteSpace : grid._defaultColInfo.whiteSpace,
            backColor : newColInfo.backColor ?  newColInfo.backColor : grid._defaultColInfo.backColor,
            fontColor : newColInfo.fontColor ?  newColInfo.fontColor : grid._defaultColInfo.fontColor,
            fontBold : newColInfo.fontBold ?  newColInfo.fontBold : grid._defaultColInfo.fontBold,
            fontItalic : newColInfo.fontItalic ?  newColInfo.fontItalic : grid._defaultColInfo.fontItalic,
            fontThruline : newColInfo.fontThruline ?  newColInfo.fontThruline : grid._defaultColInfo.fontThruline,
            fontUnderline : newColInfo.fontUnderline ?  newColInfo.fontUnderline : grid._defaultColInfo.fontUnderline,
            
            filterValues : new Set(),
            filterValue : null,
            filter : false,
            rowVisible : true,
        };
        //속성은 문자열로만 같도록 한다.
        /*
        if (newColInfo.header && (typeof newColInfo.header === 'string')) {
            resultnewColInfo.header = (newColInfo.header as string).split(';');
        }
        else {
            resultnewColInfo.header = new Array(grid.getHeaderRowCount());
            resultnewColInfo.header[0] = newColInfo.colId;
        }
        if (newColInfo.footer && (typeof newColInfo.footer === 'string')) {
            resultnewColInfo.cFooter = (newColInfo.footer as string).split(';');
        }
        */
        resultnewColInfo.filterValue = resultnewColInfo.filterable ? '$$ALL' : null;
        
        return resultnewColInfo;
    };
    handler.__getColInfo = (grid: Grid, colIndexOrColId: string | number, useError = false): ColInfo | null => {
        let returncolInfo;
        if (typeof colIndexOrColId === 'number') {
            returncolInfo = deepCopy(grid._colInfos[colIndexOrColId - 1]);
        }
        else {
            for(const colInfo of grid._colInfos) {
                if (colInfo.colId === colIndexOrColId) {
                    returncolInfo = deepCopy(colInfo);
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
    handler.__getColIndex = (grid: Grid, colIndexOrColId: number | string, useError = false): number | null => {
        if (typeof colIndexOrColId === 'number') {
            if(useError) handler.__checkColIndex(grid, colIndexOrColId);
            return colIndexOrColId;
        }
        for(const colInfo of grid._colInfos) {
            if (colInfo.colId === colIndexOrColId) {
                return colInfo.index;
            }
        }
        if (useError) {
            throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
        }
        else {
            return null;
        }
    };
    handler.__setGridColSize = (grid: Grid) => {
        const styleGridTemplateColumnsArr = [];
        
        for(const colInfo of grid._colInfos) {
            styleGridTemplateColumnsArr.push(colInfo.colVisible ? colInfo.originWidth : '0px');
        }
        const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
        if (styleGridTemplateColumns.includes('%') && grid._gridInfo.frozenColCount !== 0) {
            throw new Error(grid._id + ' has error. If you set the horizontal size to a percentage, property A is not available.');
        }
        grid.gridHeader!.style.gridTemplateColumns = styleGridTemplateColumns;
        grid.gridBody!.style.gridTemplateColumns = styleGridTemplateColumns;
        grid.gridFooter!.style.gridTemplateColumns = styleGridTemplateColumns;
    };
    handler._getCellChildNode = (cell: Cell): HTMLElement | null => {
        if (!cell) return null;
        let childNode: any;
        switch (cell.dataType) {
            case 'text':
                childNode = document.createElement('span');
                childNode.classList.add(cell._grid._id + '_data-value-text');
                childNode.innerText = cell.value;
                childNode.nType = 'text';
                break;
            case 'number':
                childNode = document.createElement('span');
                childNode.classList.add(cell._grid._id + '_data-value-number');
                if (cell.value === null || cell.value === undefined || cell.value === cell._grid._gridInfo.nullValue) childNode.innerText = cell._grid._gridInfo.nullValue;
                else childNode.innerText = handler.getFormatNumberFromCell(cell);
                childNode.nType = 'number';
                break;
            case 'mask':
                childNode = document.createElement('span');
                childNode.classList.add(cell._grid._id + '_data-value-mask');
                childNode.innerText = cell.value;
                childNode.nType = 'mask';
                break;
            case 'date':
                childNode = document.createElement('span');
                childNode.classList.add(cell._grid._id + '_data-value-date');
                if (cell.value === null || cell.value === undefined || cell.value === cell._grid._gridInfo.nullValue) childNode.innerText = cell._grid._gridInfo.nullValue;
                else childNode.innerText = handler.getDateWithGridDateFormat(cell);
                childNode.nType = 'date';
                break;
            case 'month':
                childNode = document.createElement('span');
                childNode.classList.add(cell._grid._id + '_data-value-month');
                if (cell.value === null || cell.value === undefined || cell.value === cell._grid._gridInfo.nullValue) childNode.innerText = cell._grid._gridInfo.nullValue;
                else childNode.innerText = handler.getDateWithGridMonthFormat(cell);
                childNode.nType = 'month';
                break;
            case 'select':
                if (Array.isArray(cell.value) && cell.value.length > 0) {
                    childNode = document.createElement('select');
                    childNode.classList.add(cell._grid._id + '_data-value-select');
                    childNode.addEventListener('change', function (e: any) { handler.selectAndCheckboxOnChange(e.target); });
                    handler.setSelectOptions(childNode, cell.value);
                    childNode.nType = 'select';
                    if (cell.selectSize) childNode.style.width = cell.selectSize;
                }
                else {
                    childNode = document.createElement('span');
                    childNode.classList.add(cell._grid._id + '_data-value-text');
                    childNode.innerText = cell._grid._gridInfo.nullValue;
                    childNode.nType = 'text';
                }
                break;
            case 'checkbox':
                childNode = document.createElement('input');
                childNode.classList.add(cell._grid._id + '_data-value-checkbox');
                childNode.addEventListener('change', function (e: any) { handler.selectAndCheckboxOnChange(e.target); });
                childNode.type = 'checkbox';
                childNode.nType = 'checkbox';
                if (handler.getCheckboxCellTrueOrFalse(cell)) childNode.setAttribute('checked','');
                break;
            case 'button':
                if (cell.value === null || cell.value === undefined || cell.value === cell._grid._gridInfo.nullValue) {
                    childNode = document.createElement('span');
                    childNode.classList.add(cell._grid._id + '_data-value-text');
                    childNode.innerText = cell._grid._gridInfo.nullValue;
                    childNode.nType = 'text';
                }
                else {
                    childNode = document.createElement('button');
                    childNode.classList.add(cell._grid._id + '_data-value-button');
                    childNode.innerText = cell.value;
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
                if (cell.value === null || cell.value === undefined || cell.value === cell._grid._gridInfo.nullValue) {
                    childNode = document.createElement('span');
                    childNode.classList.add(cell._grid._id + '_data-value-text');
                    childNode.innerText = cell._grid._gridInfo.nullValue;
                    childNode.nType = 'text';
                }
                else {
                    childNode = document.createElement('a');
                    childNode.classList.add(cell._grid._id + '_data-value-link');
                    childNode.innerText = cell.value.text;
                    childNode.setAttribute('href', cell.value.value);
                    childNode.setAttribute('target', cell.value.target ? cell.value.target : '_blank');
                    childNode.nType = 'link';
                }
                break;
            case 'code':
                childNode = document.createElement('span');
                childNode.classList.add(cell._grid._id + '_data-value-code');
                childNode.innerText = cell.value;
                childNode.nType = 'code';
                break;
            default:
                if(vg.dataType) {
                    Object.keys(vg.dataType).forEach((key) => {
                        if(key === cell.dataType) {
                            if(vg.dataType[key].getChildNode) {
                                if(typeof vg.dataType[key].getChildNode !== 'function') throw new Error('getChildNode must be a function.');
                                childNode = vg.dataType[key].getChildNode(handler.__getData(cell));
                                if(childNode) {
                                    if(!(childNode instanceof HTMLElement) || childNode.nodeType !== 1)  throw new Error('getChildNode must return an html element.');
                                }
                                else {
                                    childNode = document.createElement('span');
                                    childNode.innerText = cell.value;
                                }
                            }
                            else {
                                childNode = document.createElement('span');
                                childNode.innerText = cell.value;
                            }
                            childNode.classList.add(cell._grid._id + '_data-value-' + key);
                            childNode.nType = key;
                        }
                    });
                }
                break;
        }
        childNode.classList.add(cell._grid._id + '_data-value');
        childNode.gType = 'gbdv';
        return childNode;
    };
    handler.__loadHeader = (grid: Grid) => {
        handler.__setGridColSize(grid);
        removeAllChild(grid.gridHeader!);
        grid.gridHeader._gridHeaderCells.length = 0;
    
        for(let rowCount = 1; rowCount <= grid.getHeaderRowCount(); rowCount++) {
            const tempRows = [];
            let colCount = 1;
            for(const colInfo of grid._colInfos) {
                const tempGridData = document.createElement('v-g-d') as Cell;
                tempGridData._gridId = grid._id;
                tempGridData._grid = grid;
                tempGridData._type = 'ghd';
                Object.keys(colInfo).forEach(key => {
                    if (['header', 'footer', 'rowMerge', 'colMerge', 'filterValue','index'].indexOf(key) < 0) {
                        (tempGridData as any)[key] = colInfo[key as keyof ColInfo];
                    }
                });
                if (Array.isArray(colInfo.header)) {
                    tempGridData.value = colInfo.header[rowCount - 1] ? colInfo.header[rowCount - 1].replaceAll('\\n','\n') : '';
                }
                else {
                    tempGridData.value = colInfo.header;
                }
                handler.setGridDataRowCol(tempGridData, rowCount, colCount);
                if (colCount !== 1) {
                    if (!colInfo.header![rowCount - 1]) { 
                        
                        for(let r = rowCount - 2; r >= 0; r--) {
                            if (colInfo.header![r]) tempGridData.isRowMerge = true;
                        }
                        
                        if (!tempGridData.isRowMerge) {
                            for(let c = colCount - 2; c >= 0; c--) {
                                if (grid._colInfos[c].header![rowCount - 1]) tempGridData.isColMerge = true;
                            }
                        }
                    }
                }
                else { 
                    if (rowCount !== 1) tempGridData.isRowMerge = true;
                }
                tempGridData.addEventListener('mousemove', function (e: any) {
                    const grid: Grid = e.target._grid;
                    if (e.target.style.cursor) this.style.removeProperty('cursor');
                    if (grid._gridInfo.resizable) return;
                    if (e.target.gType !== 'ghd') return;
                    const { left, right } = e.target.getBoundingClientRect();
                    let mouseX = e.clientX;
                    let deltaX;
                    let targetCell;
                    if (mouseX - left < 20) {
                        if (e.target.col <= 3) return;
                        if (e.target.frozenCol) return;
                        for(let col = e.target.col - 1; col > 1; col--) {
                            targetCell = handler._getHeaderCell(grid, 1, col);
                            if (targetCell.colVisible === true) break;
                        }
                        if (!targetCell!.resizable) return;
    
                        e.target.style.cursor = 'ew-resize';
                        vg._status.onHeaderDragging = true;
    
                        if (vg._status.isHeaderDragging) {
                            deltaX = mouseX - vg._status.mouseX;
                            handler.modifyColSize(grid, targetCell!, deltaX);
                            vg._status.mouseX = mouseX;
                        }
                    }
                    else if (right - mouseX < 20) {
                        
                        if (e.target.col < 3) return;
                        if (e.target.frozenCol) return;
                        for(let col = e.target.col; col > 1; col--) {
                            targetCell = handler._getHeaderCell(grid, 1, col);
                            if (targetCell.colVisible === true) break;
                        }
                        if (!targetCell!.resizable) return;
                        
                        e.target.style.cursor = 'ew-resize';
                        vg._status.onHeaderDragging = true;
                        if (vg._status.isHeaderDragging) {
                            deltaX = mouseX - vg._status.mouseX;
                            handler.modifyColSize(grid, targetCell!, deltaX);
                            vg._status.mouseX = mouseX;
                        }
                    } else {
                        
                        e.target.style.cursor = '';
                        vg._status.onHeaderDragging = false;
                    }
                });
    
                tempGridData.addEventListener('mousedown', function (e: any) {
                    vg._status.mouseX = e.clientX;
                    if (vg._status.onHeaderDragging) {
                        vg._status.isHeaderDragging = true;
                    }
                });
    
                tempRows.push(tempGridData);
                colCount++;
            }
            grid.gridHeader._gridHeaderCells.push(tempRows);
        }
    
        for(const row of grid.gridHeader._gridHeaderCells) {
            for(const cell of row) {
                grid.gridHeader.append(cell);
            }
        }
    };
    handler._getHeaderRow = (grid: Grid, rowIndex: number): Cell[] => {
        return getArrayElementWithBoundCheck(grid.gridHeader._gridHeaderCells, rowIndex - 1);
    };
    handler._getHeaderCell = (grid: Grid, rowIndex: number, colIndexOrColId: number | string): Cell => {
        if (typeof colIndexOrColId === 'number') {
            return getArrayElementWithBoundCheck(handler._getHeaderRow(grid, rowIndex), colIndexOrColId - 1);
        }
        else {
            for(const cell of handler._getHeaderRow(grid, rowIndex)) {
                if (cell.colId === colIndexOrColId) return cell;
            }
        }
        throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
    };
    handler._getHeaderCells = (grid: Grid) => {
        return grid.gridHeader._gridHeaderCells;
    };
    handler.__getHeaderFilter = (grid: Grid, colIndexOrColId: number | string): any => {
        const colIndex = handler.__getColIndex(grid, colIndexOrColId);
        if (!grid._colInfos[colIndex! - 1].filterable)  return null;
        let headerCell;
        let filterSelect;
        for(let r = 1; r <= grid.getHeaderRowCount(); r++) {
            headerCell = handler._getHeaderCell(grid, r, colIndex!);
            if (headerCell) {
                filterSelect = headerCell.querySelectorAll('.' + grid._id + '_filterSelect');
                if (filterSelect[0]) {
                    return filterSelect[0];
                }
            }
        }
        return null;
    };
    handler.__loadFooter = (grid: Grid) => {
        removeAllChild(grid.gridFooter);
        grid.gridFooter._gridFooterCells.length = 0;
        for(let rowCount = 1; rowCount <= grid.getFooterRowCount(); rowCount++) {
            const tempRows = [];
            let colCount = 1;
            for(const colInfo of grid._colInfos) {
                const tempGridData = document.createElement('v-g-d') as Cell ;
                tempGridData._gridId = grid._id;
                tempGridData._grid = grid;
                tempGridData._type = 'gfd';
                Object.keys(colInfo).forEach(key => {
                    if (['header', 'footer', 'rowMerge', 'colMerge', 'filterValue','index'].indexOf(key) < 0) {
                        (tempGridData as any)[key] = (colInfo as any)[key];
                    }
                });
                if (colInfo.footer && colInfo.footer[rowCount - 1]) {
                    tempGridData.footer = colInfo.footer[rowCount - 1];
                }
                
                handler.setGridDataRowCol(tempGridData, rowCount, colCount);
                tempRows.push(tempGridData);
                colCount++;
            }
            grid.gridFooter._gridFooterCells.push(tempRows);
        }
    
        for(const row of grid.gridFooter._gridFooterCells) {
            for(const cell of row) {
                grid.gridFooter.append(cell);
            }
        }
    }
    handler._getFooterRow = (grid: Grid, rowIndex: number) => {
        return getArrayElementWithBoundCheck(grid.gridFooter._gridFooterCells, rowIndex - 1);
    };
    handler._getFooterCell = (grid: Grid, rowIndex: number, colIndexOrColId: number | string) => {
        if (typeof colIndexOrColId === 'number') {
            return getArrayElementWithBoundCheck(handler._getFooterRow(grid, rowIndex), colIndexOrColId - 1);
        }
        else {
            for(const cell of handler._getFooterRow(grid, rowIndex)) {
                if (cell.colId === colIndexOrColId) return cell;
            }
        }
        throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
    };
    handler._getFooterCells = (grid: Grid) => {
        return grid.gridFooter._gridFooterCells;
    };
    handler._getRow = (grid: Grid, rowIndex: number) => {
        return grid.gridBody._gridBodyCells[rowIndex - 1];
    };
    handler._getCell = (grid: Grid, rowIndex: number, colIndexOrColId: number | string) => {
        try {
            if (typeof colIndexOrColId === 'number') {
                return grid.gridBody._gridBodyCells[rowIndex - 1][colIndexOrColId - 1];
            }
            else {
                for(const cell of grid.gridBody._gridBodyCells[rowIndex - 1]) {
                    if (cell.colId === colIndexOrColId) return cell;
                }
            }
        } catch (error) {
            return null;
        }
        return null;
    };
    handler._getCells = (grid: Grid) => {
        return grid.gridBody._gridBodyCells;
    };
    handler.__gridBodyCellsReConnected = (grid: Grid) => {
        if (!grid._variables._isDrawable) return;
        for(const row of grid.gridBody._gridBodyCells) {
            for(const cell of row) {
                handler.reConnectedCallbackElement(cell);
            }
        }
    };
    handler.__mountGridBodyCell = (grid: Grid) => {
        if (!grid._variables._isDrawable) return;
        removeAllChild(grid.gridBody);
        for(const row of grid.gridBody._gridBodyCells) {
            for(const cell of row) {
                grid.gridBody.append(cell);
            }
        }
        
        handler.reloadGridForMerge(grid);
        
        grid.reloadFilterValue();
        grid.reloadFooterValue();
    };
    handler.__clear = (grid: Grid) => {
        grid.gridBody._gridBodyCells.length = 0;
        grid._variables._activeRows = [];
        grid._variables._activeCols = [];
        grid._variables._activeCells = [];
        grid._variables._targetCell = null;
        grid._variables._records = [];
        grid._variables._recordseq = 0;
    };
    handler.__checkRowIndex = (grid: Grid, row: number) => {
        row = validatePositiveIntegerAndZero(row);
        if (!row || row < 1 || row > grid.getRowCount()) throw new Error('Please insert a row of valid range.');
    };
    handler.__checkColRownumOrStatus = (grid: Grid, colIndexOrColId: number | string) => {
        if(typeof colIndexOrColId === 'number') {
            if (colIndexOrColId <= 2) throw new Error('The row number or status columns info cannot be modified.');
        }
        else {
            if(colIndexOrColId === 'v-g-rownum' || colIndexOrColId === 'v-g-status') throw new Error('The row number or status columns info cannot be modified.');
        }
    };
    handler.__checkColIndex = (grid: Grid, col: number) => {
        col = validatePositiveIntegerAndZero(col);
        if (!col || col < 1 || col > grid.getColCount()) throw new Error('Please insert a col of valid range.');
    };
    handler.___getDatasWithoutExceptedProperty = (grid: Grid, exceptedProperty: string[] = []) => {
        const datas = [];
        let cols;
        for(const rows of grid.gridBody._gridBodyCells) {
            cols = [];
            for(const cell of rows) {
                const data = handler.__getData(cell, exceptedProperty);
                cols.push(data);
            }
            datas.push(cols);
        }
        return datas;
    };
    handler._doFilter = (grid: Grid) => {
        grid._variables._filters = [];
        let filter: any;
        grid.gridHeader.querySelectorAll('.' + grid._id + '_filterSelect').forEach(function (filterSelect: any) {
            if (filterSelect.value !== '$$ALL') {
                filter = {
                    colId : filterSelect.colId,
                    value : filterSelect.value,
                };
                handler.__getColInfo(grid, filterSelect.parentNode.parentNode.index)!.filterValue = filterSelect.value;
                if (filter.value === '$$NULL' || filter.value === null || filter.value === undefined || filter.value === '') filter.value = grid._gridInfo.nullValue;
                grid._variables._filters.push(filter);
            }
        });
    
        if (grid._variables._filters.length === 0) {
            handler._getCells(grid).forEach(function (cells: any) {
                cells.forEach(function (cell: any) {
                    cell.cFilter = false;
                })
            })
        }
        else {
            let rowCount = 1;
            handler._getCells(grid).forEach(function (cells: any) {
                let _isFilter = false;
                cells.forEach(function (cell: any) {
                    grid._variables._filters.forEach(function (filter: any) {
                        if (cell.colId === filter.colId) {
                            let cellValue: any = handler.getTextFromCell(cell);
    
                            Object.keys(vg.dataType).forEach((key) => {
                                if(cell.dataType === key) {
                                    if(vg.dataType[key].getFilterValue) {
                                        if(typeof vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                                        cellValue = vg.dataType[key].getFilterValue(cell.value);
                                    }
                                }
                            });
                            
                            if (cellValue != filter.value) _isFilter = true;
                        }
                    });
                });
                handler._getRow(grid, rowCount).forEach(function (filterCell: any) {
                    filterCell.cFilter = _isFilter;
                })
                rowCount++;
            });
        }
        grid.load(grid.getDatas());
    };
    handler.__gridCellReConnectedWithControlSpan = (cell: Cell) => {
        handler.reConnectedCallbackElement(cell);
        if(cell.rowSpan) {
            for(let row = cell._row + 1; row < cell._row + cell.rowSpan; row++) {
                handler.__gridCellReConnectedWithControlSpan(handler._getCell(cell._grid, row, cell._col)!);
            }
        }
        if(cell.colSpan) {
            for(let col = cell._col + 1; col < cell._col + cell.colSpan; col++) {
                handler.__gridCellReConnectedWithControlSpan(handler._getCell(cell._grid, cell._row, col)!);
            }
        }
    };
    //수정필요 cell data 형태
    handler.__getData = (cell: Cell, exceptedProperty: string[] = []): CellData => {
        const data: CellData = {
            //_gridId : cell._gridId,
            //_type : cell._type,
            //_row : cell._row,
            //_col : cell._col,
            value : cell.value,
            //colInfo
            colId : cell.colId,
            index : cell.index,
            name : cell.name,
            header : cell.header,
            footer : cell.footer,
            untarget : cell.untarget,
            rowMerge : cell.rowMerge,
            colMerge : cell.colMerge,
            colVisible : cell.colVisible,
            required : cell.required,
            resizable : cell.resizable,
            sortable : cell.sortable,
            filterable : cell.filterable,
            originWidth : cell.originWidth,
            dataType : cell.dataType,
            selectSize : cell.selectSize,
            locked : cell.locked,
            lockedColor : cell.lockedColor,
            format : cell.format,
            codes : deepCopy(cell.codes),
            defaultCode : cell.defaultCode,
            maxLength : cell.maxLength,
            maxByte : cell.maxByte,
            maxNumber : cell.maxNumber,
            minNumber : cell.minNumber,
            roundNumber : cell.roundNumber,
            align : cell.align,
            verticalAlign : cell.verticalAlign,
            overflowWrap : cell.overflowWrap,
            wordBreak : cell.wordBreak,
            whiteSpace : cell.whiteSpace,
            backColor : cell.backColor,
            fontColor : cell.fontColor,
            fontBold : cell.fontBold,
            fontItalic : cell.fontItalic,
            fontThruline : cell.fontThruline,
            fontUnderline : cell.fontUnderline,
        };
        
        data.text = handler.getTextFromCell(cell);
        if(cell.rowSpan) data.rowSpan = cell.rowSpan;
        if(cell.colSpan) data.colSpan = cell.colSpan;
        if(cell.isRowMerge) data.isRowMerge = cell.isRowMerge;
        if(cell.isColMerge) data.isColMerge = cell.isColMerge;
        if(cell.filterValues) data.filterValues = deepCopy(cell.filterValues);
        if(cell.filterValue) data.filterValue = cell.filterValue;
        if(cell.filter) data.filter = cell.filter;
        if(cell.rowVisible) data.rowVisible = cell.rowVisible;
    
        if (exceptedProperty) {
            if (exceptedProperty.indexOf('untarget') >= 0) data.untarget = null;
            if (exceptedProperty.indexOf('colVisible') >= 0) data.colVisible = null;
            if (exceptedProperty.indexOf('rowVisible') >= 0) data.rowVisible = null;
            if (exceptedProperty.indexOf('required') >= 0) data.required = null;
            if (exceptedProperty.indexOf('resizable') >= 0) data.resizable = null;
            if (exceptedProperty.indexOf('originWidth') >= 0) data.originWidth = null;
            if (exceptedProperty.indexOf('dataType') >= 0) data.dataType = null;
            if (exceptedProperty.indexOf('selectSize') >= 0) data.selectSize = null;
            if (exceptedProperty.indexOf('locked') >= 0) data.locked = null;
            if (exceptedProperty.indexOf('lockedColor') >= 0) data.lockedColor = null;
            if (exceptedProperty.indexOf('format') >= 0) data.format = null;
            if (exceptedProperty.indexOf('codes') >= 0) data.codes = null;
            if (exceptedProperty.indexOf('defaultCode') >= 0) data.defaultCode = null;
            if (exceptedProperty.indexOf('maxLength') >= 0) data.maxLength = null;
            if (exceptedProperty.indexOf('maxByte') >= 0) data.maxByte = null;
            if (exceptedProperty.indexOf('maxNumber') >= 0) data.maxNumber = null;
            if (exceptedProperty.indexOf('minNumber') >= 0) data.minNumber = null;
            if (exceptedProperty.indexOf('roundNumber') >= 0) data.roundNumber = null;
            if (exceptedProperty.indexOf('align') >= 0) data.align = null;
            if (exceptedProperty.indexOf('verticalAlign') >= 0) data.verticalAlign = null;
            if (exceptedProperty.indexOf('backColor') >= 0) data.backColor = null;
            if (exceptedProperty.indexOf('fontColor') >= 0) data.fontColor = null;
            if (exceptedProperty.indexOf('fontBold') >= 0) data.fontBold = null;
            if (exceptedProperty.indexOf('fontItalic') >= 0) data.fontItalic = null;
            if (exceptedProperty.indexOf('fontThruline') >= 0) data.fontThruline = null;
            if (exceptedProperty.indexOf('fontUnderline') >= 0) data.fontUnderline = null;
            if (exceptedProperty.indexOf('filter') >= 0) data.filter = null;
            if (exceptedProperty.indexOf('value') >= 0) data.value = null;
        }
        return data;
    };
    //수정필요 cell data 형태
    handler.__setCellData = (grid: Grid, row: number, colIndexOrColId: number | string, cellData: CellData, isImmutableColCheck = true) => {
        handler.__checkRowIndex(grid, row);
        const colIndex = handler.__getColIndex(grid, colIndexOrColId, true)!;
        if (colIndex <= 2) {
            if (isImmutableColCheck) throw new Error('The row number or status columns are immutable.');
            return false;
        }
        const cell = handler._getCell(grid, row, colIndex);
        if (cellData.untarget) cell!.untarget = cellData.untarget;
        if (cellData.dataType) cell!.dataType = cellData.dataType;
        if (cellData.selectSize) cell!.selectSize = cellData.selectSize;
        if (cellData.locked) cell!.locked = cellData.locked;
        if (cellData.lockedColor) cell!.lockedColor = cellData.lockedColor;
        if (cellData.format) cell!.format = cellData.format;
        if (cellData.codes) cell!.codes = cellData.codes;
        if (cellData.defaultCode) cell!.defaultCode = cellData.defaultCode;
        if (cellData.maxLength) cell!.maxLength = cellData.maxLength;
        if (cellData.maxByte) cell!.maxByte = cellData.maxByte;
        if (cellData.maxNumber) cell!.maxNumber = cellData.maxNumber;
        if (cellData.minNumber) cell!.minNumber = cellData.minNumber;
        if (cellData.roundNumber) cell!.roundNumber = cellData.roundNumber;
        if (cellData.align) cell!.align = cellData.align;
        if (cellData.verticalAlign) cell!.verticalAlign = cellData.verticalAlign;
        if (cellData.overflowWrap) cell!.overflowWrap = cellData.overflowWrap;
        if (cellData.wordBreak) cell!.wordBreak = cellData.wordBreak;
        if (cellData.whiteSpace) cell!.whiteSpace = cellData.whiteSpace;
        if (cellData.backColor) cell!.backColor = cellData.backColor;
        if (cellData.fontColor) cell!.fontColor = cellData.fontColor;
        if (cellData.fontBold) cell!.fontBold = cellData.fontBold;
        if (cellData.fontItalic) cell!.fontItalic = cellData.fontItalic;
        if (cellData.fontThruline) cell!.fontThruline = cellData.fontThruline;
        if (cellData.fontUnderline) cell!.fontUnderline = cellData.fontUnderline;
        if (cellData.value) cell!.value = cellData.value;
        handler.reConnectedCallbackElement(cell!);
        handler.reloadGridWithModifyCell(grid, cell!.index!);
        return true;
    };
    handler._getDataTypeStyle = (grid: Grid) => {
        const dataTypeStyle: any = {};
        Object.keys(vg.dataType).forEach((key) => {
            if(vg.dataType[key].cellStyle) {
                (dataTypeStyle as any)[key] = vg.dataType[key].cellStyle;
            }
        });
        return dataTypeStyle;
    };
    handler._getFilterSpan = () => {
        return vg.elements.filterSpan;
    };
    handler._getFooterFormula = () => {
        return deepCopy(vg.footerFormula);
    };
}
