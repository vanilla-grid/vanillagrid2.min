import type { DefaultGridCssInfo, DefaultGridInfo, GridCssInfo, GridInfo } from "./gridInfo";
import type { ColInfo, DefaultColInfo } from "./colInfo";
import type { DataType } from "./dataType";
import type { GridMethods } from "./gridMethods";
import type { documentEvent } from "./event";
import type { Cell, CellRecord } from "./cell";

/**
 * The main interface representing the Vanillagrid instance.
 * 
 * Vanillagrid provides intuitive and flexible methods and properties to manage grid structures without relying on external libraries or frameworks. It supports easy configuration through predefined default settings, extensive styling capabilities, and straightforward data management via JSON objects. 
 * 
 * - **Life Cycle Management**: Provides methods to explicitly manage the creation and destruction of grid instances.
 * - **Customization**: Offers a variety of properties and customizable elements (e.g., sorting icons, filtering indicators).
 * - **Styling and CSS**: Facilitates CSS styling via default CSS settings, reducing repetitive code and enhancing reusability.
 * - **Cell Selection & Editing**: Allows fine-grained cell selection, active range management, and cell editing features.
 * - **Undo & Redo**: Includes undo and redo functionalities for robust data management.
 * 
 * ### Example usage:
 * ```typescript
 * const vg = getVanillagrid();
 * vg.create();
 * const grid = vg.get('myGrid');
 * grid.load([{id: '001', name: 'Alice'}, {id: '002', name: 'Bob'}]);
 * ```
 */
export interface Vanillagrid extends VanillagridConfig{
    grids : Record<string, Grid>;
    /**
     * An array containing IDs of all grids managed by this instance.
     */
    //gridIds: string[];
    /**
     * Retrieves grid instance methods by grid ID.
     *
     * ### Example usage:
     * ```typescript
     * const myGrid = vg.get('myGrid');
     * myGrid.load(data);
     * ```
     *
     * @param gridId - Unique identifier of the grid instance.
     * @returns Methods available for managing the specified grid instance.
     */
    getGrid(gridId: string): Grid;

    init(): void,
    /**
     * Creates and initializes the Vanillagrid instance.
     *
     * - Automatically renders the grid structure on the page.
     * - Should be called to start using Vanillagrid.
     *
     * ### Example usage:
     * ```typescript
     * vg.create();
     * ```
     */
    mountGrid(element?: HTMLElement): void;
    /**
     * Destroys the Vanillagrid instance, cleaning up all associated resources and events.
     *
     * - Completely removes grid instance and cleans up event listeners and internal data.
     */
    destroy(): void;
    unmountGrid(element?: HTMLElement): void;
    
    documentEvent: documentEvent;
    _status: {
        isDragging: boolean,
        onHeaderDragging: boolean,
        isHeaderDragging: boolean,
        mouseX: number,
        mouseY: number,
        activeGrid: Grid | null,
        activeGridEditor: HTMLElement | null,
        editOldValue: any | null,
        editNewValue: any | null,
        filterOldValue: any | null,
        filterNewValue: any | null,
        mouseoverCell: HTMLElement | null,
        scrollInterval: NodeJS.Timeout |  null,
    }
    _initialized: boolean;

    _VanillaGrid: any;
    _GridHeader: any;
    _GridBody: any;
    _GridFooter: any;
    _GridData: any;
}

/**
 * 
 */
export interface VanillagridConfig {
    elements : {
        /**
         * HTML element for ascending sort icon displayed upon double-clicking header cells.
         */
        sortAscSpan: HTMLSpanElement | null;
        /**
         * HTML element representing descending sort icon, displayed upon header double-click.
         */
        sortDescSpan: HTMLSpanElement | null;
        /**
         * HTML element representing filter icon in column headers.
         */
        filterSpan: HTMLSpanElement | null;
    };
    /**
     * Defines footer formulas keyed by column IDs.
     * Example: `{ "total": "sum(colId)" }`
     */
    footerFormula: Record<string, string>;
    /**
     * Data type configurations for grid cells.
     */
    dataType: {
        [key: string]: DataType;
    };
    attributes: {
        /**
         * Default grid configuration values controlling functional behaviors of grids.
         * Reduces repetitive configuration in `<vanilla-grid>` elements.
         */
        defaultGridInfo: DefaultGridInfo;
        /**
         * Default CSS configuration for grid styling.
         * Facilitates consistent UI across multiple grid instances.
         */
        defaultGridCssInfo: DefaultGridCssInfo;
        /**
         * Default configuration for column-level properties.
         * Simplifies column setup and ensures consistency.
         */
        defaultColInfo: DefaultColInfo;
    };
    checkByte: CheckByte;
}

export interface CheckByte {
    /**
     * Byte size limit for characters with ASCII code ≤ 0x7FF.
     * Customizable based on encoding.
     */
    lessoreq0x7ffByte: number;
    /**
     * Byte size limit for characters with ASCII codes > 0x7FF and ≤ 0xFFFF.
     * Customizable based on encoding.
     */
    lessoreq0xffffByte: number;
    /**
     * Byte size limit for characters with ASCII code > 0xFFFF.
     * Customizable based on encoding.
     */
    greater0xffffByte: number;
}
export interface Grid extends GridMethods, HTMLElement{
    _id: string;
    _gridInfo: GridInfo;
    _gridCssInfo: GridCssInfo;
    _colInfos: ColInfo[];
    _defaultColInfo: DefaultColInfo;
    _variables: GridVariables;
    _events: {
        onActiveCell(row: number, colId: string): boolean;
        onActiveCells(startRow: number, startColId: string, endRow: number, endColId: string): boolean;
        onActiveRow(row: number): boolean;
        onActiveRows(startRow: number, endRow: number): boolean;
        onActiveCol(colId: string): boolean;
        onActiveCols(startColId: string, endColId: string): boolean;
        onBeforeChange(row: number, colId: string, oldValue: any, newValue: any): boolean;
        onAfterChange(row: number, colId: string, oldValue: any, newValue: any): void;
        onBeforeClickCell(row: number, colId: string): boolean;
        onAfterClickCell(row: number, colId: string): void;
        onClickSelect(row: number, colId: string, selectNode: HTMLElement): boolean;
        onClickCheckbox(row: number, colId: string, checkboxNode: HTMLElement): boolean;
        onClickButton(row: number, colId: string, buttonNude: HTMLElement): boolean;
        onClickLink(row: number, colId: string, linkNode: HTMLElement): boolean;
        onBeforeDblClickCell(row: number, colId: string): boolean;
        onAfterDblClickCell(row: number, colId: string): void;
        onBeforeClickHeader(row: number, colId: string): boolean;
        onAfterClickHeader(row: number, colId: string): void;
        onBeforeDblClickHeader(row: number, colId: string): boolean;
        onAfterDblClickHeader(row: number, colId: string): void;
        onBeforeEditEnter(row: number, colId: string, editorNode: HTMLElement): boolean;
        onAfterEditEnter(row: number, colId: string, editorNode: HTMLElement): void;
        onEditEnding(row: number, colId: string, oldValue: any, newValue: any): boolean;
        onClickFilter(row: number, colId: string, filterNode: HTMLElement): boolean;
        onChooseFilter(row: number, colId: string, oldValue: any, newValue: any): boolean;
        onPaste(startRow: number, startColId: string, clipboardText: string): boolean;
        onCopy(startRow: number, startColId: string, endRow: number, endColId: string, copyText: string): boolean;
        onResize(colId: string): boolean;
        onKeydownEditor(event: KeyboardEvent): boolean;
        onInputEditor(event: InputEvent): boolean;
        onKeydownGrid(event: KeyboardEvent): boolean;
    };
    gridHeader: GridHeader;
    gridBody: GridBody;
    gridFooter: GridFooter;
    _vg: Vanillagrid;
}
interface GridVariables {
    _activeRows: number[];
    _activeCols: number[];
    _activeCells: Cell[];
    _targetCell: Cell | null;
    _records: CellRecord[][];
    _recordseq: number;
    _sortToggle: Record<string, boolean>;
    _filters: { colId : string, value : string }[];
    _isDrawable: boolean;
}
export interface GridHeader extends HTMLElement{
    _gridId: string;
    _type: string;
    _gridHeaderCells: Cell[][];
}
export interface GridBody extends HTMLElement{
    _gridId: string;
    _type: string;
    _gridBodyCells: Cell[][];
}
export interface GridFooter extends HTMLElement{
    _gridId: string;
    _type: string;
    _gridFooterCells: Cell[][];
}
