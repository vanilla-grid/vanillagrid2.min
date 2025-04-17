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
 * import { getVanillagrid, getVanillagridConfig } from 'vanillagrid2';
 * // Customizing vanillagrid with vgConfig.
 * const vgConfig = getVanillagridConfig();
 * // Create a vanillagrid object by injecting a customized vgConfig.
 * const vg = getVanillagrid(vgConfig);
 * vg.init();   // Initialize vanillagrid in document. Provide init function separately considering SSR environment.
 * // Inject the component screen to create a grid of the div data-vanillagrid declared on the screen.
 * // If the HTMLElement is not injected, it is created in the document by default.
 * vg.mountGrid(HTMLElement);
 * // For example, the grid format declared in an HTML document.
 * // <div data-vanillagrid data-id="myGridId" height="200px">
 * //   <div data-col id="colId01" header="header" data-type="text" width="600"></div>
 * // </div>
 * // Get the functions of the grid created using the getGrid method of the vanillagrid object.
 * const myGrid = vg.getGrid('myGridId');
 * // Manipulate the grid by leveraging its features.
 * myGrid.load([{id: '001', name: 'Alice'}, {id: '002', name: 'Bob'}]);
 * // When unmounting a component, you must remove the grid via vanillagrid's unmountGrid.
 * vg.unmountGrid(HTMLElement);
 * // If you want to remove the vanillagrid object and delete the applied document event and css, you can use destroy.
 * // (Note that the vanillagrid object is created as a singleton.)
 * vg.destroy();
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
     * const myGrid = vg.getGrid('myGridId');
     * myGrid.load(data);
     * ```
     *
     * @param gridId - Unique identifier of the grid instance.
     * @returns Methods available for managing the specified grid instance.
     */
    getGrid(gridId: string): GridMethods | null;
    /**
     * Initializes the vanillagrid object. Registers a handler to manipulate the grid,
     * defines the CSS required for the grid, and declares a document event.
     * This is a method for defining the entire public part that must be applied after creating a document in an SSR environment.
     * If it is not an SSR environment, it is recommended to run it only once in main.js, etc.
     * 
     * ### Example usage:
     * ```typescript
     * const vg = getVanillagrid(vgConfig);
     * vg.init();
     * ```
     */
    init(): void,
    /**
     * Mounts and initializes grids within a specified DOM element.
     *
     * - Searches the provided `HTMLElement` (or the entire `document` if not provided) 
     *   for elements with the attribute `data-vanillagrid`.
     * - Creates grid structures and attaches 
     *   necessary event handlers to manage interactions such as cell clicks, sorting, filtering, 
     *   editing, and range selection.
     * - Registers the newly created grids within the internal grid management system.
     *
     * **Important:**
     * - Must be called **after** the `init()` method has been executed.
     * - Throws an error if `init()` has not been previously executed.
     *
     * ### Example usage:
     * ```typescript
     * const vg = getVanillagrid(vgConfig);
     * vg.init(); // Must call init before mountGrid
     *
     * // Mount grids declared within a specific HTML element.
     * vg.mountGrid(specificHTMLElement);
     *
     * // or mount grids declared globally in the document.
     * vg.mountGrid();
     * ```
     *
     * ### HTML Structure:
     * ```html
     * <div data-vanillagrid data-id="myGridId" height="200px">
     *   <div data-col id="colId01" header="Header" data-type="text" width="600"></div>
     * </div>
     * ```
     *
     * @param element - (Optional) DOM element containing grid definitions. If omitted, searches the entire document.
     * @throws Error if Vanillagrid has not been initialized via `init()`.
     * @throws Error if duplicate grid IDs are detected.
     */
    mountGrid(element?: HTMLElement): void;
    /**
     * Removes the vanillagrid object. The vanillagrid object is initially created as a singleton and null is injected.
     * The vanillagrid object can be recreated via getVanillagrid when needed.
     */
    destroy(): void;
    /**
     * Unmounts and removes grid instances from the specified DOM element.
     *
     * - Searches the provided `HTMLElement` (or the entire `document` if not provided) 
     *   for elements with the attribute `data-vanillagrid`.
     * - Completely removes grid-related DOM elements and clears associated resources.
     * - Deregisters the removed grids from internal management systems, preventing memory leaks and event-handling issues.
     *
     * **Important:**
     * - Should be invoked when the component or page hosting the grid is unmounted.
     * - This operation does not destroy the entire vanillagrid instance; use `destroy()` for complete removal.
     *
     * ### Example usage:
     * ```typescript
     * // Unmount grids within a specific element.
     * vg.unmountGrid(specificHTMLElement);
     *
     * // Or unmount all grids globally within the document.
     * vg.unmountGrid();
     * ```
     *
     * @param element - (Optional) DOM element containing grids to unmount. Defaults to entire document if omitted.
     * @throws Error if Vanillagrid has not been initialized via `init()`.
     */
    unmountGrid(element?: HTMLElement): void;
    /**
     * Holds event handlers applied globally to the document for managing grid interactions.
     *
     * This object contains event listeners that manage user interactions involving grids at the document level, including mouse and keyboard events, as well as clipboard operations (copy and paste). Each handler is registered globally and ensures that relevant grid behaviors (such as cell selection, cell navigation, and clipboard management) operate smoothly and intuitively.
     *
     * - **Mouse events**: Manage grid selections and range highlighting (`mousedown`, `mouseup`).
     * - **Keyboard events**: Provide keyboard-based navigation and editing support (`keydown`).
     * - **Clipboard events**: Handle copying and pasting data to and from grid cells (`copy`, `paste`).
     */
    documentEvent: documentEvent;
    /**
     * Stores variables that manipulate the behavior of the grid. It is recommended not to change them.
     */
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
    /**
     * Whether the vanillagrid object has been initialized. A variable to prevent duplicate initialization. Used in SSR environments.
     */
    _initialized: boolean;
}

/**
 * Configuration interface for initializing and customizing Vanillagrid instances.
 * 
 * `VanillagridConfig` provides an organized way to configure global defaults, visual elements, data handling behaviors, 
 * and byte-size checks that apply across all grids created through Vanillagrid. 
 * Developers can easily customize grid defaults to suit specific UI/UX or functional requirements, significantly reducing repetitive settings and enhancing consistency across multiple grid instances.
 * 
 * This configuration object can be generated using the `getVanillagridConfig()` method, allowing default values to be customized or overridden by passing a custom config object into `getVanillagrid(config)`.
 * 
 * ### Example usage:
 * ```typescript
 * import { getVanillagrid, getVanillagridConfig } from 'vanillagrid2';
 * 
 * const config = getVanillagridConfig();
 * config.attributes.defaultGridInfo.dateFormat = 'dd-mm-yyyy';
 * 
 * const vg = getVanillagrid(config);
 * vg.init();
 * ```
 */
export interface VanillagridConfig {
    /**
     * Visual and interactive HTML elements used within grid headers.
     */
    elements : {
        /**
         * Custom HTML element representing the ascending sort indicator icon 
         * displayed upon header double-click.
         */

        sortAscSpan: HTMLSpanElement | null;
        /**
         * Custom HTML element representing the descending sort indicator icon 
         * displayed upon header double-click.
         */
        sortDescSpan: HTMLSpanElement | null;
        /**
         * Custom HTML element representing the filter indicator icon 
         * displayed within column headers.
         */
        filterSpan: HTMLSpanElement | null;
    };
    /**
     * Defines custom footer formulas keyed by column IDs, allowing dynamic calculations such as sums or averages.
     *
     * Example:
     * ```typescript
     * footerFormula: {
     *   total: (colValues) => colValues.reduce((sum, val) => sum + val, 0).toString()
     * }
     * ```
     */
    footerFormula: Record<string, (colValues: any[]) => string>;
    /**
     * Data type definitions allowing users to extend or customize grid cell behaviors.
     */
    dataType: {
        [key: string]: DataType;
    };
    /**
     * Default attribute sets applied globally to grids, covering functional behaviors, CSS styling, and column properties.
     */
    attributes: {
        /**
         * Default functional settings for grid behavior, such as selection policy, sorting, filtering, and display options.
         */
        defaultGridInfo: DefaultGridInfo;
        /**
         * Default CSS styling options applied globally to grids, ensuring consistent visual presentation and layout.
         */
        defaultGridCssInfo: DefaultGridCssInfo;
        /**
         * Default settings for column-level properties including visibility, data types, editing behaviors, and styling.
         */
        defaultColInfo: DefaultColInfo;
    };
    /**
     * Defines byte-size limits used for character-length checks, particularly useful for validation scenarios involving multi-byte character sets.
     * 
     * Default values assume UTF-8 encoding standards but can be customized according to different encoding schemes.
     */
    checkByte: CheckByte;
}

/**
 * Configuration for byte-size validation of character inputs based on their ASCII code ranges.
 * Useful for scenarios involving multilingual support or precise data length validation.
 */
export interface CheckByte {
    /**
     * Assigned byte size for characters with ASCII codes ≤ 0x7FF.
     */
    lessoreq0x7ffByte: number;
    /**
     * Assigned byte size for characters with ASCII codes > 0x7FF and ≤ 0xFFFF.
     */
    lessoreq0xffffByte: number;
    /**
     * Assigned byte size for characters with ASCII codes > 0xFFFF.
     */
    greater0xffffByte: number;
}
