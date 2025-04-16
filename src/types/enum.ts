export const enum Align {
    left = "left",
    center = "center",
    right = "right"
}
export const enum VerticalAlign {
    top = "top",
    center = "center",
    bottom = "bottom"
}
export const enum SelectionPolicy {
    single = "single",
    range = "range",
    none = "none"
}
export const enum ColorSet {
    skyblue = "skyblue",
    blue = "blue",
    light_red = "light-red",
    red = "red",
    light_green = "light-green",
    green = "green",
    orange = "orange",
    yellow = "yellow",
    purple = "purple",
    brown = "brown",
    black = "black"
}
export const enum DateFormat {
    "yyyy-mm-dd" = "yyyy-mm-dd",
    "yyyy/mm/dd" = "yyyy/mm/dd",
    "yyyy. mm. dd" = "yyyy. mm. dd",
    "yyyymmdd" = "yyyymmdd",
    "mm-dd-yyyy" = "mm-dd-yyyy",
    "mm/dd/yyyy" = "mm/dd/yyyy",
    "mm. dd. yyyy" = "mm. dd. yyyy",
    "mmddyyyy" = "mmddyyyy",
    "dd-mm-yyyy" = "dd-mm-yyyy",
    "dd/mm/yyyy" = "dd/mm/yyyy",
    "dd. mm. yyyy" = "dd. mm. yyyy",
    "ddmmyyyy" = "ddmmyyyy",
}
export const enum MonthFormat {
    "yyyymm" = "yyyymm",
    "yyyy-mm" = "yyyy-mm",
    "yyyy/mm" = "yyyy/mm",
    "yyyy. mm" = "yyyy. mm",
    "mmyyyy" = "mmyyyy",
    "mm-yyyy" = "mm-yyyy",
    "mm/yyyy" = "mm/yyyy",
    "mm. yyyy" = "mm. yyyy",
}
export const enum BasicDataType {
    text = "text",
    number = "number",
    date = "date",
    month = "month",
    mask = "mask",
    select = "select",
    checkbox = "checkbox",
    button = "button",
    link = "link",
    code = "code",
}
export const enum RowStatus {
    create ='C',
    update ='U',
    delete ='D',
}
export const basicDataType = Object.freeze({
    text : "text",
    number : "number",
    date : "date",
    month : "month",
    mask : "mask",
    select : "select",
    checkbox : "checkbox",
    button : "button",
    link : "link",
    code : "code",
});
export const enumWidthUnit = Object.freeze({
    pixel: 'px',
    percent: '%',
});
export const alignUnit = Object.freeze({
    left: 'left',
    center: 'center',
    right: 'right',
});
export const verticalAlignUnit = Object.freeze({
    top: 'top',
    center: 'center',
    bottom: 'bottom',
});
export const footerUnit = Object.freeze({
    max: '$$MAX',
    min: '$$MIN',
    sum: '$$SUM',
    avg: '$$AVG',
});
export const statusUnit = Object.freeze({
    create: 'C',
    update: 'U',
    delete: 'D',
});
export const selectionPolicyUnit = Object.freeze({
    single: 'single',
    range: 'range',
    none: 'none',
});
