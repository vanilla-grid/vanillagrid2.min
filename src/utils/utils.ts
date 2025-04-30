import type { CheckByte } from "../types/vanillagrid";
import type { GridCssInfo } from "../types/gridInfo";
import { ColorSet, VerticalAlign } from "../types/enum";

export const validateNumber = (param: string | number) => {
    const number = Number(param);
    if (isNaN(number)) {
        throw new Error('The provided parameter is not a number.');
    }
    return number;
};
export const validateIntegerAndZero = (param: string | number) => {
    const number = Number(param);
    if (isNaN(number)) {
        throw new Error('The provided parameter is not a number.');
    }
    if (!Number.isInteger(number)) {
        throw new Error('The provided number is not an integer.');
    }
    return number;
};
export const validatePositiveIntegerAndZero = (param: string | number) => {
    const number = Number(param);
    if (isNaN(number)) {
        throw new Error('The provided parameter is not a number.');
    }
    if (!Number.isInteger(number)) {
        throw new Error('The provided number is not an integer.');
    }
    if (number < 0) {
        throw new Error('The provided number is not a positive integer.');
    }
    return number;
};
export const extractNumberAndUnit = (val: string | null) => {
    if (val === null || val === undefined) return { number: 0, unit: '' };
    val = '' + val.trim();
    const regex = /^(\d+)(\D*)$/;
    const match = val.match(regex);
    if (match) {
        const unit = match[2] === '' ? '' : match[2];
        return { number: parseInt(match[1], 10), unit: unit };
    } else {
        return { number: 0, unit: '' };
    }
};
export const toLowerCase = (val: string | null) => {
    if (!val || typeof val !== 'string') return '';
    return val.toLowerCase();
};
export const toUpperCase = (val: string | null) => {
    if (!val || typeof val !== 'string') return '';
    return val.toUpperCase();
};
export const isIncludeEnum = (enumObj: Record<string, string>, value: string) => {
    return Object.values(enumObj).includes(value);
};
export const isValidDate = (year: number | string, month: number | string, day: number | string) => {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    const date = new Date(y, m - 1, d);
    return date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d;
};
export const isValidEmail = (email: string) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};
export const getCutByteLength = (str: string, cutByte: number, checkByte: CheckByte) => {
    if (str === null || str === undefined) return null;
    str = String(str);
    let byteLength = 0;
    let cutIndex = str.length;

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode <= 0x7F) {
            byteLength += 1;
        } else if (charCode <= 0x7FF) {
            byteLength += checkByte.lessoreq0x7ffByte;
        } else if (charCode <= 0xFFFF) {
            byteLength += checkByte.lessoreq0xffffByte;
        } else {
            byteLength += checkByte.greater0xffffByte;
        }
        if (byteLength > cutByte) {
            cutIndex = i;
            break;
        }
    }
    return str.substring(0, cutIndex);
};
export const deepCopy = (object: any, visited?: any[]) => {
    if (object === null || typeof object !== 'object') {
        return object;
    }
    if (object.constructor !== Object && object.constructor !== Array) {
        return object;
    }
    if (!visited) visited = [];
    for (let i = 0; i < visited.length; i++) {
        if (visited[i].source === object) {
            return visited[i].copy;
        }
    }
    let copy: any;
    if (Array.isArray(object)) {
        copy = [];
        visited.push({ source: object, copy: copy });

        for (let j = 0; j < object.length; j++) {
            copy[j] = deepCopy(object[j], visited);
        }
    } else {
        copy = {};
        visited.push({ source: object, copy: copy });

        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                copy[key] = deepCopy(object[key], visited);
            }
        }
    }
    return copy;
};
export const deepFreeze = <T extends Record<string, any>> (object: T, noFreezeArr?: any[]) => {
    const propNames = Object.getOwnPropertyNames(object);

    propNames.forEach((name) => {
        const prop = object[name];
        if (noFreezeArr && noFreezeArr.indexOf(name) < 0 && typeof prop == 'object' && prop !== null) {
            deepFreeze(prop, noFreezeArr);
        }
    });
    
    return Object.freeze(object);
};
export const getArrayElementWithBoundCheck = (arr: any[], idx: number | null) => {
    idx = getOnlyNumberWithNaNToNull(idx);
    if (idx === null || idx === undefined) throw new Error('Please enter the correct index.');
    if (idx < 0 || idx >= arr.length) throw new Error('Index is out of range. Please enter the correct index.');
    return arr[idx];
};
export const removeAllChild = (element: HTMLElement) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};
export const getBorderWidth = (el: HTMLElement) => {
    const style = getComputedStyle(el);
    const borderLeftWidth = extractNumberAndUnit(style.borderLeftWidth)!.number;
    const borderRightWidth = extractNumberAndUnit(style.borderRightWidth)!.number;
    return borderLeftWidth + borderRightWidth
};
export const getBorderHeight = (el: HTMLElement) => {
    const style = getComputedStyle(el);
    const borderTopWidth = extractNumberAndUnit(style.borderTopWidth)!.number;
    const borderBottomWidth = extractNumberAndUnit(style.borderBottomWidth)!.number;
    return borderTopWidth + borderBottomWidth
};
export const getHexColorFromColorName = (colorName: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(colorName)) {
        return colorName;
    }
    
    const dummyDiv = document.createElement('div');
    dummyDiv.style.color = colorName;
    document.body.appendChild(dummyDiv);
    
    
    const color = window.getComputedStyle(dummyDiv).color;
    document.body.removeChild(dummyDiv);
    
    
    const rgb: RegExpMatchArray | null = color.match(/\d+/g); 
    const hex = '#' + ((1 << 24) + (+rgb![0] << 16) + (+rgb![1] << 8) + +rgb![2]).toString(16).slice(1);
    
    return hex;
};
export const getColorShade = (hexColor: string): "light" | "dark" => {
    if (!/^#([0-9a-fA-F]{6})$/.test(hexColor)) {
      throw new Error(`Invalid HEX color format: ${hexColor}`);
    }
  
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
  
    const brightness = r + g + b;
  
    return brightness > 385 ? "light" : "dark";
};
export const getAdjustHexColor = (color: string, diff: string) => {
    if (color.startsWith('#')) {
        color = color.slice(1);
    }
    
    let diffValue = parseInt(diff, 16);
    if (diff.startsWith('-')) {
        diffValue = -parseInt(diff.slice(1), 16);
    }
    
    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);

    r = parseInt(String(r + diffValue));
    g = parseInt(String(g + diffValue));
    b = parseInt(String(b + diffValue));

    return '#'
         + (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, '0')
         + (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, '0')
         + (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, '0');
};
export const getMostLightHexColor = (color: string) => {
    if (color.startsWith('#')) {
        color = color.slice(1);
    }
                
    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);

    r = parseInt(String(210 + r / 255 * 50));
    g = parseInt(String(210 + g / 255 * 50));
    b = parseInt(String(210 + b / 255 * 50));
    
    return '#'
        + (r < 0 ? 0 : r > 255 ? 248 : r).toString(16).padStart(2, '0')
        + (g < 0 ? 0 : g > 255 ? 248 : g).toString(16).padStart(2, '0')
        + (b < 0 ? 0 : b > 255 ? 248 : b).toString(16).padStart(2, '0');
};
export const getInvertColor = (hex: string | null) => {
    if (!hex) return null;
    if (hex.startsWith('#')) {
        hex = hex.slice(1);
    }
    
    let r = 255 - parseInt(hex.slice(0, 2), 16);
    let g = 255 - parseInt(hex.slice(2, 4), 16);
    let b = 255 - parseInt(hex.slice(4, 6), 16);
    
    r = r < 127.5 ? r + 16 : r - 16;
    g = g < 127.5 ? g + 16 : g - 16;
    b = b < 127.5 ? b + 16 : b - 16;
    
    return '#'
        + (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, '0')
        + (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, '0')
        + (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, '0');
};
export const getCssTextFromObject = (cssObject: Record<string, string>) => {
    let cssText = '';
    if (!cssObject || cssObject.constructor !== Object || Object.keys(cssObject).length === 0) return cssText;
    
    let csses = Object.entries(cssObject);
    for(let i = 0; i < csses.length; i++) {
        if (csses[i].length < 2) continue;
        cssText += csses[i][0].trim() + ':' + csses[i][1].trim() + ';';
    }
    
    return cssText;
};
export const getAttributeWithCheckRequired = (attributeName: string, el: HTMLElement) => {
    if (!el.getAttribute(attributeName)) {
        throw new Error(`'`+ attributeName + `' is required.`);
    }
    else {
        return el.getAttribute(attributeName);
    }
};
export const getAttributeOnlyNumberIntegerOrZero = (attributeName: string, el: HTMLElement) => {
    let numStr = el.getAttribute(attributeName);
    if (numStr === null || numStr === undefined || numStr === '') return null;
    let num = Number(numStr);
    if (Number.isInteger(num) && num >= 0) {
        return num;
    }
    return null
};
export const getAttributeOnlyNumberInteger = (attributeName: string, el: HTMLElement) => {
    let numStr = el.getAttribute(attributeName);
    if (numStr === null || numStr === undefined || numStr === '') return null;
    let num = Number(numStr);
    if (Number.isInteger(num)) {
        return num;
    }
    return null;
};
export const getAttributeOnlyNumber = (attributeName: string, el: HTMLElement) => {
    let numStr = el.getAttribute(attributeName);
    if (numStr === null || numStr === undefined || numStr === '') return null;
    let num = Number(numStr);
    if (isNaN(num)) {
        return null;
    }
    return num;
};
export const getAttributeOnlyBoolean = (attributeName: string, el: HTMLElement) => {
    let bool = el.getAttribute(attributeName);
    if (bool === null || bool === undefined || bool === '') return null;
    
    return toLowerCase(bool) === 'true';
};
export const getOnlyNumberWithNaNToZero = (value: any) => {
    const returnValue = Number(value);
    if (isNaN(returnValue)) {
        return 0;
    }
    return returnValue;
};
export const getOnlyNumberWithNaNToNull = (value: any) => {
    const returnValue = Number(value);
    if (isNaN(returnValue)) {
        return null;
    }
    return returnValue;
};
export const isElementVisible = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
        const x = rect.left + (rect.right - rect.left) / 2;
        const y = rect.top + (rect.bottom - rect.top) / 2;
        const topElement = document.elementFromPoint(x, y);
        return el.contains(topElement) || el === topElement;
    }
    return false;
};
export const getFirstChildTextNode = (el: HTMLElement) => {
    for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
            return child;
        }
    }
    return null;
};
export const nvl = <T,U> (value: T, nullValue: U) => {
    if (value === null || value === undefined || value === '') {
        return nullValue;
    }
    return value;
};
export const getVerticalAlign = (verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom) => {
    switch (toLowerCase(verticalAlign)) {
        case 'top':
            return 'flex-start';
        case 'bottom':
            return 'flex-end';
        default:
            return 'center';
    }
};
export const checkIsValueOrData = (keyValueOrDatas: (object | object[])[]) => {
    let isKeyValue = null;
    for(const keyValueOrData of keyValueOrDatas) {
        if (keyValueOrData.constructor === Object) {
            if (isKeyValue !==null && isKeyValue === false) throw new Error('Please insert valid datas.');
            isKeyValue = true;
        }
        else {
            if (!Array.isArray(keyValueOrData)) throw new Error('Please insert valid datas.');
            if (keyValueOrData[0] && keyValueOrData[0].constructor !== Object) throw new Error('Please insert valid datas.');
            if (isKeyValue !==null && isKeyValue === true) throw new Error('Please insert valid datas.');
            isKeyValue = false;
        }
    }
    return isKeyValue;
};
export const getColorFromColorSet = (colorSet: ColorSet.black
    | ColorSet.blue
    | ColorSet.brown
    | ColorSet.green
    | ColorSet.light_green
    | ColorSet.light_red
    | ColorSet.orange
    | ColorSet.purple
    | ColorSet.red
    | ColorSet.skyblue
    | ColorSet.yellow
    | string | null
) => {
    switch(colorSet) {
        case 'skyblue':
            return '#91c8e4';
        case 'blue':
            return '#4682a9';
        case 'light-red' :
            return '#fdd2bf';
        case 'red' :
            return '#b61919';
        case 'light-green' :
            return '#a4be7b';
        case 'green' :
            return '#217346';
        case 'orange' :
            return '#f79327';
        case 'yellow' :
            return '#ffe569';
        case 'purple' :
            return '#804674';
        case 'brown' :
            return '#675d50';
        case 'black' :
            return '#272829';
        default :
            throw new Error('Please enter the correct colorSet.');
    }
};
export const getHeaderString = (headerRowCount: number, header: string) => {
    const headerArr = header.split(';');
    if(headerRowCount > headerArr.length) {
        for(let i = 0; i <= headerRowCount - headerArr.length; i++) {
            headerArr.push('');
        }
    }
    const headerString = headerArr.join(';');
    return headerString;
}
