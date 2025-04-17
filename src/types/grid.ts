import type { GridMethods } from "./gridMethods";
import type { GridCssInfo, GridInfo } from "./gridInfo";
import type { ColInfo } from "./colInfo";
import type { Cell, CellRecord } from "./cell";

export interface Grid{
    data: GridData;
    events: GridEvents;
    hendler: {
        gridHeader_dblclick(e: any): void;
        gridHeader_click(e: any): void;
        gridBody_mousemove(e: any): void;
        gridBody_mouseleave(e: any): void;
        gridBody_mouseenter(e: any): void;
        gridBody_dblclick(e: any): void;
        gridElement_click(e: any): void;
        gridElement_mousedown(e: any): void;
        gridElement_mousemove(e: any): void;
        gridElement_mouseleave(e: any): void;
    }
    methods: GridMethods;
    elements: {
        grid: GridElements;
        gridHeader: GridHeader;
        gridBody: GridBody;
        gridFooter: GridFooter;
    }
    _isMounted: boolean;
}
export interface GridData{
    id: string;
    gridInfo: GridInfo;
    gridCssInfo: GridCssInfo;
    colInfos: ColInfo[];
    variables: GridVariables;
}
export interface GridEvents {
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
}
interface GridVariables {
    activeRows: number[];
    activeCols: number[];
    activeCells: Cell[];
    targetCell: Cell | null;
    records: CellRecord[][];
    recordseq: number;
    sortToggle: Record<string, boolean>;
    filters: { colId : string, value : string }[];
    isDrawable: boolean;
}
export interface GridElements extends HTMLElement{
    _gridId: string;
    _type: string;
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
