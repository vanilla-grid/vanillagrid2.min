import type { DefaultGridCssInfo, DefaultGridInfo } from "./gridInfo";
import type { DefaultColInfo } from "./colInfo";
import type { DataType } from "./dataType";
import type { documentEvent } from "./event";
import type { Grid } from "./grid";
import type { GridMethods } from "./gridMethods";

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
    getGrid(gridId: string): GridMethods | null;

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
