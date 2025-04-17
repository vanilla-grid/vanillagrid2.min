import type { Cell, CellData } from "./cell";

/**
 * Defines custom behaviors, styles, and data handling for specific cell data types in Vanillagrid.
 *
 * `DataType` provides detailed control over how grid cells handle data types by allowing developers to specify
 * CSS styles, event handlers, editor components, and data formatting logic for custom cell data types.
 *
 * When defining a custom data type (e.g., `'img'`, `'radio'`, `'tree'`), you must implement the necessary methods
 * within a `DataType` object and assign it to `vg.dataType`. Cells utilize these definitions by specifying the
 * corresponding `dataType` attribute in the `<div data-col>` element.
 *
 * ### Example (Defining a custom `'radio'` dataType):
 * ```typescript
 * vgConfig.dataType = {
 *     radio : {
 *         //Specify the justify-content and text-align properties in the cell's style.
 *         cellStyle: {
 *             justifyContent: "center",
 *             textAlign: "center",
 *         },
 *         //When the 'Enter' key is pressed while a cell is selected, the value of that cell changes to "Y".
 *         onSelectedAndKeyDown : function (event, gridId, data) {
 *             if(event.key === 'Enter' || event.key === ' ') {
 *                 vg.getGrid(gridId)!.setColSameValue(data.colId, "N", true);
 *                 vg.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, "Y", true);
 *                 event.stopPropagation();
 *                 event.preventDefault();
 *                 return false;
 *             }
 *             return false;
 *         },
 *         //Selecting a cell with the mouse changes the cell's value to "Y".
 *         onClick : function (event, gridId, data) {
 *             vg.getGrid(gridId)!.setColSameValue(data.colId, "N", true);
 *             vg.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, "Y", true);
 *         },
 *         //Returns the value as is.
 *         getValue: function (gridId, value) {
 *             return value;
 *         },
 *         //Returns "true" when value is "Y", otherwise "false".
 *         getText: function (gridId, value) {
 *             const text = value === "Y" ? "true" : "false";
 *             return text;
 *         },
 *         //This is a radio type input and returns the HTML element that is checked when data is "Y".
 *         getChildNode: function (gridId, data) {
 *             const childNode: any = document.createElement("input");
 *             childNode.setAttribute("type", "radio");
 *             childNode.setAttribute("name", data.name? data.name : data.colId);
 *             childNode.setAttribute("value", "" + data.rowIndex);
 *             childNode._gridId = gridId;
 *             childNode.rowIndex = data.rowIndex;
 *             childNode.colId = data.colId;
 *             childNode.checked = data.value === "Y";
 *             return childNode;
 *         },
 *         //The filter applies "●" to checked values ​​and "○" to unchecked values.
 *         getFilterValue: function (gridId, value) {
 *             const filterValue = value === "Y" ? "●" : "○";
 *             return filterValue;
 *         },
 *     }
 * }
 *
 * // Usage in v-col
 * <div data-col id="radioCol" dataType="radio"></div>
 * ```
 *
 * Each method within the interface controls specific aspects of cell lifecycle, rendering, and user interactions.
 */
export interface DataType {
    /**
     * Defines CSS styles applied directly to the cell element.
     *
     * ### Example:
     * ```typescript
     * cellStyle: {
     *     textAlign: 'center',
     *     justifyContent: 'center',
     * }
     */
    cellStyle?: Partial<CSSStyleDeclaration>;
    /**
     * Called when a cell becomes selected.
     *
     * @param target - Selected cell HTMLElement.
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the selected cell.
     */
    onSelected?: (targetCell: Cell, gridId: string, data: CellData) => void;
    /**
     * Called when a cell selection is removed.
     *
     * @param target - Unselected cell HTMLElement.
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the unselected cell.
     */
    onUnselected?: (targetCell: Cell, gridId: string, data: CellData) => void;
    /**
     * Triggered when a key is pressed while the cell is selected.
     *
     * @param event - Keyboard event object.
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the selected cell.
     */
    onSelectedAndKeyDown?: (event: KeyboardEvent, gridId: string, data: CellData) => boolean;
    /**
     * Triggered when a cell is clicked.
     *
     * @param event - Mouse click event.
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the clicked cell.
     */
    onClick?: (event: MouseEvent, gridId: string, data: CellData) => void;
    /**
     * Triggered when the mouse button is pressed down on the cell.
     *
     * @param event - MouseDown event object.
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the target cell.
     */
    onMousedown?: (event: MouseEvent, gridId: string, data: CellData) => void;
    /**
     * Determines the value to be stored in a cell upon loading data.
     *
     * - Converts or formats raw input values before storing.
     *
     * @param gridId - grid id to access gridMethods
     * @param value - Original input data for the cell.
     * @returns The formatted or processed value.
     */
    getValue?: (gridId: string, value: any) => any;
    /**
     * Converts the stored cell value to a text representation used in sorting, filtering, and displaying.
     *
     * @param gridId - grid id to access gridMethods
     * @param value - Stored value in the cell.
     * @returns Text representation of the value.
     */
    getText?: (gridId: string, value: any) => string | null;
    /**
     * Creates the visual element that represents the cell data when displayed in the grid.
     *
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the cell.
     * @returns HTMLElement representing the cell content, or `null` if no custom element is required.
     */
    getChildNode?: (gridId: string, data: CellData) => HTMLElement | null;
    /**
     * Creates and returns the editor HTMLElement used when editing a cell.
     *
     * @param target - Target cell HTMLElement being edited.
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the cell.
     * @param call_modify - Function to call when editor content changes.
     * @param call_endEdit - Function to end editing mode.
     * @returns Editor HTMLElement.
     */
    getEditor?: (
        targetCell: Cell,
        gridId: string, 
        data: CellData,
        call_modify: () => void,
        call_endEdit: () => void
    ) => HTMLElement | null;
    /**
     * Extracts and returns the value from the cell editor after editing.
     *
     * @param target - Editor HTMLElement.
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the edited cell.
     * @returns Edited value to be stored in the cell.
     */
    getEditedValue?: (target: HTMLElement, gridId: string, data: CellData) => any;
    /**
     * Converts cell value into a string specifically used by the filtering mechanism.
     *
     * @param gridId - grid id to access gridMethods
     * @param value - Stored cell value.
     * @returns Filter-compatible string representation of the value.
     */
    getFilterValue?: (gridId: string, value: any) => string | null;
    /**
     * Converts the cell value into a form suitable for sorting operations.
     *
     * @param gridId - grid id to access gridMethods
     * @param value - Original cell value.
     * @returns Value suitable for sorting comparisons.
     */
    getSortValue?: (gridId: string, value: any) => any;
    /**
     * Returns the value used when the cell content is copied to the clipboard.
     *
     * @param gridId - grid id to access gridMethods
     * @param value - Original cell value.
     * @returns Value to be copied to the clipboard.
     */
    getCopyValue?: (gridId: string, value: any) => any;
    /**
     * Processes clipboard content and converts it to a valid cell value during paste operations.
     *
     * @param gridId - grid id to access gridMethods
     * @param data - Data object of the target cell.
     * @param text - Text content from the clipboard.
     * @returns Converted value suitable for pasting into the cell.
     */
    getPasteValue?: (gridId: string, data: CellData, text: string) => any;
}
