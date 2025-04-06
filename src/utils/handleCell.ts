import { Cell } from "../types/cell";
import { nvl } from "./utils";

export const isCellVisible = (cell: Cell) => {
    if (!cell) return;
    return !(cell._colInfo.colVisible === false || cell._colInfo.rowVisible === false || cell._colInfo.filter === true);
};
export const getFirstCellValidNumber = (grid: any, footerCell: Cell) => {
    let returnNumber;
    let tempCell;
    for(let r = 1; r < grid.getRowCount(); r++ ) {
        tempCell = grid._getCell(r, footerCell.col);
        if (!(this as any).isCellVisible(tempCell)) continue;
        returnNumber = (this as any).getOnlyNumberWithNaNToNull(tempCell!._value);
        if (returnNumber) return returnNumber;
    }
    return null;
};
export const removeGridEditor = () => {
    if (!(this as any).activeGridEditor) return false;
    const cell = (this as any).activeGridEditor.targetCell;
    cell.style.padding = '';
    cell.style.fontSize = '';
    (this as any).activeGridEditor.parentNode.removeChild((this as any).activeGridEditor);
    (this as any).activeGridEditor = null; 
    return true;
};
export const addBagicEventListenerToGridEditor = (gridEditor: HTMLElement) => {
    gridEditor.addEventListener('keydown', function (e) {
        const _grid = utils.activeGrid as any;
        const gId = _grid.gId;
        const cell = _grid.variables._targetCell;
        let newTargetCell: Cell | null;
        switch (e.key) {
            case 'Enter':
                if (!e.shiftKey) {
                    utils.modifyCell();
                    newTargetCell = utils.getMoveRowCell(cell!, 1);
                    utils.selectCell(newTargetCell!);
                    e.stopPropagation();
                    e.preventDefault();
                }
                break;
            case 'Escape':
                utils.editNewValue = utils.editOldValue;
                utils.removeGridEditor();
                e.stopPropagation();
                e.preventDefault();
                break;
            case 'Tab':
                utils.modifyCell();
                newTargetCell = utils.getTabCell(cell!, e.shiftKey);
                utils.selectCell(newTargetCell!);
                e.stopPropagation();
                e.preventDefault();
                break;
            case 'F2':
                utils.modifyCell();
                e.stopPropagation();
                e.preventDefault();
                break;
            default:
                break;
        }
    });
};
export const setBagicAttributesToGridEditor = (gridEditor: any, cell: Cell) => {
    gridEditor.eId = cell._gridId + '_Editor';
    gridEditor.gId = cell._gridId;
    gridEditor.targetCell = cell;
    gridEditor.style.width = cell.offsetWidth + 'px'; 
    gridEditor.style.height = cell.scrollHeight + gridEditor.offsetHeight - gridEditor.clientHeight + 'px';
    gridEditor.classList.add(gridEditor.gId + '_editor');
};
export const createGridEditorTextarea = (cell: Cell) => {
    const gridEditor = document.createElement('textarea') as unknown as any;
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.placeholder;
    gridEditor.classList.add(gridEditor.gId + '_editor_textarea');
    const value = (this as any)[cell._gridId].info.gNullValue === cell._value? null : cell._value;
    (this as any).editOldValue = value;
    gridEditor.value = (this as any).editOldValue; 
    
    gridEditor.addEventListener('input', function (e: any) {
        e.target.style.height = e.target.scrollHeight + gridEditor.offsetHeight - gridEditor.clientHeight + 'px';

    }, false);

    gridEditor.addEventListener('keyup', function (e: any) {
        if (e.target.value && e.target.parentNode && e.target.parentNode.cMaxLength) {
            e.target.value = e.target.value.substring(0, e.target.parentNode.cMaxLength);
        }
        
        if (e.target.value && e.target.parentNode && e.target.parentNode.cMaxByte) {
            e.target.value = utils.getCutByteLength(e.target.value, e.target.parentNode.cMaxByte);
        }
    }, false);

    (this as any).addBagicEventListenerToGridEditor(gridEditor);

    return gridEditor;
};
export const createGridEditorNumber = (cell: Cell) => {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_number');
    gridEditor.setAttribute('type','number');
    const value = (this as any)[cell._gridId].info.gNullValue === cell._value? null : cell._value;
    (this as any).editOldValue = value;
    gridEditor.value = (this as any).editOldValue; 

    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
};
export const createGridEditorDate = (cell: Cell) => {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_date');
    gridEditor.setAttribute('type','date');
    (this as any).editOldValue = (this as any).getDateWithInputDateFormat(cell._value);
    gridEditor.value = (this as any).editOldValue; 

    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
};
export const createGridEditorMonth = (cell: Cell) => {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_month');
    gridEditor.setAttribute('type','month');
    (this as any).editOldValue = (this as any).getDateWithInputMonthFormat(cell._value);
    gridEditor.value = (this as any).editOldValue; 

    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
};
export const createGridEditorMask = (cell: Cell) => {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_mask');
    gridEditor.setAttribute('type','text');
    const value = (this as any)[cell._gridId].info.gNullValue === cell._value? null : cell._value;
    (this as any).editOldValue = value;
    gridEditor.value = (this as any).editOldValue; 
    gridEditor.addEventListener('keyup', function (e: any) {
        e.target.value = utils.getMaskValue(e.target.targetCell.cFormat, e.target.value);
    });
    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
};
export const createGridEditorCode = (cell: Cell) => {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_code');
    gridEditor.setAttribute('type','text');
    const value = cell._value;
    (this as any).editOldValue = value;
    gridEditor.value = (this as any).editOldValue; 
    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
};
export const createGridEditor = (cell: Cell, isEnterKey = false) => {
    if (cell.cLocked || cell.cUntarget) return;
    if (['select','checkbox','button','link'].indexOf(cell.cDataType!) >= 0) return;
    
    (this as any).removeGridEditor();
    let gridEditor;
    switch (cell.cDataType) {
        case 'text':
            gridEditor = (this as any).createGridEditorTextarea(cell);
            break;
        case 'number':
            gridEditor = (this as any).createGridEditorNumber(cell);
            break;
        case 'date':
            gridEditor = (this as any).createGridEditorDate(cell);
            break;
        case 'month':
            gridEditor = (this as any).createGridEditorMonth(cell);
            break;
        case 'mask':
            gridEditor = (this as any).createGridEditorMask(cell);
            break;
        case 'code':
            gridEditor = (this as any).createGridEditorCode(cell);
            break;
        default:
            Object.keys(vg.dataType).forEach((key) => {
                if(cell.cDataType === key) {
                    if(vg.dataType[key].getEditor) {
                        if(typeof vg.dataType[key].getEditor !== 'function') throw new Error('getEditor must be a function.');
                        const call_endEdit = () => {
                            utils.editNewValue = utils.editOldValue;
                            utils.removeGridEditor();
                        }
                        const call_modify = () => {
                            (this as any).modifyCell()
                        }
                        gridEditor = vg.dataType[key].getEditor(cell, (this as any)[cell._gridId].__getData(cell), () => {call_modify()}, () => {call_endEdit()});
                        if(gridEditor) {
                            if(!(gridEditor instanceof HTMLElement) || gridEditor.nodeType !== 1)  throw new Error('getEditor must return an html element.');
                            (gridEditor as any).eId = cell._gridId + '_Editor';
                            (gridEditor as any).gId = cell._gridId;
                            (gridEditor as any).targetCell = cell;
                            gridEditor.classList.add((gridEditor as any).gId + '_editor_' + key);
                            gridEditor.classList.add((gridEditor as any).gId + '_editor');
                            (this as any).editOldValue = cell._value;
                        }
                    }
                }
            });
            break;
    }
    if (!gridEditor) return;
    cell.style.padding = '0';
    cell.style.fontSize = '0px'; 
    cell.appendChild(gridEditor);
    
    gridEditor.focus();
    if (isEnterKey) gridEditor.select();
    (this as any).activeGridEditor = gridEditor;
};
export const getValidValue = (cell: Cell, value: any) => {
    const nullValue = (this as any).nvl((this as any)[cell._gridId].info.gNullValue, null);
    if (!cell) return null;
    if (cell.cDataType !== 'code') {
        if (value === undefined || value === null || value === '') return nullValue;
        if (value === nullValue) return nullValue;
    }

    switch (cell.cDataType) {
        case 'text':
            if (cell.cMaxLength) {
                value = value.substring(0, cell.cMaxLength);
            }
            if (cell.cMaxByte) {
                value = (this as any).getCutByteLength(value, cell.cMaxByte);
            }
            return value;
        case 'mask':
            return (this as any).nvl((this as any).getMaskValue(cell._colInfo.format, value), nullValue);
        case 'date':
            return (this as any).nvl((this as any).getDateWithValueDateFormat(value), nullValue);
        case 'month':
            return (this as any).nvl((this as any).getDateWithValueMonthFormat(value), nullValue);
        case 'number':
            value = (this as any).getOnlyNumberWithNaNToNull(value);
            if(value === null) return nullValue

            const max = cell.cMaxNumber;
            const min = cell.cMinNumber;
            const dp = cell.cRoundNumber;

            if (max !== null && max !== undefined && typeof max === 'number' && value > max) {
                value = max;
            }
            if (min !== null && min !== undefined && typeof min === 'number' && value < min) {
                value = min;
            }
            let number = parseFloat(value);
            if (dp === null || dp === undefined || typeof dp !== 'number') {
                return Number(value);
            } else if (dp >= 0) {
                let formattedValue = number.toFixed(dp);
                formattedValue = formattedValue.replace(/(\.[0-9]*?)0+$/, '$1'); 
                formattedValue = formattedValue.replace(/\.$/, ''); 
                return Number(formattedValue);
            } else {
                const factor = Math.pow(10, -dp);
                return Number((Math.round(number / factor) * factor).toFixed(-dp));
            }
        case 'select':
            return value;
        case 'checkbox':
            if (typeof value === 'boolean') return value;
            const checkedValue = (this as any)[cell._gridId].info.gCheckedValue;
            return checkedValue === value;
        case 'button':
            return value;
        case 'link':
            return value;
        case 'code':
            return (this as any).getCodeValue(cell.cCodes, cell.cDefaultCode, value);
        default:
            if(vg.dataType) {
                Object.keys(vg.dataType).forEach((key) => {
                    if(cell.cDataType === key) {
                        if(vg.dataType[key].getValue) {
                            if(typeof vg.dataType[key].getValue !== 'function') throw new Error('getValue must be a function.');
                            value = vg.dataType[key].getValue(value);
                        }
                    }
                });
            }
            return value;
    }
};
export const getCellText =  (cell: Cell) => {
    if (!cell) return '';
    let cellText: any = '';
    const grid = cell._grid;
    let value = nvl(cell._value, grid._gridInfo.nullValue);
    switch (cell._colInfo.dataType) {
        case 'number':
            if(value === grid._gridInfo.nullValue) cellText = value;
            else cellText = nvl((this as any).getFormatNumberFromCell(cell), grid._gridInfo.nullValue);
            break;
        case 'date':
            if(value === grid._gridInfo.nullValue) cellText = value;
            else cellText = nvl((this as any).getDateWithGridDateFormat(cell), grid._gridInfo.nullValue);
            break;
        case 'month':
            if(value === grid._gridInfo.nullValue) cellText = value;
            else cellText = nvl((this as any).getDateWithGridMonthFormat(cell), grid._gridInfo.nullValue);
            break;
        case 'select':
            if (Array.isArray(cell._value) && cell._value.length > 0) {
                cellText = cell._value[0].text;
                for(const option of cell._value) {
                    if (option.selected) cellText = option.text;
                }
                if(cellText === null || cellText === undefined) cellText = grid._gridInfo.nullValue;
            }
            break;
        case 'link':
            cellText = cell._value && cell._value.text ? cell._value.text : value;
            break;
        default:
            cellText = value;
            if(grid._vg.dataType) {
                Object.keys(grid._vg.dataType).forEach((key) => {
                    if(cell._colInfo.dataType === key) {
                        if(grid._vg.dataType[key].getText) {
                            if(typeof grid._vg.dataType[key].getText !== 'function') throw new Error('getText must be a function.');
                            cellText = grid._vg.dataType[key].getText(cellText);
                        }
                    }
                });
            }
            else {
                cellText = String(value);
            }
            break;
    }
    return cellText;
};
export const getFormatNumber = (format: string, value: any) => {
    const regex = /^(.*?)([#0,.]+)(.*?)$/;
    if(!format || value === null || value === undefined) return Number(value);
    const matches = format.match(regex);
    if (!matches) return Number(value);

    const getToNumber = (val: any) => {
        if (isNaN(val) || !isFinite(val)) {
            return 0;
        }
        return Number(val);
    }
    const getToFloat = (val: any) => {
        if (isNaN(val) || !isFinite(val)) {
            return 0;
        }
        return parseFloat(val);
    }

    const prefix = matches[1];
    const numberFormat = matches[2];
    const suffix = matches[3];
    const integerFormat = numberFormat.split('.')[0];
    const decimalFormat = numberFormat.split('.').length > 1 ? numberFormat.split('.')[1] : '';

    if(suffix === '%' || suffix === ' %') value = value * 100;

    let numStr = String(value);
    const isNegative = numStr[0] === '-';
    numStr = isNegative ? numStr.substring(1) : numStr;
    let integer = numStr.split('.')[0];
    let decimal = numStr.split('.').length > 1 ? numStr.split('.')[1] : '';
    
    let result;

    decimal = getToFloat('0.' + decimal)
            .toLocaleString('en',{
                minimumFractionDigits: decimalFormat.lastIndexOf('0') + 1,
                maximumFractionDigits: decimalFormat.length
                });
    if(decimal === '0') decimal = '';
    else decimal = decimal.substring(1);

    switch (integerFormat) {
        case '#,###':
            if(getToNumber(integer) === 0) {
                result = decimal;
            }
            else {
                integer = getToFloat(integer).toLocaleString('en');
                result = integer + decimal;
            }
            break;
        case '#,##0':
            integer = getToFloat(integer).toLocaleString('en');
            result = integer + decimal;
            break;
        case '#':
            if(getToNumber(integer) === 0) {
                result = decimal;
            }
            else {
                result = integer + decimal;
            }
            break;
        case '0':
            result = integer + decimal;
            break;
        default:
            return value;
    }
    result = isNegative ? '-' + result : result;
    return prefix + result + suffix;
};
export const getFormatNumberFromCell = (cell: Cell) => {
    if(!cell._colInfo.format) return cell._value;
    if(cell._value === null || cell._value === undefined) return null;
    return (this as any).getFormatNumber(cell._colInfo.format, cell._value);
};
export const getDateWithValueDateFormat = (dateStr: string) => {
    if(!dateStr || typeof dateStr !== 'string') return null;
    
    const pattern = /^(\d{4})[-/.]? ?(\d{2})[-/.]? ?(\d{2})$/;
    const match = pattern.exec(dateStr.replace(/\s+/g, ''));
    if (!match) {
        return null;
    }
    
    const year = match[1];
    const month = match[2];
    const day = match[3];
    if (!(this as any).isValidDate(year, month, day)) {
        return null;
    }
    return `${year}${month}${day}`;
};
export const getDateWithValueMonthFormat = (dateStr: string) => {
    if(!dateStr || typeof dateStr !== 'string') return null;
    
    const patternYMD = /^(\d{4})[-/.]? ?(\d{2})[-/.]? ?(\d{2})?$/;  
    const patternYM = /^(\d{4})[-/.]? ?(\d{2})$/;

    
    dateStr = dateStr.replace(/\s+/g, '');

    const matchYMD = patternYMD.exec(dateStr);
    const matchYM = patternYM.exec(dateStr);

    let year, month;
    if (matchYMD) {
        year = matchYMD[1];
        month = matchYMD[2];
    }
    else if (matchYM) {
        year = matchYM[1];
        month = matchYM[2];
    }
    else {
        return null;
    }
    if (!(this as any).isValidDate(year, month, '01')) {
        return null;
    }
    return `${year}${month}`;
};
export const getDateWithInputDateFormat = (dateStr: string) => {
    if(!dateStr || typeof dateStr !== 'string') return null;
    
    const pattern = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})$/;
    const match = pattern.exec(dateStr);
    if (!match) {
        return null;
    }
    
    const year = match[1];
    const month = match[2];
    const day = match[3];
    if (!(this as any).isValidDate(year, month, day)) {
        return null;
    }
    return `${year}-${month}-${day}`;
};
export const getDateWithInputMonthFormat = (dateStr: string) => {
    if(!dateStr || typeof dateStr !== 'string') return null;
    
    const pattern = /^(\d{4})[-/.]?(\d{2})$/;
    const match = pattern.exec(dateStr);
    if (!match) {
        return null;
    }
    
    const year = match[1];
    const month = match[2];
    if (!(this as any).isValidDate(year, month, '01')) {
        return null;
    }
    return `${year}-${month}`;
};
export const getDateWithGridDateFormat = (cell: Cell) => {
    const pattern = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})$/;
    const match = pattern.exec(cell._value);
    
    if (!match) {
        return null;
    }
    const year = match[1];
    const month = match[2];
    const day = match[3];
    if (!(this as any).isValidDate(year, month, day)) {
        return null;
    }
    const dateFormat = (this as any)[cell._gridId].info.gDateFormat;
    
    switch (dateFormat) {
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        case 'yyyy/mm/dd':
            return `${year}/${month}/${day}`;
        case 'yyyy. mm. dd':
            return `${year}. ${month}. ${day}`;
        case 'yyyymmdd':
            return `${year}${month}${day}`;

        case 'mm-dd-yyyy':
            return `${month}-${day}-${year}`;
        case 'mm/dd/yyyy':
            return `${month}/${day}/${year}`;
        case 'mm. dd. yyyy':
            return `${month}. ${day}. ${year}`;
        case 'mmddyyyy':
            return `${month}${day}${year}`;

        case 'dd-mm-yyyy':
            return `${day}-${month}-${year}`;
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'dd. mm. yyyy':
            return `${day}. ${month}. ${year}`;
        case 'ddmmyyyy':
            return `${day}${month}${year}`;
        default:
            return `${year}-${month}-${day}`;
    }
};
export const getDateWithGridMonthFormat = (cell: Cell) => {
    const pattern = /^(\d{4})[-/.]?(\d{2})$/;
    const match = pattern.exec(cell._value);
    
    if (!match) {
        return null;
    }
    const year = match[1];
    const month = match[2];
    if (!(this as any).isValidDate(year, month, '01')) {
        return null;
    }
    const monthFormat = (this as any)[cell._gridId].info.gMonthFormat;
    
    switch (monthFormat) {
        case 'yyyy-mm':
            return `${year}-${month}`;
        case 'yyyy/mm':
            return `${year}/${month}`;
        case 'yyyy. mm':
            return `${year}. ${month}`;
        case 'yyyymm':
            return `${year}${month}`;

        case 'mm-yyyy':
            return `${month}-${year}`;
        case 'mm/yyyy':
            return `${month}/${year}`;
        case 'mm. yyyy':
            return `${month}. ${year}`;
        case 'mmyyyy':
            return `${month}${year}`;
        default:
            return `${year}-${month}`;
    }
};
export const getCheckboxCellTrueOrFalse = (cell: Cell) => {
    const value = cell._value;
    const checkedValue = (this as any)[cell._gridId].info.gCheckedValue;
    const uncheckedValue = (this as any)[cell._gridId].info.gUncheckedValue;
    if (typeof value === 'boolean') {
        if (value) {
            cell._value = checkedValue;
        }
        else {
            cell._value = uncheckedValue;
        }
        return value;
    }
    if (value !== checkedValue) {
        cell._value = uncheckedValue;
        return false;
    }
    return true;
};
export const getCodeValue = (code: string[], defaultCode: string | null, value: string) => {
    if (!code || !Array.isArray(code)) return defaultCode;
    if (code.indexOf(value) >= 0) return value;
    return defaultCode;
};
export const getMaskValue = (format: string, value: string) => {
    if(typeof format !== 'string') return null;
    if(typeof value !== 'string') return null;
    const formatArr = format.split('');
    const valueArr = value.split('');
    let lastValue = '';
    let isValid;
    formatArr.every((formatPiece, idx) => {
        isValid = false;
        switch (formatPiece) {
            case 'A':
                if (/^[A-Z]$/.test(valueArr[idx])) {
                    lastValue += valueArr[idx];
                    isValid = true;
                }
                else if (/^[a-z]$/.test(valueArr[idx])) {
                    lastValue += utils.toUpperCase(valueArr[idx]);
                    isValid = true;
                }
                break;
            case 'a':
                if (/^[a-z]$/.test(valueArr[idx])) {
                    lastValue += valueArr[idx];
                    isValid = true;
                }
                else if (/^[A-Z]$/.test(valueArr[idx])) {
                    lastValue += utils.toLowerCase(valueArr[idx]);
                    isValid = true;
                }
                break;
            case '9':
                if (/^[0-9]$/.test(valueArr[idx])) {
                    lastValue += valueArr[idx];
                    isValid = true;
                }
                break;
            default:
                if (formatPiece === valueArr[idx]) {
                    lastValue += valueArr[idx];
                    isValid = true;
                }
                break;
        }
        return isValid;
    })
    return lastValue;
};
export const setSelectOptions = (select: any, options: any) => {
    if (!Array.isArray(options)) return;
    (this as any).removeAllChild(select);
    options.forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        if (opt.selected) option.setAttribute('selected', '');
        if (opt.disabled) option.setAttribute('disabled', '');
        if (opt.label) option.setAttribute('label', opt.label);
        select.appendChild(option); 
    });
};
export const getSelectOptions = (select: any) => {
    if (!select) return null;
    const options = select.options;
    if (!options) return null;
    const returnOptions = [];
    for(const option of options) {
        let returnOption = {
            value : option.value,
            text : option.textContent
        };
        if (option.selected) (returnOption as any).selected = true;
        if (option.disabled) (returnOption as any).disabled = true;
        if (option.label) (returnOption as any).label = option.label;
        returnOptions.push(returnOption);
    }
    return returnOptions.length === 0 ? null : returnOptions;
};
