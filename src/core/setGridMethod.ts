import type { Grid, Vanillagrid } from "../types/vanillagrid";
import type { ColInfo } from "../types/colInfo";
import type { CellData } from "../types/cell";
import { Align, alignUnit, enumWidthUnit, SelectionPolicy, selectionPolicyUnit, statusUnit, VerticalAlign, verticalAlignUnit } from "../types/enum";
import { ___getDatasWithoutExceptedProperty, __checkColIndex, __checkColRownumOrStatus, __checkRowIndex, __clear, __getColIndex, __getColInfo, __getData, __getDefaultColInfo, __getHeaderFilter, __gridBodyCellsReConnected, __gridCellReConnectedWithControlSpan, __loadFooter, __loadHeader, __mountGridBodyCell, __setCellData, _doFilter, _getCell, _getFooterCell, _getHeaderCell } from "../utils/handleGrid";
import { changeColSize, getGridCell, reloadFilterValue, reloadFooterValue, reloadGridForMerge, reloadGridWithModifyCell, sort } from "../utils/handleElement";
import { checkIsValueOrData, deepCopy, extractNumberAndUnit, getArrayElementWithBoundCheck, getColorFromColorSet, getHexColorFromColorName, getOnlyNumberWithNaNToNull, getVerticalAlign, isIncludeEnum, removeAllChild, setColorSet, setInvertColor, validateIntegerAndZero, validateNumber, validatePositiveIntegerAndZero } from "../utils/utils";
import { focusCell, getRecordsWithModifyValue, reConnectedCallbackElement, recordGridModify, redoundo, selectCell, selectCells, unselectCells } from "../utils/handleActive";
import { createGridEditor, getCellText, getValidValue, isCellVisible } from "../utils/handleCell";
import { setGridCssStyle } from "../utils/createElement";

export const setGridMethod = (vg: Vanillagrid, grid: Grid) => {
    grid.getHeaderRowCount = () => {
        let count = 0;
        for(const colInfo of grid._colInfos) {
            if (colInfo.header!.length > count) count = colInfo.header!.length;
        }
        return count;
    };
    grid.getHeaderText = (colIndexOrColId: number | string) => {
        return __getColInfo(grid, colIndexOrColId, true)!.header!.join(';');
    };
    grid.setHeaderText = (colIndexOrColId: number | string, value: string) => {
        const headerTextArr = value.split(';');
        for(let r = headerTextArr.length; r < grid.getHeaderRowCount(); r++) {
            headerTextArr.push('');
        }
        for(let r = headerTextArr.length; r > grid.getHeaderRowCount(); r--) {
            grid._colInfos.forEach((colInfo) => {
                colInfo.header!.push('');
            })
        }
        __getColInfo(grid, colIndexOrColId, true)!.header = headerTextArr;
        __loadHeader(grid);
        grid.reloadFilterValue();
        return true;
    };
    grid.reloadFilterValue = () => {
        for(const colInfo of grid._colInfos) {
            grid.reloadColFilter(colInfo.index!);
        }
        return true;
    }
    grid.reloadColFilter = (colIndexOrColId: number | string) => {
        reloadFilterValue(grid, colIndexOrColId);
        return true;
    }
    grid.getFooterRowCount = () => {
        let count = 0;
        for(const colInfo of grid._colInfos) {
            if (colInfo.footer && colInfo.footer.length > count) count = colInfo.footer.length;
        }
        return count;
    };
    grid.reloadFooterValue = () => {
        reloadFooterValue(grid);
        return true;
    };
    grid.setFooterValue = (row: number, colId: number | string, value: string) => {
        const footerCell = _getFooterCell(grid, row, colId);
        footerCell.value = value;
        footerCell.innerText = value;
        return true;
    };
    grid.getFooterValue = (row: number, colId: number | string) => {
        return _getFooterCell(grid, row, colId).value;
    };
    grid.setFooterFormula = (colId: number | string, formula: string) => {
        __getColInfo(grid, colId, true)!.footer = formula.split(';');
        __loadFooter(grid);
        return true;
    };
    grid.getFooterFormula = (colId: number | string) => {
        const footerFormulas = deepCopy(__getColInfo(grid, colId, true)!.footer);
        if (footerFormulas && Array.isArray(footerFormulas)) {
            for(let i = 0; i < footerFormulas.length; i++) {
                if (typeof footerFormulas[i] === 'function') footerFormulas[i] = '$$FUNC';
            }
            return footerFormulas.join(';');
        }
        return null;
    };
    grid.setFooterFunction = (row: number, colId: number | string, func: Function) => {
        const footerFormulas = __getColInfo(grid, colId, true)!.footer;
        if (footerFormulas) {
            getArrayElementWithBoundCheck(footerFormulas, row - 1); 
            footerFormulas[row - 1] = func;
        }
        else {
            __getColInfo(grid, colId, true)!.footer = new Array(grid.getFooterRowCount()).fill('');
            __getColInfo(grid, colId, true)!.footer[row - 1]! = func;
        }
        __loadFooter(grid);
        return true;
    };
    grid.getGridInfo = () => {
        const resultInfo = deepCopy(grid._gridInfo)
        resultInfo.id = grid._id;
        resultInfo.cssInfo = deepCopy(grid._gridCssInfo);
        return resultInfo;
    };
    //수정필요 cell data 형태
    grid.load = (keyValueOrDatas: Record<string, any> | Record<string, any>[]) => {
        if (!keyValueOrDatas) return false;
        if (!Array.isArray(keyValueOrDatas)) throw new Error('Please insert valid datas.');
        
        const isKeyValue = checkIsValueOrData(keyValueOrDatas);
        __clear(grid);

        if (isKeyValue) {    
            const keyValues = keyValueOrDatas;
            for(let rowCount = 1; rowCount <= keyValues.length; rowCount++) {
                const tempRows = [];
                const keyValue = keyValues[rowCount - 1];
                for(let colCount = 1; colCount <= grid._colInfos.length; colCount++) {
                    const tempGridData = getGridCell(grid, grid._colInfos[colCount - 1], keyValue, rowCount, colCount);
                    tempRows.push(tempGridData);
                }
                grid.gridBody._gridBodyCells.push(tempRows);
            }
        }
        else {
            const datas = keyValueOrDatas;
            for(let rowCount = 1; rowCount <= datas.length; rowCount++) {
                const tempRows = [];
                const colDatas = datas[rowCount - 1];
                for(let colCount = 1; colCount <= grid._colInfos.length; colCount++) {
                    const tempGridData = getGridCell(grid, grid._colInfos[colCount - 1], colDatas, rowCount, colCount);
                    tempRows.push(tempGridData);
                }
            grid.gridBody._gridBodyCells.push(tempRows);
            }
        }
        __mountGridBodyCell(grid);
        return true;
    };
    grid.clear = () => {
        removeAllChild(grid.gridBody);
        grid._variables._sortToggle = {};
        grid._variables._filters = [];
        __clear(grid);
        return true;
    };
    grid.clearStatus = () => {
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, 2);
            cell!.value = null;
            reConnectedCallbackElement(cell!);
        }
        return true;
    };
    grid.getRowCount = () => {
        return grid.gridBody._gridBodyCells.length;
    };
    grid.getColCount = () => {
        return grid._colInfos.length;
    };
    grid.getValues = () => {
        const keyValues = [];
        let cols;
        for(const rows of grid.gridBody._gridBodyCells) {
            cols = {};
            for(const cell of rows) {
                (cols as any)[cell.colId] = deepCopy(cell.value);
            }
            keyValues.push(cols);
        }
        return keyValues;
    };
    //수정필요 cell data 형태
    grid.getDatas = () => {
        return ___getDatasWithoutExceptedProperty(grid);
    };
    grid.sort = (colId: string, isAsc = true, isNumSort = false) => {
        const datas = grid.getDatas();
        const sortDatas = sort(grid, datas, colId, isAsc, isNumSort);
        const sortToggle = grid._variables._sortToggle[colId];
        grid.load(sortDatas);
        grid._variables._sortToggle[colId] = sortToggle;
        return true;
    };
    grid.checkRequired = <T>(func?: (data: CellData) => T) => {
        if (func && typeof func !== 'function') throw new Error('Please insert a valid function.');
        for(const rows of grid.gridBody._gridBodyCells) {
            for(const cell of rows) {
                if(cell.required
                    && ['select','checkbox','button','link'].indexOf(cell.dataType!) < 0
                    && (cell.value === '' || cell.value === null || cell.value === undefined || cell.value === grid._gridInfo.nullValue)) {
                    if(func) {
                        return func(__getData(cell));
                    }
                    return __getData(cell);
                }
            }
        }
        return null;
    }
    grid.setGridMount = (isDrawable: boolean) => {
        isDrawable = isDrawable === true;
        grid._variables._isDrawable = isDrawable;
        if (isDrawable) {
            __mountGridBodyCell(grid);        
        }
        return true;
    };
    grid.getGridFilter = () => {
        return grid._variables._filters;
    }
    grid.setGridWidth = (cssTextWidth: string) => {
        if (!cssTextWidth) throw new Error('Please insert cssText of width.');
        grid._gridCssInfo.width = cssTextWidth;
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridHeight = (cssTextHeight: string) => {
        if (!cssTextHeight) throw new Error('Please insert cssText of height.');
        grid._gridCssInfo.height = cssTextHeight;
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridSizeLevel = (sizeLevel: number) => {
        sizeLevel = getOnlyNumberWithNaNToNull(sizeLevel)!;
        if (!sizeLevel) throw new Error('Please insert number of size level.');
        grid._gridCssInfo.sizeLevel = sizeLevel;
        grid._gridCssInfo.cellFontSize = ((grid._gridCssInfo.sizeLevel + 15) / 20) * 14 + 'px';    
        grid._gridCssInfo.cellMinHeight = ((grid._gridCssInfo.sizeLevel + 15) / 20) * 21 + 'px';    
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridVerticalAlign = (verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) => {
        if (!verticalAlign) throw new Error('Please insert vertical align.');
        if (!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
        const cssTextVerticalAlign = getVerticalAlign(verticalAlign)
        grid._gridCssInfo.verticalAlign = cssTextVerticalAlign;
        setGridCssStyle(grid);
        return true;
    };
    grid.setCellFontSize = (cssTextFontSize: string) => {
        if (!cssTextFontSize) throw new Error('Please insert cssText of cell font size.');
        grid._gridCssInfo.cellFontSize = cssTextFontSize;
        setGridCssStyle(grid);
        return true;
    };
    grid.setCellMinHeight = (cssTextMinHeight: string) => {
        if (!cssTextMinHeight) throw new Error('Please insert cssText of cell min height.');
        grid._gridCssInfo.cellMinHeight = cssTextMinHeight;
        setGridCssStyle(grid);
        return true;
    };
    grid.setHorizenBorderSize = (pxHorizenBorderSize: number) => {
        validatePositiveIntegerAndZero(pxHorizenBorderSize);
        grid._gridCssInfo.horizenBorderSize = pxHorizenBorderSize;
        setGridCssStyle(grid);
        return true;
    };
    grid.setVerticalBorderSize = (pxVerticalBorderSize: number) => {
        validatePositiveIntegerAndZero(pxVerticalBorderSize);
        grid._gridCssInfo.verticalBorderSize = pxVerticalBorderSize;
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridColor = (cssTextHexColor: string) => {
        if (!/^#[0-9a-fA-F]{6}$/.test(cssTextHexColor)) {
            throw new Error('Please insert valid cssText of hexadecimal color. (#ffffff)');
        }
        grid._gridCssInfo.color = cssTextHexColor;
        setColorSet(grid._gridCssInfo);
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridColorSet = (colorName: string) => {
        const hexColor = getColorFromColorSet(colorName);
        grid._gridCssInfo.color = hexColor;
        setColorSet(grid._gridCssInfo);
        setGridCssStyle(grid);
        return true;
    };
    grid.invertColor = (doInvert: boolean) => {
        doInvert = doInvert === true;
        if (doInvert) setInvertColor(grid._gridCssInfo);
        else setColorSet(grid._gridCssInfo);
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridName = (gridName: string) => {
        if (!gridName) throw new Error('Please insert a gridName.');
        grid._gridInfo.name = String(gridName);
        return true;
    };
    grid.getGridName = () => {
        return grid._gridInfo.name!;
    };
    //수정필요 cell data 형태
    grid.setGridLocked = (isLocked: boolean) => {
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.locked = isLocked;
        grid._colInfos.forEach((colInfo, idx) => {
            if (idx >= 2) {  
                colInfo.locked = isLocked;
            }
        })
        const datas = ___getDatasWithoutExceptedProperty(grid, ['locked']);
        grid.load(datas);
        return true;
    };
    grid.isGridLocked = () => {
        return grid._gridInfo.locked!;
    };
    //수정필요 cell data 형태
    grid.setGridLockedColor = (isLockedColor: boolean) => {
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.lockedColor = isLockedColor;
        grid._colInfos.forEach((colInfo, idx) => {
            if (idx >= 2) {  
                colInfo.lockedColor = isLockedColor;
            }
        })
        const datas = ___getDatasWithoutExceptedProperty(grid, ['lockedColor']);
        grid.load(datas);
        return true;
    };
    grid.setGridResizable = (isResizable: boolean) => {
        if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.resizable = isResizable;
        return true;
    };
    grid.isGridResizable = () => {
        return grid._gridInfo.resizable;
    };
    grid.setGridRecordCount = (recordCount: number) => {
        recordCount = validatePositiveIntegerAndZero(recordCount);
        grid._gridInfo.redoCount = recordCount;
        return true;
    };
    grid.getGridRecordCount = () => {
        return grid._gridInfo.redoCount!;
    };
    grid.setGridRedoable = (isRedoable: boolean) => {
        if (typeof isRedoable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.redoable = isRedoable;
        return true;
    };
    grid.isGridRedoable = () => {
        return grid._gridInfo.redoable!;
    };
    grid.setGridVisible = (isVisible: boolean) => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.visible = isVisible;
        setGridCssStyle(grid);
        return true;
    };
    grid.isGridVisible = () => {
        return grid._gridInfo.visible!;
    };
    grid.setHeaderVisible = (isVisible: boolean) => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.headerVisible = isVisible;
        setGridCssStyle(grid);
        return true;
    };
    grid.isHeaderVisible = () => {
        return grid._gridInfo.headerVisible!;
    };
    grid.setGridRownumLockedColor = (isRownumLockedColor: boolean) => {
        if (typeof isRownumLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.rownumLockedColor = isRownumLockedColor;
        grid._colInfos[0].lockedColor = isRownumLockedColor;

        for(const row of grid.gridBody._gridBodyCells) {
            row[0].lockedColor = isRownumLockedColor;
            reConnectedCallbackElement(row[0]);
        }
        return true;
    };
    grid.isGridRownumLockedColor = () => {
        return grid._gridInfo.rownumLockedColor!;
    };
    grid.setGridRownumSize = (rownumSize: number) => {
        rownumSize = validatePositiveIntegerAndZero(rownumSize);
        const colInfo = grid._colInfos[0];
        colInfo.originWidth = String(rownumSize) + extractNumberAndUnit(colInfo.originWidth)!.unit
        changeColSize(grid, colInfo.index!, rownumSize);
        colInfo.colVisible = rownumSize !== 0;
        reloadGridWithModifyCell(grid, colInfo.index!);
        return true;
    };
    grid.getGridRownumSize = () => {
        return grid._colInfos[0].originWidth!;
    };
    grid.setGridStatusLockedColor = (isStatusLockedColor: boolean) => {
        if (typeof isStatusLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.statusLockedColor = isStatusLockedColor;
        grid._colInfos[1].lockedColor = isStatusLockedColor;

        for(const row of grid.gridBody._gridBodyCells) {
            row[1].lockedColor = isStatusLockedColor;
            reConnectedCallbackElement(row[1]);
        }
        return true;
    };
    grid.isGridStatusLockedColor = () => {
        return grid._gridInfo.statusLockedColor!;
    };
    grid.setGridSelectionPolicy = (selectionPolicy: SelectionPolicy.range | SelectionPolicy.single | SelectionPolicy.none) => {
        if (!isIncludeEnum(selectionPolicyUnit, selectionPolicy)) throw new Error('Please insert the correct selectionPolicy properties. (single, range, none)');
        grid._gridInfo.selectionPolicy = selectionPolicy;
        return true
    };
    grid.getGridSelectionPolicy = () => {
        return grid._gridInfo.selectionPolicy!;
    };
    grid.setGridNullValue = (nullValue: any) => {
        grid._gridInfo.nullValue = nullValue;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.getGridNullValue = () => {
        return deepCopy(grid._gridInfo.nullValue);
    };
    grid.setGridDateFormat = (dateFormat: string) => {
        grid._gridInfo.dateFormat = dateFormat;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.getGridDateFormat = () => {
        return grid._gridInfo.dateFormat!;
    };
    grid.setGridMonthFormat = (monthFormat: string) => {
        grid._gridInfo.monthFormat = monthFormat;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.getGridMonthFormat = () => {
        return grid._gridInfo.monthFormat!;
    };
    grid.setGridAlterRow = (isAlterRow: boolean) => {
        if (typeof isAlterRow !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.alterRow = isAlterRow;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.setGridFrozenColCount = (frozenColCount: number) => {
        frozenColCount = validatePositiveIntegerAndZero(frozenColCount);
        const styleGridTemplateColumns = grid.gridHeader.style.gridTemplateColumns;
        if (styleGridTemplateColumns.includes('%') && grid._gridInfo.frozenColCount !== 0) {
            throw new Error(grid._id + ' has error. If you set the horizontal size to a percentage, property A is not available.');
        }

        grid._gridInfo.frozenColCount = frozenColCount;
        const datas = grid.getDatas();
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.getGridFrozenColCount = () => {
        return grid._gridInfo.frozenColCount!;
    };
    grid.setGridFrozenRowCount = (frozenRowCount: number) => {
        frozenRowCount = validatePositiveIntegerAndZero(frozenRowCount);
        grid._gridInfo.frozenRowCount = frozenRowCount;
        const datas = grid.getDatas();
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.getGridFrozenRowCount = () => {
        return grid._gridInfo.frozenRowCount!;
    };
    grid.setGridSortable = (isSortable: boolean) => {
        if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.sortable = isSortable;
        return true;
    };
    grid.isGridSortable = () => {
        return grid._gridInfo.sortable!;
    };
    grid.setGridFilterable = (isFilterable: boolean) => {
        if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.filterable = isFilterable;
        const datas = grid.getDatas();
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.isGridFilterable = () => {
        return grid._gridInfo.filterable!;
    };
    grid.setGridAllCheckable = (isAllCheckable: boolean) => {
        if (typeof isAllCheckable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.allCheckable = isAllCheckable;
        return true;
    };
    grid.isGridAllCheckable = () => {
        return grid._gridInfo.allCheckable!;
    };
    grid.setGridCheckedValue = (checkeValue: string) => {
        if (typeof checkeValue !== 'string') throw new Error('Please insert a string type.');
        if (grid._gridInfo.uncheckedValue === checkeValue) throw new Error('Checked and unchecked values cannot be the same.');
        const datas = grid.getDatas();
        for(const rows of datas) {
            for(const data of rows) {
                if (data.dataType === 'checkbox') {
                    if (data.value === grid._gridInfo.checkedValue) {
                        data.value = checkeValue;
                    }
                } 
            }
        }
        grid._gridInfo.checkedValue = checkeValue;
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.getGridCheckedValue = () => {
        return grid._gridInfo.checkedValue!;
    };
    grid.setGridUncheckedValue = (unCheckedValue: string) => {
        if (typeof unCheckedValue !== 'string') throw new Error('Please insert a string type.');
        if (grid._gridInfo.checkedValue === unCheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
        const datas = grid.getDatas();
        for(const rows of datas) {
            for(const data of rows) {
                if (data.dataType === 'checkbox') {
                    if (data.value !== grid._gridInfo.checkedValue) {
                        data.value = unCheckedValue;
                    }
                } 
            }
        }
        grid._gridInfo.uncheckedValue = unCheckedValue;
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.getGridUncheckedValue = () => {
        return grid._gridInfo.uncheckedValue!;
    };
    grid.addCol = (colIndexOrColId: number | string, colInfo: ColInfo) => {
        let colIndex = __getColIndex(grid, colIndexOrColId);
        if (colIndex! < 2) throw new Error('You cannot add new columns between the row number and status columns.');
        if (!colIndex || colIndex > grid.getColCount()) colIndex = grid.getColCount();

        const newColInfo = __getDefaultColInfo(grid, colInfo, true);
        const datas = grid.getDatas();
        
        grid._colInfos.splice(colIndex, 0, newColInfo);
        grid._colInfos.forEach((colInfo, idx) => {
            colInfo.index = idx + 1;
        });

        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.removeCol = (colIndexOrColId: number | string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (colIndex <= 2) throw new Error('The row number or status columns cannot be removed.');
        const result = grid.getColValues(colIndex);

        grid._colInfos.splice(colIndex - 1, 1);
        grid._colInfos.forEach((colInfo, idx) => {
            colInfo.index = idx + 1;
        });

        const datas = grid.getDatas();
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);

        return result;
    };
    //수정필요 cell data 형태
    grid.setColInfo = (colInfo: ColInfo) => {
        if (!colInfo) throw new Error('Column info is required.');
        if (colInfo.constructor !== Object) throw new Error('Please insert a valid column info');
        let colIndexOrColId;
        if (colInfo.index) colIndexOrColId = colInfo.index;
        if (colInfo.colId) colIndexOrColId = colInfo.colId;
        if (!colIndexOrColId) throw new Error('Column id is required.');
        
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (colIndex <= 2) throw new Error('The row number or status columns are immutable.');

        const newColInfo = grid._colInfos[colIndex - 1];
        Object.keys(newColInfo).forEach((key)=>{
            if(['colId', 'index'].indexOf(key) === -1) {
                const newColInfoKey = key.charAt(1).toLowerCase() + key.slice(2);
                Object.keys(colInfo).forEach((colInfoKey) => {
                    if(newColInfoKey === colInfoKey) {
                        (newColInfo as any)[key] = colInfo[colInfoKey as keyof ColInfo];
                    }
                });
            }
        });

        const datas = grid.getDatas();
        datas.forEach((row: any) => {
            for(const data of row) {
                if (data.colId === newColInfo.colId) {
                    Object.keys(newColInfo).forEach(key => {
                        if (['header', 'footer', 'rowMerge', 'colMerge', 'filterValue'].indexOf(key) < 0) {
                            const dataKey = key.charAt(1).toLowerCase() + key.slice(2);
                            data[dataKey] = (newColInfo as any)[key];
                        }
                    });
                }
            }
        })

        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.getColInfo = (colIndexOrColId: number | string) => {
        const colInfo = __getColInfo(grid, colIndexOrColId)!;

        const info: ColInfo = {
            colId : colInfo.colId,
            index : colInfo.index,
            name : colInfo.name,
            untarget : colInfo.untarget,
            colVisible : colInfo.colVisible,
            required : colInfo.required,
            resizable : colInfo.resizable,
            originWidth : colInfo.originWidth,
            dataType : colInfo.dataType,
            selectSize : colInfo.selectSize,
            locked : colInfo.locked,
            lockedColor : colInfo.lockedColor,
            format : colInfo.format,
            codes : deepCopy(colInfo.codes),
            defaultCode : colInfo.defaultCode,
            maxLength : colInfo.maxLength,
            maxByte : colInfo.maxByte,
            maxNumber : colInfo.maxNumber,
            minNumber : colInfo.minNumber,
            roundNumber : colInfo.roundNumber,
            align : colInfo.align,
            verticalAlign : colInfo.verticalAlign,
            overflowWrap : colInfo.overflowWrap,
            wordBreak : colInfo.wordBreak,
            whiteSpace : colInfo.whiteSpace,
            backColor : colInfo.backColor,
            fontColor : colInfo.fontColor,
            fontBold : colInfo.fontBold,
            fontItalic : colInfo.fontItalic,
            fontThruline : colInfo.fontThruline,
            fontUnderline : colInfo.fontUnderline,
            rowMerge : colInfo.rowMerge,
            colMerge : colInfo.colMerge,
            sortable : colInfo.sortable,
            filterable : colInfo.filterable,
            filterValues : deepCopy(colInfo.filterValues),
            filterValue : deepCopy(colInfo.filterValue),
            filter : colInfo.filter,
            rowVisible : colInfo.rowVisible,
            header : null,
            footer : null,
        };
        
        // if (colInfo.header && Array.isArray(colInfo.header)) info.header = colInfo.header.join(';');
        // if (colInfo.footer && Array.isArray(colInfo.footer)) info.footer = colInfo.footer.join(';');
        return info;
    };
    grid.getColDatas = (colIndexOrColId: number | string): CellData[] => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colDatas = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            colDatas.push(grid.getCellData(row, colIndex));
        }
        return colDatas;
    };
    grid.setColSameValue = (colIndexOrColId: number | string, value: any, doRecord = false)  => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColRownumOrStatus(grid, colIndex);
        if (doRecord) {
            const records = [];
            for(let row = 1; row <= grid.getRowCount(); row++) {
                let cell = _getCell(grid, row, colIndex)!;
                let record = getRecordsWithModifyValue(cell, value, true);
                if (Array.isArray(record) && record.length > 0) records.push(record[0]);
            }
            recordGridModify(grid, records);
        }
        else {
            for(let row = 1; row <= grid.getRowCount(); row++) {
                let cell = _getCell(grid, row, colIndex)!;
                cell.value = getValidValue(cell, value);
                reConnectedCallbackElement(cell);
            }
            reloadGridWithModifyCell(grid, colIndex);
        }
        return true;
    };
    grid.getColValues = (colIndexOrColId: number | string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colValues = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            let cell = _getCell(grid, row, colIndex)!;
            colValues.push(deepCopy(cell.value));
        }
        return colValues;
    };
    grid.getColTexts = (colIndexOrColId: number | string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colTexts = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            colTexts.push(grid.getCellText(row, colIndex));
      }
        return colTexts;
    };
    grid.isColUnique = (colIndexOrColId: number | string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colValues = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            let cell = _getCell(grid, row, colIndex)!;
            switch (cell.dataType) {
                case 'select':
                case 'checkbox':
                case 'button':
                case 'link':
                    colValues.push(getCellText(cell));
                    break;
                default:
                    colValues.push(cell.value);
                    break;
            }
        }
        return colValues.length === new Set(colValues).size;
    };
    grid.openFilter = (colIndexOrColId: number | string) => {
        __getHeaderFilter(grid, colIndexOrColId).style.display = 'block';
        return true;
    };
    grid.closeFilter = (colIndexOrColId: number | string) => {
        __getHeaderFilter(grid, colIndexOrColId).style.display = 'none';
        return true;
    };
    grid.setColFilterValue = (colIndexOrColId: number | string, filterValue: string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        if(!colInfo.filterValues!.has(filterValue))  throw new Error('Please insert a valid filterValue. ' + Array.from(colInfo.filterValues!).join(', '));

        let headerCell;
        let modifyFilterSelect: any;
        for(let row = 1; row <= grid.getHeaderRowCount(); row++) {
            headerCell = _getHeaderCell(grid, row, colInfo.index!);
            modifyFilterSelect = headerCell.querySelectorAll('.' + grid._id + '_filterSelect');
            if(modifyFilterSelect.length > 0) {
                modifyFilterSelect = modifyFilterSelect[0]
                break;
            }
        }
        modifyFilterSelect.value = filterValue;
        if(modifyFilterSelect.value !== '$$ALL') modifyFilterSelect.style.display = 'block';

        _doFilter(grid);
        return true;
    };
    grid.getColFilterValues = (colIndexOrColId: number | string): string[]  => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return Array.from(colInfo.filterValues!);
    };
    grid.getColFilterValue = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.filterValue ? colInfo.filterValue : null;
    };
    grid.getColId = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo  = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.colId;
    };
    grid.getColIndex = (colIndexOrColId: number | string) => {
        return __getColIndex(grid, colIndexOrColId, true)!;
    };
    grid.setColName = (colIndexOrColId: number | string, colName: string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (!colName) throw new Error('Column Name is required');
        if (typeof colName !== 'string') throw new Error('Please insert a string type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.name = colName;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex)!.name = colName;
        }
        return true;
    };
    grid.getColName = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId)!;
        return colInfo.name!;
    };
    grid.setColUntarget = (colIndexOrColId: number | string, isUntarget: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isUntarget !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.untarget = isUntarget;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex)!.untarget = isUntarget;
        }
        return true;
    };
    grid.setColRowMerge = (colIndexOrColId: number | string, isRowMerge: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isRowMerge !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.rowMerge = isRowMerge;
    
        const datas = grid.getDatas();
        grid.load(datas);
        return true;
    };
    grid.isColRowMerge = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.rowMerge;
    };
    grid.setColColMerge = (colIndexOrColId: number | string, isColMerge: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isColMerge !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.colMerge = isColMerge;
    
        const datas = grid.getDatas();
        grid.load(datas);
        return true;
    };
    grid.isColColMerge = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.colMerge;
    };
    grid.setColVisible = (colIndexOrColId: number | string, isVisible: boolean) => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        if (isVisible) {
            changeColSize(grid, colInfo.index!, extractNumberAndUnit(colInfo.originWidth)!.number);
        }
        else {
            changeColSize(grid, colInfo.index!, 0)
        }
        colInfo.colVisible = isVisible;
        __loadHeader(grid);
        reloadGridWithModifyCell(grid, colInfo.index!);
        return true;
    };
    grid.isColVisible = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.colVisible!;
    };
    grid.setColRequired = (colIndexOrColId: number | string, isRequired: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex, true)!;
        colInfo.required = isRequired;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex)!.required = isRequired;
        }
        return true;
    };
    grid.isColRequired = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.required!;
    };
    grid.setColResizable = (colIndexOrColId: number | string, isResizable: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        colInfo.resizable = isResizable;
        __loadHeader(grid);
        return true;
    };
    grid.isColResizable = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.resizable!;
    };
    grid.setColSortable = (colIndexOrColId: number | string, isSortable: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        colInfo.sortable = isSortable;
        return true;
    };
    grid.isColSortable = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.sortable!;
    };
    grid.setColFilterable = (colIndexOrColId: number | string, isFilterable: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex, true)!;
        colInfo.filterable = isFilterable;
        __loadHeader(grid);
        reloadFilterValue(grid, colIndexOrColId);
        return true;
    };
    grid.isColFilterable = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.filterable!;
    };
    grid.setColOriginWidth = (colIndexOrColId: number | string, originWidth: string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        const newOriginWidth = extractNumberAndUnit(originWidth)!;
        if (!isIncludeEnum(enumWidthUnit, newOriginWidth.unit!)) throw new Error('Width units can only be pixel or %.');
        colInfo.originWidth = newOriginWidth.number + newOriginWidth.unit!;
        changeColSize(grid, colInfo.index!, newOriginWidth.number);
        if(newOriginWidth.number === 0) colInfo.colVisible = false;
        else colInfo.colVisible = true;
        __loadHeader(grid);
        reloadGridWithModifyCell(grid, colInfo.index!);
        return true;
    };
    grid.getColOriginWidth = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.originWidth!;
    };
    grid.setColDataType = (colIndexOrColId: number | string, dataType: string) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (!Object.keys(grid._vg.dataType).includes(dataType)) throw new Error('Please insert a valid dataType.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.dataType = dataType;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.dataType = dataType;
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColDataType = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.dataType!;
    };
    grid.setColSelectSize = (colIndexOrColId: number | string, cssTextSelectSize: string) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.selectSize = cssTextSelectSize;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.selectSize = cssTextSelectSize;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColSelectSize = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.selectSize;
    };
    grid.setColLocked = (colIndexOrColId: number | string, isLocked: boolean) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.locked = isLocked;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.locked = isLocked;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColLocked = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.locked!;
    };
    grid.setColLockedColor = (colIndexOrColId: number | string, isLockedColor: boolean) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.lockedColor = isLockedColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.lockedColor = isLockedColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColLockedColor = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.lockedColor!;
    };
    grid.setColFormat = (colIndexOrColId: number | string, format: string) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof format !== 'string') throw new Error('Please insert a string type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.format = format;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.format = format;
            if(cell.dataType === 'mask') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColFormat = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.format;
    };
    grid.setColCodes = (colIndexOrColId: number | string, codes: string[]) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.codes = codes;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.codes = codes;
            if(cell.dataType === 'code') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColCodes = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.codes;
    };
    grid.setColDefaultCode = (colIndexOrColId: number | string, defaultCode: string) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.defaultCode = defaultCode;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.defaultCode = defaultCode;
            if(cell.dataType === 'code') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColDefaultCode = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.defaultCode;
    };
    grid.setColMaxLength = (colIndexOrColId: number | string, maxLength: number) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        maxLength = validatePositiveIntegerAndZero(maxLength);
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.maxLength = maxLength;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.maxLength = maxLength;
            if(cell.dataType === 'text') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColMaxLength = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.maxLength;
    };
    grid.setColMaxByte = (colIndexOrColId: number | string, maxByte: number) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        maxByte = validatePositiveIntegerAndZero(maxByte);
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.maxByte = maxByte;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.maxByte = maxByte;
            if(cell.dataType === 'text') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColMaxByte = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.maxByte;
    };
    grid.setColMaxNumber = (colIndexOrColId: number | string, maxNumber: number) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        maxNumber = validateNumber(maxNumber);
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.maxNumber = maxNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.maxNumber = maxNumber;
            if(cell.dataType === 'number') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColMaxNumber = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.maxNumber;
    };
    grid.setColMinNumber = (colIndexOrColId: number | string, minNumber: number) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        minNumber = validateNumber(minNumber);
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.minNumber = minNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.minNumber = minNumber;
            if(cell.dataType === 'number') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColMinNumber = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.minNumber;
    };
    grid.setColRoundNumber = (colIndexOrColId: number | string, roundNumber: number) => {
        __checkColRownumOrStatus(grid, colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        roundNumber = validateIntegerAndZero(roundNumber);
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.roundNumber = roundNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.roundNumber = roundNumber;
            if(cell.dataType === 'number') {
                cell.value = getValidValue(cell, cell.value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getColRoundNumber = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.roundNumber;
    };
    grid.setColAlign = (colIndexOrColId: number | string, align: Align.left | Align.center | Align.right) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if(!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.align = align;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.align = align;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColAlign = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.align;
    };
    grid.setColVerticalAlign = (colIndexOrColId: number | string, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if(!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.verticalAlign = verticalAlign;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.verticalAlign = verticalAlign;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColVerticalAlign = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.verticalAlign;
    };
    grid.setColOverflowWrap = (colIndexOrColId: number | string, overflowWrap: string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.overflowWrap = overflowWrap;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.overflowWrap = overflowWrap;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColOverflowWrap = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.overflowWrap;
    };
    grid.setColWordBreak = (colIndexOrColId: number | string, wordBreak: string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.wordBreak = wordBreak;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.wordBreak = wordBreak;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColWordBreak = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.wordBreak;
    };
    grid.setColWhiteSpace = (colIndexOrColId: number | string, whiteSpace: string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.whiteSpace = whiteSpace;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.whiteSpace = whiteSpace;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColWhiteSpace = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.whiteSpace;
    };
    grid.setColBackColor = (colIndexOrColId: number | string, hexadecimalBackColor: string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.backColor = hexadecimalBackColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.backColor = hexadecimalBackColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColBackColor = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.backColor;
    };
    grid.setColFontColor = (colIndexOrColId: number | string, hexadecimalFontColor: string) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.fontColor = hexadecimalFontColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.fontColor = hexadecimalFontColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColFontColor = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.fontColor;
    };
    grid.setColFontBold = (colIndexOrColId: number | string, isFontBold: boolean) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.fontBold = isFontBold;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.fontBold = isFontBold;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontBold = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.fontBold!;
    };
    grid.setColFontItalic = (colIndexOrColId: number | string, isFontItalic: boolean) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.fontItalic = isFontItalic;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.fontItalic = isFontItalic;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontItalic = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.fontItalic!;
    };
    grid.setColFontThruline = (colIndexOrColId: number | string, isFontThruline: boolean) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.fontThruline = isFontThruline;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.fontThruline = isFontThruline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontThruline = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.fontThruline!;
    };
    grid.setColFontUnderline = (colIndexOrColId: number | string, isFontUnderline: boolean) => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: ColInfo = __getColInfo(grid, colIndex)!;
        colInfo.fontUnderline = isFontUnderline;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex)!;
            cell.fontUnderline = isFontUnderline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontUnderline = (colIndexOrColId: number | string) => {
        const colInfo: ColInfo = __getColInfo(grid, colIndexOrColId, true)!;
        return colInfo.fontUnderline!;
    };
    grid.addRow = (rowOrValuesOrDatas?: number | Record<string, any> | Record<string, any>[], valuesOrDatas?: Record<string, any> | Record<string, any>[]) => {
        let row, addKeyValueOrDatas;

        if (rowOrValuesOrDatas === 0) rowOrValuesOrDatas = 1
        if (rowOrValuesOrDatas) {
            if (typeof rowOrValuesOrDatas === 'number') {
                row = rowOrValuesOrDatas - 1;
                addKeyValueOrDatas = valuesOrDatas;
            }
            else {
                addKeyValueOrDatas = rowOrValuesOrDatas;
            }
        }
        else {
            addKeyValueOrDatas = valuesOrDatas;
        }
        if (row === null || row === undefined || row > grid.getRowCount()) row = grid.getRowCount();
        if (!addKeyValueOrDatas) addKeyValueOrDatas = [[{}]];
        else addKeyValueOrDatas = [addKeyValueOrDatas];
        if (addKeyValueOrDatas === null || !Array.isArray(addKeyValueOrDatas)) throw new Error('Please insert valid datas.');
        const isKeyValue = checkIsValueOrData(addKeyValueOrDatas);
        const datas = grid.getDatas();
        let cnt = 0;
        for(const keyValueOrData of addKeyValueOrDatas) {
            if (isKeyValue) {
                const tempRow: any = [];
                let tempCol;
                for (const key in keyValueOrData) {
                    tempCol = {
                        id : key,
                        value : (keyValueOrData as any)[key],
                    };
                    tempRow.push(tempCol);
                }
                datas.splice(row + cnt, 0, tempRow);
            }
            else {
                datas.splice(row + cnt, 0, keyValueOrData as CellData[]);
            }
            cnt++;
        }
        grid.load(datas);
        for(let r = row; r < row + cnt; r++) {
            grid.setRowStatus(r + 1, 'C');
        }
        focusCell(_getCell(grid, row + 1, 'v-g-status')!);
        return true;
    };
    grid.removeRow = (row: number) => {
        __checkRowIndex(grid, row);
        const result = grid.getRowValues(row);
        result['v-g-status'] = 'D';
        const datas = grid.getDatas();
        datas.splice(row - 1, 1);
        grid.load(datas);
        return result;
    };
    grid.setRowStatus = (row: number, status: string) => {
        __checkRowIndex(grid, row);
        if (!isIncludeEnum(statusUnit, status)) throw new Error('Please insert the correct status code. (C, U, D)');
        const statusCell = _getCell(grid, row, 'v-g-status')!;
        statusCell.value = status;
        reConnectedCallbackElement(statusCell);
        return true;
    };
    grid.getRowStatus = (row: number) => {
        __checkRowIndex(grid, row);
        return _getCell(grid, row, 'v-g-status')!.value;
    };
    grid.setRowDatas = (row: number, cellDatas: CellData[]) => {
        for(const cellData of cellDatas) {
            __setCellData(grid, row, cellData.colId, cellData, false);
        }
        return true;
    };
    grid.getRowDatas = (row: number) => {
        __checkRowIndex(grid, row);
        const rowDatas = [];
        for(const colInfo of grid._colInfos) {
            rowDatas.push(grid.getCellData(row, colInfo.index!));
        }
        return rowDatas;
    };
    grid.setRowValues = (row: number, values: Record<string, any>, doRecord = false) => {
        row = 2;
        __checkRowIndex(grid, row);
        if (!values || values.constructor !== Object) throw new Error('Please insert a valid value.');
        let value = null;
        let cell = null;

        if (doRecord) {
            const records = [];
            let record
            for(const colInfo of grid._colInfos) {
                if (colInfo.colId === 'v-g-rownum' || colInfo.colId === 'v-g-status') continue;
                for(const key in values) {
                    if (colInfo.colId === key) value = values[key];
                }
                cell = _getCell(grid, row, colInfo.index!)!;
                record = getRecordsWithModifyValue(cell, value, true);
                if (Array.isArray(record) && record.length > 0) records.push(record[0]);
            }
            recordGridModify(grid, records);
        }
        else {
            for(const colInfo of grid._colInfos) {
                if (colInfo.colId === 'v-g-rownum' || colInfo.colId === 'v-g-status') continue;
                for(const key in values) {
                    if (colInfo.colId === key) value = values[key];
                }
                cell = _getCell(grid, row, colInfo.index!)!;
                cell.value = getValidValue(cell, value);
                reConnectedCallbackElement(cell);
                reloadGridWithModifyCell(grid, cell.index!);
            }
        }
        return true;
    };
    grid.getRowValues = (row: number) => {
        __checkRowIndex(grid, row);
        const rowValues = {};
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            (rowValues as any)[cell.colId] = deepCopy(cell.value);
        }
        return rowValues;
    };
    grid.getRowTexts = (row: number): Record<string, string> => {
        __checkRowIndex(grid, row);
        const rowTexts = {};
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            (rowTexts as any)[cell.colId] = getCellText(cell);
        }
        return rowTexts;
    };
    grid.setRowVisible = (row: number, isVisible: boolean) => {
        __checkRowIndex(grid, row);
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        for(let c = 1; c <= grid.getColCount(); c++) {
            const cell = _getCell(grid, row, c)!;
            cell.rowVisible = isVisible;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isRowVisible = (row: number) => {
        __checkRowIndex(grid, row);
        const cell = _getCell(grid, row, 1)!;
        return cell.rowVisible!;
    };
    grid.setRowDataType = (row: number, dataType: string) => {
        __checkRowIndex(grid, row);
        if (!Object.keys(grid._vg.dataType).includes(dataType)) throw new Error('Please insert a valid dataType.');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.dataType = dataType;
            reConnectedCallbackElement(cell);
        }
        reloadGridForMerge(grid);
        
        grid.reloadFilterValue();
        
        grid.reloadFooterValue();
        return true;
    };
    grid.setRowLocked = (row: number, isRowLocked: boolean) => {
        __checkRowIndex(grid, row);
        if (typeof isRowLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.locked = isRowLocked;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowLockedColor = (row: number, isRowLockedColor: boolean) => {
        __checkRowIndex(grid, row);
        if (typeof isRowLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.lockedColor = isRowLockedColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowAlign = (row: number, align: Align.left | Align.center | Align.right) => {
        __checkRowIndex(grid, row);
        if (!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.align = align;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowVerticalAlign = (row: number, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) => {
        __checkRowIndex(grid, row);
        if (!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.verticalAlign = verticalAlign;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowBackColor = (row: number, hexadecimalBackColor: string) => {
        __checkRowIndex(grid, row);
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.backColor = hexadecimalBackColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontColor = (row: number, hexadecimalFontColor: string) => {
        __checkRowIndex(grid, row);
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.fontColor = hexadecimalFontColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontBold = (row: number, isRowFontBold: boolean) => {
        __checkRowIndex(grid, row);
        if (typeof isRowFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.fontBold = isRowFontBold;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontItalic = (row: number, isRowFontItalic: boolean) => {
        __checkRowIndex(grid, row);
        if (typeof isRowFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.fontItalic = isRowFontItalic;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontThruline = (row: number, isRowFontThruline: boolean) => {
        __checkRowIndex(grid, row);
        if (typeof isRowFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.fontThruline = isRowFontThruline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontUnderline = (row: number, isRowFontUnderline: boolean) => {
        __checkRowIndex(grid, row);
        if (typeof isRowFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of grid.gridBody._gridBodyCells[row - 1]) {
            if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
            cell.fontUnderline = isRowFontUnderline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.searchRowsWithMatched = (matches: Record<string, any>) => {
        if (matches.constructor !== Object) throw new Error('Please insert a valid matches. (Object)');
        const matchedRows: number[] = [];
        let isMatched;
        grid.gridBody._gridBodyCells.forEach((row, rowIndex: number) => {
            isMatched = true;
            for(const cell of row) {
                for(const key of Object.keys(matches)) {
                    if (cell.colId === key && cell.value !== matches[key]) {
                        isMatched = false;
                        break;
                    }
                }
            }
            if(isMatched) matchedRows.push(rowIndex + 1);
        })
        return matchedRows;
    };
    grid.searchRowDatasWithMatched = (matches: Record<string, any>) => {
        const matchedRows = grid.searchRowsWithMatched(matches);
        const matchedRowDatas: Record<string, any>[][] = [];
        matchedRows.forEach((row: number) => {
            matchedRowDatas.push(grid.getRowDatas(row));
        })
        return matchedRowDatas;
    };
    grid.searchRowValuesWithMatched = (matches: Record<string, any>) => {
        const matchedRows = grid.searchRowsWithMatched(matches);
        const matchedRowValues: Record<string, any>[] = [];
        matchedRows.forEach((row: number) => {
            matchedRowValues.push(grid.getRowValues(row));
        })
        return matchedRowValues;
    };
    grid.searchRowsWithFunction = (func: (rowDatas: CellData[]) => boolean) => {
        if (typeof func !== 'function') throw new Error('Please insert a valid function.');
        const matchedRows = [];
        let isMatched;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            isMatched = func(grid.getRowDatas(row));
            if(isMatched) matchedRows.push(row);
        }
        return matchedRows;
    };
    grid.searchRowDatasWithFunction = (func: (rowDatas: CellData[]) => boolean) => {
        const matchedRows = grid.searchRowsWithFunction(func);
        const matchedRowDatas: Record<string, any>[][] = [];
        matchedRows.forEach((row: number) => {
            matchedRowDatas.push(grid.getRowDatas(row));
        })
        return matchedRowDatas;
    };
    grid.searchRowValuesWithFunction = (func: (rowDatas: CellData[]) => boolean) => {
        const matchedRows = grid.searchRowsWithFunction(func);
        const matchedRowValues: Record<string, any>[] = [];
        matchedRows.forEach((row: number) => {
            matchedRowValues.push(grid.getRowValues(row));
        })
        return matchedRowValues;
    };
    grid.setCellData = (row: number, colIndexOrColId: number | string, cellData: CellData) => {
        return __setCellData(grid, row, colIndexOrColId, cellData);
    }
    grid.getCellData = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        
        const cell = _getCell(grid, row, colIndex)!;
        const data = __getData(cell);
        return data;
    }
    grid.setCellValue = (row: number, colIndexOrColId: number | string, value: any, doRecord = false) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);

        const cell = _getCell(grid, row, colIndex)!;
        if (doRecord) {
            recordGridModify(grid, getRecordsWithModifyValue(cell, value, true));
        }
        else {
            cell.value = getValidValue(cell, value);
            reConnectedCallbackElement(cell);
            reloadGridWithModifyCell(grid, cell.index!);
        }
        return true;
    };
    grid.getCellValue = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);

        return deepCopy(_getCell(grid, row, colIndex)!.value);
    };
    grid.getCellText = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);

        return getCellText(_getCell(grid, row, colIndex)!);
    };
    grid.setCellRequired = (row: number, colIndexOrColId: number | string, isRequired: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');

        const cell = _getCell(grid, row, colIndex)!;
        cell.required = isRequired;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    }
    grid.getCellRequired = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.required!;
    }
    grid.setCellDataType = (row: number, colIndexOrColId: number | string, dataType: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        if (!Object.keys(grid._vg.dataType).includes(dataType)) throw new Error('Please insert a valid dataType.');
        const cell = _getCell(grid, row, colIndex)!;
        cell.dataType = dataType;
        reConnectedCallbackElement(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellDataType = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        return _getCell(grid, row, colIndex)!.dataType!;
    };
    grid.setCellLocked = (row: number, colIndexOrColId: number | string, isLocked: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');

        const cell = _getCell(grid, row, colIndex)!;
        cell.locked = isLocked;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellLocked = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.locked!;
    };
    grid.setCellLockedColor = (row: number, colIndexOrColId: number | string, isLockedColor: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex)!;
        cell.lockedColor = isLockedColor;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellLockedColor = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.lockedColor!;
    };
    grid.setCellFormat = (row: number, colIndexOrColId: number | string, format: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        if (typeof format !== 'string') throw new Error('Please insert a string type.');
        const cell = _getCell(grid, row, colIndex)!;
        cell.format = format;
        if(cell.dataType === 'mask') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellFormat = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.format;
    };
    grid.setCellCodes = (row: number, colIndexOrColId: number | string, codes: string[]) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
        const cell = _getCell(grid, row, colIndex)!;
        cell.codes = codes;
        if(cell.dataType === 'code') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellCodes = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.codes;
    };
    grid.setCellDefaultCode = (row: number, colIndexOrColId: number | string, defaultCode: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        const cell = _getCell(grid, row, colIndex)!;
        cell.defaultCode = defaultCode;
        if(cell.dataType === 'code') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellDefaultCode = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.defaultCode;
    };
    grid.setCellMaxLength = (row: number, colIndexOrColId: number | string, maxLength: number) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        maxLength = validatePositiveIntegerAndZero(maxLength);
        const cell = _getCell(grid, row, colIndex)!;
        cell.maxLength = maxLength;
        if(cell.dataType === 'text') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellMaxLength = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.maxLength;
    };
    grid.setCellMaxByte = (row: number, colIndexOrColId: number | string, maxByte: number) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        maxByte = validatePositiveIntegerAndZero(maxByte);
        const cell = _getCell(grid, row, colIndex)!;
        cell.maxByte = maxByte;
        if(cell.dataType === 'text') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellMaxByte = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.maxByte;
    };
    grid.setCellMaxNumber = (row: number, colIndexOrColId: number | string, maxNumber: number) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        maxNumber = validateNumber(maxNumber);
        const cell = _getCell(grid, row, colIndex)!;
        cell.maxNumber = maxNumber;
        if(cell.dataType === 'number') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellMaxNumber = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.maxNumber;
    };
    grid.setCellMinNumber = (row: number, colIndexOrColId: number | string, minNumber: number) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        minNumber = validateNumber(minNumber);
        const cell = _getCell(grid, row, colIndex)!;
        cell.minNumber = minNumber;
        if(cell.dataType === 'number') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellMinNumber = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.minNumber;
    };
    grid.setCellRoundNumber = (row: number, colIndexOrColId: number | string, roundNumber: number) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        roundNumber = validateIntegerAndZero(roundNumber);
        const cell = _getCell(grid, row, colIndex)!;
        cell.roundNumber = roundNumber;
        if(cell.dataType === 'number') {
            cell.value = getValidValue(cell, cell.value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid, colIndex);
        return true;
    };
    grid.getCellRoundNumber = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.roundNumber;
    };
    grid.setCellAlign = (row: number, colIndexOrColId: number | string, align: Align.left | Align.center | Align.right) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if(!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        const cell = _getCell(grid, row, colIndex)!;
        cell.align = align;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellAlign = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.align!;
    };
    grid.setCellVerticalAlign = (row: number, colIndexOrColId: number | string, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if(!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
        const cell = _getCell(grid, row, colIndex)!;
        cell.verticalAlign = verticalAlign;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellVerticalAlign = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.verticalAlign;
    };
    grid.setCellOverflowWrap = (row: number, colIndexOrColId: number | string, overflowWrap: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        const cell = _getCell(grid, row, colIndex)!;
        cell.overflowWrap = overflowWrap;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellOverflowWrap = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.overflowWrap;
    };
    grid.setCellWordBreak = (row: number, colIndexOrColId: number | string, wordBreak: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        const cell = _getCell(grid, row, colIndex)!;
        cell.wordBreak = wordBreak;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellWordBreak = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.wordBreak;
    };
    grid.setCellWhiteSpace = (row: number, colIndexOrColId: number | string, whiteSpace: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        const cell = _getCell(grid, row, colIndex)!;
        cell.whiteSpace = whiteSpace;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellWhiteSpace = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.whiteSpace;
    };
    grid.setCellVisible = (row: number, colIndexOrColId: number | string, isVisible: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');

        const cell = _getCell(grid, row, colIndex)!;
        if (isVisible) {
            if (cell.firstChild) (cell.firstChild as any).style.removeProperty('display');
        }
        else {
            if (cell.firstChild) (cell.firstChild as any).style.display = 'none'
        }
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellVisible = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        const cell = _getCell(grid, row, colIndex)!;
        if(cell.firstChild) (cell.firstChild as any).style.display !== 'none';
        return false;
    };
    grid.setCellBackColor = (row: number, colIndexOrColId: number | string, hexadecimalBackColor: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const cell = _getCell(grid, row, colIndex)!;
        cell.backColor = hexadecimalBackColor;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellBackColor = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.backColor;
    };
    grid.setCellFontColor = (row: number, colIndexOrColId: number | string, hexadecimalFontColor: string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const cell = _getCell(grid, row, colIndex)!;
        cell.fontColor = hexadecimalFontColor;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellFontColor = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.fontColor;
    };
    grid.setCellFontBold = (row: number, colIndexOrColId: number | string, isFontBold: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex)!;
        cell.fontBold = isFontBold;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontBold = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.fontBold!;
    };
    grid.setCellFontItalic = (row: number, colIndexOrColId: number | string, isFontItalic: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex)!;
        cell.fontItalic = isFontItalic;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontItalic = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.fontItalic!;
    };
    grid.setCellFontThruline = (row: number, colIndexOrColId: number | string, isFontThruline: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex)!;
        cell.fontThruline = isFontThruline;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontThruline = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.fontThruline!;
    };
    grid.setCellFontUnderline = (row: number, colIndexOrColId: number | string, isFontUnderline: boolean) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex)!;
        cell.fontUnderline = isFontUnderline;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontUnderline = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        return _getCell(grid, row, colIndex)!.fontUnderline!;
    };
    grid.setTargetCell = (row:number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);

        const targetCell = _getCell(grid, row, colIndex)!;
        if (!isCellVisible(targetCell)) return false;

        grid._vg._status.activeGrid = grid;
        return selectCell(targetCell);
    }
    grid.getTargetRow = () => {
        return grid._variables._targetCell ? grid._variables._targetCell._row : null;
    }
    grid.getTargetCol = () => {
        return grid._variables._targetCell ? grid._variables._targetCell.colId : null;
    }
    grid.setActiveCells = (startRow: number, startColIndexOrColId: number | string, endRow: number, endColIndexOrColId: number | string) => {
        __checkRowIndex(grid, startRow);
        __checkRowIndex(grid, endRow);
        const startColIndex = __getColIndex(grid, startColIndexOrColId, true)!;
        const endColIndex = __getColIndex(grid, endColIndexOrColId, true)!;
        __checkColIndex(grid, startColIndex);
        __checkColIndex(grid, endColIndex);

        const startCell = _getCell(grid, startRow, startColIndex)!;
        const endCell = _getCell(grid, endRow, endColIndex)!;
        
        if (!isCellVisible(startCell)) return false;
        if (!isCellVisible(endCell)) return false;

        grid._vg._status.activeGrid = grid;
        grid._variables._targetCell = startCell;
        unselectCells(grid);
        return selectCells(startCell, endCell, startCell);
    }
    grid.getActiveRows = () => {
        return grid._variables._activeRows;
    }
    grid.getActiveCols = () => {
        const colIds: string[] = [];
        grid._variables._activeCols.forEach((colIndex: number) => {
            colIds.push(__getColInfo(grid, colIndex)!.colId);
        });
        return colIds;
    }
    grid.getActiveRange = (): {
        startRow: number | null;
        startColId : string | null;
        endRow : number | null;
        endColId : string | null;
    } => {
        const range: {
            startRow : number | null,
            startColId : string | null,
            endRow : number | null,
            endColId : string | null,
        } = {
            startRow : null,
            startColId : null,
            endRow : null,
            endColId : null,
        };
        const activeCells = grid._variables._activeCells;
        if (activeCells.length > 0) {
            range.startRow = activeCells[0]._row; 
            range.startColId = activeCells[0].colId; 
            range.endRow = activeCells[activeCells.length - 1]._row; 
            range.endColId = activeCells[activeCells.length - 1].colId; 
        }
        return range;
    }
    grid.editCell = (row: number, colIndexOrColId: number | string) => {
        __checkRowIndex(grid, row);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        __checkColIndex(grid, colIndex);
        __checkColRownumOrStatus(grid, colIndex);
        const cell = _getCell(grid, row, colIndexOrColId)!;
        if (['select','checkbox','button','link'].indexOf(cell.dataType!) >= 0) return false;
        if (!grid.setTargetCell(row, colIndexOrColId)) return false;
        createGridEditor(cell);
        return true;
    }
    grid.redo = () => {
        return redoundo(grid);
    }
    grid.undo = () => {
        return redoundo(grid, false);
    }
}
