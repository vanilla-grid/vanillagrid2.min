import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { ColInfo } from "../types/colInfo";
import type { CellData } from "../types/cell";
import type { Handler } from "../types/handler";
import { Align, alignUnit, enumWidthUnit, SelectionPolicy, selectionPolicyUnit, statusUnit, VerticalAlign, verticalAlignUnit } from "../types/enum";
import { checkIsValueOrData, deepCopy, extractNumberAndUnit, getArrayElementWithBoundCheck, getColorFromColorSet, getHeaderString, getHexColorFromColorName, getOnlyNumberWithNaNToNull, getVerticalAlign, isIncludeEnum, removeAllChild, validateIntegerAndZero, validateNumber, validatePositiveIntegerAndZero } from "../utils/utils";
import { setColorSet, setGridCssStyle, setInvertColor } from "../utils/setGridStyle";

export const getGridMethod = (vg: Vanillagrid, grid: Grid, handler: Handler) => {
    return {
        getDefualtGridInfo() {
            return vg.attributes.defaultGridInfo;
        },
        getDefualtGridCssInfo() {
            return vg.attributes.defaultGridCssInfo;
        },
        getDefualtColInfo() {
            return vg.attributes.defaultColInfo;
        },

        setOnActiveCell(func: (row: number, colId: string) => boolean) {
            grid.events.onActiveCell = func;
        },
        setOnActiveCells(func: (startRow: number, startColId: string, endRow: number, endColId: string) => boolean) {
            grid.events.onActiveCells = func;
        },
        setOnActiveRow(func: (row: number) => boolean) {
            grid.events.onActiveRow = func;
        },
        setOnActiveRows(func: (startRow: number, endRow: number) => boolean) {
            grid.events.onActiveRows = func;
        },
        setOnActiveCol(func: (colId: string) => boolean) {
            grid.events.onActiveCol = func;
        },
        setOnActiveCols(func: (startColId: string, endColId: string) => boolean) {
            grid.events.onActiveCols = func;
        },
        setOnBeforeChange(func: (row: number, colId: string, oldValue: any, newValue: any) => boolean) {
            grid.events.onBeforeChange = func;
        },
        setOnAfterChange(func: (row: number, colId: string, oldValue: any, newValue: any) => void) {
            grid.events.onAfterChange = func;
        },
        setOnBeforeClickCell(func: (row: number, colId: string) => boolean) {
            grid.events.onBeforeClickCell = func;
        },
        setOnAfterClickCell(func: (row: number, colId: string) => void) {
            grid.events.onAfterClickCell = func;
        },
        setOnClickSelect(func: (row: number, colId: string, selectNode: HTMLElement) => boolean) {
            grid.events.onClickSelect = func;
        },
        setOnClickCheckbox(func: (row: number, colId: string, checkboxNode: HTMLElement) => boolean) {
            grid.events.onClickCheckbox = func;
        },
        setOnClickButton(func: (row: number, colId: string, buttonNude: HTMLElement) => boolean) {
            grid.events.onClickButton = func;
        },
        setOnClickLink(func: (row: number, colId: string, linkNode: HTMLElement) => boolean) {
            grid.events.onClickLink = func;
        },
        setOnBeforeDblClickCell(func: (row: number, colId: string) => boolean) {
            grid.events.onBeforeDblClickCell = func;
        },
        setOnAfterDblClickCell(func: (row: number, colId: string) => void) {
            grid.events.onAfterDblClickCell = func;
        },
        setOnBeforeClickHeader(func: (row: number, colId: string) => boolean) {
            grid.events.onBeforeClickHeader = func;
        },
        setOnAfterClickHeader(func: (row: number, colId: string) => void) {
            grid.events.onAfterClickHeader = func;
        },
        setOnBeforeDblClickHeader(func: (row: number, colId: string) => boolean) {
            grid.events.onBeforeDblClickHeader = func;
        },
        setOnAfterDblClickHeader(func: (row: number, colId: string) => void) {
            grid.events.onAfterDblClickHeader = func;
        },
        setOnBeforeEditEnter(func: (row: number, colId: string, editorNode: HTMLElement) => boolean) {
            grid.events.onBeforeEditEnter = func;
        },
        setOnAfterEditEnter(func: (row: number, colId: string, editorNode: HTMLElement) => void) {
            grid.events.onAfterEditEnter = func;
        },
        setOnEditEnding(func: (row: number, colId: string, oldValue: any, newValue: any) => boolean) {
            grid.events.onEditEnding = func;
        },
        setOnClickFilter(func: (row: number, colId: string, filterNode: HTMLElement) => boolean) {
            grid.events.onClickFilter = func;
        },
        setOnChooseFilter(func: (row: number, colId: string, oldValue: any, newValue: any) => boolean) {
            grid.events.onChooseFilter = func;
        },
        setOnPaste(func: (startRow: number, startColId: string, clipboardText: string) => boolean) {
            grid.events.onPaste = func;
        },
        setOnCopy(func: (startRow: number, startColId: string, endRow: number, endColId: string, copyText: string) => boolean) {
            grid.events.onCopy = func;
        },
        setOnResize(func: (colId: string) => boolean) {
            grid.events.onResize = func;
        },
        setOnKeydownEditor(func: (event: KeyboardEvent) => boolean) {
            grid.events.onKeydownEditor = func;
        },
        setOnInputEditor(func: (event: InputEvent) => boolean) {
            grid.events.onInputEditor = func;
        },
        setOnKeydownGrid(func: (event: KeyboardEvent) => boolean) {
            grid.events.onKeydownGrid = func;
        },

        getHeaderRowCount() {
            let count = 0;
            for(const colInfo of grid.data.colInfos) {
                const headerArr = colInfo.header.split(';');
                if (headerArr.length > count) count = headerArr.length;
            }
            return count;
        },
        getHeaderText(colIndexOrColId: number | string) {
            return handler.__getColInfo(grid.data.id, colIndexOrColId, true)!.header;
        },
        setHeaderText(colIndexOrColId: number | string, value: string) {
            handler.__getColInfo(grid.data.id, colIndexOrColId, true)!.header = getHeaderString(grid.methods.getHeaderRowCount(), value);
            handler.__loadHeader(grid.data.id);
            grid.methods.reloadFilterValue();
            return true;
        },
        reloadFilterValue() {
            for(const colInfo of grid.data.colInfos) {
                grid.methods.reloadColFilter(colInfo.colIndex!);
            }
            return true;
        },
        reloadColFilter(colIndexOrColId: number | string) {
            handler.reloadColFilterValue(grid.data.id, colIndexOrColId);
            return true;
        },
        clearFilterValue() {
            const datas = handler.getDatasWithClearFilterValue(grid.data.id, grid.methods.getDatas());
            handler.__loadHeader(grid.data.id);
            grid.methods.load(datas);
            handler.__loadFooter(grid.data.id);
            return true;
        },
        getFooterRowCount() {
            let count = 0;
            for(const colInfo of grid.data.colInfos) {
                if (colInfo.footer && Array.isArray(colInfo.footer) && colInfo.footer.length > count) count = colInfo.footer.length;
            }
            return count;
        },
        reloadFooterValue() {
            handler.reloadFooterValue(grid.data.id);
            return true;
        },
        setFooterValue(row: number, colId: number | string, value: string) {
            const footer = handler.__getColInfo(grid.data.id, colId, true)!.footer;
            const footerArr = footer ? footer : Array(grid.methods.getFooterRowCount()).fill(null);
            getArrayElementWithBoundCheck(footerArr, row - 1);
            footerArr[row - 1] = value;
            handler.__getColInfo(grid.data.id, colId, true)!.footer = footerArr;
            handler.__loadFooter(grid.data.id);
            return true;
        },
        getFooterValue(row: number, colId: number | string) {
            return handler._getFooterCell(grid.data.id, row, colId).value;
        },
        setFooterFormula(colId: number | string, formula: string) {
            handler.__getColInfo(grid.data.id, colId, true)!.footer = formula.split(';');
            handler.__loadFooter(grid.data.id);
            return true;
        },
        getFooterFormula(colId: number | string) {
            const footerFormulas = deepCopy(handler.__getColInfo(grid.data.id, colId, true)!.footer);
            if (footerFormulas && Array.isArray(footerFormulas)) {
                for(let i = 0; i < footerFormulas.length; i++) {
                    if (typeof footerFormulas[i] === 'function') footerFormulas[i] = '$$FUNC';
                }
                return footerFormulas.join(';');
            }
            return null;
        },
        setFooterFunction(row: number, colId: number | string, func: (values: any[]) => string) {
            const footer = handler.__getColInfo(grid.data.id, colId, true)!.footer;
            const footerArr = footer ? footer : Array(grid.methods.getFooterRowCount()).fill(null);
            getArrayElementWithBoundCheck(footerArr, row - 1);
            footerArr[row - 1] = func;
            handler.__getColInfo(grid.data.id, colId, true)!.footer = footerArr;
            handler.__loadFooter(grid.data.id);
            return true;
        },
        getGridInfo() {
            const resultInfo = deepCopy(grid.data.gridInfo)
            resultInfo.id = grid.data.id;
            resultInfo.cssInfo = deepCopy(grid.data.gridCssInfo);
            return resultInfo;
        },
        load(keyValueOrDatas: Record<string, any> | Record<string, any>[]) {
            if (!keyValueOrDatas) return false;
            if (!Array.isArray(keyValueOrDatas)) throw new Error('Please insert valid datas.');
            
            const isKeyValue = checkIsValueOrData(keyValueOrDatas);
            handler.__clear(grid.data.id);
    
            if (isKeyValue) {    
                const keyValues = keyValueOrDatas;
                for(let rowCount = 1; rowCount <= keyValues.length; rowCount++) {
                    const tempRows = [];
                    const keyValue = keyValues[rowCount - 1];
                    for(let colCount = 1; colCount <= grid.data.colInfos.length; colCount++) {
                        const tempGridData = handler.getGridCell(grid.data.id, grid.data.colInfos[colCount - 1], keyValue, rowCount, colCount);
                        tempRows.push(tempGridData);
                    }
                    grid.elements.gridBody._gridBodyCells.push(tempRows);
                }
            }
            else {
                const datas = keyValueOrDatas;
                for(let rowCount = 1; rowCount <= datas.length; rowCount++) {
                    const tempRows = [];
                    const colDatas = datas[rowCount - 1];
                    for(let colCount = 1; colCount <= grid.data.colInfos.length; colCount++) {
                        const tempGridData = handler.getGridCell(grid.data.id, grid.data.colInfos[colCount - 1], colDatas, rowCount, colCount);
                        tempRows.push(tempGridData);
                    }
                grid.elements.gridBody._gridBodyCells.push(tempRows);
                }
            }
            handler.__mountGridBodyCell(grid.data.id);
            return true;
        },
        clear() {
            removeAllChild(grid.elements.gridBody);
            grid.data.variables.sortToggle = {};
            grid.data.variables.filters = [];
            handler.__clear(grid.data.id);
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            return true;
        },
        clearStatus() {
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, 2);
                cell!.value = null;
                handler.reConnectedCallbackElement(cell!);
            }
            return true;
        },
        getRowCount() {
            return grid.elements.gridBody._gridBodyCells.length;
        },
        getColCount() {
            return grid.data.colInfos.length;
        },
        getValues() {
            const keyValues = [];
            let cols;
            for(const rows of grid.elements.gridBody._gridBodyCells) {
                cols = {};
                for(const cell of rows) {
                    (cols as any)[cell.colId] = deepCopy(cell.value);
                }
                keyValues.push(cols);
            }
            return keyValues;
        },
        getDatas() {
            return handler.___getDatasWithoutExceptedProperty(grid.data.id);
        },
        sort(colId: string, isAsc = true, isNumSort = false) {
            const datas = grid.methods.getDatas();
            const sortDatas = handler.sort(grid.data.id, datas, colId, isAsc, isNumSort);
            const sortToggle = grid.data.variables.sortToggle[colId];
            grid.methods.load(sortDatas);
            grid.data.variables.sortToggle[colId] = sortToggle;
            return true;
        },
        checkRequired<T>(func?: (data: CellData) => T) {
            if (func && typeof func !== 'function') throw new Error('Please insert a valid function.');
            for(const rows of grid.elements.gridBody._gridBodyCells) {
                for(const cell of rows) {
                    if(cell.required
                        && ['select','checkbox','button','link'].indexOf(cell.dataType!) < 0
                        && (cell.value === '' || cell.value === null || cell.value === undefined || cell.value === grid.data.gridInfo.nullValue)) {
                        if(func) {
                            return func(handler.__getData(cell));
                        }
                        return handler.__getData(cell);
                    }
                }
            }
            return null;
        },
        setGridMount(isDrawable: boolean) {
            isDrawable = isDrawable === true;
            grid.data.variables.isDrawable = isDrawable;
            if (isDrawable) {
                handler.__mountGridBodyCell(grid.data.id);        
            }
            return true;
        },
        getGridFilter() {
            return grid.data.variables.filters;
        },
        setGridWidth(cssTextWidth: string) {
            if (!cssTextWidth) throw new Error('Please insert cssText of width.');
            grid.data.gridCssInfo.width = cssTextWidth;
            setGridCssStyle(grid);
            return true;
        },
        setGridHeight(cssTextHeight: string) {
            if (!cssTextHeight) throw new Error('Please insert cssText of height.');
            grid.data.gridCssInfo.height = cssTextHeight;
            setGridCssStyle(grid);
            return true;
        },
        setGridSizeLevel(sizeLevel: number) {
            sizeLevel = getOnlyNumberWithNaNToNull(sizeLevel)!;
            if (!sizeLevel) throw new Error('Please insert number of size level.');
            grid.data.gridCssInfo.sizeLevel = sizeLevel;
            grid.data.gridCssInfo.cellFontSize = ((grid.data.gridCssInfo.sizeLevel + 15) / 20) * 14 + 'px';    
            grid.data.gridCssInfo.cellMinHeight = ((grid.data.gridCssInfo.sizeLevel + 15) / 20) * 21 + 'px';    
            setGridCssStyle(grid);
            return true;
        },
        setGridVerticalAlign(verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) {
            if (!verticalAlign) throw new Error('Please insert vertical align.');
            if (!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
            const cssTextVerticalAlign = getVerticalAlign(verticalAlign)
            grid.data.gridCssInfo.verticalAlign = cssTextVerticalAlign;
            setGridCssStyle(grid);
            return true;
        },
        setCellFontSize(cssTextFontSize: string) {
            if (!cssTextFontSize) throw new Error('Please insert cssText of cell font size.');
            grid.data.gridCssInfo.cellFontSize = cssTextFontSize;
            setGridCssStyle(grid);
            return true;
        },
        setCellMinHeight(cssTextMinHeight: string) {
            if (!cssTextMinHeight) throw new Error('Please insert cssText of cell min height.');
            grid.data.gridCssInfo.cellMinHeight = cssTextMinHeight;
            setGridCssStyle(grid);
            return true;
        },
        setHorizenBorderSize(pxHorizenBorderSize: number) {
            validatePositiveIntegerAndZero(pxHorizenBorderSize);
            grid.data.gridCssInfo.horizenBorderSize = pxHorizenBorderSize;
            setGridCssStyle(grid);
            return true;
        },
        setVerticalBorderSize(pxVerticalBorderSize: number) {
            validatePositiveIntegerAndZero(pxVerticalBorderSize);
            grid.data.gridCssInfo.verticalBorderSize = pxVerticalBorderSize;
            setGridCssStyle(grid);
            return true;
        },
        setGridColor(cssTextHexColor: string) {
            if (!/^#[0-9a-fA-F]{6}$/.test(cssTextHexColor)) {
                throw new Error('Please insert valid cssText of hexadecimal color. (#ffffff)');
            }
            grid.data.gridCssInfo.color = cssTextHexColor;
            setColorSet(grid.data.gridCssInfo);
            setGridCssStyle(grid);
            return true;
        },
        setGridColorSet(colorName: string) {
            const hexColor = getColorFromColorSet(colorName);
            grid.data.gridCssInfo.color = hexColor;
            setColorSet(grid.data.gridCssInfo);
            setGridCssStyle(grid);
            return true;
        },
        invertColor(doInvert: boolean) {
            doInvert = doInvert === true;
            if (doInvert) setInvertColor(grid.data.gridCssInfo);
            else setColorSet(grid.data.gridCssInfo);
            setGridCssStyle(grid);
            return true;
        },
        setGridName(gridName: string) {
            if (!gridName) throw new Error('Please insert a gridName.');
            grid.data.gridInfo.name = String(gridName);
            return true;
        },
        getGridName() {
            return grid.data.gridInfo.name!;
        },
        setGridLocked (isLocked: boolean) {
            if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.locked = isLocked;
            grid.data.colInfos.forEach((colInfo, idx) => {
                if (idx >= 2) {  
                    colInfo.locked = isLocked;
                }
            })
            const datas = handler.___getDatasWithoutExceptedProperty(grid.data.id, ['locked']);
            grid.methods.load(datas);
            return true;
        },
        isGridLocked () {
            return grid.data.gridInfo.locked!;
        },
        setGridLockedColor (isLockedColor: boolean) {
            if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.lockedColor = isLockedColor;
            grid.data.colInfos.forEach((colInfo, idx) => {
                if (idx >= 2) {  
                    colInfo.lockedColor = isLockedColor;
                }
            })
            const datas = handler.___getDatasWithoutExceptedProperty(grid.data.id, ['lockedColor']);
            grid.methods.load(datas);
            return true;
        },
        setGridResizable (isResizable: boolean) {
            if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.resizable = isResizable;
            return true;
        },
        isGridResizable () {
            return grid.data.gridInfo.resizable;
        },
        setGridRecordCount (recordCount: number) {
            recordCount = validatePositiveIntegerAndZero(recordCount);
            grid.data.gridInfo.redoCount = recordCount;
            return true;
        },
        getGridRecordCount () {
            return grid.data.gridInfo.redoCount!;
        },
        setGridRedoable(isRedoable: boolean) {
            if (typeof isRedoable !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.redoable = isRedoable;
            return true;
        },
        isGridRedoable() {
            return grid.data.gridInfo.redoable!;
        },
        setGridVisible(isVisible: boolean) {
            if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.visible = isVisible;
            setGridCssStyle(grid);
            return true;
        },
        isGridVisible() {
            return grid.data.gridInfo.visible!;
        },
        setHeaderVisible(isVisible: boolean) {
            if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.headerVisible = isVisible;
            setGridCssStyle(grid);
            return true;
        },
        isHeaderVisible() {
            return grid.data.gridInfo.headerVisible!;
        },
        setGridRownumLockedColor(isRownumLockedColor: boolean) {
            if (typeof isRownumLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.rownumLockedColor = isRownumLockedColor;
            grid.data.colInfos[0].lockedColor = isRownumLockedColor;
    
            for(const row of grid.elements.gridBody._gridBodyCells) {
                row[0].lockedColor = isRownumLockedColor;
                handler.reConnectedCallbackElement(row[0]);
            }
            return true;
        },
        isGridRownumLockedColor() {
            return grid.data.gridInfo.rownumLockedColor!;
        },
        setGridRownumSize(rownumSize: number) {
            rownumSize = validatePositiveIntegerAndZero(rownumSize);
            const colInfo = grid.data.colInfos[0];
            colInfo.originWidth = String(rownumSize) + extractNumberAndUnit(colInfo.originWidth)!.unit
            handler.changeColSize(grid.data.id, colInfo.colIndex!, rownumSize);
            colInfo.colVisible = rownumSize !== 0;
            handler.reloadGridWithModifyCell(grid.data.id, colInfo.colIndex!);
            return true;
        },
        getGridRownumSize() {
            return grid.data.colInfos[0].originWidth!;
        },
        setGridStatusLockedColor(isStatusLockedColor: boolean) {
            if (typeof isStatusLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.statusLockedColor = isStatusLockedColor;
            grid.data.colInfos[1].lockedColor = isStatusLockedColor;
    
            for(const row of grid.elements.gridBody._gridBodyCells) {
                row[1].lockedColor = isStatusLockedColor;
                handler.reConnectedCallbackElement(row[1]);
            }
            return true;
        },
        isGridStatusLockedColor() {
            return grid.data.gridInfo.statusLockedColor!;
        },
        setGridSelectionPolicy(selectionPolicy: SelectionPolicy.range | SelectionPolicy.single | SelectionPolicy.none) {
            if (!isIncludeEnum(selectionPolicyUnit, selectionPolicy)) throw new Error('Please insert the correct selectionPolicy properties. (single, range, none)');
            grid.data.gridInfo.selectionPolicy = selectionPolicy;
            return true
        },
        getGridSelectionPolicy() {
            return grid.data.gridInfo.selectionPolicy!;
        },
        setGridNullValue(nullValue: any) {
            grid.data.gridInfo.nullValue = nullValue;
            handler.__gridBodyCellsReConnected(grid.data.id);
            return true;
        },
        getGridNullValue() {
            return deepCopy(grid.data.gridInfo.nullValue);
        },
        setGridDateFormat(dateFormat: string) {
            grid.data.gridInfo.dateFormat = dateFormat;
            handler.__gridBodyCellsReConnected(grid.data.id);
            return true;
        },
        getGridDateFormat() {
            return grid.data.gridInfo.dateFormat!;
        },
        setGridMonthFormat(monthFormat: string) {
            grid.data.gridInfo.monthFormat = monthFormat;
            handler.__gridBodyCellsReConnected(grid.data.id);
            return true;
        },
        getGridMonthFormat() {
            return grid.data.gridInfo.monthFormat!;
        },
        setGridAlterRow(isAlterRow: boolean) {
            if (typeof isAlterRow !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.alterRow = isAlterRow;
            handler.__gridBodyCellsReConnected(grid.data.id);
            return true;
        },
        setGridFrozenColCount(frozenColCount: number) {
            frozenColCount = validatePositiveIntegerAndZero(frozenColCount);
            const styleGridTemplateColumns = grid.elements.gridHeader.style.gridTemplateColumns;
            if (styleGridTemplateColumns.includes('%') && grid.data.gridInfo.frozenColCount !== 0) {
                throw new Error(grid.data.id + ' has error. If you set the horizontal size to a percentage, property A is not available.');
            }
    
            grid.data.gridInfo.frozenColCount = frozenColCount;
            const datas = grid.methods.getDatas();
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            grid.methods.load(datas);
            return true;
        },
        getGridFrozenColCount() {
            return grid.data.gridInfo.frozenColCount!;
        },
        setGridFrozenRowCount(frozenRowCount: number) {
            frozenRowCount = validatePositiveIntegerAndZero(frozenRowCount);
            grid.data.gridInfo.frozenRowCount = frozenRowCount;
            const datas = grid.methods.getDatas();
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            grid.methods.load(datas);
            return true;
        },
        getGridFrozenRowCount() {
            return grid.data.gridInfo.frozenRowCount!;
        },
        setGridSortable(isSortable: boolean) {
            if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.sortable = isSortable;
            return true;
        },
        isGridSortable() {
            return grid.data.gridInfo.sortable!;
        },
        setGridFilterable(isFilterable: boolean) {
            if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.filterable = isFilterable;
            const datas = grid.methods.getDatas();
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            grid.methods.load(datas);
            return true;
        },
        isGridFilterable() {
            return grid.data.gridInfo.filterable!;
        },
        setGridAllCheckable(isAllCheckable: boolean) {
            if (typeof isAllCheckable !== 'boolean') throw new Error('Please insert a boolean type.');
            grid.data.gridInfo.allCheckable = isAllCheckable;
            return true;
        },
        isGridAllCheckable() {
            return grid.data.gridInfo.allCheckable!;
        },
        setGridCheckedValue(checkeValue: string) {
            if (typeof checkeValue !== 'string') throw new Error('Please insert a string type.');
            if (grid.data.gridInfo.uncheckedValue === checkeValue) throw new Error('Checked and unchecked values cannot be the same.');
            const datas = grid.methods.getDatas();
            for(const rows of datas) {
                for(const data of rows) {
                    if (data.dataType === 'checkbox') {
                        if (data.value === grid.data.gridInfo.checkedValue) {
                            data.value = checkeValue;
                        }
                    } 
                }
            }
            grid.data.gridInfo.checkedValue = checkeValue;
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            grid.methods.load(datas);
            return true;
        },
        getGridCheckedValue() {
            return grid.data.gridInfo.checkedValue!;
        },
        setGridUncheckedValue(unCheckedValue: string) {
            if (typeof unCheckedValue !== 'string') throw new Error('Please insert a string type.');
            if (grid.data.gridInfo.checkedValue === unCheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
            const datas = grid.methods.getDatas();
            for(const rows of datas) {
                for(const data of rows) {
                    if (data.dataType === 'checkbox') {
                        if (data.value !== grid.data.gridInfo.checkedValue) {
                            data.value = unCheckedValue;
                        }
                    } 
                }
            }
            grid.data.gridInfo.uncheckedValue = unCheckedValue;
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            grid.methods.load(datas);
            return true;
        },
        getGridUncheckedValue() {
            return grid.data.gridInfo.uncheckedValue!;
        },
        addCol(colIndexOrColId: number | string, colInfo: ColInfo) {
            let colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId);
            if (colIndex! < 2) throw new Error('You cannot add new columns between the row number and status columns.');
            if (!colIndex || colIndex > grid.methods.getColCount()) colIndex = grid.methods.getColCount();
    
            const newColInfo = handler.__getDefaultColInfo(grid.data.id, colInfo, true);
            let datas = grid.methods.getDatas();
            
            grid.data.colInfos.splice(colIndex, 0, newColInfo);
            grid.data.colInfos.forEach((colInfo, idx) => {
                colInfo.colIndex = idx + 1;
            });
            for(let r = 1; r <= grid.methods.getRowCount(); r++) {
                const newCellData = handler.__getCellData(grid.data.colInfos[colIndex], r);
                datas[r - 1].splice(colIndex, 0, newCellData);
            }
            datas = handler.getDatasWithClearFilterValue(grid.data.id, datas);
            handler.__loadHeader(grid.data.id);
            grid.methods.load(datas);
            handler.__loadFooter(grid.data.id);
            return true;
        },
        removeCol(colIndexOrColId: number | string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (colIndex <= 2) throw new Error('The row number or status columns cannot be removed.');
            const result = grid.methods.getColValues(colIndex);
    
            grid.data.colInfos.splice(colIndex - 1, 1);
            grid.data.colInfos.forEach((colInfo, idx) => {
                colInfo.colIndex = idx + 1;
            });

            const datas = grid.methods.getDatas();
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            grid.methods.load(datas);
    
            return result;
        },
        setColInfo(colInfo: ColInfo) {
            if (!colInfo) throw new Error('Column info is required.');
            if (colInfo.constructor !== Object) throw new Error('Please insert a valid column info');
            let colIndexOrColId;
            if (colInfo.colIndex) colIndexOrColId = colInfo.colIndex;
            if (colInfo.colId) colIndexOrColId = colInfo.colId;
            if (!colIndexOrColId) throw new Error('Column id is required.');
            
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (colIndex <= 2) throw new Error('The row number or status columns are immutable.');
    
            const newColInfo = grid.data.colInfos[colIndex - 1];
            Object.keys(colInfo).forEach((key) => {
                if(Object.prototype.hasOwnProperty.call(newColInfo, key) && (colInfo as any)[key] !== undefined) {
                    (newColInfo as any)[key] = (colInfo as any)[key];
                }
            })
            if(!newColInfo.name) newColInfo.name = newColInfo.colId;
            if(!newColInfo.header) newColInfo.header = getHeaderString(grid.methods.getHeaderRowCount(), newColInfo.colId);
    
            const datas = grid.methods.getDatas();
            datas.forEach((row: CellData[]) => {
                for(const data of row) {
                    if (data.colId === newColInfo.colId) {
                        handler.setCellDataFromColInfo(data, newColInfo);
                    }
                }
            })
    
            handler.__loadHeader(grid.data.id);
            grid.methods.load(datas);
            handler.__loadFooter(grid.data.id);
            return true;
        },
        getColInfo(colIndexOrColId: number | string) {
            const colInfo = handler.__getColInfo(grid.data.id, colIndexOrColId)!;
    
            const info: ColInfo = {
                colId : colInfo.colId,
                colIndex : colInfo.colIndex,
                name : colInfo.name,
                header : colInfo.header,
                footer : colInfo.footer,
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
            };
            return info;
        },
        getColDatas(colIndexOrColId: number | string): CellData[] {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colDatas = [];
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                colDatas.push(grid.methods.getCellData(row, colIndex));
            }
            return colDatas;
        },
        setColSameValue(colIndexOrColId: number | string, value: any, doRecord = false)  {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColRownumOrStatus(colIndex);
            if (doRecord) {
                const records = [];
                for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                    let cell = handler._getCell(grid.data.id, row, colIndex)!;
                    let record = handler.getRecordsWithModifyValue(cell, value, true);
                    if (Array.isArray(record) && record.length > 0) records.push(record[0]);
                }
                handler.recordGridModify(grid.data.id, records);
            }
            else {
                for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                    let cell = handler._getCell(grid.data.id, row, colIndex)!;
                    cell.value = handler.getValidValue(cell, value);
                    handler.reConnectedCallbackElement(cell);
                }
                handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            }
            return true;
        },
        getColValues(colIndexOrColId: number | string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colValues = [];
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                let cell = handler._getCell(grid.data.id, row, colIndex)!;
                colValues.push(deepCopy(cell.value));
            }
            return colValues;
        },
        getColTexts(colIndexOrColId: number | string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colTexts = [];
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                colTexts.push(grid.methods.getCellText(row, colIndex));
          }
            return colTexts;
        },
        isColUnique(colIndexOrColId: number | string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colValues = [];
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                let cell = handler._getCell(grid.data.id, row, colIndex)!;
                switch (cell.dataType) {
                    case 'select':
                    case 'checkbox':
                    case 'button':
                    case 'link':
                        colValues.push(handler.getTextFromCell(cell));
                        break;
                    default:
                        colValues.push(cell.value);
                        break;
                }
            }
            return colValues.length === new Set(colValues).size;
        },
        openFilter(colIndexOrColId: number | string) {
            handler.__getHeaderFilter(grid.data.id, colIndexOrColId).style.display = 'block';
            return true;
        },
        closeFilter(colIndexOrColId: number | string) {
            handler.__getHeaderFilter(grid.data.id, colIndexOrColId).style.display = 'none';
            return true;
        },
        setColFilterValue(colIndexOrColId: number | string, filterValue: string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            if(!colInfo.filterValues!.has(filterValue))  throw new Error('Please insert a valid filterValue. ' + Array.from(colInfo.filterValues!).join(', '));
    
            let headerCell;
            let modifyFilterSelect: any;
            for(let row = 1; row <= grid.methods.getHeaderRowCount(); row++) {
                headerCell = handler._getHeaderCell(grid.data.id, row, colInfo.colIndex!);
                modifyFilterSelect = headerCell.querySelectorAll('.' + grid.data.id + '_filterSelect');
                if(modifyFilterSelect.length > 0) {
                    modifyFilterSelect = modifyFilterSelect[0]
                    break;
                }
            }
            modifyFilterSelect.value = filterValue;
            if(modifyFilterSelect.value !== '$$ALL') modifyFilterSelect.style.display = 'block';
    
            handler._doFilter(grid.data.id);
            return true;
        },
        getColFilterValues(colIndexOrColId: number | string): string[]  {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return Array.from(colInfo.filterValues!);
        },
        getColFilterValue(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.filterValue ? colInfo.filterValue : null;
        },
        getColId(colIndexOrColId: number | string) {
            const colInfo: ColInfo  = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.colId;
        },
        getColIndex(colIndexOrColId: number | string) {
            return handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
        },
        setColName(colIndexOrColId: number | string, colName: string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (!colName) throw new Error('Column Name is required');
            if (typeof colName !== 'string') throw new Error('Please insert a string type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.name = colName;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                handler._getCell(grid.data.id, row, colIndex)!.name = colName;
            }
            return true;
        },
        getColName(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId)!;
            return colInfo.name!;
        },
        setColUntarget(colIndexOrColId: number | string, isUntarget: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isUntarget !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.untarget = isUntarget;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                handler._getCell(grid.data.id, row, colIndex)!.untarget = isUntarget;
            }
            return true;
        },
        setColRowMerge(colIndexOrColId: number | string, isRowMerge: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isRowMerge !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.rowMerge = isRowMerge;
        
            const datas = grid.methods.getDatas();
            grid.methods.load(datas);
            return true;
        },
        isColRowMerge(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.rowMerge;
        },
        setColColMerge(colIndexOrColId: number | string, isColMerge: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isColMerge !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.colMerge = isColMerge;
        
            const datas = grid.methods.getDatas();
            grid.methods.load(datas);
            return true;
        },
        isColColMerge(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.colMerge;
        },
        setColVisible(colIndexOrColId: number | string, isVisible: boolean) {
            if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            if (isVisible) {
                handler.changeColSize(grid.data.id, colInfo.colIndex!, extractNumberAndUnit(colInfo.originWidth)!.number);
            }
            else {
                handler.changeColSize(grid.data.id, colInfo.colIndex!, 0)
            }
            colInfo.colVisible = isVisible;
            handler.__loadHeader(grid.data.id);
            handler.reloadGridWithModifyCell(grid.data.id, colInfo.colIndex!);
            return true;
        },
        isColVisible(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.colVisible!;
        },
        setColRequired(colIndexOrColId: number | string, isRequired: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex, true)!;
            colInfo.required = isRequired;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                handler._getCell(grid.data.id, row, colIndex)!.required = isRequired;
            }
            return true;
        },
        isColRequired(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.required!;
        },
        setColResizable(colIndexOrColId: number | string, isResizable: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            colInfo.resizable = isResizable;
            handler.__loadHeader(grid.data.id);
            return true;
        },
        isColResizable(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.resizable!;
        },
        setColSortable(colIndexOrColId: number | string, isSortable: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            colInfo.sortable = isSortable;
            return true;
        },
        isColSortable(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.sortable!;
        },
        setColFilterable(colIndexOrColId: number | string, isFilterable: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex, true)!;
            colInfo.filterable = isFilterable;
            handler.__loadHeader(grid.data.id);
            handler.__loadFooter(grid.data.id);
            handler.reloadColFilterValue(grid.data.id, colIndexOrColId);
            return true;
        },
        isColFilterable(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.filterable!;
        },
        setColOriginWidth(colIndexOrColId: number | string, originWidth: string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            const newOriginWidth = extractNumberAndUnit(originWidth)!;
            if (!isIncludeEnum(enumWidthUnit, newOriginWidth.unit!)) throw new Error('Width units can only be pixel or %.');
            colInfo.originWidth = newOriginWidth.number + newOriginWidth.unit!;
            handler.changeColSize(grid.data.id, colInfo.colIndex!, newOriginWidth.number);
            if(newOriginWidth.number === 0) colInfo.colVisible = false;
            else colInfo.colVisible = true;
            handler.__loadHeader(grid.data.id);
            handler.reloadGridWithModifyCell(grid.data.id, colInfo.colIndex!);
            return true;
        },
        getColOriginWidth(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.originWidth!;
        },
        setColDataType(colIndexOrColId: number | string, dataType: string) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (!Object.keys(vg.dataType).includes(dataType)) throw new Error('Please insert a valid dataType.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.dataType = dataType;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.dataType = dataType;
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColDataType(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.dataType!;
        },
        setColSelectSize(colIndexOrColId: number | string, cssTextSelectSize: string) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.selectSize = cssTextSelectSize;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.selectSize = cssTextSelectSize;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColSelectSize(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.selectSize;
        },
        setColLocked(colIndexOrColId: number | string, isLocked: boolean) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.locked = isLocked;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.locked = isLocked;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        isColLocked(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.locked!;
        },
        setColLockedColor(colIndexOrColId: number | string, isLockedColor: boolean) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.lockedColor = isLockedColor;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.lockedColor = isLockedColor;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        isColLockedColor(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.lockedColor!;
        },
        setColFormat(colIndexOrColId: number | string, format: string) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof format !== 'string') throw new Error('Please insert a string type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.format = format;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.format = format;
                if(cell.dataType === 'mask') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColFormat(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.format;
        },
        setColCodes(colIndexOrColId: number | string, codes: string[]) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.codes = codes;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.codes = codes;
                if(cell.dataType === 'code') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColCodes(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.codes;
        },
        setColDefaultCode(colIndexOrColId: number | string, defaultCode: string) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.defaultCode = defaultCode;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.defaultCode = defaultCode;
                if(cell.dataType === 'code') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColDefaultCode(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.defaultCode;
        },
        setColMaxLength(colIndexOrColId: number | string, maxLength: number) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            maxLength = validatePositiveIntegerAndZero(maxLength);
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.maxLength = maxLength;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.maxLength = maxLength;
                if(cell.dataType === 'text') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColMaxLength(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.maxLength;
        },
        setColMaxByte(colIndexOrColId: number | string, maxByte: number) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            maxByte = validatePositiveIntegerAndZero(maxByte);
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.maxByte = maxByte;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.maxByte = maxByte;
                if(cell.dataType === 'text') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColMaxByte(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.maxByte;
        },
        setColMaxNumber(colIndexOrColId: number | string, maxNumber: number) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            maxNumber = validateNumber(maxNumber);
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.maxNumber = maxNumber;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.maxNumber = maxNumber;
                if(cell.dataType === 'number') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColMaxNumber(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.maxNumber;
        },
        setColMinNumber(colIndexOrColId: number | string, minNumber: number) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            minNumber = validateNumber(minNumber);
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.minNumber = minNumber;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.minNumber = minNumber;
                if(cell.dataType === 'number') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColMinNumber(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.minNumber;
        },
        setColRoundNumber(colIndexOrColId: number | string, roundNumber: number) {
            handler.__checkColRownumOrStatus(colIndexOrColId);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            roundNumber = validateIntegerAndZero(roundNumber);
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.roundNumber = roundNumber;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.roundNumber = roundNumber;
                if(cell.dataType === 'number') {
                    cell.value = handler.getValidValue(cell, cell.value);
                }
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getColRoundNumber(colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.roundNumber;
        },
        setColAlign(colIndexOrColId: number | string, align: Align.left | Align.center | Align.right) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if(!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.align = align;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.align = align;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColAlign (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.align;
        },
        setColVerticalAlign (colIndexOrColId: number | string, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if(!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.verticalAlign = verticalAlign;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.verticalAlign = verticalAlign;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColVerticalAlign (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.verticalAlign;
        },
        setColOverflowWrap (colIndexOrColId: number | string, overflowWrap: string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.overflowWrap = overflowWrap;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.overflowWrap = overflowWrap;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColOverflowWrap (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.overflowWrap;
        },
        setColWordBreak (colIndexOrColId: number | string, wordBreak: string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.wordBreak = wordBreak;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.wordBreak = wordBreak;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColWordBreak (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.wordBreak;
        },
        setColWhiteSpace (colIndexOrColId: number | string, whiteSpace: string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.whiteSpace = whiteSpace;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.whiteSpace = whiteSpace;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColWhiteSpace (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.whiteSpace;
        },
        setColBackColor (colIndexOrColId: number | string, hexadecimalBackColor: string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.backColor = hexadecimalBackColor;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.backColor = hexadecimalBackColor;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColBackColor (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.backColor;
        },
        setColFontColor (colIndexOrColId: number | string, hexadecimalFontColor: string) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.fontColor = hexadecimalFontColor;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.fontColor = hexadecimalFontColor;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        getColFontColor (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.fontColor;
        },
        setColFontBold (colIndexOrColId: number | string, isFontBold: boolean) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.fontBold = isFontBold;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.fontBold = isFontBold;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        isColFontBold (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.fontBold!;
        },
        setColFontItalic (colIndexOrColId: number | string, isFontItalic: boolean) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.fontItalic = isFontItalic;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.fontItalic = isFontItalic;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        isColFontItalic (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.fontItalic!;
        },
        setColFontThruline (colIndexOrColId: number | string, isFontThruline: boolean) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.fontThruline = isFontThruline;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.fontThruline = isFontThruline;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        isColFontThruline (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.fontThruline!;
        },
        setColFontUnderline (colIndexOrColId: number | string, isFontUnderline: boolean) {
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndex)!;
            colInfo.fontUnderline = isFontUnderline;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                const cell = handler._getCell(grid.data.id, row, colIndex)!;
                cell.fontUnderline = isFontUnderline;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        isColFontUnderline (colIndexOrColId: number | string) {
            const colInfo: ColInfo = handler.__getColInfo(grid.data.id, colIndexOrColId, true)!;
            return colInfo.fontUnderline!;
        },
        addRow (rowOrValuesOrDatas?: number | Record<string, any> | Record<string, any>[], valuesOrDatas?: Record<string, any> | Record<string, any>[]) {
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
            if (row === null || row === undefined || row > grid.methods.getRowCount()) row = grid.methods.getRowCount();
            if (!addKeyValueOrDatas) addKeyValueOrDatas = [[{}]];
            else addKeyValueOrDatas = [addKeyValueOrDatas];
            if (addKeyValueOrDatas === null || !Array.isArray(addKeyValueOrDatas)) throw new Error('Please insert valid datas.');
            const isKeyValue = checkIsValueOrData(addKeyValueOrDatas);
            const datas = grid.methods.getDatas();
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
            grid.methods.load(datas);
            for(let r = row; r < row + cnt; r++) {
                grid.methods.setRowStatus(r + 1, 'C');
            }
            handler.focusCell(handler._getCell(grid.data.id, row + 1, 'v-g-status')!);
            return true;
        },
        removeRow(row: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const result = grid.methods.getRowValues(row);
            result['v-g-status'] = 'D';
            const datas = grid.methods.getDatas();
            datas.splice(row - 1, 1);
            grid.methods.load(datas);
            return result;
        },
        setRowStatus(row: number, status: string) {
            handler.__checkRowIndex(grid.data.id, row);
            if (!isIncludeEnum(statusUnit, status)) throw new Error('Please insert the correct status code. (C, U, D)');
            const statusCell = handler._getCell(grid.data.id, row, 'v-g-status')!;
            statusCell.value = status;
            handler.reConnectedCallbackElement(statusCell);
            return true;
        },
        getRowStatus(row: number) {
            handler.__checkRowIndex(grid.data.id, row);
            return handler._getCell(grid.data.id, row, 'v-g-status')!.value;
        },
        setRowDatas(row: number, cellDatas: CellData[]) {
            for(const cellData of cellDatas) {
                handler.__setCellData(grid.data.id, row, cellData.colId, cellData, false);
            }
            return true;
        },
        getRowDatas(row: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const rowDatas = [];
            for(const colInfo of grid.data.colInfos) {
                rowDatas.push(grid.methods.getCellData(row, colInfo.colIndex!));
            }
            return rowDatas;
        },
        setRowValues(row: number, values: Record<string, any>, doRecord = false) {
            row = 2;
            handler.__checkRowIndex(grid.data.id, row);
            if (!values || values.constructor !== Object) throw new Error('Please insert a valid value.');
            let value = null;
            let cell = null;
    
            if (doRecord) {
                const records = [];
                let record
                for(const colInfo of grid.data.colInfos) {
                    if (colInfo.colId === 'v-g-rownum' || colInfo.colId === 'v-g-status') continue;
                    for(const key in values) {
                        if (colInfo.colId === key) value = values[key];
                    }
                    cell = handler._getCell(grid.data.id, row, colInfo.colIndex!)!;
                    record = handler.getRecordsWithModifyValue(cell, value, true);
                    if (Array.isArray(record) && record.length > 0) records.push(record[0]);
                }
                handler.recordGridModify(grid.data.id, records);
            }
            else {
                for(const colInfo of grid.data.colInfos) {
                    if (colInfo.colId === 'v-g-rownum' || colInfo.colId === 'v-g-status') continue;
                    for(const key in values) {
                        if (colInfo.colId === key) value = values[key];
                    }
                    cell = handler._getCell(grid.data.id, row, colInfo.colIndex!)!;
                    cell.value = handler.getValidValue(cell, value);
                    handler.reConnectedCallbackElement(cell);
                    handler.reloadGridWithModifyCell(grid.data.id, cell.colIndex!);
                }
            }
            return true;
        },
        getRowValues(row: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const rowValues = {};
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                (rowValues as any)[cell.colId] = deepCopy(cell.value);
            }
            return rowValues;
        },
        getRowTexts(row: number): Record<string, string> {
            handler.__checkRowIndex(grid.data.id, row);
            const rowTexts = {};
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                (rowTexts as any)[cell.colId] = handler.getTextFromCell(cell);
            }
            return rowTexts;
        },
        setRowVisible(row: number, isVisible: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
            for(let c = 1; c <= grid.methods.getColCount(); c++) {
                const cell = handler._getCell(grid.data.id, row, c)!;
                cell.rowVisible = isVisible;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        isRowVisible(row: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const cell = handler._getCell(grid.data.id, row, 1)!;
            return cell.rowVisible!;
        },
        setRowDataType(row: number, dataType: string) {
            handler.__checkRowIndex(grid.data.id, row);
            if (!Object.keys(vg.dataType).includes(dataType)) throw new Error('Please insert a valid dataType.');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.dataType = dataType;
                handler.reConnectedCallbackElement(cell);
            }
            handler.reloadGridForMerge(grid.data.id);
            
            grid.methods.reloadFilterValue();
            grid.methods.reloadFooterValue();
            return true;
        },
        setRowLocked(row: number, isRowLocked: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            if (typeof isRowLocked !== 'boolean') throw new Error('Please insert a boolean type.');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.locked = isRowLocked;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowLockedColor(row: number, isRowLockedColor: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            if (typeof isRowLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.lockedColor = isRowLockedColor;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowAlign(row: number, align: Align.left | Align.center | Align.right) {
            handler.__checkRowIndex(grid.data.id, row);
            if (!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.align = align;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowVerticalAlign(row: number, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) {
            handler.__checkRowIndex(grid.data.id, row);
            if (!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.verticalAlign = verticalAlign;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowBackColor(row: number, hexadecimalBackColor: string) {
            handler.__checkRowIndex(grid.data.id, row);
            if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.backColor = hexadecimalBackColor;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowFontColor(row: number, hexadecimalFontColor: string) {
            handler.__checkRowIndex(grid.data.id, row);
            if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.fontColor = hexadecimalFontColor;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowFontBold(row: number, isRowFontBold: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            if (typeof isRowFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.fontBold = isRowFontBold;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowFontItalic(row: number, isRowFontItalic: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            if (typeof isRowFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.fontItalic = isRowFontItalic;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowFontThruline(row: number, isRowFontThruline: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            if (typeof isRowFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.fontThruline = isRowFontThruline;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        setRowFontUnderline(row: number, isRowFontUnderline: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            if (typeof isRowFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
            for(const cell of grid.elements.gridBody._gridBodyCells[row - 1]) {
                if (cell.colId === 'v-g-rownum' || cell.colId === 'v-g-status') continue;
                cell.fontUnderline = isRowFontUnderline;
                handler.__gridCellReConnectedWithControlSpan(cell);
            }
            return true;
        },
        searchRowsWithMatched(matches: Record<string, any>) {
            if (matches.constructor !== Object) throw new Error('Please insert a valid matches. (Object)');
            const matchedRows: number[] = [];
            let isMatched;
            grid.elements.gridBody._gridBodyCells.forEach((row, rowIndex: number) => {
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
        },
        searchRowDatasWithMatched(matches: Record<string, any>) {
            const matchedRows = grid.methods.searchRowsWithMatched(matches);
            const matchedRowDatas: Record<string, any>[][] = [];
            matchedRows.forEach((row: number) => {
                matchedRowDatas.push(grid.methods.getRowDatas(row));
            })
            return matchedRowDatas;
        },
        searchRowValuesWithMatched(matches: Record<string, any>) {
            const matchedRows = grid.methods.searchRowsWithMatched(matches);
            const matchedRowValues: Record<string, any>[] = [];
            matchedRows.forEach((row: number) => {
                matchedRowValues.push(grid.methods.getRowValues(row));
            })
            return matchedRowValues;
        },
        searchRowsWithFunction(func: (rowDatas: CellData[]) => boolean) {
            if (typeof func !== 'function') throw new Error('Please insert a valid function.');
            const matchedRows = [];
            let isMatched;
            for(let row = 1; row <= grid.methods.getRowCount(); row++) {
                isMatched = func(grid.methods.getRowDatas(row));
                if(isMatched) matchedRows.push(row);
            }
            return matchedRows;
        },
        searchRowDatasWithFunction(func: (rowDatas: CellData[]) => boolean) {
            const matchedRows = grid.methods.searchRowsWithFunction(func);
            const matchedRowDatas: Record<string, any>[][] = [];
            matchedRows.forEach((row: number) => {
                matchedRowDatas.push(grid.methods.getRowDatas(row));
            })
            return matchedRowDatas;
        },
        searchRowValuesWithFunction(func: (rowDatas: CellData[]) => boolean) {
            const matchedRows = grid.methods.searchRowsWithFunction(func);
            const matchedRowValues: Record<string, any>[] = [];
            matchedRows.forEach((row: number) => {
                matchedRowValues.push(grid.methods.getRowValues(row));
            })
            return matchedRowValues;
        },
        setCellData(row: number, colIndexOrColId: number | string, cellData: CellData) {
            return handler.__setCellData(grid.data.id, row, colIndexOrColId, cellData);
        },
        getCellData(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            const data = handler.__getData(cell);
            return data;
        },
        setCellValue(row: number, colIndexOrColId: number | string, value: any, doRecord = false) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
    
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            if (doRecord) {
                handler.recordGridModify(grid.data.id, handler.getRecordsWithModifyValue(cell, value, true));
            }
            else {
                cell.value = handler.getValidValue(cell, value);
                handler.reConnectedCallbackElement(cell);
                handler.reloadGridWithModifyCell(grid.data.id, cell.colIndex!);
            }
            return true;
        },
        getCellValue(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
    
            return deepCopy(handler._getCell(grid.data.id, row, colIndex)!.value);
        },
        getCellText(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
    
            return handler.getTextFromCell(handler._getCell(grid.data.id, row, colIndex)!);
        },
        setCellRequired(row: number, colIndexOrColId: number | string, isRequired: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');
    
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.required = isRequired;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellRequired(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.required!;
        },
        setCellDataType(row: number, colIndexOrColId: number | string, dataType: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            if (!Object.keys(vg.dataType).includes(dataType)) throw new Error('Please insert a valid dataType.');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.dataType = dataType;
            handler.reConnectedCallbackElement(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellDataType(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.dataType!;
        },
        setCellLocked(row: number, colIndexOrColId: number | string, isLocked: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
    
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.locked = isLocked;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        isCellLocked(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.locked!;
        },
        setCellLockedColor(row: number, colIndexOrColId: number | string, isLockedColor: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.lockedColor = isLockedColor;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        isCellLockedColor(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.lockedColor!;
        },
        setCellFormat(row: number, colIndexOrColId: number | string, format: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            if (typeof format !== 'string') throw new Error('Please insert a string type.');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.format = format;
            if(cell.dataType === 'mask') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellFormat(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.format;
        },
        setCellCodes(row: number, colIndexOrColId: number | string, codes: string[]) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.codes = codes;
            if(cell.dataType === 'code') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellCodes(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.codes;
        },
        setCellDefaultCode(row: number, colIndexOrColId: number | string, defaultCode: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.defaultCode = defaultCode;
            if(cell.dataType === 'code') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellDefaultCode(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.defaultCode;
        },
        setCellMaxLength(row: number, colIndexOrColId: number | string, maxLength: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            maxLength = validatePositiveIntegerAndZero(maxLength);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.maxLength = maxLength;
            if(cell.dataType === 'text') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellMaxLength(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.maxLength;
        },
        setCellMaxByte(row: number, colIndexOrColId: number | string, maxByte: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            maxByte = validatePositiveIntegerAndZero(maxByte);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.maxByte = maxByte;
            if(cell.dataType === 'text') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellMaxByte(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.maxByte;
        },
        setCellMaxNumber(row: number, colIndexOrColId: number | string, maxNumber: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            maxNumber = validateNumber(maxNumber);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.maxNumber = maxNumber;
            if(cell.dataType === 'number') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellMaxNumber(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.maxNumber;
        },
        setCellMinNumber(row: number, colIndexOrColId: number | string, minNumber: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            minNumber = validateNumber(minNumber);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.minNumber = minNumber;
            if(cell.dataType === 'number') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellMinNumber(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.minNumber;
        },
        setCellRoundNumber(row: number, colIndexOrColId: number | string, roundNumber: number) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            roundNumber = validateIntegerAndZero(roundNumber);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.roundNumber = roundNumber;
            if(cell.dataType === 'number') {
                cell.value = handler.getValidValue(cell, cell.value);
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            handler.reloadGridWithModifyCell(grid.data.id, colIndex);
            return true;
        },
        getCellRoundNumber(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.roundNumber;
        },
        setCellAlign(row: number, colIndexOrColId: number | string, align: Align.left | Align.center | Align.right) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if(!isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.align = align;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellAlign(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.align!;
        },
        setCellVerticalAlign(row: number, colIndexOrColId: number | string, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if(!isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.verticalAlign = verticalAlign;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellVerticalAlign(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.verticalAlign;
        },
        setCellOverflowWrap(row: number, colIndexOrColId: number | string, overflowWrap: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.overflowWrap = overflowWrap;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellOverflowWrap(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.overflowWrap;
        },
        setCellWordBreak(row: number, colIndexOrColId: number | string, wordBreak: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.wordBreak = wordBreak;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellWordBreak(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.wordBreak;
        },
        setCellWhiteSpace(row: number, colIndexOrColId: number | string, whiteSpace: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.whiteSpace = whiteSpace;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellWhiteSpace(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.whiteSpace;
        },
        setCellVisible(row: number, colIndexOrColId: number | string, isVisible: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
    
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            if (isVisible) {
                if (cell.firstChild) (cell.firstChild as any).style.removeProperty('display');
            }
            else {
                if (cell.firstChild) (cell.firstChild as any).style.display = 'none'
            }
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        isCellVisible(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            if(cell.firstChild) (cell.firstChild as any).style.display !== 'none';
            return false;
        },
        setCellBackColor(row: number, colIndexOrColId: number | string, hexadecimalBackColor: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.backColor = hexadecimalBackColor;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellBackColor(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.backColor;
        },
        setCellFontColor(row: number, colIndexOrColId: number | string, hexadecimalFontColor: string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.fontColor = hexadecimalFontColor;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        getCellFontColor(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.fontColor;
        },
        setCellFontBold(row: number, colIndexOrColId: number | string, isFontBold: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.fontBold = isFontBold;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        isCellFontBold(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.fontBold!;
        },
        setCellFontItalic(row: number, colIndexOrColId: number | string, isFontItalic: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.fontItalic = isFontItalic;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        isCellFontItalic(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.fontItalic!;
        },
        setCellFontThruline(row: number, colIndexOrColId: number | string, isFontThruline: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.fontThruline = isFontThruline;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        isCellFontThruline(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.fontThruline!;
        },
        setCellFontUnderline(row: number, colIndexOrColId: number | string, isFontUnderline: boolean) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
            const cell = handler._getCell(grid.data.id, row, colIndex)!;
            cell.fontUnderline = isFontUnderline;
            handler.__gridCellReConnectedWithControlSpan(cell);
            return true;
        },
        isCellFontUnderline(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            return handler._getCell(grid.data.id, row, colIndex)!.fontUnderline!;
        },
        setTargetCell(row:number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
    
            const targetCell = handler._getCell(grid.data.id, row, colIndex)!;
            if (!handler.isCellVisible(targetCell)) return false;
    
            vg._status.activeGrid = grid;
            return handler.selectCell(targetCell);
        },
        getTargetRow() {
            return grid.data.variables.targetCell ? grid.data.variables.targetCell.rowIndex : null;
        },
        getTargetCol() {
            return grid.data.variables.targetCell ? grid.data.variables.targetCell.colId : null;
        },
        setActiveCells(startRow: number, startColIndexOrColId: number | string, endRow: number, endColIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, startRow);
            handler.__checkRowIndex(grid.data.id, endRow);
            const startColIndex = handler.__getColIndex(grid.data.id, startColIndexOrColId, true)!;
            const endColIndex = handler.__getColIndex(grid.data.id, endColIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, startColIndex);
            handler.__checkColIndex(grid.data.id, endColIndex);
    
            const startCell = handler._getCell(grid.data.id, startRow, startColIndex)!;
            const endCell = handler._getCell(grid.data.id, endRow, endColIndex)!;
            
            if (!handler.isCellVisible(startCell)) return false;
            if (!handler.isCellVisible(endCell)) return false;
    
            vg._status.activeGrid = grid;
            grid.data.variables.targetCell = startCell;
            handler.unselectCells(grid.data.id);
            return handler.selectCells(startCell, endCell, startCell);
        },
        getActiveRows() {
            return grid.data.variables.activeRows;
        },
        getActiveCols() {
            const colIds: string[] = [];
            grid.data.variables.activeCols.forEach((colIndex: number) => {
                colIds.push(handler.__getColInfo(grid.data.id, colIndex)!.colId);
            });
            return colIds;
        },
        getActiveRange(): {
            startRow: number | null;
            startColId : string | null;
            endRow : number | null;
            endColId : string | null;
        } {
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
            const activeCells = grid.data.variables.activeCells;
            if (activeCells.length > 0) {
                range.startRow = activeCells[0].rowIndex; 
                range.startColId = activeCells[0].colId; 
                range.endRow = activeCells[activeCells.length - 1].rowIndex; 
                range.endColId = activeCells[activeCells.length - 1].colId; 
            }
            return range;
        },
        editCell(row: number, colIndexOrColId: number | string) {
            handler.__checkRowIndex(grid.data.id, row);
            const colIndex = handler.__getColIndex(grid.data.id, colIndexOrColId, true)!;
            handler.__checkColIndex(grid.data.id, colIndex);
            handler.__checkColRownumOrStatus(colIndex);
            const cell = handler._getCell(grid.data.id, row, colIndexOrColId)!;
            if (['select','checkbox','button','link'].indexOf(cell.dataType!) >= 0) return false;
            if (!grid.methods.setTargetCell(row, colIndexOrColId)) return false;
            handler.createGridEditor(cell);
            return true;
        },
        redo() {
            return handler.redoundo(grid.data.id);
        },
        undo() {
            return handler.redoundo(grid.data.id, false);
        },
    }
}
