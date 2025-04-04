export interface documentEvent {
    mousedown: ((e: MouseEvent) => unknown) | null;
    mouseup: ((e: MouseEvent) => unknown) | null;
    keydown: ((e: KeyboardEvent) => unknown) | null;
    copy: ((e: ClipboardEvent) => unknown) | null;
    paste: ((e: ClipboardEvent) => unknown) | null;
}
