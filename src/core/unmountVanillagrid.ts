import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import { removeAllChild } from "../utils/utils";

export const unmountVanillagrid = (vg: Vanillagrid, gridList: Record<string, Grid>, targetElement?: HTMLElement) => {
    if(!vg._initialized) throw new Error('Please initialize vanillagrid');
    const targetEl = targetElement ? targetElement : document;
    const vanillagridBoxList: NodeListOf<HTMLElement> = targetEl.querySelectorAll('[data-vanillagrid]');

    vanillagridBoxList.forEach((vanillagridBox: any) => {
        const grid = gridList[vanillagridBox._gridId];
        if(grid._isMounted) {
            grid.elements.gridHeader.removeEventListener('dblclick', grid.hendler.gridHeader_dblclick);
            grid.elements.gridHeader.removeEventListener('click', grid.hendler.gridHeader_click);
            grid.elements.gridBody.removeEventListener('mousemove', grid.hendler.gridBody_mousemove);
            grid.elements.gridBody.removeEventListener('mouseleave', grid.hendler.gridBody_mouseleave);
            grid.elements.gridBody.removeEventListener('mouseenter', grid.hendler.gridBody_mouseenter);
            grid.elements.gridBody.removeEventListener('dblclick', grid.hendler.gridBody_dblclick);
            grid.elements.grid.removeEventListener('click', grid.hendler.gridElement_click);
            grid.elements.grid.removeEventListener('mousedown', grid.hendler.gridElement_mousedown);
            grid.elements.grid.removeEventListener('mousemove', grid.hendler.gridElement_mousemove);
            grid.elements.grid.removeEventListener('mouseleave', grid.hendler.gridElement_mouseleave);
            
            removeAllChild(vanillagridBox);
            delete gridList[vanillagridBox._gridId];
        }
    });
};
