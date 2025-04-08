import type { Grid, Vanillagrid } from "../types/vanillagrid";

export const unmountVanillagrid = (vg: Vanillagrid, targetElement?: HTMLElement) => {
    if(!vg._initialized) throw new Error('Please initialize vanillagrid');
    const targetEl = targetElement ? targetElement : document;
    const vanillagrids: NodeListOf<Grid> = targetEl.querySelectorAll('vanilla-grid');

    vanillagrids.forEach((grid: Grid | null) => {
        grid!.parentNode!.removeChild(grid!);
        delete vg.grids[grid!._id];
        grid = null;
    });
}


