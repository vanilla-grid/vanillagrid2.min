import type { GridInfo } from "./gridInfo";
import type { ColInfo } from "./colInfo";
import type { CellData } from "./cell";
import { Align, ColorSet, SelectionPolicy, VerticalAlign } from "./enum";

/**
 * Provides various methods to manipulate and manage a Vanillagrid instance.
 * 
 * - This interface includes over 200 methods for handling grid structure, data,
 *   filtering, sorting, appearance, and user interactions.
 * - A `GridMethods` instance can be retrieved using `vg.get(gridId)`.
 * - It allows users to dynamically modify grid properties, update cell values,
 *   and customize the grid's behavior through predefined methods.
 * 
 * ### Key Features:
 * - Manage grid headers, footers, rows, and columns.
 * - Load and retrieve data as JSON.
 * - Apply filters, sorting, and styling dynamically.
 * - Control grid visibility, locking, and resizing.
 * - Undo and redo changes within the grid.
 * 
 * ### Example usage:
 * ```typescript
 * const grid = vg.get('gridId');
 * grid.setHeaderText('col1', 'New Header');
 * grid.setCellValue(1, 'col1', 'Updated Value');
 * ```
 */
export interface GridMethods {
    /**
     * Returns the number of header rows in the grid.
     * 
     * - Calculates the maximum header depth across all columns.
     * - Useful for determining the hierarchical structure of headers.
     * 
     * ### Example usage:
     * ```typescript
     * const rowCount = grid.getHeaderRowCount();
     * console.log(rowCount); // e.g., 2
     * ```
     * 
     * @returns The number of header rows.
     */
    getHeaderRowCount(): number;
    /**
     * Returns the header text of the specified column.
     * 
     * - Retrieves the header information for the given column index or column ID.
     * - If multiple header rows exist, the texts are concatenated using `';'`.
     * 
     * ### Example usage:
     * ```typescript
     * const headerText = grid.getHeaderText('col1');
     * console.log(headerText); // e.g., "Main Header;Sub Header"
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The concatenated header text.
     */
    getHeaderText(colIndexOrColId: number | string): string;
    /**
     * Sets the header text of the specified column.
     * 
     * - The `value` should be a `';'`-separated string representing multi-line headers.
     * - If the given value has fewer lines than the current header rows, empty strings are added.
     * - If the given value has more lines than the current header rows, additional rows are created.
     * - Reloads the header and filter values after updating.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setHeaderText('col1', 'Header1;Header2;Header3');
     * // The column 'col1' will have:
     * // - Row 1: "Header1"
     * // - Row 2: "Header2"
     * // - Row 3: "Header3"
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param value The new header text, separated by `';'` for multiple rows.
     * @returns `true` if the update is successful.
     */
    setHeaderText(colIndexOrColId: number | string, value: string): boolean;
    /**
     * Reloads all column filters in the grid.
     * 
     * - Refreshes the filter values for all columns.
     * - Typically used after modifying values programmatically to ensure filters reflect the latest data.
     * 
     * ### Example usage:
     * ```typescript
     * grid.reloadFilterValue();
     * ```
     * 
     * @returns `true` if the operation is successful.
     */
    reloadFilterValue(): boolean;
    /**
     * Reloads the filter for a specific column.
     * 
     * - Updates the filter values for the specified column index or column ID.
     * - Typically used after modifying values programmatically to ensure the filter is updated.
     * 
     * ### Example usage:
     * ```typescript
     * grid.reloadColFilter('col1');
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the operation is successful.
     */
    reloadColFilter(colIndexOrColId: number | string): boolean;
    /**
     * Returns the number of footer rows in the grid.
     * 
     * - Calculates the maximum footer depth across all columns.
     * - Useful for determining the hierarchical structure of footers.
     * 
     * ### Example usage:
     * ```typescript
     * const footerRowCount = grid.getFooterRowCount();
     * console.log(footerRowCount); // e.g., 2
     * ```
     * 
     * @returns The number of footer rows.
     */
    getFooterRowCount(): number;
    /**
     * Reloads all footer values in the grid.
     * 
     * - Updates the footer values for all columns.
     * - Typically used after modifying values programmatically to ensure footers reflect the latest data.
     * 
     * ### Example usage:
     * ```typescript
     * grid.reloadFooterValue();
     * ```
     * 
     * @returns `true` if the operation is successful.
     */
    reloadFooterValue(): boolean;
    /**
     * Sets the display value of a specific footer cell.
     * 
     * - Updates the visible value of the footer at the given row and column.
     * - This change may be overridden when the footer is reloaded.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setFooterValue(1, 'col1', 'Total: 100');
     * ```
     * 
     * @param row The footer row index.
     * @param colId The column index or column ID.
     * @param value The new footer display value.
     * @returns `true` if the update is successful.
     */
    setFooterValue(row: number, colIndexOrColId: number | string, value: string): boolean;
    /**
     * Returns the value of a specific footer cell.
     * 
     * - Retrieves the stored value of the footer at the given row and column.
     * 
     * ### Example usage:
     * ```typescript
     * const footerValue = grid.getFooterValue(1, 'col1');
     * console.log(footerValue); // e.g., "Total: 100"
     * ```
     * 
     * @param row The footer row index.
     * @param colId The column index or column ID.
     * @returns The footer value as a string.
     */
    getFooterValue(row: number, colIndexOrColId: number | string): string;
    /**
     * Sets the formula values for a specific column footer using a `';'`-separated string.
     * 
     * - The `formula` string should contain multiple formulas separated by `';'`.
     * - Reloads the footer after applying the formula.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setFooterFormula('col1', '$$MAX;$$MIN;$$SUM;$$AVG');
     * ```
     * 
     * @param colId The column index or column ID.
     * @param formula The `';'`-separated string of formulas to apply.
     * @returns `true` if the update is successful.
     */
    setFooterFormula(colIndexOrColId: number | string, formula: string): boolean;
    /**
     * Returns the formula values defined for a specific column footer as a `';'`-separated string.
     * 
     * - If a formula is a function, it is replaced with `$$FUNC` in the returned string.
     * - Returns `null` if no formulas are defined.
     * 
     * ### Example usage:
     * ```typescript
     * const footerFormula = grid.getFooterFormula('col1');
     * console.log(footerFormula); // e.g., "SUM(A1:A10);AVG(A1:A10)"
     * ```
     * 
     * @param colId The column index or column ID.
     * @returns A `';'`-separated string of footer formulas, or `null` if none exist.
     */
    getFooterFormula(colIndexOrColId: number | string): string | null;
    /**
     * Defines a function for a specific footer cell.
     * 
     * - Sets a custom function for the footer at the given row and column.
     * - The function receives the grid's `getValues()` result as a parameter.
     * - Reloads the footer after setting the function.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setFooterFunction(1, 'col1', function(values) {
     *     return values.length ? values.reduce((sum, v) => sum + v, 0) : 0;
     * });
     * ```
     * 
     * @param row The footer row index.
     * @param colId The column index or column ID.
     * @param func The function to apply to the footer cell.
     * @returns `true` if the update is successful.
     */
    setFooterFunction(row: number, colIndexOrColId: number | string, func: Function): boolean;
    /**
     * Returns the information of the current grid.
     * 
     * - Retrieves various properties related to the grid, excluding the internal `type` field.
     * - Returns a deep-copied object to prevent unintended modifications.
     * - Includes grid ID and CSS-related information.
     * 
     * ### Example usage:
     * ```typescript
     * const gridInfo = grid.getGridInfo();
     * console.log(gridInfo);
     * ```
     * 
     * @returns An object containing the grid's information.
     */
    getGridInfo(): GridInfo;
    /**
     * Loads data into the grid.
     * 
     * - Accepts data in two formats:
     *   - **Key-Value Format**: An array of objects where keys are column IDs.
     *   - **Datas Format**: A nested array where each cell contains an object with `id` and `value`.
     * - Clears existing grid data before loading new data.
     * 
     * ### Example usage:
     * ```typescript
     * // Key-Value format
     * grid.load([
     *     { col1: 'value1-1', col2: 'value1-2' },
     *     { col1: 'value2-1', col2: 'value2-2' }
     * ]);
     * 
     * // Datas format
     * grid.load([
     *     [{ id: 'col1', value: 'value1-1' }, { id: 'col2', value: 'value1-2' }],
     *     [{ id: 'col1', value: 'value2-1' }, { id: 'col2', value: 'value2-2' }]
     * ]);
     * ```
     * 
     * @param keyValueOrDatas The data to load, in key-value or datas format.
     * @returns `true` if the data is successfully loaded.
     */
    load(keyValueOrDatas: Record<string, any> | Record<string, any>[]): boolean;
    /**
     * Clears all data from the grid.
     * 
     * - Removes all child elements from the grid body.
     * - Resets sorting and filtering variables.
     * - Calls an internal method to clear additional grid-related data.
     * 
     * ### Example usage:
     * ```typescript
     * grid.clear();
     * ```
     * 
     * @returns `true` if the operation is successful.
     */
    clear(): boolean;
    /**
     * Resets all status columns (`v-g-status`) in the grid.
     * 
     * - Sets the value of each status cell to `null`.
     * - Reconnects the cell elements to ensure updates are reflected.
     * 
     * ### Example usage:
     * ```typescript
     * grid.clearStatus();
     * ```
     * 
     * @returns `true` if the operation is successful.
     */
    clearStatus(): boolean;
    /**
     * Returns the number of data rows in the grid.
     * 
     * - Counts the total number of rows currently stored in the grid body.
     * 
     * ### Example usage:
     * ```typescript
     * const rowCount = grid.getRowCount();
     * console.log(rowCount); // e.g., 10
     * ```
     * 
     * @returns The number of data rows in the grid.
     */
    getRowCount(): number;
    /**
     * Returns the number of columns in the grid.
     * 
     * - Counts the total number of columns currently defined in the grid.
     * 
     * ### Example usage:
     * ```typescript
     * const colCount = grid.getColCount();
     * console.log(colCount); // e.g., 5
     * ```
     * 
     * @returns The number of columns in the grid.
     */
    getColCount(): number;
    /**
     * Returns grid data in key-value format.
     * 
     * - Each row is represented as an object where keys are column IDs and values are cell data.
     * - Uses deep copy to prevent unintended modifications to the original data.
     * 
     * ### Example usage:
     * ```typescript
     * const values = grid.getValues();
     * console.log(values);
     * // Output:
     * // [
     * //   { col1: 'value1-1', col2: 'value1-2' },
     * //   { col1: 'value2-1', col2: 'value2-2' }
     * // ]
     * ```
     * 
     * @returns An array of objects representing grid data in key-value format.
     */
    getValues(): Record<string, any>[];
    /**
     * Returns grid data in the datas format.
     * 
     * - Each row is an array of objects where each object contains column ID and cell value.
     * - Includes additional cell-related information beyond just values.
     * 
     * ### Example usage:
     * ```typescript
     * const datas = grid.getDatas();
     * console.log(datas);
     * // Output:
     * // [
     * //   [{ id: 'col1', value: 'value1-1' }, { id: 'col2', value: 'value1-2' }],
     * //   [{ id: 'col1', value: 'value2-1' }, { id: 'col2', value: 'value2-2' }]
     * // ]
     * ```
     * 
     * @returns A nested array representing grid data, where each row contains an array of cell objects.
     */
    getDatas(): CellData[][];
    /**
     * Sorts the grid data by the specified column.
     * 
     * - Supports both ascending and descending order.
     * - If `isNumSort` is `true`, values are sorted numerically even if they are stored as strings.
     * - Reloads the grid with sorted data while preserving the previous sort toggle state.
     * 
     * ### Example usage:
     * ```typescript
     * grid.sort('col1', false, true);
     * // Sorts 'col1' in descending order with numeric sorting.
     * ```
     * 
     * @param colId The column ID to sort by.
     * @param isAsc `true` for ascending order, `false` for descending order (default: `true`).
     * @param isNumSort `true` to sort numerically, `false` for string-based sorting (default: `false`).
     * @returns `true` if the sorting operation is successful.
     */
    sort(colId: string, isAsc?: boolean, isNumSort?: boolean): boolean;
    /**
     * Checks if all required cells have valid values.
     * 
     * - Iterates through all cells to find required (`cRequired: true`) cells with `null` or empty values.
     * - If a required cell is empty, the provided `func` is called with the cell's `getCellData()` result.
     * - If no `func` is provided, it triggers the default validation function (`vg.checkRequiredFunction`).
     * - If at least one required cell is empty, the function returns `false`.
     * 
     * ### Example usage:
     * ```typescript
     * grid.checkRequired(function(cellData) {
     *     alert('Please enter the information for ' + cellData.row + ' row, ' + cellData.name + ' column.')
     * });
     * ```
     * 
     * @param func A user-defined function to handle empty required cells. Defaults to the system validation function if not provided.
     * @returns `true` if all required cells have valid values, otherwise `false`.
     */
    checkRequired(func: Function): boolean;
    /**
     * Controls whether the grid should be re-mounted after modifications.
     * 
     * - When `isDrawable` is `false`, the grid is not re-mounted after each modification, reducing system load.
     * - When `isDrawable` is `true`, all pending changes are applied, and the grid is fully reloaded.
     * - Useful for optimizing performance when making multiple updates, such as adding or modifying rows.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridMount(false); // Temporarily disable grid re-mounting.
     * grid.addRow({ col1: 'value1', col2: 'value2' });
     * grid.addRow({ col1: 'value3', col2: 'value4' });
     * grid.setGridMount(true); // Apply all changes and re-mount the grid.
     * ```
     * 
     * @param isDrawable `true` to enable automatic re-mounting, `false` to disable it.
     * @returns `true` if the operation is successful.
     */
    setGridMount(isDrawable: boolean): boolean;
    /**
     * Returns the currently applied filter values.
     * 
     * - Retrieves the active filter settings from the grid.
     * - The returned data structure depends on how filters are defined in `_filters`.
     * 
     * ### Example usage:
     * ```typescript
     * const filters = grid.getGridFilter();
     * console.log(filters);
     * ```
     * 
     * @returns An array of objects representing the current filter settings.
     */
    getGridFilter(): Record<string, any>[];
    /**
     * Sets the width of the grid.
     * 
     * - The width should be specified as a valid CSS text value (e.g., `"100%"`, `"800px"`).
     * - Updates the grid's `cssInfo.width` property and applies the new style.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridWidth('100%'); // Sets the grid width to 100% of its container.
     * ```
     * 
     * @param cssTextWidth The CSS width value (e.g., `"100%"`, `"800px"`).
     * @returns `true` if the operation is successful.
     * @throws An error if `cssTextWidth` is not provided.
     */
    setGridWidth(cssTextWidth: string): boolean;
    /**
     * Sets the height of the grid.
     * 
     * - The height should be specified as a valid CSS text value (e.g., `"900px"`, `"100vh"`).
     * - Updates the grid's `cssInfo.height` property and applies the new style.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridHeight('900px'); // Sets the grid height to 900px.
     * ```
     * 
     * @param cssTextHeight The CSS height value (e.g., `"900px"`, `"100vh"`).
     * @returns `true` if the operation is successful.
     * @throws An error if `cssTextHeight` is not provided.
     */
    setGridHeight(cssTextHeight: string): boolean;
    /**
     * Sets the size level of the grid.
     * 
     * - The `sizeLevel` determines the font size and cell height based on a scaling formula.
     * - A value of `5` represents the default scale.
     * - The provided value must be a positive integer.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridSizeLevel(5); // Sets the grid to the standard size level.
     * ```
     * 
     * @param sizeLevel A positive integer representing the grid size level.
     * @returns `true` if the operation is successful.
     * @throws An error if `sizeLevel` is not a valid number.
     */
    setGridSizeLevel(sizeLevel: number): void;
    /**
     * Sets the default vertical alignment for grid cells.
     * 
     * - The alignment must be one of `'top'`, `'center'`, or `'bottom'`.
     * - Updates the grid's vertical alignment style and applies the new settings.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridVerticalAlign(VerticalAlign.CENTER); // Sets vertical alignment to center.
     * ```
     * 
     * @param verticalAlign The vertical alignment (`'top'`, `'center'`, or `'bottom'`).
     * @returns `true` if the operation is successful.
     * @throws An error if `verticalAlign` is not provided or invalid.
     */
    setGridVerticalAlign(verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom): boolean;
    /**
     * Sets the default font size for grid cells.
     * 
     * - The font size should be specified as a valid CSS text value (e.g., `"1.2em"`, `"14px"`).
     * - Updates the grid's `cssInfo.cellFontSize` property and applies the new style.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setCellFontSize('1.2em'); // Sets the font size of grid cells to 1.2em.
     * ```
     * 
     * @param cssTextFontSize The CSS font size value (e.g., `"1.2em"`, `"14px"`).
     * @returns `true` if the operation is successful.
     * @throws An error if `cssTextFontSize` is not provided.
     */
    setCellFontSize(cssTextFontSize: string): boolean;
    /**
     * Sets the minimum height for grid cells.
     * 
     * - The height should be specified as a valid CSS text value (e.g., `"18px"`, `"1.5rem"`).
     * - Updates the grid's `cssInfo.cellMinHeight` property and applies the new style.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setCellMinHeight('18px'); // Sets the minimum height of grid cells to 18px.
     * ```
     * 
     * @param cssTextMinHeight The CSS min-height value (e.g., `"18px"`, `"1.5rem"`).
     * @returns `true` if the operation is successful.
     * @throws An error if `cssTextMinHeight` is not provided.
     */
    setCellMinHeight(cssTextMinHeight: string): boolean;
    /**
     * Sets the horizontal border size for grid cells.
     * 
     * - The value should be a non-negative integer representing pixel size.
     * - Updates the grid's `cssInfo.horizenBorderSize` property and applies the new style.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setHorizenBorderSize(2); // Sets the horizontal border size to 2px.
     * ```
     * 
     * @param pxHorizenBorderSize The horizontal border size in pixels (0 or a positive integer).
     * @returns `true` if the operation is successful.
     * @throws An error if `pxHorizenBorderSize` is not a valid non-negative integer.
     */
    setHorizenBorderSize(pxHorizenBorderSize: number): boolean;
    /**
     * Sets the vertical border size for grid cells.
     * 
     * - The value should be a non-negative integer representing pixel size.
     * - Updates the grid's `cssInfo.verticalBorderSize` property and applies the new style.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setVerticalBorderSize(2); // Sets the vertical border size to 2px.
     * ```
     * 
     * @param pxVerticalBorderSize The vertical border size in pixels (0 or a positive integer).
     * @returns `true` if the operation is successful.
     * @throws An error if `pxVerticalBorderSize` is not a valid non-negative integer.
     */
    setVerticalBorderSize(pxVerticalBorderSize: number): boolean;
    /**
     * Sets the main color of the grid.
     * 
     * - The color should be specified as a valid 6-digit hexadecimal string (e.g., `"#ffffff"`).
     * - Updates the grid's `cssInfo.color` property and applies the corresponding grid color scheme.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridColor('#ff5733'); // Sets the grid's main color to a shade of orange.
     * ```
     * 
     * @param cssTextHexColor A valid hexadecimal color code (e.g., `"#ffffff"`).
     * @returns `true` if the operation is successful.
     * @throws An error if `cssTextHexColor` is not a valid 6-digit hexadecimal color.
     */
    setGridColor(cssTextHexColor: string): boolean;
    /**
     * Sets the grid's color using a predefined color set.
     * 
     * - Accepts a color name from the predefined set.
     * - Updates the grid's `cssInfo.color` property based on the selected color.
     * - Applies the corresponding grid color scheme.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridColorSet('skyblue'); // Sets the grid color to sky blue.
     * ```
     * 
     * @param colorName A valid color name from the predefined set (`'skyblue'`, `'blue'`, `'light-red'`, `'red'`, `'light-green'`, `'green'`, `'orange'`, `'yellow'`, `'purple'`, `'brown'`, `'black'`).
     * @returns `true` if the operation is successful.
     */
    setGridColorSet(colorSetName: ColorSet.black
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
        | string | null): boolean;
    /**
     * Inverts the grid's color scheme.
     * 
     * - Can be used for dark mode or other theme variations.
     * - If `doInvert` is `true`, applies an inverted color scheme.
     * - If `doInvert` is `false`, restores the default color scheme.
     * 
     * ### Example usage:
     * ```typescript
     * grid.invertColor(true); // Enables dark mode or inverted colors.
     * grid.invertColor(false); // Restores the original color scheme.
     * ```
     * 
     * @param doInvert `true` to invert colors, `false` to restore the default color scheme.
     * @returns `true` if the operation is successful.
     */
    invertColor(doInvert: boolean): boolean;
    /**
     * Sets the name of the grid.
     * 
     * - Assigns a custom name to the grid for identification purposes.
     * - The name is stored in the grid's `info.gName` property.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridName('EmployeeGrid'); // Sets the grid name to 'EmployeeGrid'.
     * ```
     * 
     * @param gridName The name to assign to the grid.
     * @returns `true` if the operation is successful.
     * @throws An error if `gridName` is not provided.
     */
    setGridName(gridName: string): boolean;
    /**
     * Returns the name of the grid.
     * 
     * - Retrieves the grid's name stored in `info.gName`.
     * 
     * ### Example usage:
     * ```typescript
     * const gridName = grid.getGridName();
     * console.log(gridName); // e.g., 'EmployeeGrid'
     * ```
     * 
     * @returns The name of the grid as a string.
     */
    getGridName(): string;
    /**
     * Sets the locked state of the grid.
     * 
     * - When `isLocked` is `true`, the grid becomes read-only, preventing modifications.
     * - Applies the lock state to all columns except the first two.
     * - Reloads the grid data after updating the lock state.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridLocked(true); // Locks the grid to prevent modifications.
     * grid.setGridLocked(false); // Unlocks the grid to allow changes.
     * ```
     * 
     * @param isLocked `true` to lock the grid, `false` to unlock it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isLocked` is not a boolean.
     */
    setGridLocked(isLocked: boolean): boolean;
    /**
     * Checks whether the grid is locked.
     * 
     * - Returns `true` if the grid is in a locked state, preventing modifications.
     * - Returns `false` if the grid is unlocked and editable.
     * 
     * ### Example usage:
     * ```typescript
     * const isLocked = grid.isGridLocked();
     * console.log(isLocked); // e.g., true or false
     * ```
     * 
     * @returns `true` if the grid is locked, otherwise `false`.
     */
    isGridLocked(): boolean;
    /**
     * Sets the locked color state for the grid.
     * 
     * - When `isLockedColor` is `true`, locked cells are visually distinguished using a locked color.
     * - Applies the lock color state to all columns except the first two.
     * - Reloads the grid data after updating the locked color state.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridLockedColor(true); // Applies locked color to locked cells.
     * grid.setGridLockedColor(false); // Removes locked color from locked cells.
     * ```
     * 
     * @param isLockedColor `true` to enable locked color, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isLockedColor` is not a boolean.
     */
    setGridLockedColor(isLockedColor: boolean): boolean;
    /**
     * Sets whether the grid is resizable.
     * 
     * - When `isResizable` is `true`, columns can be resized by the user.
     * - When `isResizable` is `false`, column resizing is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridResizable(true); // Enables column resizing.
     * grid.setGridResizable(false); // Disables column resizing.
     * ```
     * 
     * @param isResizable `true` to allow resizing, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isResizable` is not a boolean.
     */
    setGridResizable(isResizable: boolean): boolean;
    /**
     * Checks whether the grid is resizable.
     * 
     * - Returns `true` if column resizing is enabled.
     * - Returns `false` if column resizing is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * const resizable = grid.isGridResizable();
     * console.log(resizable); // e.g., true or false
     * ```
     * 
     * @returns `true` if the grid is resizable, otherwise `false`.
     */
    isGridResizable(): void;
    /**
     * Sets the record count for redo and undo actions in the grid.
     * 
     * - Determines the number of changes stored for redo/undo functionality.
     * - The value must be a non-negative integer.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridRecordCount(10); // Sets the redo/undo record count to 10.
     * ```
     * 
     * @param recordCount The number of redo/undo actions to store (must be 0 or a positive integer).
     * @returns `true` if the operation is successful.
     * @throws An error if `recordCount` is not a valid non-negative integer.
     */
    setGridRecordCount(recordCount: number): boolean;
    /**
     * Returns the record count for redo and undo actions in the grid.
     * 
     * - Indicates the number of changes stored for redo/undo functionality.
     * 
     * ### Example usage:
     * ```typescript
     * const recordCount = grid.getGridRecordCount();
     * console.log(recordCount); // e.g., 10
     * ```
     * 
     * @returns The number of redo/undo actions stored.
     */
    getGridRecordCount(): number;
    /**
     * Enables or disables redo and undo functionality in the grid.
     * 
     * - When `isRedoable` is `true`, redo and undo actions are allowed.
     * - When `isRedoable` is `false`, redo and undo actions are disabled.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridRedoable(true); // Enables redo/undo functionality.
     * grid.setGridRedoable(false); // Disables redo/undo functionality.
     * ```
     * 
     * @param isRedoable `true` to enable redo/undo, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isRedoable` is not a boolean.
     */
    setGridRedoable(isRedoable: boolean): boolean;
    /**
     * Checks whether redo and undo functionality is enabled in the grid.
     * 
     * - Returns `true` if redo/undo actions are allowed.
     * - Returns `false` if redo/undo actions are disabled.
     * 
     * ### Example usage:
     * ```typescript
     * const redoable = grid.isGridRedoable();
     * console.log(redoable); // e.g., true or false
     * ```
     * 
     * @returns `true` if redo/undo functionality is enabled, otherwise `false`.
     */
    isGridRedoable(): boolean;
    /**
     * Sets the visibility of the grid.
     * 
     * - When `isVisible` is `true`, the grid is displayed.
     * - When `isVisible` is `false`, the grid is hidden.
     * - Updates the grid's CSS style accordingly.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridVisible(true); // Makes the grid visible.
     * grid.setGridVisible(false); // Hides the grid.
     * ```
     * 
     * @param isVisible `true` to show the grid, `false` to hide it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isVisible` is not a boolean.
     */
    setGridVisible(isVisible: boolean): boolean;
    /**
     * Checks whether the grid is visible.
     * 
     * - Returns `true` if the grid is currently displayed.
     * - Returns `false` if the grid is hidden.
     * 
     * ### Example usage:
     * ```typescript
     * const isVisible = grid.isGridVisible();
     * console.log(isVisible); // e.g., true or false
     * ```
     * 
     * @returns `true` if the grid is visible, otherwise `false`.
     */
    isGridVisible(): boolean;
    /**
     * Sets the visibility of the grid header.
     * 
     * - When `isVisible` is `true`, the grid header is displayed.
     * - When `isVisible` is `false`, the grid header is hidden.
     * - Updates the grid's CSS style accordingly.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setHeaderVisible(true); // Makes the grid header visible.
     * grid.setHeaderVisible(false); // Hides the grid header.
     * ```
     * 
     * @param isVisible `true` to show the grid header, `false` to hide it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isVisible` is not a boolean.
     */
    setHeaderVisible(isVisible: boolean): boolean;
    /**
     * Checks whether the grid header is visible.
     * 
     * - Returns `true` if the grid header is currently displayed.
     * - Returns `false` if the grid header is hidden.
     * 
     * ### Example usage:
     * ```typescript
     * const isHeaderVisible = grid.isHeaderVisible();
     * console.log(isHeaderVisible); // e.g., true or false
     * ```
     * 
     * @returns `true` if the grid header is visible, otherwise `false`.
     */
    isHeaderVisible(): boolean;
    /**
     * Sets whether the row number column should display a locked color.
     * 
     * - When `isRownumLockedColor` is `true`, the row number column applies a locked color.
     * - Updates the locked color property for the row number column.
     * - Reconnects affected row elements to apply changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridRownumLockedColor(true); // Enables locked color for the row number column.
     * grid.setGridRownumLockedColor(false); // Disables locked color for the row number column.
     * ```
     * 
     * @param isRownumLockedColor `true` to enable locked color, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isRownumLockedColor` is not a boolean.
     */
    setGridRownumLockedColor(isRownumLockedColor: boolean): boolean;
    /**
     * Checks whether the row number column is using a locked color.
     * 
     * - Returns `true` if the row number column applies a locked color.
     * - Returns `false` if the row number column does not use a locked color.
     * 
     * ### Example usage:
     * ```typescript
     * const isRownumLockedColor = grid.isGridRownumLockedColor();
     * console.log(isRownumLockedColor); // e.g., true or false
     * ```
     * 
     * @returns `true` if the row number column applies a locked color, otherwise `false`.
     */
    isGridRownumLockedColor(): boolean;
    /**
     * Sets the size of the row number column.
     * 
     * - The size should be specified in pixels as a positive integer.
     * - Adjusts the column width and updates visibility based on the provided size.
     * - A value of `0` hides the row number column.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridRownumSize(40); // Sets the row number column width to 40px.
     * ```
     * 
     * @param rownumSize The size of the row number column in pixels (must be a positive integer).
     * @returns `true` if the operation is successful.
     * @throws An error if `rownumSize` is not a valid positive integer.
     */
    setGridRownumSize(rownumSize: number): boolean;
    /**
     * Returns the currently set row number column size.
     * 
     * - Retrieves the width of the row number column in its originally defined unit.
     * 
     * ### Example usage:
     * ```typescript
     * const rownumSize = grid.getGridRownumSize();
     * console.log(rownumSize); // e.g., "40px"
     * ```
     * 
     * @returns The row number column size as a string with its unit (e.g., `"40px"`).
     */
    getGridRownumSize(): string;
    /**
     * Sets whether the status column should display a locked color.
     * 
     * - When `isStatusLockedColor` is `true`, the status column applies a locked color.
     * - Updates the locked color property for the status column.
     * - Reconnects affected row elements to apply changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridStatusLockedColor(true); // Enables locked color for the status column.
     * grid.setGridStatusLockedColor(false); // Disables locked color for the status column.
     * ```
     * 
     * @param isStatusLockedColor `true` to enable locked color, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isStatusLockedColor` is not a boolean.
     */
    setGridStatusLockedColor(isStatusLockedColor: boolean): boolean;
    /**
     * Checks whether the status column is using a locked color.
     * 
     * - Returns `true` if the status column applies a locked color.
     * - Returns `false` if the status column does not use a locked color.
     * 
     * ### Example usage:
     * ```typescript
     * const isStatusLockedColor = grid.isGridStatusLockedColor();
     * console.log(isStatusLockedColor); // e.g., true or false
     * ```
     * 
     * @returns `true` if the status column applies a locked color, otherwise `false`.
     */
    isGridStatusLockedColor(): boolean;
    /**
     * Sets the selection policy for the grid.
     * 
     * - Determines how cells can be selected within the grid.
     * - Available policies:
     *   - `'range'`: Allows selecting a range of cells.
     *   - `'single'`: Allows selecting a single cell at a time.
     *   - `'none'`: Disables cell selection.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridSelectionPolicy(SelectionPolicy.range); // Enables range selection.
     * grid.setGridSelectionPolicy(SelectionPolicy.single); // Enables single-cell selection.
     * grid.setGridSelectionPolicy(SelectionPolicy.none); // Disables selection.
     * ```
     * 
     * @param selectionPolicy The selection policy (`'range'`, `'single'`, or `'none'`).
     * @returns `true` if the operation is successful.
     * @throws An error if `selectionPolicy` is invalid.
     */
    setGridSelectionPolicy(selectionPolicy: SelectionPolicy.range | SelectionPolicy.single | SelectionPolicy.none): boolean;
    /**
     * Returns the selection policy set for the grid.
     * 
     * - Possible return values:
     *   - `'range'`: Allows selecting a range of cells.
     *   - `'single'`: Allows selecting a single cell at a time.
     *   - `'none'`: Disables cell selection.
     * 
     * ### Example usage:
     * ```typescript
     * const selectionPolicy = grid.getGridSelectionPolicy();
     * console.log(selectionPolicy); // e.g., 'range', 'single', or 'none'
     * ```
     * 
     * @returns The current selection policy (`'range'`, `'single'`, or `'none'`).
     */
    getGridSelectionPolicy(): string;
    /**
     * Sets the value to be used as the grid's null representation.
     * 
     * - Defines how `null` values should be stored and displayed within the grid.
     * - Reconnects grid body cells to apply the change.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridNullValue('-'); // Sets '-' as the null value representation.
     * ```
     * 
     * @param nullValue The value to be used for null representation.
     * @returns `true` if the operation is successful.
     */
    setGridNullValue(nullValue: any): boolean;
    /**
     * Returns the currently set null value representation in the grid.
     * 
     * - Retrieves the value used to represent `null` in the grid.
     * - Returns a deep copy to prevent unintended modifications.
     * 
     * ### Example usage:
     * ```typescript
     * const nullValue = grid.getGridNullValue();
     * console.log(nullValue); // e.g., '-'
     * ```
     * 
     * @returns The current null value representation.
     */
    getGridNullValue(): any;
    /**
     * Sets the date format for the grid.
     * 
     * - Defines how dates should be displayed in the grid.
     * - Reconnects grid body cells to apply the new format.
     * - Supported formats:
     *   - `'yyyy-mm-dd'`, `'yyyy/mm/dd'`, `'yyyy. mm. dd'`, `'yyyymmdd'`
     *   - `'mm-dd-yyyy'`, `'mm/dd/yyyy'`, `'mm. dd. yyyy'`, `'mmddyyyy'`
     *   - `'dd-mm-yyyy'`, `'dd/mm/yyyy'`, `'dd. mm. yyyy'`, `'ddmmyyyy'`
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridDateFormat('yyyy-mm-dd'); // Sets the date format to 'yyyy-mm-dd'.
     * ```
     * 
     * @param dateFormat The date format to apply.
     * @returns `true` if the operation is successful.
     */
    setGridDateFormat(dateFormat: string): boolean;
    /**
     * Returns the currently set date format in the grid.
     * 
     * - Retrieves the date format used to display dates in the grid.
     * 
     * ### Example usage:
     * ```typescript
     * const dateFormat = grid.getGridDateFormat();
     * console.log(dateFormat); // e.g., 'yyyy-mm-dd'
     * ```
     * 
     * @returns The current date format as a string.
     */
    getGridDateFormat(): string;
    /**
     * Sets the month format for the grid.
     * 
     * - Defines how months should be displayed in the grid.
     * - Reconnects grid body cells to apply the new format.
     * - Supported formats:
     *   - `'yyyymm'`, `'yyyy-mm'`, `'yyyy/mm'`, `'yyyy. mm'`
     *   - `'mmyyyy'`, `'mm-yyyy'`, `'mm/yyyy'`, `'mm. yyyy'`
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridMonthFormat('yyyy-mm'); // Sets the month format to 'yyyy-mm'.
     * ```
     * 
     * @param monthFormat The month format to apply.
     * @returns `true` if the operation is successful.
     */
    setGridMonthFormat(monthFormat: string): boolean;
    /**
     * Returns the currently set month format in the grid.
     * 
     * - Retrieves the month format used to display months in the grid.
     * 
     * ### Example usage:
     * ```typescript
     * const monthFormat = grid.getGridMonthFormat();
     * console.log(monthFormat); // e.g., 'yyyy-mm'
     * ```
     * 
     * @returns The current month format as a string.
     */
    getGridMonthFormat(): string;
    /**
     * Sets the alternating row color feature for the grid.
     * 
     * - When `isAlterRow` is `true`, rows are displayed with alternating colors.
     * - When `isAlterRow` is `false`, all rows have the same background color.
     * - Reconnects grid body cells to apply the changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridAlterRow(true); // Enables alternating row colors.
     * grid.setGridAlterRow(false); // Disables alternating row colors.
     * ```
     * 
     * @param isAlterRow `true` to enable alternating row colors, `false` to disable.
     * @returns `true` if the operation is successful.
     * @throws An error if `isAlterRow` is not a boolean.
     */
    setGridAlterRow(isAlterRow: boolean): boolean;
    /**
     * Sets the number of frozen (fixed) columns in the grid.
     * 
     * - The value must be `0` or a positive integer.
     * - Cannot be used together with `frozenRowCount`.
     * - Can only be applied when all column widths are defined in `px`, not `%`.
     * - Reloads the grid header, footer, and data after setting.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridFrozenColCount(2); // Freezes the first two columns.
     * ```
     * 
     * @param frozenColCount The number of columns to freeze (must be `0` or a positive integer).
     * @returns `true` if the operation is successful.
     * @throws An error if a column has a `%` width or `frozenRowCount` is set.
     */
    setGridFrozenColCount(frozenColCount: number): boolean;
    /**
     * Returns the number of frozen (fixed) columns in the grid.
     * 
     * - Retrieves the number of columns that are set as frozen.
     * 
     * ### Example usage:
     * ```typescript
     * const frozenColCount = grid.getGridFrozenColCount();
     * console.log(frozenColCount); // e.g., 2
     * ```
     * 
     * @returns The number of frozen columns.
     */
    getGridFrozenColCount(): number;
    /**
     * Sets the number of frozen (fixed) rows in the grid.
     * 
     * - The value must be `0` or a positive integer.
     * - Cannot be used together with `frozenColCount`.
     * - Reloads the grid header, footer, and data after setting.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridFrozenRowCount(2); // Freezes the first two rows.
     * ```
     * 
     * @param frozenRowCount The number of rows to freeze (must be `0` or a positive integer).
     * @returns `true` if the operation is successful.
     */
    setGridFrozenRowCount(frozenRowCount: number): boolean;
    /**
     * Returns the number of frozen (fixed) rows in the grid.
     * 
     * - Retrieves the number of rows that are set as frozen.
     * 
     * ### Example usage:
     * ```typescript
     * const frozenRowCount = grid.getGridFrozenRowCount();
     * console.log(frozenRowCount); // e.g., 2
     * ```
     * 
     * @returns The number of frozen rows.
     */
    getGridFrozenRowCount(): number;
    /**
     * Enables or disables sorting functionality in the grid.
     * 
     * - When `isSortable` is `true`, sorting is allowed.
     * - When `isSortable` is `false`, sorting is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridSortable(true); // Enables sorting.
     * grid.setGridSortable(false); // Disables sorting.
     * ```
     * 
     * @param isSortable `true` to enable sorting, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isSortable` is not a boolean.
     */
    setGridSortable(isSortable: boolean): boolean;
    /**
     * Checks whether sorting functionality is enabled in the grid.
     * 
     * - Returns `true` if sorting is allowed.
     * - Returns `false` if sorting is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * const sortable = grid.isGridSortable();
     * console.log(sortable); // e.g., true or false
     * ```
     * 
     * @returns `true` if sorting is enabled, otherwise `false`.
     */
    isGridSortable(): boolean;
    /**
     * Enables or disables filtering functionality in the grid.
     * 
     * - When `isFilterable` is `true`, filtering is allowed.
     * - When `isFilterable` is `false`, filtering is disabled.
     * - Reloads the grid header, footer, and data after setting.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridFilterable(true); // Enables filtering.
     * grid.setGridFilterable(false); // Disables filtering.
     * ```
     * 
     * @param isFilterable `true` to enable filtering, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isFilterable` is not a boolean.
     */
    setGridFilterable(isFilterable: boolean): boolean;
    /**
     * Checks whether filtering functionality is enabled in the grid.
     * 
     * - Returns `true` if filtering is allowed.
     * - Returns `false` if filtering is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * const filterable = grid.isGridFilterable();
     * console.log(filterable); // e.g., true or false
     * ```
     * 
     * @returns `true` if filtering is enabled, otherwise `false`.
     */
    isGridFilterable(): boolean;
    /**
     * Enables or disables the ability to toggle all checkboxes in a column by double-clicking the header.
     * 
     * - When `isAllCheckable` is `true`, double-clicking the checkbox column header toggles all checkboxes.
     * - When `isAllCheckable` is `false`, this feature is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridAllCheckable(true); // Enables header double-click checkbox toggle.
     * grid.setGridAllCheckable(false); // Disables the feature.
     * ```
     * 
     * @param isAllCheckable `true` to enable the feature, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isAllCheckable` is not a boolean.
     */
    setGridAllCheckable(isAllCheckable: boolean): boolean;
    /**
     * Checks whether the grid allows toggling all checkboxes by double-clicking the header.
     * 
     * - Returns `true` if the feature is enabled.
     * - Returns `false` if the feature is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * const allCheckable = grid.isGridAllCheckable();
     * console.log(allCheckable); // e.g., true or false
     * ```
     * 
     * @returns `true` if the feature is enabled, otherwise `false`.
     */
    isGridAllCheckable(): boolean;
    /**
     * Sets the value representing a checked state for checkbox-type cells in the grid.
     * 
     * - The value must be a string.
     * - The checked value cannot be the same as the unchecked value.
     * - Updates existing checkbox cells with the new checked value.
     * - Reloads the grid header, footer, and data after applying the change.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridCheckedValue('Y'); // Sets the checked value to 'Y'.
     * ```
     * 
     * @param checkeValue The value representing a checked state.
     * @returns `true` if the operation is successful.
     * @throws An error if `checkeValue` is not a string or is the same as the unchecked value.
     */
    setGridCheckedValue(checkeValue: string): boolean;
    /**
     * Returns the value representing a checked state for checkbox-type cells in the grid.
     * 
     * - Retrieves the currently set checked value.
     * 
     * ### Example usage:
     * ```typescript
     * const checkedValue = grid.getGridCheckedValue();
     * console.log(checkedValue); // e.g., 'Y'
     * ```
     * 
     * @returns The current checked value as a string.
     */
    getGridCheckedValue(): string;
    /**
     * Sets the value representing an unchecked state for checkbox-type cells in the grid.
     * 
     * - The value must be a string.
     * - The unchecked value cannot be the same as the checked value.
     * - Updates existing checkbox cells with the new unchecked value.
     * - Reloads the grid header, footer, and data after applying the change.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setGridUncheckedValue('N'); // Sets the unchecked value to 'N'.
     * ```
     * 
     * @param unCheckedValue The value representing an unchecked state.
     * @returns `true` if the operation is successful.
     * @throws An error if `unCheckedValue` is not a string or is the same as the checked value.
     */
    setGridUncheckedValue(unCheckedValue: string): boolean;
    /**
     * Returns the value representing an unchecked state for checkbox-type cells in the grid.
     * 
     * - Retrieves the currently set unchecked value.
     * 
     * ### Example usage:
     * ```typescript
     * const uncheckedValue = grid.getGridUncheckedValue();
     * console.log(uncheckedValue); // e.g., 'N'
     * ```
     * 
     * @returns The current unchecked value as a string.
     */
    getGridUncheckedValue(): string;
    /**
     * Adds a new column to the grid at the specified position.
     * 
     * - The new column is inserted after the specified column ID or index.
     * - If the provided index is invalid, the column is added at the end.
     * - Cannot add a column between the row number and status columns.
     * - Updates column indices and reloads the grid header, footer, and data.
     * 
     * ### Example usage:
     * ```typescript
     * grid.addCol(2, { id: 'dept', header: '부서', name: '부서', dataType: 'mask', format: 'AAA99' });
     * ```
     * 
     * @param colIndexOrColId The column index or column ID where the new column will be inserted.
     * @param colInfo The column information object defining the new column.
     * @returns `true` if the operation is successful.
     * @throws An error if attempting to add a column between the row number and status columns.
     */
    addCol(colIndexOrColId: number | string, colInfo: ColInfo): boolean;
    /**
     * Removes a column from the grid.
     * 
     * - Deletes the column specified by its ID or index.
     * - Returns the values of the removed column before deletion.
     * - Cannot remove the row number or status columns.
     * - Updates column indices and reloads the grid header, footer, and data.
     * 
     * ### Example usage:
     * ```typescript
     * const removedValues = grid.removeCol('dept');
     * console.log(removedValues); // Returns an array of values from the removed column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID to remove.
     * @returns An array containing the values of the removed column.
     * @throws An error if attempting to remove the row number or status columns.
     */
    removeCol(colIndexOrColId: number | string): any[];
    /**
     * Updates the information of an existing column in the grid.
     * 
     * - The column to be updated is identified by `colInfo.id`.
     * - Only properties provided in `colInfo` will be updated, while others remain unchanged.
     * - Cannot modify the row number or status columns.
     * - Reloads the grid header, footer, and data after applying changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColInfo({ id: 'dept', header: '부서', name: '부서', dataType: 'text', format: 'AAA99' });
     * ```
     * 
     * @param colInfo An object containing the new column information.
     * @returns `true` if the operation is successful.
     * @throws An error if `colInfo` is invalid or if attempting to modify a restricted column.
     */
    setColInfo(colInfo: ColInfo): boolean;
    /**
     * Returns the information of a specific column.
     * 
     * - Retrieves the column properties, including ID, index, name, visibility, formatting, and alignment settings.
     * - The header and footer values are returned as `';'`-separated strings if multiple values exist.
     * - Returns a deep copy of array-based properties (`codes`, `filterValues`, `filterValue`) to prevent unintended modifications.
     * 
     * ### Example usage:
     * ```typescript
     * const colInfo = grid.getColInfo('dept');
     * console.log(colInfo);
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns A `ColInfo` object containing detailed column properties.
     */
    getColInfo(colIndexOrColId: number | string): ColInfo;
    /**
     * Returns the data objects for all cells in a specific column.
     * 
     * - Retrieves an array of `CellData` objects for the specified column.
     * - Each object contains detailed information about an individual cell.
     * 
     * ### Example usage:
     * ```typescript
     * const colDatas = grid.getColDatas('dept');
     * console.log(colDatas); // Array of cell data objects for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns An array of `CellData` objects representing the column's data.
     */
    getColDatas(colIndexOrColId: number | string): CellData[];
    /**
     * Sets the same value for all cells in a specific column.
     * 
     * - Updates all cells in the specified column with the given `value`.
     * - If `doRecord` is `true`, the changes are recorded for undo/redo functionality.
     * - If `doRecord` is `false`, the values are directly updated.
     * - Reloads the grid to apply changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColSameValue('dept', 'HR'); // Sets all values in the 'dept' column to 'HR'.
     * grid.setColSameValue(3, 100, true); // Sets all values in column index 3 to 100 with redo/undo recording.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param value The value to be set for all cells in the column.
     * @param doRecord `true` to record the change for undo/redo, `false` for direct modification (default: `false`).
     * @returns `true` if the operation is successful.
     */
    setColSameValue(colIndexOrColId: number | string, value: any, doRecord?: boolean) : boolean;
    /**
     * Returns an array of values from all cells in a specific column.
     * 
     * - Retrieves the `value` of each cell in the specified column.
     * - Returns a deep copy to prevent unintended modifications.
     * 
     * ### Example usage:
     * ```typescript
     * const colValues = grid.getColValues('dept');
     * console.log(colValues); // e.g., ['HR', 'Finance', 'Engineering']
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns An array containing the values of all cells in the column.
     */
    getColValues(colIndexOrColId: number | string): any[];
    /**
     * Returns an array of text values from all cells in a specific column.
     * 
     * - Retrieves the text representation of each cell in the specified column.
     * - Uses `getCellText()` to extract the display text.
     * 
     * ### Example usage:
     * ```typescript
     * const colTexts = grid.getColTexts('dept');
     * console.log(colTexts); // e.g., ['HR', 'Finance', 'Engineering']
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns An array containing the text values of all cells in the column.
     */
    getColTexts(colIndexOrColId: number | string): string[];
    /**
     * Checks whether all values in a specific column are unique.
     * 
     * - Compares all cell values in the column.
     * - If duplicate values exist, returns `false`; otherwise, returns `true`.
     * - For certain data types (`'select'`, `'checkbox'`, `'button'`, `'link'`), it checks the display text instead of the raw value.
     * 
     * ### Example usage:
     * ```typescript
     * const isUnique = grid.isColUnique('dept');
     * console.log(isUnique); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if all values in the column are unique, otherwise `false`.
     */
    isColUnique(colIndexOrColId: number | string): boolean;
    /**
     * Opens the filter dropdown for a specific column.
     * 
     * - Displays the filter UI for the specified column.
     * 
     * ### Example usage:
     * ```typescript
     * grid.openFilter('dept'); // Opens the filter for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the operation is successful.
     */
    openFilter(colIndexOrColId: number | string): boolean;
    /**
     * Closes the filter dropdown for a specific column.
     * 
     * - Hides the filter UI for the specified column.
     * 
     * ### Example usage:
     * ```typescript
     * grid.closeFilter('dept'); // Closes the filter for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the operation is successful.
     */
    closeFilter(colIndexOrColId: number | string): boolean;
    /**
     * Sets the filter option for a specific column.
     * 
     * - Updates the column filter to use the specified `filterValue`.
     * - Ensures `filterValue` exists within the predefined filter options.
     * - Applies the filter and updates the grid accordingly.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColFilterValue('dept', 'HR'); // Sets the filter for the 'dept' column to 'HR'.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param filterValue The filter option to be applied.
     * @returns `true` if the operation is successful.
     * @throws An error if `filterValue` is not a valid filter option.
     */
    setColFilterValue(colIndexOrColId: number | string, filterValue: string): boolean;
    /**
     * Returns the available filter values for a specific column.
     * 
     * - Retrieves all possible filter options for the specified column.
     * 
     * ### Example usage:
     * ```typescript
     * const filterValues = grid.getColFilterValues('dept');
     * console.log(filterValues); // e.g., ['HR', 'Finance', 'Engineering']
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns An array of strings representing the available filter values.
     */
    getColFilterValues(colIndexOrColId: number | string): string[];
    /**
     * Returns the currently set filter value for a specific column.
     * 
     * - Retrieves the current filter value applied to the specified column.
     * - If no filter value is set, it returns `null`.
     * 
     * ### Example usage:
     * ```typescript
     * const filterValue = grid.getColFilterValue('dept');
     * console.log(filterValue); // e.g., 'HR' or null if no filter is set.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The currently set filter value, or `null` if no filter is applied.
     */
    getColFilterValue(colIndexOrColId: number | string): string | null;
    /**
     * Returns the column ID for a specific column.
     * 
     * - Retrieves the `cId` property of the column, which represents its unique ID.
     * 
     * ### Example usage:
     * ```typescript
     * const colId = grid.getColId(2); // Returns the ID of the second column.
     * console.log(colId); // e.g., 'dept'
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The column ID (`cId`) of the specified column.
     */
    getColId(colIndexOrColId: number | string): string;
    /**
     * Returns the column index for a specific column.
     * 
     * - Retrieves the index of the column specified by its ID or index.
     * 
     * ### Example usage:
     * ```typescript
     * const colIndex = grid.getColIndex('dept'); // Returns the index of the 'dept' column.
     * console.log(colIndex); // e.g., 3
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The column index (`cIndex`) of the specified column.
     */
    getColIndex(colIndexOrColId: number | string): number;
    /**
     * Sets the name of a specific column.
     * 
     * - Updates the `cName` property of the column and applies the name to all cells in that column.
     * - The column name must be a valid string.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColName('dept', 'Department'); // Sets the column name of 'dept' to 'Department'.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param colName The new name for the column.
     * @returns `true` if the operation is successful.
     * @throws An error if `colName` is not provided or not a valid string.
     */
    setColName(colIndexOrColId: number | string, colName: string): boolean;
    /**
     * Returns the name of a specific column.
     * 
     * - Retrieves the `cName` property of the specified column.
     * 
     * ### Example usage:
     * ```typescript
     * const colName = grid.getColName('dept');
     * console.log(colName); // e.g., 'Department'
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The column name (`cName`) of the specified column.
     */
    getColName(colIndexOrColId: number | string): string;
    /**
     * Sets the untarget state for a specific column.
     * 
     * - When `isUntarget` is `true`, the column cannot be selected or interacted with.
     * - When `isUntarget` is `false`, the column can be targeted and selected.
     * - Updates the `cUntarget` property for all cells in the column.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColUntarget('dept', true); // Makes the 'dept' column untargeted (non-selectable).
     * grid.setColUntarget('dept', false); // Makes the 'dept' column selectable again.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isUntarget `true` to make the column untargeted, `false` to allow selection.
     * @returns `true` if the operation is successful.
     * @throws An error if `isUntarget` is not a boolean.
     */
    setColUntarget(colIndexOrColId: number | string, isUntarget: boolean): boolean;
    /**
     * Sets the row merge state for a specific column.
     * 
     * - When `isRowMerge` is `true`, the cells in the column are merged if their values, data type, and format are the same.
     * - When `isRowMerge` is `false`, row merging is disabled for the column.
     * - Reloads the grid data after applying the change to reflect the row merging.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColRowMerge('dept', true); // Enables row merge for the 'dept' column.
     * grid.setColRowMerge('dept', false); // Disables row merge for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isRowMerge `true` to enable row merging, `false` to disable.
     * @returns `true` if the operation is successful.
     * @throws An error if `isRowMerge` is not a boolean.
     */
    setColRowMerge(colIndexOrColId: number | string, isRowMerge: boolean): boolean;
    /**
     * Checks whether row merge is enabled for a specific column.
     * 
     * - Returns `true` if row merge is enabled for the specified column.
     * - Returns `false` if row merge is disabled for the column.
     * - Returns `null` if no row merge setting is available.
     * 
     * ### Example usage:
     * ```typescript
     * const isRowMerge = grid.isColRowMerge('dept');
     * console.log(isRowMerge); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if row merge is enabled, `false` if disabled, or `null` if no setting is found.
     */
    isColRowMerge(colIndexOrColId: number | string): boolean | null;
    /**
     * Sets the column merge state for a specific column.
     * 
     * - When `isColMerge` is `true`, the cells in the column are merged with the previous row if their values, data type, and format are the same.
     * - When `isColMerge` is `false`, column merging is disabled for the column.
     * - Reloads the grid data after applying the change to reflect the column merging.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColColMerge('dept', true); // Enables column merge for the 'dept' column.
     * grid.setColColMerge('dept', false); // Disables column merge for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isColMerge `true` to enable column merging, `false` to disable.
     * @returns `true` if the operation is successful.
     * @throws An error if `isColMerge` is not a boolean.
     */
    setColColMerge(colIndexOrColId: number | string, isColMerge: boolean): boolean;
    /**
     * Checks whether column merge is enabled for a specific column.
     * 
     * - Returns `true` if column merge is enabled for the specified column.
     * - Returns `false` if column merge is disabled for the column.
     * - Returns `null` if no column merge setting is found.
     * 
     * ### Example usage:
     * ```typescript
     * const isColMerge = grid.isColColMerge('dept');
     * console.log(isColMerge); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if column merge is enabled, `false` if disabled, or `null` if no setting is found.
     */
    isColColMerge(colIndexOrColId: number | string): boolean | null;
    /**
     * Sets the visibility of a specific column.
     * 
     * - When `isVisible` is `true`, the column is made visible.
     * - When `isVisible` is `false`, the column is hidden (i.e., `display: none`).
     * - Reloads the grid header and adjusts the column size after setting visibility.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColVisible('dept', true); // Makes the 'dept' column visible.
     * grid.setColVisible('dept', false); // Hides the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isVisible `true` to show the column, `false` to hide it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isVisible` is not a boolean.
     */
    setColVisible(colIndexOrColId: number | string, isVisible: boolean): boolean;
    /**
     * Checks whether a specific column is visible.
     * 
     * - Returns `true` if the column is visible.
     * - Returns `false` if the column is hidden (i.e., `display: none`).
     * 
     * ### Example usage:
     * ```typescript
     * const isVisible = grid.isColVisible('dept');
     * console.log(isVisible); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the column is visible, otherwise `false`.
     */
    isColVisible(colIndexOrColId: number | string): boolean;
    /**
     * Sets the required state for a specific column.
     * 
     * - When `isRequired` is `true`, the column becomes a required field.
     * - When `isRequired` is `false`, the column is no longer required.
     * - Enables validation of required fields using `checkRequired()`.
     * - Updates the `cRequired` property for all cells in the column.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColRequired('dept', true); // Makes the 'dept' column required.
     * grid.setColRequired('dept', false); // Makes the 'dept' column not required.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isRequired `true` to make the column required, `false` to make it optional.
     * @returns `true` if the operation is successful.
     * @throws An error if `isRequired` is not a boolean.
     */
    setColRequired(colIndexOrColId: number | string, isRequired: boolean): boolean;
    /**
     * Checks whether a specific column is required.
     * 
     * - Returns `true` if the column is marked as required.
     * - Returns `false` if the column is not required.
     * 
     * ### Example usage:
     * ```typescript
     * const isRequired = grid.isColRequired('dept');
     * console.log(isRequired); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the column is required, otherwise `false`.
     */
    isColRequired(colIndexOrColId: number | string): boolean;
    /**
     * Sets the resizable state for a specific column.
     * 
     * - When `isResizable` is `true`, the column width can be adjusted by the user.
     * - When `isResizable` is `false`, the column width is fixed and cannot be resized by the user.
     * - Reloads the grid header after applying the change.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColResizable('dept', true); // Makes the 'dept' column resizable.
     * grid.setColResizable('dept', false); // Makes the 'dept' column non-resizable.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isResizable `true` to allow resizing, `false` to prevent resizing.
     * @returns `true` if the operation is successful.
     * @throws An error if `isResizable` is not a boolean.
     */
    setColResizable(colIndexOrColId: number | string, isResizable: boolean): boolean;
    /**
     * Checks whether a specific column is resizable.
     * 
     * - Returns `true` if the column is resizable.
     * - Returns `false` if the column is not resizable.
     * 
     * ### Example usage:
     * ```typescript
     * const isResizable = grid.isColResizable('dept');
     * console.log(isResizable); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the column is resizable, otherwise `false`.
     */
    isColResizable(colIndexOrColId: number | string): boolean;
    /**
     * Sets the sortable state for a specific column.
     * 
     * - When `isSortable` is `true`, the column becomes sortable by the user.
     * - When `isSortable` is `false`, the column is not sortable.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColSortable('dept', true); // Makes the 'dept' column sortable.
     * grid.setColSortable('dept', false); // Disables sorting for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isSortable `true` to make the column sortable, `false` to disable sorting.
     * @returns `true` if the operation is successful.
     * @throws An error if `isSortable` is not a boolean.
     */
    setColSortable(colIndexOrColId: number | string, isSortable: boolean): boolean;
    /**
     * Checks whether a specific column is sortable.
     * 
     * - Returns `true` if the column is sortable.
     * - Returns `false` if the column is not sortable.
     * 
     * ### Example usage:
     * ```typescript
     * const isSortable = grid.isColSortable('dept');
     * console.log(isSortable); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the column is sortable, otherwise `false`.
     */
    isColSortable(colIndexOrColId: number | string): boolean;
    /**
     * Sets the filterable state for a specific column.
     * 
     * - When `isFilterable` is `true`, the column can be filtered.
     * - When `isFilterable` is `false`, the column's filter functionality is disabled.
     * - Reloads the grid header and filter values after applying the change.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColFilterable('dept', true); // Makes the 'dept' column filterable.
     * grid.setColFilterable('dept', false); // Disables filtering for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isFilterable `true` to make the column filterable, `false` to disable filtering.
     * @returns `true` if the operation is successful.
     * @throws An error if `isFilterable` is not a boolean.
     */
    setColFilterable(colIndexOrColId: number | string, isFilterable: boolean): boolean;
    /**
     * Checks whether a specific column is filterable.
     * 
     * - Returns `true` if the column can be filtered.
     * - Returns `false` if the column's filter functionality is disabled.
     * 
     * ### Example usage:
     * ```typescript
     * const isFilterable = grid.isColFilterable('dept');
     * console.log(isFilterable); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the column is filterable, otherwise `false`.
     */
    isColFilterable(colIndexOrColId: number | string): boolean;
    /**
     * Sets the original width for a specific column.
     * 
     * - The `originWidth` must be specified in either `px` or `%` units.
     * - The column's width is updated based on the specified value.
     * - If the width is set to `0`, the column is hidden.
     * - Reloads the grid header and adjusts the column size after setting the new width.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColOriginWidth('dept', '100px'); // Sets the width of the 'dept' column to 100px.
     * grid.setColOriginWidth('dept', '50%'); // Sets the width of the 'dept' column to 50%.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param originWidth The original width of the column, in `px` or `%` (e.g., `"100px"`, `"50%"`).
     * @returns `true` if the operation is successful.
     * @throws An error if the width unit is not `px` or `%`.
     */
    setColOriginWidth(colIndexOrColId: number | string, originWidth: string): boolean;
    /**
     * Returns the original width of a specific column.
     * 
     * - Retrieves the `cOriginWidth` property of the specified column, which represents its original width.
     * 
     * ### Example usage:
     * ```typescript
     * const originWidth = grid.getColOriginWidth('dept');
     * console.log(originWidth); // e.g., '100px' or '50%'
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The original width of the column as a string (e.g., `"100px"`, `"50%"`).
     */
    getColOriginWidth(colIndexOrColId: number | string): string;
    /**
     * Sets the data type for a specific column.
     * 
     * - The `dataType` must be one of the following: `'text'`, `'date'`, `'month'`, `'mask'`, `'select'`, `'checkbox'`, `'button'`, `'link'`, `'code'`.
     * - Updates the `cDataType` property for the column and all cells in the column.
     * - Reloads the grid to apply the changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColDataType('dept', 'text'); // Sets the data type of the 'dept' column to 'text'.
     * grid.setColDataType('dept', 'date'); // Sets the data type of the 'dept' column to 'date'.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param dataType The data type to be set for the column (e.g., `'text'`, `'date'`, `'month'`, `'mask'`, `'select'`, `'checkbox'`, `'button'`, `'link'`, `'code'`).
     * @returns `true` if the operation is successful.
     * @throws An error if `dataType` is not one of the valid options.
     */
    setColDataType(colIndexOrColId: number | string, dataType: string): boolean;
    /**
     * Returns the data type of a specific column.
     * 
     * - Retrieves the `cDataType` property of the specified column, which represents its data type.
     * 
     * ### Example usage:
     * ```typescript
     * const dataType = grid.getColDataType('dept');
     * console.log(dataType); // e.g., 'text', 'date', 'select', etc.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The data type of the column as a string (e.g., `'text'`, `'date'`, `'select'`, etc.).
     */
    getColDataType(colIndexOrColId: number | string): string;
    /**
     * Sets the select size for a specific column.
     * 
     * - The `cssTextSelectSize` should be a valid CSS width value (e.g., `"100px"`, `"50%"`).
     * - Updates the `cSelectSize` property for the column and all cells in the column.
     * - Reconnects grid cells with the new select size applied.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColSelectSize('dept', '150px'); // Sets the select size of the 'dept' column to 150px.
     * grid.setColSelectSize('dept', '30%'); // Sets the select size of the 'dept' column to 30%.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param cssTextSelectSize The select size to be applied to the column (e.g., `"100px"`, `"50%"`).
     * @returns `true` if the operation is successful.
     */
    setColSelectSize(colIndexOrColId: number | string, cssTextSelectSize: string): boolean;
    /**
     * Returns the select size for a specific column.
     * 
     * - Retrieves the `cSelectSize` property of the specified column, which represents its select width.
     * 
     * ### Example usage:
     * ```typescript
     * const selectSize = grid.getColSelectSize('dept');
     * console.log(selectSize); // e.g., '100px' or '30%'
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The select size of the column as a string (e.g., `"100px"`, `"30%"`), or `null` if not set.
     */
    getColSelectSize(colIndexOrColId: number | string): string | null;
    /**
     * Sets the locked state for a specific column.
     * 
     * - When `isLocked` is `true`, the column's cell values cannot be modified by the user.
     * - When `isLocked` is `false`, the column's cell values can be modified.
     * - Updates the `cLocked` property for the column and all cells in the column.
     * - Reconnects grid cells after applying the locked state.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColLocked('dept', true); // Locks the 'dept' column, preventing changes to its cells.
     * grid.setColLocked('dept', false); // Unlocks the 'dept' column, allowing changes to its cells.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isLocked `true` to lock the column, `false` to unlock it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isLocked` is not a boolean.
     */
    setColLocked(colIndexOrColId: number | string, isLocked: boolean): boolean;
    /**
     * Checks whether a specific column is locked.
     * 
     * - Returns `true` if the column is locked and its cell values cannot be modified.
     * - Returns `false` if the column is not locked and its cell values can be modified.
     * 
     * ### Example usage:
     * ```typescript
     * const isLocked = grid.isColLocked('dept');
     * console.log(isLocked); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the column is locked, otherwise `false`.
     */
    isColLocked(colIndexOrColId: number | string): boolean;
    /**
     * Sets the locked color state for a specific column.
     * 
     * - When `isLockedColor` is `true`, the background color of locked cells in the column is applied.
     * - When `isLockedColor` is `false`, the locked cells will not have a special background color.
     * - Updates the `cLockedColor` property for the column and all cells in the column.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColLockedColor('dept', true); // Applies locked color to locked cells in the 'dept' column.
     * grid.setColLockedColor('dept', false); // Removes locked color from locked cells in the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param isLockedColor `true` to enable locked color, `false` to disable it.
     * @returns `true` if the operation is successful.
     * @throws An error if `isLockedColor` is not a boolean.
     */
    setColLockedColor(colIndexOrColId: number | string, isLockedColor: boolean): boolean;
    /**
     * Checks whether the locked color is applied to a specific column.
     * 
     * - Returns `true` if locked color is applied to the column's locked cells.
     * - Returns `false` if locked color is not applied to the column's locked cells.
     * 
     * ### Example usage:
     * ```typescript
     * const isLockedColor = grid.isColLockedColor('dept');
     * console.log(isLockedColor); // e.g., true or false
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if locked color is applied, otherwise `false`.
     */
    isColLockedColor(colIndexOrColId: number | string): boolean;
    /**
     * Sets the format for a specific column.
     * 
     * - The `format` is applied to cells in the column, and it is only effective for `mask` and `number` data types.
     * - If the cell data type is `mask`, the value is validated based on the format.
     * - Reloads the grid to apply the new format.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColFormat('salary', '0.00'); // Sets the format for the 'salary' column to two decimal places.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param format The format string to apply to the column's cells (e.g., `'###-###'`, `'0.00'`).
     * @returns `true` if the operation is successful.
     * @throws An error if `format` is not a string.
     */
    setColFormat(colIndexOrColId: number | string, format: string): boolean;
    /**
     * Returns the format of a specific column.
     * 
     * - Retrieves the `cFormat` property of the specified column, which represents its format.
     * 
     * ### Example usage:
     * ```typescript
     * const colFormat = grid.getColFormat('dept');
     * console.log(colFormat); // e.g., '###-###' or '0.00'
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The format of the column as a string (e.g., `'###-###'`, `'0.00'`), or `null` if not set.
     */
    getColFormat(colIndexOrColId: number | string): string | null;
    /**
     * Sets the list of codes for a specific column.
     * 
     * - The `codes` array is applied to the column, and it is only effective for cells with the `data-type` set to `'code'`.
     * - If the cell's data type is `'code'`, the value is validated based on the codes provided.
     * - Reloads the grid to apply the changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColCodes('dept', ['HR', 'Finance', 'Engineering']); // Sets valid codes for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param codes The list of valid codes to apply to the column's cells.
     * @returns `true` if the operation is successful.
     * @throws An error if `codes` is not a valid array.
     */
    setColCodes(colIndexOrColId: number | string, codes: string[]): boolean;
    /**
     * Returns the list of codes for a specific column.
     * 
     * - Retrieves the `cCodes` property of the specified column, which represents the valid codes for that column.
     * 
     * ### Example usage:
     * ```typescript
     * const colCodes = grid.getColCodes('dept');
     * console.log(colCodes); // e.g., ['HR', 'Finance', 'Engineering']
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns An array of codes for the column, or `null` if no codes are set.
     */
    getColCodes(colIndexOrColId: number | string): string[] | null;
    /**
     * Sets the default code for a specific column.
     * 
     * - The `defaultCode` is applied to the column, and it is only effective for cells with the `data-type` set to `'code'`.
     * - If a cell's value is empty or invalid, the `defaultCode` is used as the default value.
     * - Reloads the grid to apply the changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColDefaultCode('dept', 'HR'); // Sets 'HR' as the default code for the 'dept' column.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param defaultCode The default code to apply to the column's cells.
     * @returns `true` if the operation is successful.
     */
    setColDefaultCode(colIndexOrColId: number | string, defaultCode: string): boolean;
    /**
     * Returns the default code for a specific column.
     * 
     * - Retrieves the `cDefaultCode` property of the specified column, which represents the default code used when a cell value is empty or invalid.
     * 
     * ### Example usage:
     * ```typescript
     * const defaultCode = grid.getColDefaultCode('dept');
     * console.log(defaultCode); // e.g., 'HR'
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The default code for the column, or `null` if not set.
     */
    getColDefaultCode(colIndexOrColId: number | string): string | null;
    /**
     * Sets the maximum length for a specific column.
     * 
     * - The `maxLength` is applied to the column, and it is only effective for cells with the `data-type` set to `'text'`.
     * - If a cell's value exceeds the `maxLength`, it will be truncated.
     * - Reloads the grid to apply the changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColMaxLength('dept', 10); // Sets the maximum length of the 'dept' column's text cells to 10 characters.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param maxLength The maximum length for the column's text cells (must be a non-negative integer).
     * @returns `true` if the operation is successful.
     * @throws An error if `maxLength` is not a valid positive integer.
     */
    setColMaxLength(colIndexOrColId: number | string, maxLength: number): boolean;
    /**
     * Returns the maximum length for a specific column.
     * 
     * - Retrieves the `cMaxLength` property of the specified column, which represents the maximum length allowed for text cells.
     * 
     * ### Example usage:
     * ```typescript
     * const maxLength = grid.getColMaxLength('dept');
     * console.log(maxLength); // e.g., 10 or null if not set.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The maximum length for the column's text cells, or `null` if not set.
     */
    getColMaxLength(colIndexOrColId: number | string): number | null;
    /**
     * Sets the maximum byte size for a specific column.
     * 
     * - The `maxByte` is applied to the column and is only effective for cells with the `data-type` set to `'text'`.
     * - If the byte size of a cell value exceeds the `maxByte`, it will be truncated.
     * - Reloads the grid to apply the changes.
     * - The byte size calculation considers special characters and can be configured using specific functions:
     *   - `vg.lessoreq0x7ffByte(charCode <= 0x7FF)`
     *   - `vg.lessoreq0xffffByte(charCode <= 0xFFFF)`
     *   - `vg.greater0xffffByte(charCode > 0xFFFF)`
     * - The default byte size settings are 2, 3, and 4 for different character ranges.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColMaxByte('dept', 100); // Sets the maximum byte size for the 'dept' column to 100 bytes.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param maxByte The maximum byte size for the column's text cells (must be a non-negative integer).
     * @returns `true` if the operation is successful.
     * @throws An error if `maxByte` is not a valid positive integer.
     */
    setColMaxByte(colIndexOrColId: number | string, maxByte: number): boolean;
    /**
     * Returns the maximum byte size for a specific column.
     * 
     * - Retrieves the `cMaxByte` property of the specified column, which represents the maximum byte size allowed for text cells.
     * 
     * ### Example usage:
     * ```typescript
     * const maxByte = grid.getColMaxByte('dept');
     * console.log(maxByte); // e.g., 100 or null if not set.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The maximum byte size for the column's text cells, or `null` if not set.
     */
    getColMaxByte(colIndexOrColId: number | string): number | null;
    /**
     * Sets the maximum number value for a specific column.
     * 
     * - The `maxNumber` is applied to the column, and it is only effective for cells with the `data-type` set to `'number'`.
     * - If the value in a cell exceeds the `maxNumber`, it will be truncated or adjusted.
     * - Reloads the grid to apply the changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColMaxNumber('salary', 10000); // Sets the maximum number for the 'salary' column to 10000.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param maxNumber The maximum number allowed for the column's cells (must be a valid number).
     * @returns `true` if the operation is successful.
     * @throws An error if `maxNumber` is not a valid number.
     */
    setColMaxNumber(colIndexOrColId: number | string, maxNumber: number): boolean;
    /**
     * Returns the maximum number value for a specific column.
     * 
     * - Retrieves the `cMaxNumber` property of the specified column, which represents the maximum allowed number for that column.
     * 
     * ### Example usage:
     * ```typescript
     * const maxNumber = grid.getColMaxNumber('salary');
     * console.log(maxNumber); // e.g., 10000 or null if not set.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The maximum number for the column's cells, or `null` if not set.
     */
    getColMaxNumber(colIndexOrColId: number | string): number | null;
    /**
     * Sets the minimum number value for a specific column.
     * 
     * - The `minNumber` is applied to the column, and it is only effective for cells with the `data-type` set to `'number'`.
     * - If the value in a cell is less than the `minNumber`, it will be adjusted to the minimum allowed value.
     * - Reloads the grid to apply the changes.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setColMinNumber('salary', 1000); // Sets the minimum number for the 'salary' column to 1000.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param minNumber The minimum number allowed for the column's cells (must be a valid number).
     * @returns `true` if the operation is successful.
     * @throws An error if `minNumber` is not a valid number.
     */
    setColMinNumber(colIndexOrColId: number | string, minNumber: number): boolean;
    /**
     * Returns the minimum number value for a specific column.
     * 
     * - Retrieves the `cMinNumber` property of the specified column, which represents the minimum allowed number for that column.
     * 
     * ### Example usage:
     * ```typescript
     * const minNumber = grid.getColMinNumber('salary');
     * console.log(minNumber); // e.g., 1000 or null if not set.
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The minimum number for the column's cells, or `null` if not set.
     */
    getColMinNumber(colIndexOrColId: number | string): number | null;
    /**
     * Sets the rounding precision for a specific column identified by `colIndex` or `colId`.
     *
     * The `roundNumber` determines how numeric values in the column are rounded:
     * - A positive integer specifies the number of decimal places to round to.
     * - Zero (`0`) rounds to the nearest integer.
     * - Negative values round digits to the left of the decimal point (e.g., tens, hundreds).
     *
     * **Note**:
     * - Effective immediately; the grid reloads automatically after applying the changes.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColRoundNumber('price', 2); // Rounds 'price' column values to 2 decimal places.
     * ```
     *
     * @param colIndexOrColId - The column's identifier (`colId`) or index (`colIndex`).
     * @param roundNumber - The number of decimal places (positive), or integer places (negative) for rounding.
     * @returns `true` if rounding is successfully applied.
     * @throws Error if `colIndexOrColId` is invalid or `roundNumber` is not a valid integer.
     */
    setColRoundNumber(colIndexOrColId: number | string, roundNumber: number): boolean;
    /**
     * Retrieves the rounding precision set for the specified column by `colIndex` or `colId`.
     *
     * Returns the configured rounding precision (`roundNumber`) if previously set:
     * - A positive integer indicates decimal precision.
     * - Zero indicates rounding to the nearest integer.
     * - Returns `null` if no rounding precision has been set explicitly.
     *
     * ### Example usage:
     * ```typescript
     * const roundPrecision = grid.getColRoundNumber('price');
     * console.log(roundPrecision); // 2 (rounded to 2 decimal places), or null if not set
     * ```
     *
     * @param colIndexOrColId - The identifier (column ID or index) for the column to query.
     * @returns The current rounding precision, or `null` if not set.
     */
    getColRoundNumber(colIndexOrColId: number | string): number | null;
    /**
     * Sets the text alignment for the specified column.
     *
     * ### Example:
     * ```typescript
     * grid.setColAlign('name', Align.center); // Centers content in 'name' column
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param align - Text alignment ('left', 'center', 'right').
     * @returns `true` if alignment is set successfully.
     */
    setColAlign(colIndexOrColId: number | string, align: Align.left | Align.center | Align.right): boolean;
    /**
     * Gets the text alignment of the specified column.
     *
     * ### Example usage:
     * ```typescript
     * const align = grid.getColAlign('name'); // 'LEFT', 'CENTER', or 'RIGHT'
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns The alignment ('left', 'center', 'right'), or `null` if unset.
     */
    getColAlign(colIndexOrColId: number | string): string | null;
    /**
     * Sets the vertical alignment for the specified column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColVerticalAlign('status', 'center'); // Sets vertical alignment to 'center'
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param verticalAlign - Vertical alignment ('top', 'center', 'bottom').
     * @returns `true` if the alignment is successfully applied.
     * @throws Error if an invalid alignment value is provided.
     */
    setColVerticalAlign(colIndexOrColId: number | string, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom): boolean;
    /**
     * Gets the vertical alignment of the specified column.
     *
     * ### Example usage:
     * ```typescript
     * const verticalAlign = grid.getColVerticalAlign('name'); // 'top', 'center', 'bottom' or null
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns The vertical alignment ('top', 'center', 'bottom'), or `null` if not set.
     */
    getColVerticalAlign(colIndexOrColId: number | string): string | null;
    /**
     * Sets the CSS overflow-wrap style for a specific column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColOverflowWrap('description', 'break-word');
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param overflowWrap - Overflow-wrap value (e.g., `'break-word'`, `'normal'`, `'anywhere'`).
     * @returns `true` if set successfully.
     */
    setColOverflowWrap(colIndexOrColId: number | string, overflowWrap: string): boolean;
    /**
     * Gets the overflow-wrap property of the specified column.
     *
     * ### Example usage:
     * ```typescript
     * const overflowWrap = grid.getColOverflowWrap('description'); // e.g., 'break-word'
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns The overflow-wrap value (`'break-word'`, `'normal'`, `'anywhere'`), or `null` if unset.
     */
    getColOverflowWrap(colIndexOrColId: number | string): string | null;
    /**
     * Sets the CSS word-break property for the specified column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColWordBreak('content', 'break-all');
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param wordBreak - CSS word-break value (e.g., `'break-all'`, `'keep-all'`, `'normal'`).
     * @returns `true` if successfully applied.
     */
    setColWordBreak(colIndexOrColId: number | string, wordBreak: string): boolean;
    /**
     * Gets the CSS word-break property of the specified column.
     *
     * ### Example usage:
     * ```typescript
     * const wordBreak = grid.getColWordBreak('content'); // e.g., 'break-all'
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns The word-break CSS value (e.g., `'break-all'`), or `null` if not set.
     */
    getColWordBreak(colIndexOrColId: number | string): string | null;
    /**
     * Sets the CSS white-space property for the specified column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColWhiteSpace('remarks', 'nowrap');
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param whiteSpace - CSS white-space value (e.g., `'nowrap'`, `'pre-wrap'`, `'normal'`).
     * @returns `true` if set successfully.
     */
    setColWhiteSpace(colIndexOrColId: number | string, whiteSpace: string): boolean;
    /**
     * Gets the CSS white-space property for the specified column.
     *
     * ### Example usage:
     * ```typescript
     * const whiteSpace = grid.getColWhiteSpace('remarks'); // e.g., 'nowrap'
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns The CSS white-space value (`'nowrap'`, `'normal'`, etc.), or `null` if not set.
     */
    getColWhiteSpace(colIndexOrColId: number | string): string | null;
    /**
     * Sets the background color for the specified column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColBackColor('status', '#ffffff');
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param hexadecimalBackColor - Hexadecimal color string (e.g., `'#ffffff'`).
     * @returns `true` if the background color is set successfully.
     * @throws Error if an invalid hexadecimal color is provided.
     */
    setColBackColor(colIndexOrColId: number | string, hexadecimalBackColor: string): boolean;
    /**
     * Gets the background color of the specified column.
     *
     * ### Example usage:
     * ```typescript
     * const backColor = grid.getColBackColor('status'); // e.g., '#ffffff'
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns The hexadecimal background color (e.g., `'#ffffff'`), or `null` if not set.
     */
    getColBackColor(colIndexOrColId: number | string): string | null;
    /**
     * Sets the font color for the specified column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontColor('status', '#ff0000');
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param hexadecimalFontColor - Font color in hexadecimal format (e.g., `'#ffffff'`).
     * @returns `true` if the font color is set successfully.
     * @throws Error if an invalid hexadecimal color is provided.
     */
    setColFontColor(colIndexOrColId: number | string, hexadecimalFontColor: string): boolean;
    /**
     * Gets the font color of the specified column.
     *
     * ### Example usage:
     * ```typescript
     * const fontColor = grid.getColFontColor('status'); // e.g., '#000000'
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns The hexadecimal font color (e.g., `'#ffffff'`), or `null` if not set.
     */
    getColFontColor(colIndexOrColId: number | string): string | null;
    /**
     * Sets the font weight to bold or normal for the specified column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontBold('name', true); // Sets column 'name' font to bold.
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param isBold - `true` for bold font, `false` for normal weight.
     * @returns `true` if successfully applied.
     */
    setColFontBold(colIndexOrColId: number | string, isFontBold: boolean): boolean;
    /**
     * Returns whether the font of the specified column is set to bold.
     *
     * ### Example usage:
     * ```typescript
     * const isBold = grid.getColFontBold('name'); // true or false
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if font is bold; otherwise `false`.
     */
    isColFontBold(colIndexOrColId: number | string): boolean;
    /**
     * Sets the italic style for the font of the specified column.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontItalic('remarks', true); // Sets italic font for 'remarks' column.
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param isFontItalic - `true` to italicize text, `false` otherwise.
     * @returns `true` if the operation succeeds.
     * @throws Error if `isFontItalic` is not a boolean.
     */
    setColFontItalic(colIndexOrColId: number | string, isFontItalic: boolean): boolean;
    /**
     * Returns whether the font style of the specified column is italic.
     *
     * ### Example usage:
     * ```typescript
     * const isItalic = grid.isColFontItalic('title'); // true or false
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if the column font is italic, otherwise `false`.
     */
    isColFontItalic(colIndexOrColId: number | string): boolean;
    /**
     * Sets whether the font of the specified column has a strikethrough (line-through).
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontThruline('price', true); // Adds strikethrough to 'price' column.
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param isFontThruline - `true` to apply strikethrough, `false` otherwise.
     * @returns `true` if successfully set.
     * @throws Error if `isFontThruline` is not a boolean.
     */
    setColFontThruline(colIndexOrColId: number | string, isFontThruline: boolean): boolean;
    /**
     * Returns whether the font of the specified column has a strikethrough (line-through).
     *
     * ### Example usage:
     * ```typescript
     * const isThruline = grid.isColFontThruline('discount'); // true or false
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if strikethrough is enabled; otherwise, `false`.
     */
    isColFontThruline(colIndexOrColId: number | string): boolean;
    /**
     * Sets whether the font of the specified column has an underline.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontUnderline('productName', true); // Adds underline to 'productName' column.
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @param isFontUnderline - `true` to underline text, `false` otherwise.
     * @returns `true` if set successfully.
     * @throws Error if `isFontUnderline` is not a boolean.
     */
    setColFontUnderline(colIndexOrColId: number | string, isFontUnderline: boolean): boolean;
    /**
     * Returns whether the font of the specified column has an underline.
     *
     * ### Example usage:
     * ```typescript
     * const isUnderline = grid.isColFontUnderline('product'); // true or false
     * ```
     *
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if underline is enabled; otherwise, `false`.
     */
    isColFontUnderline(colIndexOrColId: number | string): boolean;
    /**
     * Adds row(s) to the grid at the specified position or at the end.
     *
     * ### Example:
     * ```typescript
     * grid.addRow(1, [{ id: 'A001', name: 'Item A' }]);
     * ```
     *
     * @param rowOrValuesOrDatas - Row index, key-value pairs, or data arrays.
     * @param valuesOrDatas - Row data as key-value pairs or array.
     * @returns `true` if rows are added successfully.
     */
    addRow(rowOrValuesOrDatas?: number | Record<string, any> | Record<string, any>[], valuesOrDatas?: Record<string, any> | Record<string, any>[]): boolean;
    /**
     * Removes the specified row and returns its data.
     *
     * ### Example:
     * ```typescript
     * const removedData = grid.removeRow(2);
     * ```
     *
     * @param row - Row index to remove.
     * @returns Removed row data marked with status `'D'`.
     */
    removeRow(row: number): Record<string, any>;
    /**
     * Sets the status code for the specified row (e.g., 'C', 'U', 'D').
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowStatus(3, 'U');
     * ```
     *
     * @param row - Row index.
     * @param status - Status string to set.
     * @returns `true` if the status is set successfully.
     */
    setRowStatus(row: number, status: string): boolean;
    /**
     * Gets the current status code of the specified row.
     *
     * ### Example usage:
     * ```typescript
     * const status = grid.getRowStatus(3); // e.g., 'C', 'U', 'D'
     * ```
     *
     * @param row - Row index.
     * @returns The row status.
     */
    getRowStatus(row: number): string;
    /**
     * Sets multiple cell data values for the specified row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowDatas(2, [{id:'colId1', value:'value1'}, {id:'colId2', value:'value2'}, {id:'colId3', value:'value3'}]);
     * ```
     *
     * @param row - Row index.
     * @param cellDatas - Array of cell data objects (`CellData[]`).
     * @returns `true` if row data is set successfully.
     */
    setRowDatas(row: number, cellDatas: CellData): boolean;
    /**
     * Retrieves data objects for all cells in the specified row.
     *
     * ### Example usage:
     * ```typescript
     * const rowDatas = grid.getRowDatas(1);
     * //[{id:'colId1', value:'value1'...}, {id:'colId2', value:'value2'...}, {id:'colId3', value:'value3'...}]
     * ```
     *
     * @param row - Row index.
     * @returns Array of cell data objects.
     */
    getRowDatas(row: number): Record<string, any>[];
    /**
     * Sets multiple cell values at once for the specified row.
     *
     * ### Example usage:
     * ```typescript
     * gridId.setRowValues(1, {colId1:'value1', colId2:'value2', colId3:'value3'});
     * ```
     *
     * @param row - Row index.
     * @param values - Key-value pairs of column IDs and values.
     * @param doRecord - Whether to record changes (optional).
     * @returns `true` if values are set successfully.
     */
    setRowValues(row: number, values: Record<string, any>, doRecord?: boolean): boolean;
    /**
     * Gets the key-value pairs of cell values for the specified row.
     *
     * ### Example usage:
     * ```typescript
     * const values = grid.getRowValues(3);
     * //{colId1:value, colId2:value ...}
     * ```
     *
     * @param row - Row index.
     * @returns Row values as a key-value object.
     */
    getRowValues(row: number): Record<string, any>;
    /**
     * Gets the text representations of all cells in the specified row.
     *
     * ### Example usage:
     * ```typescript
     * const texts = grid.getRowTexts(5);
     * //{colId1:text, colId2:text ...}
     * ```
     *
     * @param row - Row index.
     * @returns Key-value pairs representing text of each cell.
     */
    getRowTexts(row: number): Record<string, string>;
    /**
     * Sets the visible status of the row-th row. If visible is false, the row is hidden. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowVisible(1, false);
     * ```
     *
     * @param row - Row index.
     * @param isVisible `true` to show the row, `false` to hide it.
     * @returns `true` if values are set successfully.
     */
    setRowVisible(row: number, isVisible: boolean): boolean;
    /**
     * Returns the visible status of the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowVisible(1, false);
     * const isFirstRowVisible = grid.isRowVisible(1) // e.g. false
     * ```
     *
     * @param  row - Row index.
     * @returns `true` if the column is visible, otherwise `false`.
     */
    isRowVisible(row: number): boolean;
    /**
     * Sets the data-type of the row-th row. Returns true if it operates normally.
     * data-type: 'text', 'date', 'month', 'mask', 'select', 'checkbox', 'button', 'link', 'code' ...
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowDataType(1, 'text');
     * ```
     *
     * @param row - Row index.
     * @param dataType - cell's data types. 'text', 'date', 'month', 'mask', 'select', 'checkbox', 'button', 'link', 'code' ...
     * @returns `true` if values are set successfully.
     */
    setRowDataType(row: number, dataType: string): boolean;
    /**
     * Sets the locked status of the row-th row. If locked is true, the cell value of the column cannot be changed.
     * Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowLocked(1, true); // lock first row
     * ```
     *
     * @param row - Row index.
     * @param isRowLocked `true` if the row locked, otherwise `false`.
     * @returns `true` if values are set successfully.
     */
    setRowLocked(row: number, isRowLocked: boolean): boolean;
    /**
     * Sets the lockedColor of the row-th row. If lockedColor is true, the background color is displayed for locked cells.
     * Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowLocked(1, true); // set lock color on first row
     * ```
     *
     * @param row - Row index.
     * @param isRowLockedColor `true` if the row has locked-color, otherwise `false`.
     * @returns `true` if values are set successfully.
     */
    setRowLockedColor(row: number, isRowLockedColor: boolean): boolean;
    /**
     * Sets the align of the row-th row. Choose from 'left', 'center', 'right'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowAlign(1, 'center'); // set align on first row
     * ```
     *
     * @param row - Row index.
     * @param align css text about align. 'left', 'center', 'right'.
     * @returns `true` if values are set successfully.
     */
    setRowAlign(row: number, align: Align.left | Align.center | Align.right): boolean;
    /**
     * Sets the vertical-align of the row-th row. Choose from 'top', 'center', 'bottom'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowVerticalAlign(1, 'bottom'); // set vertical align on first row
     * ```
     *
     * @param row - Row index.
     * @param verticalAlign css text about vertical align. 'top', 'center', 'bottom'.
     * @returns `true` if values are set successfully.
     */
    setRowVerticalAlign(row: number, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom): boolean;
    /**
     * Sets the background color of the row-th row. Returns true if it operates normally. Enter a hexadecimal color. Ex) '#ffffff'
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowBackColor(1, '#ffffff') // set back ground color on first row
     * ```
     *
     * @param row - Row index.
     * @param hexadecimalBackColor row back ground color with hexadecimal css text. '#ffffff'
     * @returns `true` if values are set successfully.
     */
    setRowBackColor(row: number, hexadecimalBackColor: string): boolean;
    /**
     * Sets the font color of the row-th row. Returns true if it operates normally. Enter a hexadecimal color. Ex) '#ffffff'
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowFontColor(1, '#333333') // set font color on first row
     * ```
     *
     * @param row - Row index.
     * @param hexadecimalFontColor row font color with hexadecimal css text. '#ffffff'
     * @returns `true` if values are set successfully.
     */
    setRowFontColor(row: number, hexadecimalFontColor: string): boolean;
    /**
     * Sets the fontBold of the row-th row. If fontBold is true, the text is displayed in bold. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowFontBold(1, true) // set font-bold on first row
     * ```
     *
     * @param row - Row index.
     * @param isRowFontBold `true` if the row's font is bold, otherwise `false`.
     * @returns `true` if values are set successfully.
     */
    setRowFontBold(row: number, isRowFontBold: boolean): boolean;
    /**
     * Sets the fontItalic of the row-th row. If fontItalic is true, the text is displayed in italics. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowFontItalic(1, true) // set font-italic on first row
     * ```
     *
     * @param row - Row index.
     * @param isRowFontItalic `true` if the row's font is italic, otherwise `false`.
     * @returns `true` if values are set successfully.
     */
    setRowFontItalic(row: number, isRowFontItalic: boolean): boolean;
    /**
     * Sets the fontThruline of the row-th row. If fontThruline is true, the text is displayed with a strikethrough. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowFontThruline(1, true) // set font-thruline on first row
     * ```
     *
     * @param row - Row index.
     * @param isRowFontThruline `true` if the row's font is thruline, otherwise `false`.
     * @returns `true` if values are set successfully.
     */
    setRowFontThruline(row: number, isRowFontThruline: boolean): boolean;
    /**
     * Sets the fontUnderline of the row-th row. If fontUnderline is true, the text is displayed with an underline. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setRowFontUnderline(1, true) // set font-underline on first row
     * ```
     *
     * @param row - Row index.
     * @param isRowFontUnderline `true` if the row's font is underline, otherwise `false`.
     * @returns `true` if values are set successfully.
     */
    setRowFontUnderline(row: number, isRowFontUnderline: boolean): boolean;
    /**
     * Returns rows that match the colId and value based on the conditions of the matches object {colId:value, colId:value..}.
     * All conditions must match to be returned. Returns the row numbers as an array.
     * 
     * ### Example usage:
     * ```typescript
     * gridId.searchRowsWithMatched({dept:'Human Resources Team',salary:'5000'})
     * ```
     *
     * @param matches - Record<string, any>, the matches object.
     * @returns `true` if values are set successfully.
     */
    searchRowsWithMatched(matches: Record<string, any>): number[];
    /**
     * Returns rows that match the colId and value based on the conditions of the matches object {colId:value, colId:value..}.
     * All conditions must match to be returned. Returns the rows as Datas [[{},{}..],[{},{}..]...].
     *
     * ### Example usage:
     * ```typescript
     * gridId.searchRowsWithMatched({dept:'Human Resources Team',salary:'5000'})
     * ```
     *
     * @param matches - Record<string, any>, the matches object.
     * @returns `true` if values are set successfully.
     */
    searchRowDatasWithMatched(matches: Record<string, any>): Record<string, any>[][];
    /**
     * Returns rows that match the colId and value based on the conditions of the matches object {colId:value, colId:value..}.
     * All conditions must match to be returned. Returns the rows as keyValues [{},{}... ].
     *
     * ### Example usage:
     * ```typescript
     * gridId.searchRowsWithMatched({dept:'Human Resources Team',salary:'5000'})
     * ```
     *
     * @param matches - Record<string, any>, the matches object.
     * @returns `true` if values are set successfully.
     */
    searchRowValuesWithMatched(matches: Record<string, any>): Record<string, any>[];
    /**
     * Returns rows for which the return value is true through the matchFunction inserted by the user.
     * The result value of getRowDatas(row) is passed as a parameter to matchFunction. Returns the row numbers as an array.
     *
     * ### Example usage:
     * ```typescript
     * gridId.searchRowsWithFunction(function (rowDatas) {if(rowDatas[3].value === 'Human Resources Team' && rowDatas[4].value >= 5000) return true})
     * ```
     *
     * @param func (rowDatas: Record<string, any>[]) => boolean - Find only rows that return true.
     * @returns The sequence array of rows that return true with func.
     */
    searchRowsWithFunction(func: (rowDatas: Record<string, any>[]) => boolean): number[];
    /**
     * Returns rows for which the return value is true through the matchFunction inserted by the user.
     * The result value of getRowDatas(row) is passed as a parameter to matchFunction. Returns the rows as Datas [[{},{}..],[{},{}..]...].
     *
     * ### Example usage:
     * ```typescript
     * gridId.searchRowsWithFunction(function (rowDatas) {if(rowDatas[3].value === 'Human Resources Team' && rowDatas[4].value >= 5000) return true})
     * ```
     *
     * @param func (rowDatas: Record<string, any>[]) => boolean - Find only rows that return true.
     * @returns The row array of rows that return true with func.
     */
    searchRowDatasWithFunction(func: Function): Record<string, any>[][];
    /**
     * Returns rows for which the return value is true through the matchFunction inserted by the user.
     * The result value of getRowDatas(row) is passed as a parameter to matchFunction. Returns the rows as keyValues [{},{}... ].
     *
     * ### Example usage:
     * ```typescript
     * gridId.searchRowsWithFunction(function (rowDatas) {if(rowDatas[3].value === 'Human Resources Team' && rowDatas[4].value >= 5000) return true})
     * ```
     *
     * @param func (rowDatas: Record<string, any>[]) => boolean - Find only rows that return true.
     * @returns The values array of rows that return true with func.
     */
    searchRowValuesWithFunction(func: Function): Record<string, any>[];
    /**
     * Changes the information of the cell in the colId or colIndex column in the row-th row.
     * cellData is an object in the form {id:'colId', value:'value'...}. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellData(1, 'colId1', {id:'colId', value:'value'...});
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param cellData Cell data object (`CellData`).
     * @returns `true` if values are set successfully.
     */
    setCellData(row: number, colIndexOrColId: number | string, cellData: CellData): boolean;
    /**
     * Returns the information of the cell in the colId or colIndex column in the row-th row. cellData is an object in the form {id:'colId', value:'value'..}.
     *
     * ### Example usage:
     * ```typescript
     * grid.getCellData(1, 'colId1'); // e.g. {id:'colId', value:'value'...}
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns cellData Cell data object (`CellData`).
     */
    getCellData(row: number, colIndexOrColId: number | string): CellData;
    /**
     * Changes the value of the cell in the colId or colIndex column in the row-th row. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellValue(1, 'colId1', 'value'); // Set the value of the colId1 column in row 1 to 'value'. Do not record undo.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param doRecord `true` if Do record undo, otherwise `false`. default : false.
     * @returns `true` if values are set successfully.
     */
    setCellValue(row: number, colIndexOrColId: number | string, value: any, doRecord?: boolean): boolean;
    /**
     * Returns the value of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellValue(1, 'colId1', 'value');
     * grid.getCellValue(1, 'colId1'); // e.g. 'value'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns Returns the value held by the cell
     */
    getCellValue(row: number, colIndexOrColId: number | string): any;
    /**
     * Returns the text of the cell in the colId or colIndex column in the row-th row (values applied with format, etc.).
     *
     * ### Example usage:
     * ```typescript
     * grid.getCellText(1, 'colId1');
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns Returns the character value of the cell
     */
    getCellText(row: number, colIndexOrColId: number | string): string;
    /**
     * Sets the required status of the cell in the colId or colIndex column in the row-th row.
     * If required is true, it can be checked through checkRequired(). Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellRequired(1, 'colId1', true);
     * //And, If the value of the 'colId1' column in row 1 is blank,
     * grid.checkRequired(function(cellData) {
     *     alert('Please enter the information for ' + cellData.row + ' row, ' + cellData.name + ' column.')
     * });
     * // An alert called 'Please enter the information for first row, colName column.' occurred.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if values are set successfully.
     */
    setCellRequired(row: number, colIndexOrColId: number | string, isRequired: boolean): boolean;
    /**
     * Returns the required status of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellRequired(1, 'colId1', true);
     * grid.getCellRequired(1, 'colId1'); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if the cell is required, otherwise `false`.
     */
    getCellRequired(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Sets the data-type of the cell in the colId or colIndex column in the row-th row. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellDataType(1, 'colId1', 'text');
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param dataType - cell's data types. 'text', 'date', 'month', 'mask', 'select', 'checkbox', 'button', 'link', 'code' ...
     * @returns `true` if values are set successfully.
     */
    setCellDataType(row: number, colIndexOrColId: number | string, dataType: string): boolean;
    /**
     * Returns the data-type of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellDataType(1, 'colId1', 'text');
     * grid.getCellDataType(1, 'colId1'); // e.g. 'text'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns cell's data types. 'text', 'date', 'month', 'mask', 'select', 'checkbox', 'button', 'link', 'code' ...
     */
    getCellDataType(row: number, colIndexOrColId: number | string): string;
    /**
     * Sets the locked status of the cell in the colId or colIndex column in the row-th row.
     * If locked is true, the cell value of the column cannot be changed. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellLocked(1, 'colId1', true);
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param isLocked `true` to lock the cell, `false` to unlock it.
     * @returns `true` if values are set successfully.
     */
    setCellLocked(row: number, colIndexOrColId: number | string, isLocked: boolean): boolean;
    /**
     * Returns the locked status of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellLocked(1, 'colId1', true);
     * grid.isCellLocked(1, 'colId1'); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if the cell is locked, otherwise `false`.
     */
    isCellLocked(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Sets the lockedColor of the cell in the colId or colIndex column in the row-th row.
     * If lockedColor is true, the background color is displayed for locked cells. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellLockedColor(1, 'dept', true); // Applies locked color to locked cell.
     * grid.setCellLockedColor(1, 'dept', false); // Removes locked color from locked cell.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param isLockedColor `true` to enable locked color, `false` to disable it.
     * @returns `true` if values are set successfully.
     */
    setCellLockedColor(row: number, colIndexOrColId: number | string, isLockedColor: boolean): boolean;
    /**
     * Returns the lockedColor of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellLockedColor(1, 'dept', true);
     * grid.isCellLockedColor(1, 'dept', true); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if locked color is applied, otherwise `false`.
     */
    isCellLockedColor(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Sets the format of the cell in the colId or colIndex column in the row-th row.
     * Format is valid when the cell's data-type is 'mask' and 'number'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellFormat(1, 'salary', '0.00'); // Sets the format for the 'salary' column to two decimal places.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param format The format string to apply to the cell (e.g., `'AA-##'`, `'0.00'`).
     * @returns `true` if values are set successfully.
     * @throws An error if `format` is not a string.
     */
    setCellFormat(row: number, colIndexOrColId: number | string, format: string): boolean;
    /**
     * Returns the format of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellFormat(1, 'salary', '0.00');
     * grid.getCellFormat(1, 'salary'); // e.g. '0.00'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The format of the column as a string (e.g. `'0.00'`), or `null` if not set.
     */
    getCellFormat(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the codes of the cell in the colId or colIndex column in the row-th row.
     * Codes are valid when the cell's data-type is 'code'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellCodes(1, 'dept', ['HR', 'FN', 'EG']); // Sets valid codes for the first row, 'dept' column Cell.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param codes The list of valid codes to apply to the cell.
     * @returns `true` if values are set successfully.
     * @throws An error if `codes` is not a valid array.
     */
    setCellCodes(row: number, colIndexOrColId: number | string, codes: string[]): boolean;
    /**
     * Returns the codes of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellCodes(1, 'dept', ['HR', 'FN', 'EG']);
     * grid.getCellCodes(1, 'dept'); // e.g. `['HR', 'FN', 'EG']`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns An array of codes for the cell, or `null` if no codes are set.
     */
    getCellCodes(row: number, colIndexOrColId: number | string): string[] | null;
    /**
     * Sets the default-code of the cell in the colId or colIndex column in the row-th row.
     * default-code is valid when the cell's data-type is 'code'. If there is no value, it uses the default value null.
     * Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellDefaultCode(1, 'dept', 'HR'); // Sets 'HR' as the default code for the first row, 'dept' column cell.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param defaultCode The default code to apply to the cell.
     * @returns `true` if values are set successfully.
     */
    setCellDefaultCode(row: number, colIndexOrColId: number | string, defaultCode: string): boolean;
    /**
     * Returns the default-code of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellDefaultCode(1, 'dept', 'HR');
     * grid.getCellDefaultCode(1, 'dept'); // e.g. `'dept'`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The default code for the cell, or `null` if not set.
     */
    getCellDefaultCode(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the maxLength of the cell in the colId or colIndex column in the row-th row.
     * maxLength is valid when the cell's data-type is 'text'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellMaxLength(1, 'dept', 10); // Sets the maximum length of the first row, 'dept' column's cell to 10 characters.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param maxLength The maximum length for the column's text cell (must be a non-negative integer).
     * @returns `true` if values are set successfully.
     * @throws An error if `maxLength` is not a valid positive integer.
     */
    setCellMaxLength(row: number, colIndexOrColId: number | string, maxLength: number): boolean;
    /**
     * Returns the maxLength of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellMaxLength(1, 'dept', 10);
     * grid.getCellMaxLength(1, 'dept'); // e.g. `10`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID. 
     * @returns The maximum length for the cell's text, or `null` if not set.
     */
    getCellMaxLength(row: number, colIndexOrColId: number | string): number | null;
    /**
     * "Sets the maxByte of the cell in the colId or colIndex column in the row-th row.
     * 
     * - The `maxByte` is applied to the column and is only effective for cells with the `data-type` set to `'text'`.
     * - If the byte size of a cell value exceeds the `maxByte`, it will be truncated.
     * - Reloads the grid to apply the changes.
     * - The byte size calculation considers special characters and can be configured using specific functions:
     *   - `vg.lessoreq0x7ffByte(charCode <= 0x7FF)`
     *   - `vg.lessoreq0xffffByte(charCode <= 0xFFFF)`
     *   - `vg.greater0xffffByte(charCode > 0xFFFF)`
     * - The default byte size settings are 2, 3, and 4 for different character ranges.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setCellMaxByte(1, 'email', 100); // Sets the maximum byte size for the first row, 'email' column cell to 100 bytes.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param maxByte The maximum byte size for the text cell (must be a non-negative integer).
     * @returns `true` if values are set successfully.
     * @throws An error if `maxByte` is not a valid positive integer.
     */
    setCellMaxByte(row: number, colIndexOrColId: number | string, maxByte: number): boolean;
    /**
     * Returns the maxByte of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellMaxByte(1, 'email', 100);
     * grid.getCellMaxByte(1, 'email'); // e.g. `100`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The maximum byte size for the text cell, or `null` if not set.
     */
    getCellMaxByte(row: number, colIndexOrColId: number | string): number | null;
    /**
     * Sets the maxNumber of the cell in the colId or colIndex column in the row-th row.
     * maxNumber is valid when the cell's data-type is 'number'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellMaxNumber(1, 'salary', 10000); // Sets the maximum number for the first row, 'salary' column's cell to 10000.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param maxNumber The maximum number allowed for the cell (must be a valid number).
     * @returns `true` if values are set successfully.
     * @throws An error if `maxNumber` is not a valid number.
     */
    setCellMaxNumber(row: number, colIndexOrColId: number | string, maxNumber: number): boolean;
    /**
     * Returns the maxNumber of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellMaxNumber(1, 'salary', 10000);
     * grid.getCellMaxNumber(1, 'salary'); // e.g. `10000`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The maximum number for the cell, or `null` if not set.
     */
    getCellMaxNumber(row: number, colIndexOrColId: number | string): number | null;
    /**
     * Sets the minNumber of the cell in the colId or colIndex column in the row-th row.
     * minNumber is valid when the cell's data-type is 'number'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellMinNumber(1, 'salary', 1000); // Sets the minimum number for the first row, 'salary' column's cell to 1000.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param minNumber The minimum number allowed for the cell (must be a valid number).
     * @returns `true` if values are set successfully.
     * @throws An error if `minNumber` is not a valid number.
     */
    setCellMinNumber(row: number, colIndexOrColId: number | string, minNumber: number): boolean;
    /**
     * Returns the minNumber of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellMinNumber(1, 'salary', 1000);
     * grid.setCellMinNumber(1, 'salary'); // e.g. 1000
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The minimum number for the cell, or `null` if not set.
     */
    getCellMinNumber(row: number, colIndexOrColId: number | string): number | null;
    /**
     * Sets the roundNumber of the cell in the colId or colIndex column in the row-th row.
     * roundNumber is valid when the cell's data-type is 'number'. Returns true if it operates normally.
     * roundNumber positive integer: specifies the decimal place to be rounded.
     * roundNumber negative integer: specifies the integer place to be rounded.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellRoundNumber(1, 'price', 2); // Rounds first row, 'price' column's cell values to 2 decimal places.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param roundNumber The number of decimal places (positive), or integer places (negative) for rounding.
     * @returns `true` if values are set successfully.
     * @throws An error if `roundNumber` is not a valid number.
     */
    setCellRoundNumber(row: number, colIndexOrColId: number | string, roundNumber: number): boolean;
    /**
     * Returns the roundNumber of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellRoundNumber(1, 'price', 2);
     * grid.getCellRoundNumber(1, 'price'); // e.g. 2
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The current rounding precision, or `null` if not set.
     */
    getCellRoundNumber(row: number, colIndexOrColId: number | string): number | null;
    /**
     * Sets the align of the cell in the colId or colIndex column in the row-th row.
     * Choose from 'left', 'center', 'right'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellAlign(1, 'dept', Align.center); // Centers content in first row, 'dept' column's cell
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param align - Text alignment ('left', 'center', 'right').
     * @returns `true` if values are set successfully.
     * @throws Error if an invalid alignment value is provided.
     */
    setCellAlign(row: number, colIndexOrColId: number | string, align: Align.left | Align.center | Align.right): boolean;
    /**
     * Returns the align of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellAlign(1, 'dept', Align.CENTER);
     * grid.getCellAlign(1, 'dept'); // e.g. 'center'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The alignment ('left', 'center', 'right'), or `null` if unset.
     */
    getCellAlign(row: number, colIndexOrColId: number | string): string;
    /**
     * Sets the vertical-align of the cell in the colId or colIndex column in the row-th row.
     * Choose from 'top', 'center', 'bottom'. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellVerticalAlign(1, 'dept', 'center'); // Sets vertical alignment to 'center'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param verticalAlign - Vertical alignment ('top', 'center', 'bottom').
     * @returns `true` if values are set successfully.
     * @throws Error if an invalid alignment value is provided.
     */
    setCellVerticalAlign(row: number, colIndexOrColId: number | string, verticalAlign: VerticalAlign.top | VerticalAlign.center | VerticalAlign.bottom): boolean;
    /**
     * Returns the vertical_align of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellVerticalAlign(1, 'dept', 'center');
     * grid.getCellVerticalAlign(1, 'dept'); // e.g. `'center'`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The vertical alignment ('top', 'center', 'bottom'), or `null` if not set.
     */
    getCellVerticalAlign(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the overflow-wrap of the cell in the colId or colIndex column in the row-th row.
     * Inserts a cssText string. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellOverflowWrap(1, 'description', 'break-word');
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param overflowWrap - Overflow-wrap value (e.g., `'break-word'`, `'normal'`, `'anywhere'`).
     * @returns `true` if values are set successfully.
     */
    setCellOverflowWrap(row: number, colIndexOrColId: number | string, overflowWrap: string): boolean;
    /**
     * Returns the overflow-wrap of the cell in the colId or colIndex column in the row-th row.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setCellOverflowWrap(1, 'description', 'break-word');
     * grid.getCellOverflowWrap(1, 'description'); // e.g., 'break-word'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The overflow-wrap value (`'break-word'`, `'normal'`, `'anywhere'`), or `null` if unset.
     */
    getCellOverflowWrap(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the word-break of the cell in the colId or colIndex column in the row-th row.
     * Inserts a cssText string. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColWordBreak(1, 'content', 'break-all');
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param wordBreak - CSS word-break value (e.g., `'break-all'`, `'keep-all'`, `'normal'`).
     * @returns `true` if values are set successfully.
     */
    setCellWordBreak(row: number, colIndexOrColId: number | string, wordBreak: string): boolean;
    /**
     * Returns the word-break of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColWordBreak(1, 'content', 'break-all');
     * grid.setColWordBreak(1, 'content'); // e.g. 'break-all'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The word-break CSS value (e.g., `'break-all'`), or `null` if not set.
     */
    getCellWordBreak(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the white-space of the cell in the colId or colIndex column in the row-th row.
     * Inserts a cssText string. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellWhiteSpace(1, 'remarks', 'nowrap');
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param whiteSpace - CSS white-space value (e.g., `'nowrap'`, `'pre-wrap'`, `'normal'`).
     * @returns `true` if values are set successfully.
     */
    setCellWhiteSpace(row: number, colIndexOrColId: number | string, whiteSpace: string): boolean;
    /**
     * Returns the white-space of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellWhiteSpace(1, 'remarks', 'nowrap');
     * grid.getCellWhiteSpace(1, 'remarks'); // e.g. 'nowrap'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The CSS white-space value (`'nowrap'`, `'normal'`, etc.), or `null` if not set.
     */
    getCellWhiteSpace(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the visible of the cell in the colId or colIndex column in the row-th row.
     * Specifically, it sets the visible of the child node of the cell. Inserts a cssText string. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellVisible(1. 'dept', true); // Makes the first row, 'dept' column's cell visible.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param isVisible `true` to show the cell, `false` to hide it.
     * @returns `true` if values are set successfully.
     * @throws An error if `isVisible` is not a boolean.
     */
    setCellVisible(row: number, colIndexOrColId: number | string, isVisible: boolean): boolean;
    /**
     * Returns the visible of the cell in the colId or colIndex column in the row-th row
     * Specifically, it returns the visible of the child node of the cell.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellVisible(1. 'dept', true);
     * grid.isCellVisible(1. 'dept'); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if the cell is visible, otherwise `false`.
     */
    isCellVisible(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Sets the background-color of the cell in the colId or colIndex column in the row-th row.
     * Returns true if it operates normally. Enter a hexadecimal color. Ex) '#ffffff'
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellBackColor(1, 'status', '#ffffff');
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param hexadecimalBackColor - Hexadecimal color string (e.g., `'#ffffff'`).
     * @returns `true` if values are set successfully.
     */
    setCellBackColor(row: number, colIndexOrColId: number | string, hexadecimalBackColor: string): boolean;
    /**
     * Returns the background-color of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellBackColor(1, 'status', '#ffffff');
     * grid.getCellBackColor(1, 'status'); // e.g. '#ffffff'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The hexadecimal background color (e.g., `'#ffffff'`), or `null` if not set.
     */
    getCellBackColor(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the font-color of the cell in the colId or colIndex column in the row-th row.
     * Returns true if it operates normally. Enter a hexadecimal color. Ex) '#ffffff'
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellFontColor(1, 'status', '#ff0000');
     * ```
     *
     * @param row - Row index.
     * @param hexadecimalFontColor - Font color in hexadecimal format (e.g., `'#ffffff'`).
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if values are set successfully.
     */
    setCellFontColor(row: number, colIndexOrColId: number | string, hexadecimalFontColor: string): boolean;
    /**
     * Returns the font-color of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellFontColor(1, 'status', '#ff0000');
     * grid.getCellFontColor(1, 'status'); // e.g. '#ff0000'
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns The hexadecimal font color (e.g., `'#ffffff'`), or `null` if not set.
     */
    getCellFontColor(row: number, colIndexOrColId: number | string): string | null;
    /**
     * Sets the fontBold of the cell in the colId or colIndex column in the row-th row.
     * If fontBold is true, the text is displayed in bold. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontBold(1, 'name', true); // Sets first row, column 'name' cell font to bold.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param isFontBold - `true` for bold font, `false` for normal weight.
     * @returns `true` if values are set successfully.
     */
    setCellFontBold(row: number, colIndexOrColId: number | string, isFontBold: boolean): boolean;
    /**
     * Returns the fontBold of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontBold(1, 'name', true);
     * grid.isCellFontBold(1, 'name'); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if font is bold; otherwise `false`.
     */
    isCellFontBold(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Sets the fontItalic of the cell in the colId or colIndex column in the row-th row.
     * If fontItalic is true, the text is displayed in italics. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellFontItalic(1, 'remarks', true); // Sets italic font for frist row, 'remarks' column cell.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param isFontItalic - `true` to italicize text, `false` otherwise.
     * @returns `true` if values are set successfully.
     */
    setCellFontItalic(row: number, colIndexOrColId: number | string, isFontItalic: boolean): boolean;
    /**
     * Returns the fontItalic of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setCellFontItalic(1, 'remarks', true);
     * grid.isCellFontItalic(1, 'remarks'); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if the column font is italic, otherwise `false`.
     */
    isCellFontItalic(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Sets the fontThruline of the cell in the colId or colIndex column in the row-th row.
     * If fontThruline is true, the text is displayed with a strikethrough. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontThruline(1, 'price', true); // Adds strikethrough to first row, 'price' column cell.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param isFontThruline - `true` to apply strikethrough, `false` otherwise.
     * @returns `true` if values are set successfully.
     */
    setCellFontThruline(row: number, colIndexOrColId: number | string, isFontThruline: boolean): boolean;
    /**
     * Returns the fontThruline of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontThruline(1, 'price', true);
     * grid.isCellFontThruline(1, 'price'); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if strikethrough is enabled; otherwise, `false`.
     */
    isCellFontThruline(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Sets the fontUnderline of the cell in the colId or colIndex column in the row-th row.
     * If fontUnderline is true, the text is displayed with an underline. Returns true if it operates normally.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontUnderline(1, 'productName', true); // Adds underline to first row, 'productName' column cell.
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @param isFontUnderline - `true` to underline text, `false` otherwise.
     * @returns `true` if values are set successfully.
     */
    setCellFontUnderline(row: number, colIndexOrColId: number | string, isFontUnderline: boolean): boolean;
    /**
     * Returns the fontUnderline of the cell in the colId or colIndex column in the row-th row.
     *
     * ### Example usage:
     * ```typescript
     * grid.setColFontUnderline(1, 'productName', true);
     * grid.isCellFontUnderline(1, 'productName'); // e.g. `true`
     * ```
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if underline is enabled; otherwise, `false`.
     */
    isCellFontUnderline(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Selects the cell in the colId or colIndex column in the row-th row.
     * If the cell is set to visible false, it does not operate. Returns true if it operates normally.
     * 
     * - Selection fails if the cell is not visible.
     *
     * @param row - Row index of the cell.
     * @param colIndexOrColId - Column index or ID of the cell.
     * @returns `true` if the cell is selected successfully; otherwise `false`.
     */
    setTargetCell(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Returns the row number of the currently selected main target cell.
     *
     * @returns The row index of the active cell, or `null` if none is selected.
     */
    getTargetRow(): number | null;
    /**
     * Returns the colId of the currently selected main target cell.
     *
     * @returns Column ID, or `null` if no cell is currently selected.
     */
    getTargetCol(): string | null;
    /**
     * Selects the cells in the range from start row, start colId or colIndex to end row, end colId or colIndex.
     * Returns true if it operates normally. An error occurs if an out-of-bounds range is selected.
     * 
     * - Throws an error if the specified range is invalid.
     *
     * @param startRow - Starting row index.
     * @param startColIndexOrColId - Starting column index or ID.
     * @param endRow - Ending row index.
     * @param endColIndexOrColId - Ending column index or ID.
     * @returns `true` if cells are successfully selected.
     */
    setActiveCells(startRow: number, startColIndexOrColId: number | string, endRow: number, endColIndexOrColId: number | string): boolean;
    /**
     * Returns the row numbers of the currently selected cells.
     *
     * @returns Array of selected column IDs (e.g., `[1, 2]`).
     */
    getActiveRows(): number[];
    /**
     * Returns the column IDs of currently active (selected) cells.
     *
     * @returns Array of selected column IDs (e.g., `['col1', 'col2']`).
     */
    getActiveCols(): string[];
    /**
     * Returns the information of the currently selected cell range as an object.
     *
     * @returns Object containing start and end row/column IDs.
     * 
     * ### Example usage:
     * ```typescript
     * const activeRange = grid.getActiveRange(); 
     * // { startRow: 1, startColId: 'col1', endRow: 2, endColId: 'col2' }
     * ```
     */
    getActiveRange(): { startRow: number | null, startColId : string | null, endRow : number | null, endColId : string | null };
    /**
     * Opens the editor of the cell in the colId or colIndex column in the row-th row. If the cell is locked, it does not operate. Returns true if it operates normally.
     *
     * - Does nothing if the cell is locked.
     *
     * @param row - Row index.
     * @param colIndexOrColId - Column index or ID.
     * @returns `true` if editor opened successfully.
     */
    editCell(row: number, colIndexOrColId: number | string): boolean;
    /**
     * Undoes the changes of the currently active grid in the order recorded in the record. Returns true if it operates normally.
     *
     * @returns `true` if redo operation succeeds.
     */
    redo(): boolean;
    /**
     * Restores the last undo of the currently active grid in the order recorded in the record. Returns true if it operates normally.
     *
     * @returns `true` if undo operation is successful.
     */
    undo(): boolean;
    // _getFooterRow(rowIndex: number): void;
    // _getFooterCell(rowIndex: number, colIndexOrColId: number | string): void;
    // _getFooterCells(): void;
    // _getRow(rowIndex: number): void;
    // _getCell(rowIndex: number, colIndexOrColId: number | string): void;
    // _getCells(): void;
    // _doFilter(): void;
    // _getDataTypeStyle(): void;
    // _getFilterSpan(): void;
    // _getFooterFormula(): void;
    /* removeGridMethod(): void */
}
