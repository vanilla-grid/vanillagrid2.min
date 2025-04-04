import { Cell } from "../types/cell";

isCellVisible (cell: Cell) {
    if (!cell) return;
    return !(cell.cColVisible === false || cell.cRowVisible === false || cell.cFilter === true);
},
getFirstCellValidNumber (grid: any, footerCell: Cell): number | null {
    let returnNumber;
    let tempCell;
    for(let r = 1; r < grid.getRowCount(); r++ ) {
        tempCell = grid._getCell(r, footerCell.col);
        if (!(this as any).isCellVisible(tempCell)) continue;
        returnNumber = (this as any).getOnlyNumberWithNaNToNull(tempCell!.cValue);
        if (returnNumber) return returnNumber;
    }
    return null;
},
removeGridEditor (): boolean {
    if (!(this as any).activeGridEditor) return false;
    const cell = (this as any).activeGridEditor.targetCell;
    (this as any).doEventWithCheckChanged(cell.gId, '_onEditEnding', cell.row, cell.cId, (this as any).editOldValue, (this as any).editNewValue)
    cell.style.padding = '';
    cell.style.fontSize = '';
    (this as any).activeGridEditor.parentNode.removeChild((this as any).activeGridEditor);
    (this as any).activeGridEditor = null; 
    return true;
},
addBagicEventListenerToGridEditor (gridEditor: HTMLElement) {
    gridEditor.addEventListener('keydown', function (e) {
        const _grid = utils.activeGrid as any;
        const gId = _grid.gId;
        const cell = _grid.variables._targetCell;
        if (utils.doEventWithCheckChanged(gId, '_onKeydownEditor', e) === false) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
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
    gridEditor.addEventListener('input', function(e) {
        const _grid = utils.activeGrid as any;
        const gId = _grid.gId;
        utils.doEventWithCheckChanged(gId, '_onInputEditor', e);
    })
},
setBagicAttributesToGridEditor (gridEditor: any, cell: Cell) {
    gridEditor.eId = cell.gId + '_Editor';
    gridEditor.gId = cell.gId;
    gridEditor.targetCell = cell;
    gridEditor.style.width = cell.offsetWidth + 'px'; 
    gridEditor.style.height = cell.scrollHeight + gridEditor.offsetHeight - gridEditor.clientHeight + 'px';
    gridEditor.classList.add(gridEditor.gId + '_editor');
},
createGridEditorTextarea (cell: Cell): HTMLElement {
    const gridEditor = document.createElement('textarea') as unknown as any;
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.placeholder;
    gridEditor.classList.add(gridEditor.gId + '_editor_textarea');
    const value = (this as any)[cell.gId].info.gNullValue === cell.cValue? null : cell.cValue;
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
},
createGridEditorNumber (cell: Cell): HTMLInputElement {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_number');
    gridEditor.setAttribute('type','number');
    const value = (this as any)[cell.gId].info.gNullValue === cell.cValue? null : cell.cValue;
    (this as any).editOldValue = value;
    gridEditor.value = (this as any).editOldValue; 

    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
},
createGridEditorDate (cell: Cell): HTMLInputElement {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_date');
    gridEditor.setAttribute('type','date');
    (this as any).editOldValue = (this as any).getDateWithInputDateFormat(cell.cValue);
    gridEditor.value = (this as any).editOldValue; 

    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
},
createGridEditorMonth (cell: Cell): HTMLInputElement {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_month');
    gridEditor.setAttribute('type','month');
    (this as any).editOldValue = (this as any).getDateWithInputMonthFormat(cell.cValue);
    gridEditor.value = (this as any).editOldValue; 

    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
},
createGridEditorMask (cell: Cell): HTMLInputElement {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_mask');
    gridEditor.setAttribute('type','text');
    const value = (this as any)[cell.gId].info.gNullValue === cell.cValue? null : cell.cValue;
    (this as any).editOldValue = value;
    gridEditor.value = (this as any).editOldValue; 
    gridEditor.addEventListener('keyup', function (e: any) {
        e.target.value = utils.getMaskValue(e.target.targetCell.cFormat, e.target.value);
    });
    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
},
createGridEditorCode (cell: Cell): HTMLInputElement {
    const gridEditor = document.createElement('input');
    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
    gridEditor.classList.add((gridEditor as any).gId + '_editor_code');
    gridEditor.setAttribute('type','text');
    const value = cell.cValue;
    (this as any).editOldValue = value;
    gridEditor.value = (this as any).editOldValue; 
    (this as any).addBagicEventListenerToGridEditor(gridEditor);
    return gridEditor;
},
createGridEditor (cell: Cell, isEnterKey = false) {
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
                        gridEditor = vg.dataType[key].getEditor(cell, (this as any)[cell.gId].__getData(cell), () => {call_modify()}, () => {call_endEdit()});
                        if(gridEditor) {
                            if(!(gridEditor instanceof HTMLElement) || gridEditor.nodeType !== 1)  throw new Error('getEditor must return an html element.');
                            (gridEditor as any).eId = cell.gId + '_Editor';
                            (gridEditor as any).gId = cell.gId;
                            (gridEditor as any).targetCell = cell;
                            gridEditor.classList.add((gridEditor as any).gId + '_editor_' + key);
                            gridEditor.classList.add((gridEditor as any).gId + '_editor');
                            (this as any).editOldValue = cell.cValue;
                        }
                    }
                }
            });
            break;
    }
    if ((this as any).doEventWithCheckChanged(cell.gId, '_onEditEnter', cell.row, cell.cId, gridEditor) === false) {
        return;
    }
    if (!gridEditor) return;
    cell.style.padding = '0';
    cell.style.fontSize = '0px'; 
    cell.appendChild(gridEditor);
    
    gridEditor.focus();
    if (isEnterKey) gridEditor.select();
    (this as any).activeGridEditor = gridEditor;
    (this as any).doEventWithCheckChanged(cell.gId, '_onEditEnter', cell.row, cell.cId, gridEditor);
},
getValidValue (cell: Cell, value: any): any {
    const nullValue = (this as any).nvl((this as any)[cell.gId].info.gNullValue, null);
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
            return (this as any).nvl((this as any).getMaskValue(cell.cFormat, value), nullValue);
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
            const checkedValue = (this as any)[cell.gId].info.gCheckedValue;
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
},
getCellText (cell: Cell): string {
    if (!cell) return '';
    let cellText: any = '';
    const _grid = (this as any)[cell.gId];
    let value = (this as any).nvl(cell.cValue, _grid.info.gNullValue);
    switch (cell.cDataType) {
        case 'number':
            if(value === _grid.info.gNullValue) cellText = value;
            else cellText = utils.nvl((this as any).getFormatNumberFromCell(cell), _grid.info.gNullValue);
            break;
        case 'date':
            if(value === _grid.info.gNullValue) cellText = value;
            else cellText = utils.nvl((this as any).getDateWithGridDateFormat(cell), _grid.info.gNullValue);
            break;
        case 'month':
            if(value === _grid.info.gNullValue) cellText = value;
            else cellText = utils.nvl((this as any).getDateWithGridMonthFormat(cell), _grid.info.gNullValue);
            break;
        case 'select':
            if (Array.isArray(cell.cValue) && cell.cValue.length > 0) {
                cellText = cell.cValue[0].text;
                for(const option of cell.cValue) {
                    if (option.selected) cellText = option.text;
                }
                if(cellText === null || cellText === undefined) cellText = _grid.info.gNullValue;
            }
            break;
        case 'link':
            cellText = cell.cValue && cell.cValue.text ? cell.cValue.text : value;
            break;
        default:
            cellText = value;
            if(vg.dataType) {
                Object.keys(vg.dataType).forEach((key) => {
                    if(cell.cDataType === key) {
                        if(vg.dataType[key].getText) {
                            if(typeof vg.dataType[key].getText !== 'function') throw new Error('getText must be a function.');
                            cellText = vg.dataType[key].getText(cellText);
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
},
getFormatNumber (format: string, value: any): string | number {
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
},
getFormatNumberFromCell (cell: Cell): string | null {
    if(!cell.cFormat) return cell.cValue;
    if(cell.cValue === null || cell.cValue === undefined) return null;
    return (this as any).getFormatNumber(cell.cFormat, cell.cValue);
},
getDateWithValueDateFormat(dateStr: string): string | null {
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
},
getDateWithValueMonthFormat(dateStr: string): string | null {
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
},
getDateWithInputDateFormat (dateStr: string): string | null {
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
},
getDateWithInputMonthFormat (dateStr: string): string | null {
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
},
getDateWithGridDateFormat (cell: Cell): string | null {
    const pattern = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})$/;
    const match = pattern.exec(cell.cValue);
    
    if (!match) {
        return null;
    }
    const year = match[1];
    const month = match[2];
    const day = match[3];
    if (!(this as any).isValidDate(year, month, day)) {
        return null;
    }
    const dateFormat = (this as any)[cell.gId].info.gDateFormat;
    
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
},
getDateWithGridMonthFormat (cell: Cell): string | null {
    const pattern = /^(\d{4})[-/.]?(\d{2})$/;
    const match = pattern.exec(cell.cValue);
    
    if (!match) {
        return null;
    }
    const year = match[1];
    const month = match[2];
    if (!(this as any).isValidDate(year, month, '01')) {
        return null;
    }
    const monthFormat = (this as any)[cell.gId].info.gMonthFormat;
    
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
},
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
getCodeValue (code: string[], defaultCode: string | null, value: string): string | null {
    if (!code || !Array.isArray(code)) return defaultCode;
    if (code.indexOf(value) >= 0) return value;
    return defaultCode;
},
getMaskValue (format: string, value: string): string | null {
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
},
setSelectOptions (select: any, options: any) {
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
},
getSelectOptions (select: any) {
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
},
