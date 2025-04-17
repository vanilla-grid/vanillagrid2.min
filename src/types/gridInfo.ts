import { ColorSet, SelectionPolicy, VerticalAlign } from "./enum";

/**
 * This is information about the grid.
 */
export interface GridInfo {
    /**
     * The name of the grid. If null, the grid Id is inserted.
     */
    name: string | null;
    /**
     * Indicates whether the cell is editable. If true, the cell cannot be edited.
     */
    locked: boolean | null;
    /**
     * Indicates whether to display the background color representing the locked state of a locked cell.
     */
    lockedColor: boolean | null;
    /**
     * Indicates whether the column width can be adjusted by the user with the mouse.
     */
    resizable: boolean | null;
    /**
     * Indicates whether the user can use undo and redo shortcuts while editing the grid.
     */
    redoable: boolean | null;
    /**
     * The number of times the grid edit state is recorded for undo and redo.
     */
    redoCount: number | null;
    /**
     * Indicates whether the grid is visible. If false, it will be display none.
     */
    visible: boolean | null;
    /**
     * Indicates whether the grid header is visible. If false, it will be display none.
     */
    headerVisible: boolean | null;
    /**
     * Indicates whether to display the row number column (v-g-rownum) on the screen.
     */
    rownumVisible: boolean | null;
    /**
     * The width size of the row number column (v-g-rownum).
     */
    rownumSize: string | null;
    /**
     * Indicates whether to display the locked color of the row number column (v-g-rownum).
     */
    rownumLockedColor: boolean | null;
    /**
     * Indicates whether to display the status column (v-g-status) on the screen.
     */
    statusVisible: boolean | null;
    /**
     * Indicates whether to display the locked color of the status column (v-g-status).
     */
    statusLockedColor: boolean | null;
    /**
     * The user selection range policy of the grid. 'range': range selection, 'single': single cell selection, 'none': no selection)
     */
    selectionPolicy: SelectionPolicy.single | SelectionPolicy.range | SelectionPolicy.none | string | null;
    /**
     * Value representing null in the grid.
     */
    nullValue: any | null;
    /**
     * The format of the date in the grid.
     * 'yyyy-mm-dd', 'yyyy/mm/dd', 'yyyy. mm. dd', 'yyyymmdd'
     * 'mm-dd-yyyy', 'mm/dd/yyyy', 'mm. dd. yyyy', 'mmddyyyy'
     * 'dd-mm-yyyy', 'dd/mm/yyyy', 'dd. mm. yyyy', 'ddmmyyyy' are possible.
     */
    dateFormat: string | null;
    /**
     * The format of the month in the grid.
     * 'yyyymm', 'yyyy-mm', 'yyyy/mm', 'yyyy. mm'
     * 'mmyyyy', 'mm-yyyy', 'mm/yyyy', 'mm. yyyy' are possible.
     */
    monthFormat: string | null;
    /**
     * Sets the alter-row of the grid (the function that alternates the colors of each row).
     */
    alterRow: boolean | null;
    /**
     * Sets the frozen columns of the grid. The number should be set by calculating the invisible columns as well.
     * (Column 1 is v-g-rownum, and column 2 is v-g-status. The user column starts from at least 3 columns.)
     */
    frozenColCount: number | null;
    /**
     * Sets the frozen rows of the grid.
     */
    frozenRowCount: number | null;
    /**
     * Indicates whether to use the sorting feature of the grid.
     */
    sortable: boolean | null;
    /**
     * Indicates whether to use the filtering feature of the grid.
     */
    filterable: boolean | null;
    /**
     * Indicates whether to use the feature that checks or unchecks the column checkboxes when double-clicking the header of a checkbox.
     */
    allCheckable: boolean | null;
    /**
     * The value a checkbox type cell has when checked.
     */
    checkedValue: string | null;
    /**
     * The value a checkbox type cell has when unchecked.
     */
    uncheckedValue: string | null;
}

/**
 * Default grid configuration values controlling functional behaviors of grids.
 * Reduces repetitive configuration in `<vanilla-grid>` elements.
 */
export interface DefaultGridInfo extends Omit<GridInfo, 'name'>{
}

/**
 * This is information about the grid CSS.
 */
export interface GridCssInfo {
    /**
     * The width of the grid. Insert cssText.
     */
    width: string | null;
    /**
     * The height of the grid. Insert cssText.
     */
    height: string | null;
    /**
     * The margin of the grid. Insert cssText.
     */
    margin: string | null;
    /**
     * The padding of the grid. Insert cssText.
     */
    padding: string | null;
    /**
     * Specifies the size level of the grid. Enter a positive integer. 5 is the standard ratio.
     */
    sizeLevel: number | null;
    /**
     * Sets the default vertical-align of the grid cell. Choose from 'top', 'center', 'bottom'.
     */
    verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom | string | null;
    /**
     * Specifies the default font-size of the grid cell. Enter a css text. The unit is px.
     */
    cellFontSize: string | null;
    /**
     * Specifies the default min-height of the grid cell. Enter a css text. The unit is px.
     */
    cellMinHeight: string | null;
    /**
     * Sets the horizontal border size of the grid cell. The unit is px. Enter 0 or a positive integer.
     */
    horizenBorderSize: number | null;
    /**
     * Sets the vertical border size of the grid cell. The unit is px. Enter 0 or a positive integer.
     */
    verticalBorderSize: number | null;
    /**
     * Sets the font-family of the grid cell. Enter the font-family in cssText.
     */
    gridFontFamily: string | null;
    /**
     * Sets the font-family of the grid editor. Enter the font-family in cssText.
     */
    editorFontFamily: string | null;
    /**
     * Sets the overflow-wrap of the grid cell. Enter the overflow-wrap in cssText.
     */
    overflowWrap: string | null;
    /**
     * Sets the word-break of the grid cell. Enter the word-break in cssText.
     */
    wordBreak: string | null;
    /**
     * Sets the white-space of the grid cell. Enter the white-space in cssText.
     */
    whiteSpace: string | null;
    /**
     * Indicates whether to display the underline for link type cells.
     */
    linkHasUnderLine: boolean | null;
    /**
     * Inverts the colors of the grid.
     */
    invertColor: boolean | null;
    /**
     * Sets the main color of the grid. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    color: string | null;
    /**
     * Sets the color set of the grid. Color sets are 'skyblue', 'blue', 'light-red', 'red', 'light-green', 'green', 'orange', 'yellow', 'purple', 'brown', 'black'.
     */
    colorSet: ColorSet.black
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
        | string | null;
    /**
     * Sets the border color of the grid. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    gridBorderColor: string | null;
    /**
     * Sets the background color of the header cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    headerCellBackColor: string | null;
    /**
     * Sets the border color of the header cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    headerCellBorderColor: string | null;
    /**
     * Sets the font color of the header cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    headerCellFontColor: string | null;
    /**
     * Sets the background color of the footer cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    footerCellBackColor: string | null;
    /**
     * Sets the border color of the footer cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    footerCellBorderColor: string | null;
    /**
     * Sets the font color of the footer cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    footerCellFontColor: string | null;
    /**
     * Sets the background color of the grid body. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    bodyBackColor: string | null;
    /**
     * Sets the background color of the grid body cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    bodyCellBackColor: string | null;
    /**
     * Sets the border color of the grid body cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    bodyCellBorderColor: string | null;
    /**
     * Sets the font color of the grid body cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    bodyCellFontColor: string | null;
    /**
     * Sets the background color of the editor. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    editorBackColor: string | null;
    /**
     * Sets the font color of the editor. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    editorFontColor: string | null;
    /**
     * Sets the background color of the selected cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    selectCellBackColor: string | null;
    /**
     * Sets the font color of the selected cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    selectCellFontColor: string | null;
    /**
     * Sets the background color of the selected column header. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    selectColBackColor: string | null;
    /**
     * Sets the font color of the selected column header. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    selectColFontColor: string | null;
    /**
     * Sets the background color of the selected row. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    selectRowBackColor: string | null;
    /**
     * Sets the font color of the selected row. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    selectRowFontColor: string | null;
    /**
     * Sets the background color of the mouseover cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    mouseoverCellBackColor: string | null;
    /**
     * Sets the font color of the mouseover cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    mouseoverCellFontColor: string | null;
    /**
     * Sets the background color of the locked cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    lockCellBackColor: string | null;
    /**
     * Sets the font color of the locked cell editor. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    lockCellFontColor: string | null;
    /**
     * Sets the background color of the alternate rows. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    alterRowBackColor: string | null;
    /**
     * Sets the font color of the alternate rows. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    alterRowFontColor: string | null;
    /**
     * Sets the font color of the button type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    buttonFontColor: string | null;
    /**
     * Sets the border color of the button type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    buttonBorderColor: string | null;
    /**
     * Sets the background color of the button type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    buttonBackColor: string | null;
    /**
     * Sets the font color of the button type cell on hover. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    buttonHoverFontColor: string | null;
    /**
     * Sets the background color of the button type cell on hover. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    buttonHoverBackColor: string | null;
    /**
     * Sets the font color of the button type cell on active. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    buttonActiveFontColor: string | null;
    /**
     * Sets the background color of the button type cell on active. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    buttonActiveBackColor: string | null;
    /**
     * Sets the font color of the link type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    linkFontColor: string | null;
    /**
     * Sets the font color of the link type cell on hover. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    linkHoverFontColor: string | null;
    /**
     * Sets the font color of the link type cell on active. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    linkActiveFontColor: string | null;
    /**
     * Sets the font color of the link type cell on visited. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    linkVisitedFontColor: string | null;
    /**
     * Sets the font color of the link type cell on focus. Enter the 16-digit color code in cssText. Ex) '#ffffff'
     */
    linkFocusFontColor: string | null;
}

/**
 * Default CSS configuration for grid styling.
 * Facilitates consistent UI across multiple grid instances.
 */
export interface DefaultGridCssInfo extends Omit<GridCssInfo, 'cellFontSize' |'cellMinHeight'>{
    /**
     * Specifies the default font-size of the grid cell. Enter a positive integer. The unit is px.
     */
    cellFontSize: number | null;
    /**
     * Specifies the default min-height of the grid cell. Enter a positive integer. The unit is px.
     */
    cellMinHeight: number | null;
}
