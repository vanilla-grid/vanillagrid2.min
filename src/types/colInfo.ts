import { Align, VerticalAlign } from "./enum";

/**
 * This is information about the column.
 */
export interface ColInfo {
    /**
     * Required value. It is the id of the column.
     */
    id: string;
    /**
     * The column's sequence number. For maintenance purposes, it is recommended to use an ID rather than a default value.
     */
    index: number | null;
    /**
     * The name of the column. If null, the grid Id is inserted.
     */
    name: string | null;
    /**
     * Header text value. Use ';' as the delimiter. Empty values are automatically merged.
     */
    header: string[] | null;
    /**
     * Insert the footer using ';' as the delimiter. General text: Insert the string as text in the footer.
     * $$MAX: Calculate and display the maximum value in the footer.
     * $$MIN: Calculate and display the minimum value in the footer.
     * $$SUM: Calculate and display the sum in the footer.
     * $$AVG: Calculate and display the average in the footer (excluding null).
     */
    footer: string[] | null;
    /**
     * If untarget is true, the cells in this column cannot be selected.
     */
    untarget: boolean | null;
    /**
     * If rowMerge is true, this column merges rows based on the cell above if the value, data-type, and format are the same.
     */
    rowMerge: boolean | null;
    /**
     * If colMerge is true, this column merges columns based on the cell in front if the value, data-type, and format are the same.
     */
    colMerge: boolean | null;
    /**
     * If visible is false, this column's width becomes 0 and size cannot be changed (hidden).
     */
    colVisible: boolean | null;
    /**
     * If required is true, this column can be checked for input using the checkRequired() method.
     */
    required: boolean | null;
    /**
     * If resizable is false, the user cannot change the width size of this column.
     */
    resizable: boolean | null;
    /**
     * Indicates whether the user can use the sorting feature for this column.
     */
    sortable: boolean | null;
    /**
     * Indicates whether the user can use the filtering feature for this column.
     */
    filterable: boolean | null;
    /**
     * The width of the column. Insert cssText. If only a number is entered, the unit is 'px'.
     */
    originWidth: string | null;
    /**
     * Sets the type of the column.
     * text: Text input type. A textarea input box is created on double click.
     * number: Number input type. An input number type is created on double click.
     * date: Date input type. An input date type is created on double click.
     * month: Month input type. An input month type is created on double click.
     * mask: Text input type that matches the format. An input text type is created on double click. Controlled by the format attribute.
     * select: Input select type. Options are received when inserting values. Ex) [{value:"val1", text:"text1", selected:true},{value:"val2", text:"text2"}..]
     * checkbox: Input checkbox type. Checked if it matches the checkedValue of the grid info, unchecked otherwise.
     * button: Button type. The inserted value is displayed as the innerText of the button. If there is no value, the button is not created.
     * link: a tag. Insert the value as an object in the form {text:"text", value:"https://..", target:"_blank"}. The text is set as innerText, the value as href, and the target as target.
     * code: A type that cannot have or display values other than the specified codes. If nullValue is not in the codes, it is not allowed. Empty values are stored as default-code.
     */
    dataType: string | null;
    /**
     * Sets the select width size for this column. Insert cssText. The unit can only be px or %.
     */
    selectSize: string | null;
    /**
     * If locked is true, the cells in this column cannot be changed.
     */
    locked: boolean | null;
    /**
     * If lockedColor is true, the cells in this column will display a background color indicating the locked state when locked.
     */
    lockedColor: boolean | null;
    /**
     * Sets the format for data-type mask, number.
     * Mask format: A: Uppercase letter, a: Lowercase letter, 9: Number, others: Matching character.
     * Ex) format: "AAA-991", value: "ABC-123456" => result: "ABC-12"
     * 
     * Number format:
     * Integer part:
     * "#,###": Display with thousand separators, 0 is displayed as null, "#,##0": Display with thousand separators,
     * 0 is displayed as 0, "#": Display as is, 0 is displayed as null, "0": Display as is, 0 is displayed as 0.
     * Decimal part: "#": Display if present, "0": Display as 0 if not present.
     * Others: Characters before and after are displayed as is, and if the last character is "%", it is displayed as a percentage.
     * Ex1) format: "#,##0.## $", number: 1234.1234 => result: "1,234.12 $"
     * Ex2) format: "0%", number: 0.12 => result: "12%"
     */
    format: string | null;
    /**
     * Valid only for columns with data-type code. Sets codes separated by ";". This column can only have the specified code values.
     * Ex) "US;KR;JP" => Can only have the values "US", "KR", "JP"
     */
    codes: string[] | null;
    /**
     * Valid only for columns with data-type code. If a column with data-type code has no value, the default-code is used as the value instead of grid.info's nullValue.
     */
    defaultCode: string | null;
    /**
     * Valid only for columns with data-type text. Sets the maximum string length that can be inserted into the value. Enter only positive integers.
     */
    maxLength: number | null;
    /**
     * Valid only for columns with data-type text. Sets the maximum byte size of the string that can be inserted into the value. Enter only positive integers.
     * Byte size criteria are set with vg.lessoreq0x7ffByte, vg.lessoreq0xffffByte, vg.greater0xffffByte.
     * lessoreq0x7ffByte: Characters with charCode less than or equal to 0x7FF, default value is 2 (common symbols or English alphabet based on UTF-8).
     * lessoreq0xffffByte: Characters with charCode less than or equal to 0xFFFF, default value is 3 (additional alphabets such as Latin based on UTF-8).
     * greater0xffffByte: Characters with charCode greater than 0xFFFF, default value is 4 (emoji, Korean, Chinese, Japanese, etc. based on UTF-8).
     */
    maxByte: number | null;
    /**
     * Valid only for columns with data-type number. Sets the maximum value. If a value exceeding this is entered, it is stored as the maximum value. Enter only numbers.
     */
    maxNumber: number | null;
    /**
     * Valid only for columns with data-type number. Sets the minimum value. If a value below this is entered, it is stored as the minimum value. Enter only numbers.
     */
    minNumber: number | null;
    /**
     * Valid only for columns with data-type number. Specifies the rounding place.
     * roundNumber positive integer: Specifies the decimal place to round.
     * roundNumber negative integer: Specifies the integer place to round.
     * Ex) roundNumber: 2, number: 1234.1234 => result: 1234.12
     * Ex) roundNumber: -2, number: 1234.1234 => result: 1200
     */
    roundNumber: number | null;
    /**
     * Sets the align of the column. Choose from 'left', 'center', 'right'. If no value is specified, the default align follows the data-type.
     * text, mask: left, number: right, date, month, code, select, checkbox, button, link: center.
     */
    align: Align.left | Align.center | Align.right | string | null;
    /**
     * Sets the default vertical-align of the column. Choose from 'top', 'center', 'bottom'. If no value is specified, it defaults to center.
     */
    verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom | string | null;
    /**
     * Sets the default overflow-wrap of the column. Enter the overflow-wrap in cssText.
     */
    overflowWrap: string | null;
    /**
     * Sets the default word-break of the column. Enter the word-break in cssText.
     */
    wordBreak: string | null;
    /**
     * Sets the default white-space of the column. Enter the white-space in cssText.
     */
    whiteSpace: string | null;
    /**
     * Sets the background color of the column. Insert the 16-digit color code in cssText. Ex) "#ffffff"
     */
    backColor: string | null;
    /**
     * Sets the font color of the column. Insert the 16-digit color code in cssText. Ex) "#ffffff"
     */
    fontColor: string | null;
    /**
     * If fontBold is true, the innerText of the column's cells will be bold.
     */
    fontBold: boolean | null;
    /**
     * If fontItalic is true, the innerText of the column's cells will be italic.
     */
    fontItalic: boolean | null;
    /**
     * If fontThruline is true, the innerText of the column's cells will have a strikethrough.
     */
    fontThruline: boolean | null;
    /**
     * If fontUnderline is true, the innerText of the column's cells will be underlined.
     */
    fontUnderline: boolean | null;
    /**
     * An array of values ​​that the filter has. Automatically changes.
     */
    filterValues?: Set<string> | null;
    /**
     * The currently specified filter value.
     */
    filterValue?: string | null;
    /**
     * Whether a filter has been applied.
     */
    filter?: boolean | null;
    /**
     * If visible is false, this row is hidden.
     */
    rowVisible?: boolean | null;
}

/**
 * Default configuration for column-level properties.
 * Simplifies column setup and ensures consistency.
 */
export interface DefaultColInfo extends Omit<ColInfo,
'id' |
'index' |
'name' |
'header' |
'footer' |
'filterValues' |
'filterValue' |
'filter' |
'rowVisible'
>{
}
