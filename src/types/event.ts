/**
 * Holds event handlers applied globally to the document for managing grid interactions.
 *
 * This object contains event listeners that manage user interactions involving grids at the document level, including mouse and keyboard events, as well as clipboard operations (copy and paste). Each handler is registered globally and ensures that relevant grid behaviors (such as cell selection, cell navigation, and clipboard management) operate smoothly and intuitively.
 *
 * - **Mouse events**: Manage grid selections and range highlighting (`mousedown`, `mouseup`).
 * - **Keyboard events**: Provide keyboard-based navigation and editing support (`keydown`).
 * - **Clipboard events**: Handle copying and pasting data to and from grid cells (`copy`, `paste`).
 */
export interface documentEvent {
    /**
     * Applies an event to the document that will perform grid changes when the mouse is down.
     */
    mousedown: ((e: MouseEvent) => unknown) | null;
    /**
     * Apply a grid cell range selection event to the document when the mouse is up.
     */
    mouseup: ((e: MouseEvent) => unknown) | null;
    /**
     * Keyboard down event to apply to the document. Only works if there is an active grid. 
     * Includes events such as undo, redo, select all, and move cell range.
     */
    keydown: ((e: KeyboardEvent) => unknown) | null;
    /**
     * Applies an event that occurs when copying the contents of a grid cell to the document.
     */
    copy: ((e: ClipboardEvent) => unknown) | null;
    /**
     * Applies the event that occurs when pasting the contents of a grid cell to the document.
     */
    paste: ((e: ClipboardEvent) => unknown) | null;
}
