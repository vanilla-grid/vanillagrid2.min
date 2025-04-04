import type { CellData } from "./cell";

/**
 * Defines custom behaviors, styles, and data handling for specific cell data types in Vanillagrid.
 *
 * `DataType` provides detailed control over how grid cells handle data types by allowing developers to specify
 * CSS styles, event handlers, editor components, and data formatting logic for custom cell data types.
 *
 * When defining a custom data type (e.g., `'img'`, `'radio'`, `'tree'`), you must implement the necessary methods
 * within a `DataType` object and assign it to `vg.dataType`. Cells utilize these definitions by specifying the
 * corresponding `dataType` attribute in the `<v-col>` element.
 *
 * ### Example (Defining a custom `'radio'` dataType):
 * ```typescript
 * vg.dataType.radio = {
 *   cellStyle: { textAlign: 'center' },
 *   onClick: (event, data) => {
 *       vg.get(data.gridId).setColSameValue(data.col, 'Y');
 *   },
 *   getText: (value) => (value === 'Y' ? 'Checked' : 'Unchecked'),
 * };
 *
 * // Usage in v-col
 * <v-col id="status" dataType="radio"></v-col>
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
     * @param data - Data object of the selected cell.
     */
    onSelected?: (target: HTMLElement, data: CellData) => void;
    /**
     * Called when a cell selection is removed.
     *
     * @param target - Unselected cell HTMLElement.
     * @param data - Data object of the unselected cell.
     */
    onUnselected?: (target: HTMLElement, data: CellData) => void;
    /**
     * Triggered when a key is pressed while the cell is selected.
     *
     * @param event - Keyboard event object.
     * @param data - Data object of the selected cell.
     */
    onSelectedAndKeyDown?: (event: KeyboardEvent, data: CellData) => void;
    /**
     * Triggered when a cell is clicked.
     *
     * @param event - Mouse click event.
     * @param data - Data object of the clicked cell.
     */
    onClick?: (event: MouseEvent, data: CellData) => void;
    /**
     * Triggered when the mouse button is pressed down on the cell.
     *
     * @param event - MouseDown event object.
     * @param data - Data object of the target cell.
     */
    onMousedown?: (event: MouseEvent, data: CellData) => void;
    /**
     * Determines the value to be stored in a cell upon loading data.
     *
     * - Converts or formats raw input values before storing.
     *
     * @param value - Original input data for the cell.
     * @returns The formatted or processed value.
     */
    getValue?: (value: any) => any;
    /**
     * Converts the stored cell value to a text representation used in sorting, filtering, and displaying.
     *
     * @param value - Stored value in the cell.
     * @returns Text representation of the value.
     */
    getText?: (value: any) => string | null;
    /**
     * Creates the visual element that represents the cell data when displayed in the grid.
     *
     * @param data - Data object of the cell.
     * @returns HTMLElement representing the cell content, or `null` if no custom element is required.
     */
    getChildNode?: (data: CellData) => HTMLElement | null;
    /**
     * Creates and returns the editor HTMLElement used when editing a cell.
     *
     * @param target - Target cell HTMLElement being edited.
     * @param data - Data object of the cell.
     * @param call_modify - Function to call when editor content changes.
     * @param call_endEdit - Function to end editing mode.
     * @returns Editor HTMLElement.
     */
    getEditor?: (
        target: HTMLElement,
        data: CellData,
        call_modify: () => void,
        call_endEdit: () => void
    ) => HTMLElement | null;
    /**
     * Extracts and returns the value from the cell editor after editing.
     *
     * @param target - Editor HTMLElement.
     * @param data - Data object of the edited cell.
     * @returns Edited value to be stored in the cell.
     */
    getEditedValue?: (target: HTMLElement, data: CellData) => any;
    /**
     * Converts cell value into a string specifically used by the filtering mechanism.
     *
     * @param value - Stored cell value.
     * @returns Filter-compatible string representation of the value.
     */
    getFilterValue?: (value: any) => string | null;
    /**
     * Converts the cell value into a form suitable for sorting operations.
     *
     * @param value - Original cell value.
     * @returns Value suitable for sorting comparisons.
     */
    getSortValue?: (value: any) => any;
    /**
     * Returns the value used when the cell content is copied to the clipboard.
     *
     * @param value - Original cell value.
     * @returns Value to be copied to the clipboard.
     */
    getCopyValue?: (value: any) => any;
    /**
     * Processes clipboard content and converts it to a valid cell value during paste operations.
     *
     * @param data - Data object of the target cell.
     * @param text - Text content from the clipboard.
     * @returns Converted value suitable for pasting into the cell.
     */
    getPasteValue?: (data: CellData, text: string) => any;
}
