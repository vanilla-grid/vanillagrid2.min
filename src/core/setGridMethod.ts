import type { Grid, Vanillagrid } from "../types/vanillagrid";
import type { ColInfo } from "../types/colInfo";
import { ___getDatasWithoutExceptedProperty, __clear, __getColIndex, __getColInfo, __getData, __getDefaultColInfo, __gridBodyCellsReConnected, __loadFooter, __loadHeader, __mountGridBodyCell, _getCell, _getFooterCell } from "../utils/handleGrid";
import { changeColSize, getGridCell, reloadFilterValue, reloadFooterValue, reloadGridWithModifyCell, sort } from "../utils/handleElement";
import { checkIsValueOrData, deepCopy, extractNumberAndUnit, getArrayElementWithBoundCheck, getColorFromColorSet, getOnlyNumberWithNaNToNull, getVerticalAlign, isIncludeEnum, removeAllChild, setColorSet, setInvertColor, validatePositiveIntegerAndZero } from "../utils/utils";
import { reConnectedCallbackElement } from "../utils/handleActive";
import { CellData } from "../types/cell";
import { setGridCssStyle } from "../utils/createElement";
import { SelectionPolicy, selectionPolicyUnit, VerticalAlign, verticalAlignUnit } from "../types/enum";

const setGridMethod = (vg: Vanillagrid, grid: Grid) => {
    grid.getHeaderRowCount = (): number => {
        let count = 0;
        for(const colInfo of grid._colInfos) {
            if (colInfo.header!.length > count) count = colInfo.header!.length;
        }
        return count;
    };
    grid.getHeaderText = (colIndexOrColId: number | string): string => {
        return __getColInfo(grid, colIndexOrColId, true)!.header!.join(';');
    };
    grid.setHeaderText = (colIndexOrColId: number | string, value: string): boolean => {
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
    grid.reloadFilterValue = (): boolean => {
        for(const colInfo of grid._colInfos) {
            grid.reloadColFilter(colInfo.index!);
        }
        return true;
    }
    grid.reloadColFilter = (colIndexOrColId: number | string): boolean => {
        reloadFilterValue(grid, colIndexOrColId);
        return true;
    }
    grid.getFooterRowCount = (): number => {
        let count = 0;
        for(const colInfo of grid._colInfos) {
            if (colInfo.footer && colInfo.footer.length > count) count = colInfo.footer.length;
        }
        return count;
    };
    grid.reloadFooterValue = (): boolean => {
        reloadFooterValue(grid);
        return true;
    };
    grid.setFooterValue = (row: number, colId: number | string, value: string): boolean => {
        const footerCell = _getFooterCell(grid, row, colId);
        footerCell._value = value;
        footerCell.innerText = value;
        return true;
    };
    grid.getFooterValue = (row: number, colId: number | string): string => {
        return _getFooterCell(grid, row, colId)._value;
    };
    grid.setFooterFormula = (colId: number | string, formula: string): boolean => {
        __getColInfo(grid, colId, true)!.footer = formula.split(';');
        __loadFooter(grid);
        return true;
    };
    grid.getFooterFormula = (colId: number | string): string | null => {
        const footerFormulas = deepCopy(__getColInfo(grid, colId, true)!.footer);
        if (footerFormulas && Array.isArray(footerFormulas)) {
            for(let i = 0; i < footerFormulas.length; i++) {
                if (typeof footerFormulas[i] === 'function') footerFormulas[i] = '$$FUNC';
            }
            return footerFormulas.join(';');
        }
        return null;
    };
    grid.setFooterFunction = (row: number, colId: number | string, func: Function): boolean => {
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
        const gridInfo = grid._gridInfo;
        const resultInfo = deepCopy(grid._gridInfo)
        resultInfo.id = grid._id;
        resultInfo.cssInfo = deepCopy(grid._gridCssInfo);
        return resultInfo;
    };
    //수정필요 cell data 형태
    grid.load = (keyValueOrDatas: Record<string, any> | Record<string, any>[]): boolean => {
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
                    const tempGridData = getGridCell(grid._id, grid._colInfos[colCount - 1], keyValue, rowCount, colCount);
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
                    const tempGridData = getGridCell(grid._id, grid._colInfos[colCount - 1], colDatas, rowCount, colCount);
                    tempRows.push(tempGridData);
                }
            grid.gridBody._gridBodyCells.push(tempRows);
            }
        }
        __mountGridBodyCell(grid);
        return true;
    };
    grid.clear = (): boolean => {
        removeAllChild(grid.gridBody);
        grid._variables._sortToggle = {};
        grid._variables._filters = [];
        __clear(grid);
        return true;
    };
    grid.clearStatus = (): boolean => {
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, 2);
            cell!._value = null;
            reConnectedCallbackElement(cell!);
        }
        return true;
    };
    grid.getRowCount = (): number => {
        return grid.gridBody._gridBodyCells.length;
    };
    grid.getColCount = (): number => {
        return grid._colInfos.length;
    };
    grid.getValues = (): Record<string, any>[] => {
        const keyValues = [];
        let cols;
        for(const rows of grid.gridBody._gridBodyCells) {
            cols = {};
            for(const cell of rows) {
                (cols as any)[cell._colInfo.id] = deepCopy(cell._value);
            }
            keyValues.push(cols);
        }
        return keyValues;
    };
    //수정필요 cell data 형태
    grid.getDatas = () => {
        return ___getDatasWithoutExceptedProperty(grid);
    };
    grid.sort = (colId: string, isAsc = true, isNumSort = false): boolean => {
        const datas = grid.getDatas();
        const sortDatas = sort(grid, datas, colId, isAsc, isNumSort);
        const sortToggle = grid._variables._sortToggle[colId];
        grid.load(sortDatas);
        grid._variables._sortToggle[colId] = sortToggle;
        return true;
    };
    grid.checkRequired = <T>(func?: (data: CellData) => T): CellData | T | null => {
        if (func && typeof func !== 'function') throw new Error('Please insert a valid function.');
        for(const rows of grid.gridBody._gridBodyCells) {
            for(const cell of rows) {
                if(cell._colInfo.required
                    && ['select','checkbox','button','link'].indexOf(cell._colInfo.dataType!) < 0
                    && (cell._value === '' || cell._value === null || cell._value === undefined || cell._value === grid._gridInfo.nullValue)) {
                    if(func) {
                        return func(__getData(cell));
                    }
                    return __getData(cell);
                }
            }
        }
        return null;
    }
    grid.setGridMount = (isDrawable: boolean): boolean => {
        isDrawable = isDrawable === true;
        grid._variables._isDrawable = isDrawable;
        if (isDrawable) {
            __mountGridBodyCell(grid);        
        }
        return true;
    };
    grid.getGridFilter = (): Record<string, any>[] => {
        return grid._variables._filters;
    }
    grid.setGridWidth = (cssTextWidth: string): boolean => {
        if (!cssTextWidth) throw new Error('Please insert cssText of width.');
        grid._gridCssInfo.width = cssTextWidth;
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridHeight = (cssTextHeight: string): boolean => {
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
    grid.setGridVerticalAlign = (verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom): boolean => {
        if (!verticalAlign) throw new Error('Please insert vertical align.');
        if (!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
        const cssTextVerticalAlign = getVerticalAlign(verticalAlign)
        grid._gridCssInfo.verticalAlign = cssTextVerticalAlign;
        setGridCssStyle(grid);
        return true;
    };
    grid.setCellFontSize = (cssTextFontSize: string): boolean => {
        if (!cssTextFontSize) throw new Error('Please insert cssText of cell font size.');
        grid._gridCssInfo.cellFontSize = cssTextFontSize;
        setGridCssStyle(grid);
        return true;
    };
    grid.setCellMinHeight = (cssTextMinHeight: string): boolean => {
        if (!cssTextMinHeight) throw new Error('Please insert cssText of cell min height.');
        grid._gridCssInfo.cellMinHeight = cssTextMinHeight;
        setGridCssStyle(grid);
        return true;
    };
    grid.setHorizenBorderSize = (pxHorizenBorderSize: number): boolean => {
        validatePositiveIntegerAndZero(pxHorizenBorderSize);
        grid._gridCssInfo.horizenBorderSize = pxHorizenBorderSize;
        setGridCssStyle(grid);
        return true;
    };
    grid.setVerticalBorderSize = (pxVerticalBorderSize: number): boolean => {
        validatePositiveIntegerAndZero(pxVerticalBorderSize);
        grid._gridCssInfo.verticalBorderSize = pxVerticalBorderSize;
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridColor = (cssTextHexColor: string): boolean => {
        if (!/^#[0-9a-fA-F]{6}$/.test(cssTextHexColor)) {
            throw new Error('Please insert valid cssText of hexadecimal color. (#ffffff)');
        }
        grid._gridCssInfo.color = cssTextHexColor;
        setColorSet(grid._gridCssInfo);
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridColorSet = (colorName: string): boolean => {
        const hexColor = getColorFromColorSet(colorName);
        grid._gridCssInfo.color = hexColor;
        setColorSet(grid._gridCssInfo);
        setGridCssStyle(grid);
        return true;
    };
    grid.invertColor = (doInvert: boolean): boolean => {
        doInvert = doInvert === true;
        if (doInvert) setInvertColor(grid._gridCssInfo);
        else setColorSet(grid._gridCssInfo);
        setGridCssStyle(grid);
        return true;
    };
    grid.setGridName = (gridName: string): boolean => {
        if (!gridName) throw new Error('Please insert a gridName.');
        grid._gridInfo.name = String(gridName);
        return true;
    };
    grid.getGridName = (): string => {
        return grid._gridInfo.name!;
    };
    //수정필요 cell data 형태
    grid.setGridLocked = (isLocked: boolean): boolean => {
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
    grid.isGridLocked = (): boolean => {
        return grid._gridInfo.locked!;
    };
    //수정필요 cell data 형태
    grid.setGridLockedColor = (isLockedColor: boolean): boolean => {
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
    grid.setGridResizable = (isResizable: boolean): boolean => {
        if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.resizable = isResizable;
        return true;
    };
    grid.isGridResizable = () => {
        return grid._gridInfo.resizable;
    };
    grid.setGridRecordCount = (recordCount: number): boolean => {
        recordCount = validatePositiveIntegerAndZero(recordCount);
        grid._gridInfo.redoCount = recordCount;
        return true;
    };
    grid.getGridRecordCount = (): number => {
        return grid._gridInfo.redoCount!;
    };
    grid.setGridRedoable = (isRedoable: boolean): boolean => {
        if (typeof isRedoable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.redoable = isRedoable;
        return true;
    };
    grid.isGridRedoable = (): boolean => {
        return grid._gridInfo.redoable!;
    };
    grid.setGridVisible = (isVisible: boolean): boolean => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.visible = isVisible;
        setGridCssStyle(grid);
        return true;
    };
    grid.isGridVisible = (): boolean => {
        return grid._gridInfo.visible!;
    };
    grid.setHeaderVisible = (isVisible: boolean): boolean => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.headerVisible = isVisible;
        setGridCssStyle(grid);
        return true;
    };
    grid.isHeaderVisible = (): boolean => {
        return grid._gridInfo.headerVisible!;
    };
    grid.setGridRownumLockedColor = (isRownumLockedColor: boolean): boolean => {
        if (typeof isRownumLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.rownumLockedColor = isRownumLockedColor;
        grid._colInfos[0].lockedColor = isRownumLockedColor;

        for(const row of grid.gridBody._gridBodyCells) {
            row[0]._colInfo.lockedColor = isRownumLockedColor;
            reConnectedCallbackElement(row[0]);
        }
        return true;
    };
    grid.isGridRownumLockedColor = (): boolean => {
        return grid._gridInfo.rownumLockedColor!;
    };
    grid.setGridRownumSize = (rownumSize: number): boolean => {
        rownumSize = validatePositiveIntegerAndZero(rownumSize);
        const colInfo = grid._colInfos[0];
        colInfo.originWidth = String(rownumSize) + extractNumberAndUnit(colInfo.originWidth)!.unit
        changeColSize(grid, colInfo.index!, rownumSize);
        colInfo.colVisible = rownumSize !== 0;
        reloadGridWithModifyCell(grid, colInfo.index!);
        return true;
    };
    grid.getGridRownumSize = (): string => {
        return grid._colInfos[0].originWidth!;
    };
    grid.setGridStatusLockedColor = (isStatusLockedColor: boolean): boolean => {
        if (typeof isStatusLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.statusLockedColor = isStatusLockedColor;
        grid._colInfos[1].lockedColor = isStatusLockedColor;

        for(const row of grid.gridBody._gridBodyCells) {
            row[1]._colInfo.lockedColor = isStatusLockedColor;
            reConnectedCallbackElement(row[1]);
        }
        return true;
    };
    grid.isGridStatusLockedColor = (): boolean => {
        return grid._gridInfo.statusLockedColor!;
    };
    grid.setGridSelectionPolicy = (selectionPolicy: SelectionPolicy.range | SelectionPolicy.single | SelectionPolicy.none): boolean => {
        if (!isIncludeEnum(selectionPolicyUnit, selectionPolicy)) throw new Error('Please insert the correct selectionPolicy properties. (single, range, none)');
        grid._gridInfo.selectionPolicy = selectionPolicy;
        return true
    };
    grid.getGridSelectionPolicy = (): string => {
        return grid._gridInfo.selectionPolicy!;
    };
    grid.setGridNullValue = (nullValue: any): boolean => {
        grid._gridInfo.nullValue = nullValue;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.getGridNullValue = (): any => {
        return deepCopy(grid._gridInfo.nullValue);
    };
    grid.setGridDateFormat = (dateFormat: string): boolean => {
        grid._gridInfo.dateFormat = dateFormat;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.getGridDateFormat = (): string => {
        return grid._gridInfo.dateFormat!;
    };
    grid.setGridMonthFormat = (monthFormat: string): boolean => {
        grid._gridInfo.monthFormat = monthFormat;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.getGridMonthFormat = (): string => {
        return grid._gridInfo.monthFormat!;
    };
    grid.setGridAlterRow = (isAlterRow: boolean): boolean => {
        if (typeof isAlterRow !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.alterRow = isAlterRow;
        __gridBodyCellsReConnected(grid);
        return true;
    };
    grid.setGridFrozenColCount = (frozenColCount: number): boolean => {
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
    grid.getGridFrozenColCount = (): number => {
        return grid._gridInfo.frozenColCount!;
    };
    grid.setGridFrozenRowCount = (frozenRowCount: number): boolean => {
        frozenRowCount = validatePositiveIntegerAndZero(frozenRowCount);
        grid._gridInfo.frozenRowCount = frozenRowCount;
        const datas = grid.getDatas();
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.getGridFrozenRowCount = (): number => {
        return grid._gridInfo.frozenRowCount!;
    };
    grid.setGridSortable = (isSortable: boolean): boolean => {
        if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.sortable = isSortable;
        return true;
    };
    grid.isGridSortable = (): boolean => {
        return grid._gridInfo.sortable!;
    };
    grid.setGridFilterable = (isFilterable: boolean): boolean => {
        if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.filterable = isFilterable;
        const datas = grid.getDatas();
        __loadHeader(grid);
        __loadHeader(grid);
        grid.load(datas);
        return true;
    };
    grid.isGridFilterable = (): boolean => {
        return grid._gridInfo.filterable!;
    };
    grid.setGridAllCheckable = (isAllCheckable: boolean): boolean => {
        if (typeof isAllCheckable !== 'boolean') throw new Error('Please insert a boolean type.');
        grid._gridInfo.allCheckable = isAllCheckable;
        return true;
    };
    grid.isGridAllCheckable = (): boolean => {
        return grid._gridInfo.allCheckable!;
    };
    grid.setGridCheckedValue = (checkeValue: string): boolean => {
        if (typeof checkeValue !== 'string') throw new Error('Please insert a string type.');
        if (grid._gridInfo.uncheckedValue === checkeValue) throw new Error('Checked and unchecked values cannot be the same.');
        const datas = grid.getDatas();
        for(const rows of datas) {
            for(const data of rows) {
                if (data._colInfo.dataType === 'checkbox') {
                    if (data._value === grid._gridInfo.checkedValue) {
                        data._value = checkeValue;
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
    grid.getGridCheckedValue = (): string => {
        return grid._gridInfo.checkedValue!;
    };
    grid.setGridUncheckedValue = (unCheckedValue: string): boolean => {
        if (typeof unCheckedValue !== 'string') throw new Error('Please insert a string type.');
        if (grid._gridInfo.checkedValue === unCheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
        const datas = grid.getDatas();
        for(const rows of datas) {
            for(const data of rows) {
                if (data._colInfo.dataType === 'checkbox') {
                    if (data._value !== grid._gridInfo.checkedValue) {
                        data._value = unCheckedValue;
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
    grid.getGridUncheckedValue = (): string => {
        return grid._gridInfo.uncheckedValue!;
    };
    grid.addCol = (colIndexOrColId: number | string, colInfo: ColInfo): boolean => {
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
    grid.removeCol = (colIndexOrColId: number | string): any[] => {
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
    grid.setColInfo = (colInfo: ColInfo): boolean => {
        if (!colInfo) throw new Error('Column info is required.');
        if (colInfo.constructor !== Object) throw new Error('Please insert a valid column info');
        let colIndexOrColId;
        if (colInfo.index) colIndexOrColId = colInfo.index;
        if (colInfo.id) colIndexOrColId = colInfo.id;
        if (!colIndexOrColId) throw new Error('Column id is required.');
        
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (colIndex <= 2) throw new Error('The row number or status columns are immutable.');

        const newColInfo = grid._colInfos[colIndex - 1];
        Object.keys(newColInfo).forEach((key)=>{
            if(['cId', 'cIndex'].indexOf(key) === -1) {
                const newColInfoKey = key.iarAt(1).toLowerCase() + key.slice(2);
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
                if (data.id === newColInfo.cId) {
                    Object.keys(newColInfo).forEach(key => {
                        if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue'].indexOf(key) < 0) {
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
    grid.getColInfo = (colIndexOrColId: number | string): ColInfo => {
        colInfo = __getColInfo(colIndexOrColId);

        const info: ColInfo = {
            id : colInfo.cId,
            index : colInfo.cIndex,
            name : colInfo.cName,
            untarget : colInfo.cUntarget,
            colVisible : colInfo.cColVisible,
            required : colInfo.cRequired,
            resizable : colInfo.cResizable,
            originWidth : colInfo.cOriginWidth,
            dataType : colInfo._colInfo.dataType,
            selectSize : colInfo.cSelectSize,
            locked : colInfo.locked,
            lockedColor : colInfo.lockedColor,
            format : colInfo.cFormat,
            codes : deepCopy(colInfo.cCodes),
            defaultCode : colInfo.cDefaultCode,
            maxLength : colInfo.cMaxLength,
            maxByte : colInfo.cMaxByte,
            maxNumber : colInfo.cMaxNumber,
            minNumber : colInfo.cMinNumber,
            roundNumber : colInfo.cRoundNumber,
            align : colInfo.cAlign,
            verticalAlign : colInfo.cVerticalAlign,
            overflowWrap : colInfo.cOverflowWrap,
            wordBreak : colInfo.cWordBreak,
            whiteSpace : colInfo.cWhiteSpace,
            backColor : colInfo.cBackColor,
            fontColor : colInfo.cFontColor,
            fontBold : colInfo.cFontBold,
            fontItalic : colInfo.cFontItalic,
            fontThruline : colInfo.cFontThruline,
            fontUnderline : colInfo.cFontUnderline,
            rowMerge : colInfo.cRowMerge,
            colMerge : colInfo.cColMerge,
            sortable : colInfo.cSortable,
            filterable : colInfo.cFilterable,
            filterValues : deepCopy(colInfo.cFilterValues),
            filterValue : deepCopy(colInfo.cFilterValue),
            filter : colInfo.cFilter,
            rowVisible : colInfo.cRowVisible,
            header : null,
            footer : null,
        };
        
        if (colInfo.header && Array.isArray(colInfo.header)) info.header = colInfo.header.join(';');
        if (colInfo.footer && Array.isArray(colInfo.footer)) info.footer = colInfo.footer.join(';');
        return info;
    };
    grid.getColDatas = (colIndexOrColId: number | string): CellData[] => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colDatas = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            colDatas.push(grid.getCellData(row, colIndex));
i      }
        return colDatas;
    };
    grid.setColSameValue = (colIndexOrColId: number | string, value: any, doRecord = false) : boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColRownumOrStatus(colIndex);
        if (doRecord) {
            const records = [];
            for(let row = 1; row <= grid.getRowCount(); row++) {
                let cell = _getCell(iid, row, colIndex);
                let record = getRecordsWithModifyValue(cell, value, true);
                if (Array.isArray(record) && record.length > 0) records.push(record[0]);
            }
            recordGridModify(_id, records);
        }
        else {
            for(let row = 1; row <= grid.getRowCount(); row++) {
                let cell = _getCell(grid, row, colIndex);
                cell._value = getValidValue(cell, value);
                reConnectedCallbackElement(cell);
            }
            reloadGridWithModifyCell(grid._id, colIndex);
        }
        return true;
    };
    grid.getColValues = (colIndexOrColId: number | string): any[] => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colValues = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            let cell = _getCell(grid, row, colIndex);
            colValues.push(deepCopy(ill._value));
        }
        return colValues;
    };
    grid.getColTexts = (colIndexOrColId: number | string): string[] => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colTexts = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            colTexts.push(grid.getCellText(row, colIndex));
i      }
        return colTexts;
    };
    grid.isColUnique = (colIndexOrColId: number | string): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colValues = [];
        for(let row = 1; row <= grid.getRowCount(); row++) {
            let cell = _getCell(grid, row, colIndex);
            switch (cell._colInfo.dataType) {
i              case 'select':
                case 'checkbox':
                case 'button':
                case 'link':
                    colValues.push(getCellText(cell));
                    break;
                default:
                    colValues.push(cell._value);
                    break;
            }
        }
        return colValues.length === new Set(colValues).size;
    };
    grid.openFilter = (colIndexOrColId: number | string): boolean => {
        __getHeaderFilter(colIndexOrColId).style.display = 'block';
        return true;
    };
    grid.closeFilter = (colIndexOrColId: number | string): boolean => {
        __getHeaderFilter(colIndexOrColId).style.display = 'none';
        return true;
    };
    grid.setColFilterValue = (colIndexOrColId: number | string, filterValue: string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        if(!colInfo.cFilterValues!.has(filterValue))  throw new Error('Please insert a valid filterValue. ' + Array.from(colInfo.cFilterValues!).join(', '));

        let headerCell;
        let modifyFilterSelect;
        for(let row = 1; row <= grid.getHeaderRowCount(); row++) {
            headerCell = _getHeaderCell(row, colInfo.cIndex);
            modifyFilterSelect = headerCell.querySelectorAll('.' + grid._id + '_filterSelect');
            if(modifyFilterSelect.length > 0) {
                modifyFilterSelect = modifyFilterSelect[0]
                break;
            }
        }
        modifyFilterSelect.value = filterValue;
        if(modifyFilterSelect.value !== '$$ALL') modifyFilterSelect.style.display = 'block';

        _doFilter();
        return true;
    };
    grid.getColFilterValues = (colIndexOrColId: number | string): string[]  => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return Array.from(colInfo.cFilterValues!);
    };
    grid.getColFilterValue = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFilterValue;
    };
    grid.getColId = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo  = __getColInfo(colIndexOrColId, true);
        return colInfo.cId;
    };
    grid.getColIndex = (colIndexOrColId: number | string): number => !{
        return __getColIndex(grid, colIndexOrColId, true);
    };
    grid.setColName = (colIndexOrColId: number | string, colName: string): boolean => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (!colName) throw new Error('Column Name is required');
        if (typeof colName !== 'string') throw iw Error('Please insert a string type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cName = colName;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, ilIndex).cName = colName;
        }
        return true;
    };
    grid.getColName = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId);
        return colInfo.cName!;
    };
    grid.setColUntarget = (colIndexOrColId: number | string, isUntarget: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isUntarget !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cUntarget = isUntarget;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex).intarget = isUntarget;
        }
        return true;
    };
    grid.setColRowMerge = (colIndexOrColId: number | string, isRowMerge: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isRowMerge !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cRowMerge = isRowMerge;
    
        const datas = grid.getDatas();
        iid.load(datas);
        return true;
    };
    grid.isColRowMerge = (colIndexOrColId: number | string): boolean | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cRowMerge;
    };
    grid.setColColMerge = (colIndexOrColId: number | string, isColMerge: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isColMerge !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cColMerge = isColMerge;
    
        const datas = grid.getDatas();
        iid.load(datas);
        return true;
    };
    grid.isColColMerge = (colIndexOrColId: number | string): boolean | null  => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cColMerge;
    };
    grid.setColVisible = (colIndexOrColId: number | string, isVisible: boolean): boolean => {
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        if (isVisible) {
            changeColSize(grid._id, colInfo.cIndex!, extractNumberAndUnit(colInfo.cOriginWidth).number);
        }
        else {
            changeColSize(grid._id, colInfo.cIndex!, 0)
        }
        colInfo.cColVisible = isVisible;
        __loadHeader(grid);
        reloadGridWithModifyCell(grid._id, colInfo.cIndex!);
        return true;
    };
    grid.isColVisible = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cColVisible!;
    };
    grid.setColRequired = (colIndexOrColId: number | string, isRequired: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex, true);
        colInfo.cRequired = isRequired;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            _getCell(grid, row, colIndex).iequired = isRequired;
        }
        return true;
    };
    grid.isColRequired = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cRequired!;
    };
    grid.setColResizable = (colIndexOrColId: number | string, isResizable: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        colInfo.cResizable = isResizable;
        __loadHeader(grid);
        return true;
    };
    grid.isColResizable = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cResizable!;
    };
    grid.setColSortable = (colIndexOrColId: number | string, isSortable: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        colInfo.cSortable = isSortable;
        return true;
    };
    grid.isColSortable = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cSortable!;
    };
    grid.setColFilterable = (colIndexOrColId: number | string, isFilterable: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex, true);
        colInfo.cFilterable = isFilterable;
        __loadHeader(grid);
        reloadFilterValue(grid._id, ilIndex);
        return true;
    };
    grid.isColFilterable = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFilterable!;
    };
    grid.setColOriginWidth = (colIndexOrColId: number | string, originWidth: string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        const newOriginWidth = extractNumberAndUnit(originWidth);
        if (!isIncludeEnum(enumWidthUnit, newOriginWidth.unit)) throw new Error('Width units can only be pixel or %.');
        colInfo.cOriginWidth = newOriginWidth.number + newOriginWidth.unit;
        changeColSize(grid._id, colInfo.cIndex!, newOriginWidth.number);
        if(newOriginWidth.number === 0) colInfo.cColVisible = false;
        else colInfo.cColVisible = true;
        __loadHeader(grid);
        reloadGridWithModifyCell(grid._id, colInfo.cIndex!);
        return true;
    };
    grid.getColOriginWidth = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cOriginWidth!;
    };
    grid.setColDataType = (colIndexOrColId: number | string, dataType: string): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        if (!isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo._colInfo.dataType = dataType;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell._colInfo.dataType = dataType;
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColDataType = (colIndexOrColId: number | string): string => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo._colInfo.dataType!;
    };
    grid.setColSelectSize = (colIndexOrColId: number | string, cssTextSelectSize: string): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cSelectSize = cssTextSelectSize;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cSelectSize = cssTextSelectSize;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColSelectSize = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cSelectSize;
    };
    grid.setColLocked = (colIndexOrColId: number | string, isLocked: boolean): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.locked = isLocked;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cLocked = isLocked;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColLocked = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.locked!;
    };
    grid.setColLockedColor = (colIndexOrColId: number | string, isLockedColor: boolean): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.lockedColor = isLockedColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cLockedColor = isLockedColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColLockedColor = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.lockedColor!;
    };
    grid.setColFormat = (colIndexOrColId: number | string, format: string): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof format !== 'string') throw new Error('Please insert a string type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cFormat = format;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cFormat = format;
            if(cell._colInfo.dataType === 'mask') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColFormat = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFormat;
    };
    grid.setColCodes = (colIndexOrColId: number | string, codes: string[]): boolean => {
        __checkColRownumOrStatus(colIndexOrColId);
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cCodes = codes;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cCodes = codes;
            if(cell._colInfo.dataType === 'code') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColCodes = (colIndexOrColId: number | string): string[] | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cCodes;
    };
    grid.setColDefaultCode = (colIndexOrColId: number | string, defaultCode: string): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cDefaultCode = defaultCode;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cDefaultCode = defaultCode;
            if(cell._colInfo.dataType === 'code') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColDefaultCode = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cDefaultCode;
    };
    grid.setColMaxLength = (colIndexOrColId: number | string, maxLength: number): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        maxLength = validatePositiveIntegerAndZero(maxLength);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cMaxLength = maxLength;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cMaxLength = maxLength;
            if(cell._colInfo.dataType === 'text') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColMaxLength = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cMaxLength;
    };
    grid.setColMaxByte = (colIndexOrColId: number | string, maxByte: number): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        maxByte = validatePositiveIntegerAndZero(maxByte);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cMaxByte = maxByte;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cMaxByte = maxByte;
            if(cell._colInfo.dataType === 'text') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColMaxByte = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cMaxByte;
    };
    grid.setColMaxNumber = (colIndexOrColId: number | string, maxNumber: number): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        maxNumber = validateNumber(maxNumber);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cMaxNumber = maxNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cMaxNumber = maxNumber;
            if(cell._colInfo.dataType === 'number') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColMaxNumber = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cMaxNumber;
    };
    grid.setColMinNumber = (colIndexOrColId: number | string, minNumber: number): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        minNumber = validateNumber(minNumber);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cMinNumber = minNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cMinNumber = minNumber;
            if(cell._colInfo.dataType === 'number') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColMinNumber = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cMinNumber;
    };
    grid.setColRoundNumber = (colIndexOrColId: number | string, roundNumber: number): boolean => {
        __checkColRownumOrStatus(colIndexOrColId)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        roundNumber = validateIntegerAndZero(roundNumber);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cRoundNumber = roundNumber;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cRoundNumber = roundNumber;
            if(cell._colInfo.dataType === 'number') {
                cell._value = getValidValue(cell, cell._value);
            }
            reConnectedCallbackElement(cell);
        }
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getColRoundNumber = (colIndexOrColId: number | string): number | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cRoundNumber;
    };
    grid.setColAlign = (colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if(!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cAlign = align;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cAlign = align;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColAlign = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cAlign;
    };
    grid.setColVerticalAlign = (colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        if(!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cVerticalAlign = verticalAlign;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cVerticalAlign = verticalAlign;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColVerticalAlign = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cVerticalAlign;
    };
    grid.setColOverflowWrap = (colIndexOrColId: number | string, overflowWrap: string): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cOverflowWrap = overflowWrap;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cOverflowWrap = overflowWrap;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColOverflowWrap = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cOverflowWrap;
    };
    grid.setColWordBreak = (colIndexOrColId: number | string, wordBreak: string): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cWordBreak = wordBreak;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cWordBreak = wordBreak;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColWordBreak = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cWordBreak;
    };
    grid.setColWhiteSpace = (colIndexOrColId: number | string, whiteSpace: string): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cWhiteSpace = whiteSpace;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cWhiteSpace = whiteSpace;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColWhiteSpace = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cWhiteSpace;
    };
    grid.setColBackColor = (colIndexOrColId: number | string, hexadecimalBackColor: string): boolean => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cBackColor = hexadecimalBackColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cBackColor = hexadecimalBackColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColBackColor = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cBackColor;
    };
    grid.setColFontColor = (colIndexOrColId: number | string, hexadecimalFontColor: string): boolean => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cFontColor = hexadecimalFontColor;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cFontColor = hexadecimalFontColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.getColFontColor = (colIndexOrColId: number | string): string | null => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFontColor;
    };
    grid.setColFontBold = (colIndexOrColId: number | string, isFontBold: boolean): boolean => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cFontBold = isFontBold;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cFontBold = isFontBold;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontBold = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFontBold!;
    };
    grid.setColFontItalic = (colIndexOrColId: number | string, isFontItalic: boolean): boolean => {
        const colIndex = __getColIndex(grid, colIndexOrColId, true)!;
        if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cFontItalic = isFontItalic;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(grid, row, colIndex);
            ill.cFontItalic = isFontItalic;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontItalic = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFontItalic!;
    };
    grid.setColFontThruline = (colIndexOrColId: number | string, isFontThruline: boolean): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cFontThruline = isFontThruline;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cFontThruline = isFontThruline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontThruline = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFontThruline!;
    };
    grid.setColFontUnderline = (colIndexOrColId: number | string, isFontUnderline: boolean): boolean => !{
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        const colInfo: CellColInfo = __getColInfo(colIndex);
        colInfo.cFontUnderline = isFontUnderline;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            const cell = _getCell(iid, row, colIndex);
            cell.cFontUnderline = isFontUnderline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isColFontUnderline = (colIndexOrColId: number | string): boolean => {
        const colInfo: CellColInfo = __getColInfo(colIndexOrColId, true);
        return colInfo.cFontUnderline!;
    };
    grid.addRow = (rowOrValuesOrDatas?: number | Record<string, any> | Record<string, any>[], valuesOrDatas?: Record<string, any> | Record<string, any>[]): boolean => {
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
                const tempRow = [];
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
                datas.splice(row + cnt, 0, keyValueOrData);
            }
            cnt++;
        }
        grid.load(datas);
        for(let r = row; r < row + cnt; r++) {
            grid.setRowStatus(r + 1, 'C');
        }
        focusCell(_getCell(grid, row + 1, 'v-g-status'));
        return true;
    };
    grid.removeRow = (row: number): Record<string, any> => {
        __checkRowIndex(row);
        const result = grid.getRowValues(row);
        result['v-g-status'] = 'D';
        const datas = grid.getDatas();
        datas.splice(row - 1, 1);
        grid.load(datas);
        return result;
    };
    grid.setRowStatus = (row: number, status: string): boolean => {
        __checkRowIndex(row);
        if (!isIncludeEnum(statusUnit, status)) throw new Error('Please insert the correct status code. (C, U, D)');
        const statusCell = _getCell(grid, row, 'v-g-status');
        statusCell._value = status;
        reConnectedCallbackElement(statusCell);
        return true;
    };
    grid.getRowStatus = (row: number): string => {
        __checkRowIndex(row);
        return _getCell(grid, row, 'v-g-status')._value;
    };
    grid.setRowDatas = (row: number, cellDatas: Record<string, any>[]): boolean => {
        for(const cellData of cellDatas) {
            __setCellData(row, cellData.id, cellData, false);
        }
        return true;
    };
    grid.getRowDatas = (row: number): Record<string, any>[] => {
        __checkRowIndex(row);
        const rowDatas = [];
        for(const colInfo of colInfos) {
            rowDatas.push(grid.getCellData(row, colInfo.cIndex));
        }
        return rowDatas;
    };
    grid.setRowValues = (row: number, values: Record<string, any>, doRecord = false): boolean => {
        row = 2;
        __checkRowIndex(row);
        if (!values || values.constructor !== Object) throw new Error('Please insert a valid value.');
        let value = null;
        let cell = null;

        if (doRecord) {
            const records = [];
            let record
            for(const colInfo of colInfos) {
                if (colInfo.cId === 'v-g-rownum' || colInfo.cId === 'v-g-status') continue;
                for(const key in values) {
                    if (colInfo.cId === key) value = values[key];
                }
                cell = _getCell(grid, row, colInfo.cIndex);
                record = getRecordsWithModifyValue(cell, value, true);
                if (Array.isArray(record) && record.length > 0) records.push(record[0]);
            }
            recordGridModify(_id, records);
        }
        else {
            for(const colInfo of colInfos) {
                if (colInfo.cId === 'v-g-rownum' || colInfo.cId === 'v-g-status') continue;
                for(const key in values) {
                    if (colInfo.cId === key) value = values[key];
                }
                cell = _getCell(grid, row, colInfo.cIndex);
                cell._value = getValidValue(cell, value);
                reConnectedCallbackElement(cell);
                reloadGridWithModifyCell(cell._gridId, cell.cIndex);
            }
        }
        return true;
    };
    grid.getRowValues = (row: number): Record<string, any> => {
        __checkRowIndex(row);
        const rowValues = {};
        for(const cell of gridBodyCells[row - 1]) {
            (rowValues as any)[cell._colInfo.id] = deepCopy(cell._value);
        }
        return rowValues;
    };
    grid.getRowTexts = (row: number): Record<string, string> => {
        __checkRowIndex(row);
        const rowTexts = {};
        for(const cell of gridBodyCells[row - 1]) {
            (rowTexts as any)[cell._colInfo.id] = getCellText(cell);
        }
        return rowTexts;
    };
    grid.setRowVisible = (row: number, isVisible: boolean): boolean => {
        __checkRowIndex(row);
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
        for(let c = 1; c <= grid.getColCount(); c++) {
            const cell = _getCell(grid, row, c);
            cell.cRowVisible = isVisible;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.isRowVisible = (row: number): boolean => {
        __checkRowIndex(row);
        const cell = _getCell(grid, row, 1);
        return cell.cRowVisible;
    };
    grid.setRowDataType = (row: number, dataType: string): boolean => {
        __checkRowIndex(row);
        if (!isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell._colInfo.dataType = dataType;
            reConnectedCallbackElement(cell);
        }
        
        reloadGridForMerge(grid._id);
        
        grid.reloadFilterValue();
        
        grid.reloadFooterValue();
        return true;
    };
    grid.setRowLocked = (row: number, isRowLocked: boolean): boolean => {
        __checkRowIndex(row);
        if (typeof isRowLocked !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cLocked = isRowLocked;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowLockedColor = (row: number, isRowLockedColor: boolean): boolean => {
        __checkRowIndex(row);
        if (typeof isRowLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cLockedColor = isRowLockedColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowAlign = (row: number, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
        __checkRowIndex(row);
        if (!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cAlign = align;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowVerticalAlign = (row: number, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
        __checkRowIndex(row);
        if (!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cVerticalAlign = verticalAlign;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowBackColor = (row: number, hexadecimalBackColor: string): boolean => {
        __checkRowIndex(row);
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cBackColor = hexadecimalBackColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontColor = (row: number, hexadecimalFontColor: string): boolean => {
        __checkRowIndex(row);
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cFontColor = hexadecimalFontColor;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontBold = (row: number, isRowFontBold: boolean): boolean => {
        __checkRowIndex(row);
        if (typeof isRowFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cFontBold = isRowFontBold;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontItalic = (row: number, isRowFontItalic: boolean): boolean => {
        __checkRowIndex(row);
        if (typeof isRowFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cFontItalic = isRowFontItalic;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontThruline = (row: number, isRowFontThruline: boolean): boolean => {
        __checkRowIndex(row);
        if (typeof isRowFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cFontThruline = isRowFontThruline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.setRowFontUnderline = (row: number, isRowFontUnderline: boolean): boolean => {
        __checkRowIndex(row);
        if (typeof isRowFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        for(const cell of gridBodyCells[row - 1]) {
            if (cell._colInfo.id === 'v-g-rownum' || cell._colInfo.id === 'v-g-status') continue;
            cell.cFontUnderline = isRowFontUnderline;
            __gridCellReConnectedWithControlSpan(cell);
        }
        return true;
    };
    grid.searchRowsWithMatched = (matches: Record<string, any>): number[] => {
        if (matches.constructor !== Object) throw new Error('Please insert a valid matches. (Object)');
        const matchedRows: number[] = [];
        let isMatched;
        gridBodyCells.forEach((row, rowIndex: number) => {
            isMatched = true;
            for(const cell of row) {
                for(const key of Object.keys(matches)) {
                    if (cell._colInfo.id === key && cell._value !== matches[key]) {
                        isMatched = false;
                        break;
                    }
                }
            }
            if(isMatched) matchedRows.push(rowIndex + 1);
        })
        return matchedRows;
    };
    grid.searchRowDatasWithMatched = (matches: Record<string, any>): Record<string, any>[][] => {
        const matchedRows = grid.searchRowsWithMatched(matches);
        const matchedRowDatas: Record<string, any>[][] = [];
        matchedRows.forEach((row: number) => {
            matchedRowDatas.push(grid.getRowDatas(row));
        })
        return matchedRowDatas;
    };
    grid.searchRowValuesWithMatched = (matches: Record<string, any>): Record<string, any>[] => {
        const matchedRows = grid.searchRowsWithMatched(matches);
        const matchedRowValues: Record<string, any>[] = [];
        matchedRows.forEach((row: number) => {
            matchedRowValues.push(grid.getRowValues(row));
        })
        return matchedRowValues;
    };
    grid.searchRowsWithFunction = (func: Function): number[] => {
        if (typeof func !== 'function') throw new Error('Please insert a valid function.');
        const matchedRows = [];
        let isMatched;
        for(let row = 1; row <= grid.getRowCount(); row++) {
            isMatched = func(grid.getRowDatas(row));
            if(isMatched) matchedRows.push(row);
        }
        return matchedRows;
    };
    grid.searchRowDatasWithFunction = (func: Function): Record<string, any>[][] => {
        const matchedRows = grid.searchRowsWithFunction(func);
        const matchedRowDatas: Record<string, any>[][] = [];
        matchedRows.forEach((row: number) => {
            matchedRowDatas.push(grid.getRowDatas(row));
        })
        return matchedRowDatas;
    };
    grid.searchRowValuesWithFunction = (func: Function): Record<string, any>[] => {
        const matchedRows = grid.searchRowsWithFunction(func);
        const matchedRowValues: Record<string, any>[] = [];
        matchedRows.forEach((row: number) => {
            matchedRowValues.push(grid.getRowValues(row));
        })
        return matchedRowValues;
    };
    grid.setCellData = (row: number, colIndexOrColId: number | string, cellData: CellData): boolean => {
        return __setCellData(row, colIndexOrColId, cellData);
    }
    grid.getCellData = (row: number, colIndexOrColId: number | string): CellData => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        
        const cell = _getCell(grid, row, colIndex);
        const data = __getData(ill);
        return data;
    }
    grid.setCellValue = (row: number, colIndexOrColId: number | string, value: any, doRecord = false): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);

        const cell = _getCell(grid, row, colIndex);
        if (iRecord) {
            recordGridModify(cell.gId, getRecordsWithModifyValue(cell, value, true));
        }
        else {
            cell._value = getValidValue(cell, value);
            reConnectedCallbackElement(cell);
            reloadGridWithModifyCell(cell.gId, cell.cIndex);
        }
        return true;
    };
    grid.getCellValue = (row: number, colIndexOrColId: number | string): any => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);

        return deepCopy(_getCell(grid, row, colIndex)._value);
    };
    grid.itCellText = (row: number, colIndexOrColId: number | string): string => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);

        return getCellText(_getCell(grid, row, colIndex));
    };
    iid.setCellRequired = (row: number, colIndexOrColId: number | string, isRequired: boolean): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');

i      const cell = _getCell(grid, row, colIndex);
        cell._colInfo.required = isRequired;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    }
    grid.getCellRequired = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cRequired;
    }
    grid.setCellDataType = (row: number, colIndexOrColId: number | string, dataType: string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        
        if (!isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
i      const cell = _getCell(grid, row, colIndex);
        cell._colInfo.dataType = dataType;
        reConnectedCallbackElement(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellDataType = (row: number, colIndexOrColId: number | string): string => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        return _getCell(grid, row, colIndex)._colInfo.dataType;
    };
    iid.setCellLocked = (row: number, colIndexOrColId: number | string, isLocked: boolean): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');

i      const cell = _getCell(grid, row, colIndex);
        cell.cLocked = isLocked;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellLocked = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cLocked;
    };
    grid.setCellLockedColor = (row: number, colIndexOrColId: number | string, isLockedColor: boolean): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        ill.cLockedColor = isLockedColor;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellLockedColor = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cLockedColor;
    };
    grid.setCellFormat = (row: number, colIndexOrColId: number | string, format: string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        if (typeof format !== 'string') throw new Error('Please insert a string type.');
        const cell = _getCell(grid, row, colIndex);
        ill.cFormat = format;
        if(cell._colInfo.dataType === 'mask') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellFormat = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFormat;
    };
    grid.setCellCodes = (row: number, colIndexOrColId: number | string, codes: string[]): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
        const cell = _getCell(grid, row, colIndex);
        ill.cCodes = codes;
        if(cell._colInfo.dataType === 'code') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellCodes = (row: number, colIndexOrColId: number | string): string[] | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cCodes;
    };
    grid.setCellDefaultCode = (row: number, colIndexOrColId: number | string, defaultCode: string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cDefaultCode = defaultCode;
        if(ill._colInfo.dataType === 'code') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellDefaultCode = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cDefaultCode;
    };
    grid.setCellMaxLength = (row: number, colIndexOrColId: number | string, maxLength: number): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        maxLength = validatePositiveIntegerAndZero(maxLength);
        const cell = _getCell(grid, row, colIndex);
        ill.cMaxLength = maxLength;
        if(cell._colInfo.dataType === 'text') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellMaxLength = (row: number, colIndexOrColId: number | string): number | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMaxLength;
    };
    grid.setCellMaxByte = (row: number, colIndexOrColId: number | string, maxByte: number): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        maxByte = validatePositiveIntegerAndZero(maxByte);
        const cell = _getCell(grid, row, colIndex);
        ill.cMaxByte = maxByte;
        if(cell._colInfo.dataType === 'text') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellMaxByte = (row: number, colIndexOrColId: number | string): number | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMaxByte;
    };
    grid.setCellMaxNumber = (row: number, colIndexOrColId: number | string, maxNumber: number): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        maxNumber = validateNumber(maxNumber);
        const cell = _getCell(grid, row, colIndex);
        ill.cMaxNumber = maxNumber;
        if(cell._colInfo.dataType === 'number') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellMaxNumber = (row: number, colIndexOrColId: number | string): number | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMaxNumber;
    };
    grid.setCellMinNumber = (row: number, colIndexOrColId: number | string, minNumber: number): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        minNumber = validateNumber(minNumber);
        const cell = _getCell(grid, row, colIndex);
        ill.cMinNumber = minNumber;
        if(cell._colInfo.dataType === 'number') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellMinNumber = (row: number, colIndexOrColId: number | string): number | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cMinNumber;
    };
    grid.setCellRoundNumber = (row: number, colIndexOrColId: number | string, roundNumber: number): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        roundNumber = validateIntegerAndZero(roundNumber);
        const cell = _getCell(grid, row, colIndex);
        ill.cRoundNumber = roundNumber;
        if(cell._colInfo.dataType === 'number') {
            cell._value = getValidValue(cell, cell._value);
        }
        __gridCellReConnectedWithControlSpan(cell);
        reloadGridWithModifyCell(grid._id, colIndex);
        return true;
    };
    grid.getCellRoundNumber = (row: number, colIndexOrColId: number | string): number | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cRoundNumber;
    };
    grid.setCellAlign = (row: number, colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if(!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
        const cell = _getCell(grid, row, colIndex);
        cell.ilign = align;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellAlign = (row: number, colIndexOrColId: number | string): string => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cAlign;
    };
    grid.setCellVerticalAlign = (row: number, colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if(!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
        const cell = _getCell(grid, row, colIndex);
        cell.ierticalAlign = verticalAlign;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellVerticalAlign = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cVerticalAlign;
    };
    grid.setCellOverflowWrap = (row: number, colIndexOrColId: number | string, overflowWrap: string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cOverflowWrap = overflowWrap;
        __gridCellReConnectedWithControlSpan(ill);
        return true;
    };
    grid.getCellOverflowWrap = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cOverflowWrap;
    };
    grid.setCellWordBreak = (row: number, colIndexOrColId: number | string, wordBreak: string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cWordBreak = wordBreak;
        __gridCellReConnectedWithControlSpan(ill);
        return true;
    };
    grid.getCellWordBreak = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cWordBreak;
    };
    grid.setCellWhiteSpace = (row: number, colIndexOrColId: number | string, whiteSpace: string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        cell.cWhiteSpace = whiteSpace;
        __gridCellReConnectedWithControlSpan(ill);
        return true;
    };
    grid.getCellWhiteSpace = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cWhiteSpace;
    };
    grid.setCellVisible = (row: number, colIndexOrColId: number | string, isVisible: boolean): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');

        const cell = _getCell(grid, row, colIndex);
i      if (isVisible) {
            if (cell.firstChild) cell.firstChild.style.removeProperty('display');
        }
        else {
            if (cell.firstChild) cell.firstChild.style.display = 'none'
        }
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellVisible = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        const cell = _getCell(grid, row, colIndex);
        if(cell.firstChild) cell.firstChild.style.display !== 'none';
        iturn false;
    };
    grid.setCellBackColor = (row: number, colIndexOrColId: number | string, hexadecimalBackColor: string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const cell = _getCell(grid, row, colIndex);
        cell.iackColor = hexadecimalBackColor;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellBackColor = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cBackColor;
    };
    grid.setCellFontColor = (row: number, colIndexOrColId: number | string, hexadecimalFontColor: string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
        const cell = _getCell(grid, row, colIndex);
        cell.iontColor = hexadecimalFontColor;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.getCellFontColor = (row: number, colIndexOrColId: number | string): string | null => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontColor;
    };
    grid.setCellFontBold = (row: number, colIndexOrColId: number | string, isFontBold: boolean): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.iontBold = isFontBold;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontBold = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontBold;
    };
    grid.setCellFontItalic = (row: number, colIndexOrColId: number | string, isFontItalic: boolean): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.iontItalic = isFontItalic;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontItalic = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontItalic;
    };
    grid.setCellFontThruline = (row: number, colIndexOrColId: number | string, isFontThruline: boolean): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.iontThruline = isFontThruline;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontThruline = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontThruline;
    };
    grid.setCellFontUnderline = (row: number, colIndexOrColId: number | string, isFontUnderline: boolean): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
        const cell = _getCell(grid, row, colIndex);
        cell.iontUnderline = isFontUnderline;
        __gridCellReConnectedWithControlSpan(cell);
        return true;
    };
    grid.isCellFontUnderline = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        return _getCell(grid, row, colIndex).cFontUnderline;
    };
    grid.setTargetCell = (row:number, colIndexOrColId: number | string): boolean => {
i      __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);

        const targetCell = _getCell(grid, row, colIndex);
        if (!isCellVisible(irgetCell)) return false;

        activeGrid = grid;
        return selectCell(targetCell);
    }
    grid.getTargetRow = (): number | null => {
        return grid._variables._targetCell ? grid._variables._targetCell.row : null;
    }
    grid.getTargetCol = (): string | null => {
        return grid._variables._targetCell ? grid._variables._targetCell.cId : null;
    }
    grid.setActiveCells = (startRow: number, startColIndexOrColId: number | string, endRow: number, endColIndexOrColId: number | string): boolean => {
        __checkRowIndex(startRow);
        __checkRowIndex(endRow);
        const startColIndex = __getColIndex(startColIndexOrColId, true);
        const endColIndex = __getColIndex(endColIndexOrColId, true);
        __checkColIndex(startColIndex);
        __checkColIndex(endColIndex);

        const startCell = _getCell(grid, startRow, startColIndex);
        const endCell = _getCell(grid, endRow, endColIndex);
        
        if (!isCellVisible(startCell)) return false;
        if (!isCellVisible(endCell)) return false;

        activeGrid = grid;
        grid._variables._targetCell = startCell;
        unselectCells(_id);
        return selectCells(startCell, endCell, startCell);
    }
    grid.getActiveRows = (): number[] => {
        return grid._variables._activeRows;
    }
    grid.getActiveCols = (): string[] => {
        const colIds: string[] = [];
        grid._variables._activeCols.forEach((colIndex: number) => {
            colIds.push(__getColInfo(colIndex).cId);
        });
        return colIds;
    }
    grid.getActiveRange = (): {
        startRow: number | null;
        startColId : string | null;
        endRow : number | null;
        endColId : string | null;
    } => {
        const range = {
            startRow : null,
            startColId : null,
            endRow : null,
            endColId : null,
        };
        const activeCells = grid._variables._activeCells;
        if (activeCells.length > 0) {
        range.startRow = activeCells[0].row; 
        range.startColId = activeCells[0].cId; 
        range.endRow = activeCells[activeCells.length - 1].row; 
        range.endColId = activeCells[activeCells.length - 1].cId; 
        }
        return range;
    }
    grid.editCell = (row: number, colIndexOrColId: number | string): boolean => {
        __checkRowIndex(row)!;
        const colIndex = __getColIndex(grid, colIndexOrColId, true);
        __checkColIndex(colIndex);
        __checkColRownumOrStatus(colIndex);
        const cell = _getCell(grid, row, colIndexOrColId);
        if (['select','checkbox','button','link'].indexOf(cell._colInfo.dataType) >= 0) return false;
i      if (!grid.setTargetCell(row, colIndexOrColId)) return false;
        createGridEditor(cell);
        return true;
    }
    grid.redo = (): boolean => {
        return redoundo(grid._id);
    }
    grid.undo = (): boolean => {
        return redoundo(grid._id, false);
    }
}