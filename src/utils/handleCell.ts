import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import type { Cell } from "../types/cell";
import type { Handler } from "../types/handler";
import { getCutByteLength, getOnlyNumberWithNaNToNull, isValidDate, nvl, removeAllChild, toLowerCase, toUpperCase } from "./utils";

export const setHandleCell = (vg: Vanillagrid, gridList: Record<string, Grid>, handler: Handler) => {
    handler.isCellVisible = (cell: Cell) => {
        if (!cell) return false;
        return !(cell.colVisible === false || cell.rowVisible === false || cell.filter === true);
    };
    handler.getFirstCellValidNumber = (footerCell: Cell) => {
        const gridId = footerCell._gridId;
        let returnNumber;
        let tempCell;
        for(let r = 1; r < gridList[gridId].methods.getRowCount(); r++ ) {
            tempCell = handler._getCell(gridId, r, footerCell._col);
            if (!handler.isCellVisible(tempCell!)) continue;
            returnNumber = getOnlyNumberWithNaNToNull(tempCell!.value);
            if (returnNumber) return returnNumber;
        }
        return null;
    };
   handler.removeGridEditor = () => {
        if (!vg._status.activeGridEditor) return false;
        const cell: Cell = (vg._status.activeGridEditor as any).targetCell;
        const gridId = cell._gridId;
        gridList[gridId].events.onEditEnding(cell._row, cell.colId, vg._status.editOldValue, vg._status.editNewValue);
        cell.style.padding = '';
        cell.style.fontSize = '';
        vg._status.activeGridEditor.parentNode!.removeChild(vg._status.activeGridEditor);
        vg._status.activeGridEditor = null; 
        return true;
    };
   handler.addBagicEventListenerToGridEditor = (gridEditor: HTMLElement) => {
        gridEditor.addEventListener('keydown', function (e) {
            const activeGrid = vg._status.activeGrid!;
            const cell = activeGrid.data.variables.targetCell!;
            if(activeGrid.events.onKeydownEditor(e) === false) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            let newTargetCell;
            switch (e.key) {
                case 'Enter':
                    if (!e.shiftKey) {
                        handler.modifyCell(vg);
                        newTargetCell = handler.getMoveRowCell(cell!, 1);
                        handler.selectCell(newTargetCell!);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    break;
                case 'Escape':
                    vg._status.editNewValue = vg._status.editOldValue;
                    handler.removeGridEditor();
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                case 'Tab':
                    handler.modifyCell(vg);
                    newTargetCell = handler.getTabCell(cell!, e.shiftKey);
                    handler.selectCell(newTargetCell!);
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                case 'F2':
                    handler.modifyCell(vg);
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        });
        gridEditor.addEventListener('input', function(e) {
            const activeGrid = vg._status.activeGrid!;
            activeGrid.events.onInputEditor(e as InputEvent);
        })
    };
   handler.setBagicAttributesToGridEditor = (gridEditor: any, cell: Cell) => {
        gridEditor._gridId = cell._gridId;
        gridEditor.targetCell = cell;
        gridEditor.style.width = cell.offsetWidth + 'px'; 
        gridEditor.style.height = cell.scrollHeight + gridEditor.offsetHeight - gridEditor.clientHeight + 'px';
        gridEditor.classList.add(gridEditor._gridId + '_editor');
    };
   handler.createGridEditorTextarea = (cell: Cell) => {
        const gridEditor = document.createElement('textarea') as unknown as any;
        handler.setBagicAttributesToGridEditor(gridEditor, cell);
        gridEditor.placeholder;
        gridEditor.classList.add(gridEditor._gridId + '_editor_textarea');
        const value = gridList[cell._gridId].data.gridInfo.nullValue === cell.value? null : cell.value;
        vg._status.editOldValue = value;
        gridEditor.value = vg._status.editOldValue; 
        
        gridEditor.addEventListener('input', function (e: any) {
            e.target.style.height = e.target.scrollHeight + gridEditor.offsetHeight - gridEditor.clientHeight + 'px';
        }, false);
    
        gridEditor.addEventListener('keyup', function (e: any) {
            if (e.target.value && e.target.parentNode && e.target.parentNode.maxLength) {
                e.target.value = e.target.value.substring(0, e.target.parentNode.maxLength);
            }
            
            if (e.target.value && e.target.parentNode && e.target.parentNode.maxByte) {
                e.target.value = getCutByteLength(e.target.value, e.target.parentNode.maxByte, vg.checkByte);
            }
        }, false);
    
        handler.addBagicEventListenerToGridEditor(gridEditor);
    
        return gridEditor;
    };
   handler.createGridEditorNumber = (cell: Cell) => {
        const gridEditor = document.createElement('input');
        handler.setBagicAttributesToGridEditor(gridEditor, cell);
        gridEditor.classList.add((gridEditor as any)._gridId + '_editor_number');
        gridEditor.setAttribute('type','number');
        const value = gridList[cell._gridId].data.gridInfo.nullValue === cell.value? null : cell.value;
        vg._status.editOldValue = value;
        gridEditor.value = vg._status.editOldValue; 
        handler.addBagicEventListenerToGridEditor(gridEditor);
        return gridEditor;
    };
   handler.createGridEditorDate = (cell: Cell) => {
        const gridEditor = document.createElement('input');
        handler.setBagicAttributesToGridEditor(gridEditor, cell);
        gridEditor.classList.add((gridEditor as any)._gridId + '_editor_date');
        gridEditor.setAttribute('type','date');
        vg._status.editOldValue = handler.getDateWithInputDateFormat(cell.value);
        gridEditor.value = vg._status.editOldValue;
        handler.addBagicEventListenerToGridEditor(gridEditor);
        return gridEditor;
    };
   handler.createGridEditorMonth = (cell: Cell) => {
        const gridEditor = document.createElement('input');
        handler.setBagicAttributesToGridEditor(gridEditor, cell);
        gridEditor.classList.add((gridEditor as any)._gridId + '_editor_month');
        gridEditor.setAttribute('type','month');
        vg._status.editOldValue = handler.getDateWithInputMonthFormat(cell.value);
        gridEditor.value = vg._status.editOldValue;
        handler.addBagicEventListenerToGridEditor(gridEditor);
        return gridEditor;
    };
   handler.createGridEditorMask = (cell: Cell) => {
        const gridEditor = document.createElement('input');
        handler.setBagicAttributesToGridEditor(gridEditor, cell);
        gridEditor.classList.add((gridEditor as any)._gridId + '_editor_mask');
        gridEditor.setAttribute('type','text');
        const value = gridList[cell._gridId].data.gridInfo.nullValue === cell.value? null : cell.value;
        vg._status.editOldValue = value;
        gridEditor.value = vg._status.editOldValue; 
        gridEditor.addEventListener('keyup', function (e: any) {
            e.target.value = handler.getMaskValue(e.target.targetCell.format, e.target.value);
        })
        handler.addBagicEventListenerToGridEditor(gridEditor);
        return gridEditor;
    };
   handler.createGridEditorCode = (cell: Cell) => {
        const gridEditor = document.createElement('input');
        handler.setBagicAttributesToGridEditor(gridEditor, cell);
        gridEditor.classList.add((gridEditor as any)._gridId + '_editor_code');
        gridEditor.setAttribute('type','text');
        const value = cell.value;
        vg._status.editOldValue = value;
        gridEditor.value = vg._status.editOldValue;
        handler.addBagicEventListenerToGridEditor(gridEditor);
        return gridEditor;
    };
    handler.createGridEditor = (cell: Cell, isEnterKey = false) => {
        if (cell.locked || cell.untarget) return;
        if (['select','checkbox','button','link'].indexOf(cell.dataType!) >= 0) return;
        
        handler.removeGridEditor();
        let gridEditor: any;
        switch (cell.dataType) {
            case 'text':
                gridEditor = handler.createGridEditorTextarea(cell);
                break;
            case 'number':
                gridEditor = handler.createGridEditorNumber(cell);
                break;
            case 'date':
                gridEditor = handler.createGridEditorDate(cell);
                break;
            case 'month':
                gridEditor = handler.createGridEditorMonth(cell);
                break;
            case 'mask':
                gridEditor = handler.createGridEditorMask(cell);
                break;
            case 'code':
                gridEditor = handler.createGridEditorCode(cell);
                break;
            default:
                Object.keys(vg.dataType).forEach((key) => {
                    if(cell.dataType === key) {
                        if(vg.dataType[key].getEditor) {
                            if(typeof vg.dataType[key].getEditor !== 'function') throw new Error('getEditor must be a function.');
                            const call_endEdit = () => {
                                vg._status.editNewValue = vg._status.editOldValue;
                                handler.removeGridEditor();
                            }
                            const call_modify = () => {
                                handler.modifyCell(vg);
                            }
                            gridEditor = vg.dataType[key].getEditor(cell, handler.__getData(cell), () => {call_modify()}, () => {call_endEdit()});
                            if(gridEditor) {
                                if(!(gridEditor instanceof HTMLElement) || gridEditor.nodeType !== 1)  throw new Error('getEditor must return an html element.');
                                (gridEditor as any)._gridId = cell._gridId;
                                (gridEditor as any).targetCell = cell;
                                gridEditor.classList.add((gridEditor as any)._gridId + '_editor_' + key);
                                gridEditor.classList.add((gridEditor as any)._gridId + '_editor');
                                vg._status.editOldValue = cell.value;
                            }
                        }
                    }
                });
                break;
        }
        if(gridList[cell._gridId].events.onBeforeEditEnter(cell._row, cell.colId, gridEditor) === false) return;
        if (!gridEditor) return;
        cell.style.padding = '0';
        cell.style.fontSize = '0px'; 
        cell.appendChild(gridEditor);
        
        gridEditor.focus();
        if (isEnterKey) gridEditor.select();
        vg._status.activeGridEditor = gridEditor;
        gridList[cell._gridId].events.onAfterEditEnter(cell._row, cell.colId, gridEditor);
    };
    handler.getValidValue = (cell: Cell, value: any) => {
        const nullValue = nvl(gridList[cell._gridId].data.gridInfo.nullValue, null);
        if (!cell) return null;
        if (cell.dataType !== 'code') {
            if (value === undefined || value === null || value === '') return nullValue;
            if (value === nullValue) return nullValue;
        }
    
        switch (cell.dataType) {
            case 'text':
                if (cell.maxLength) {
                    value = value.substring(0, cell.maxLength);
                }
                if (cell.maxByte) {
                    value = getCutByteLength(value, cell.maxByte, vg.checkByte);
                }
                return value;
            case 'mask':
                return nvl(handler.getMaskValue(cell.format!, value), nullValue);
            case 'date':
                return nvl(handler.getDateWithValueDateFormat(value), nullValue);
            case 'month':
                return nvl(handler.getDateWithValueMonthFormat(value), nullValue);
            case 'number':
                value = getOnlyNumberWithNaNToNull(value);
                if(value === null) return nullValue
    
                const max = cell.maxNumber;
                const min = cell.minNumber;
                const dp = cell.roundNumber;
    
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
                const checkedValue = gridList[cell._gridId].data.gridInfo.checkedValue;
                return checkedValue === value;
            case 'button':
                return value;
            case 'link':
                return value;
            case 'code':
                return handler.getCodeValue(cell.codes!, cell.defaultCode, value);
            default:
                if(vg.dataType) {
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.dataType === key) {
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
    handler.getTextFromCell =  (cell: Cell) => {
        if (!cell) return '';
        let cellText: any = '';
        let value = nvl(cell.value, gridList[cell._gridId].data.gridInfo.nullValue);
        switch (cell.dataType) {
            case 'number':
                if(value === gridList[cell._gridId].data.gridInfo.nullValue) cellText = value;
                else cellText = nvl(handler.getFormatNumberFromCell(cell), gridList[cell._gridId].data.gridInfo.nullValue);
                break;
            case 'date':
                if(value === gridList[cell._gridId].data.gridInfo.nullValue) cellText = value;
                else cellText = nvl(handler.getDateWithGridDateFormat(cell), gridList[cell._gridId].data.gridInfo.nullValue);
                break;
            case 'month':
                if(value === gridList[cell._gridId].data.gridInfo.nullValue) cellText = value;
                else cellText = nvl(handler.getDateWithGridMonthFormat(cell), gridList[cell._gridId].data.gridInfo.nullValue);
                break;
            case 'select':
                if (Array.isArray(cell.value) && cell.value.length > 0) {
                    cellText = cell.value[0].text;
                    for(const option of cell.value) {
                        if (option.selected) cellText = option.text;
                    }
                    if(cellText === null || cellText === undefined) cellText = gridList[cell._gridId].data.gridInfo.nullValue;
                }
                break;
            case 'link':
                cellText = cell.value && cell.value.text ? cell.value.text : value;
                break;
            default:
                cellText = value;
                if(vg.dataType) {
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.dataType === key) {
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
    };
    handler.getFormatNumber = (format: string, value: any) => {
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
   handler.getFormatNumberFromCell = (cell: Cell) => {
        if(!cell.format) return cell.value;
        if(cell.value === null || cell.value === undefined) return null;
        return handler.getFormatNumber(cell.format, cell.value);
    };
    handler.getDateWithValueDateFormat = (dateStr: string) => {
        if(!dateStr || typeof dateStr !== 'string') return null;
        
        const pattern = /^(\d{4})[-/.]? ?(\d{2})[-/.]? ?(\d{2})$/;
        const match = pattern.exec(dateStr.replace(/\s+/g, ''));
        if (!match) {
            return null;
        }
        
        const year = match[1];
        const month = match[2];
        const day = match[3];
        if (!isValidDate(year, month, day)) {
            return null;
        }
        return `${year}${month}${day}`;
    };
    handler.getDateWithValueMonthFormat = (dateStr: string) => {
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
        if (!isValidDate(year, month, '01')) {
            return null;
        }
        return `${year}${month}`;
    };
   handler.getDateWithInputDateFormat = (dateStr: string) => {
        if(!dateStr || typeof dateStr !== 'string') return null;
        
        const pattern = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})$/;
        const match = pattern.exec(dateStr);
        if (!match) {
            return null;
        }
        
        const year = match[1];
        const month = match[2];
        const day = match[3];
        if (!isValidDate(year, month, day)) {
            return null;
        }
        return `${year}-${month}-${day}`;
    };
   handler.getDateWithInputMonthFormat = (dateStr: string) => {
        if(!dateStr || typeof dateStr !== 'string') return null;
        
        const pattern = /^(\d{4})[-/.]?(\d{2})$/;
        const match = pattern.exec(dateStr);
        if (!match) {
            return null;
        }
        
        const year = match[1];
        const month = match[2];
        if (!isValidDate(year, month, '01')) {
            return null;
        }
        return `${year}-${month}`;
    };
    handler.getDateWithGridDateFormat = (cell: Cell) => {
        const pattern = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})$/;
        const match = pattern.exec(cell.value);
        
        if (!match) {
            return null;
        }
        const year = match[1];
        const month = match[2];
        const day = match[3];
        if (!isValidDate(year, month, day)) {
            return null;
        }
        const dateFormat = gridList[cell._gridId].data.gridInfo.dateFormat;
        
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
    handler.getDateWithGridMonthFormat = (cell: Cell) => {
        const pattern = /^(\d{4})[-/.]?(\d{2})$/;
        const match = pattern.exec(cell.value);
            if (!match) {
            return null;
        }
        const year = match[1];
        const month = match[2];
        if (!isValidDate(year, month, '01')) {
            return null;
        }
        
        switch (gridList[cell._gridId].data.gridInfo.monthFormat) {
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
    handler.getCheckboxCellTrueOrFalse = (cell: Cell) => {
        const value = cell.value;
        const checkedValue = gridList[cell._gridId].data.gridInfo.checkedValue;
        const uncheckedValue = gridList[cell._gridId].data.gridInfo.uncheckedValue;
        if (typeof value === 'boolean') {
            if (value) {
                cell.value = checkedValue;
            }
            else {
                cell.value = uncheckedValue;
            }
            return value;
        }
        if (value !== checkedValue) {
            cell.value = uncheckedValue;
            return false;
        }
        return true;
    };
   handler.getCodeValue = (code: string[], defaultCode: string | null, value: string) => {
        if (!code || !Array.isArray(code)) return defaultCode;
        if (code.indexOf(value) >= 0) return value;
        return defaultCode;
    };
   handler.getMaskValue = (format: string, value: string) => {
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
                        lastValue += toUpperCase(valueArr[idx]);
                        isValid = true;
                    }
                    break;
                case 'a':
                    if (/^[a-z]$/.test(valueArr[idx])) {
                        lastValue += valueArr[idx];
                        isValid = true;
                    }
                    else if (/^[A-Z]$/.test(valueArr[idx])) {
                        lastValue += toLowerCase(valueArr[idx]);
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
    handler.setSelectOptions = (select: any, options: any) => {
        if (!Array.isArray(options)) return;
        removeAllChild(select);
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
    handler.getSelectOptions = (select: any) => {
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
}
