import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import { removeAllChild } from "../utils/utils";

export const unmountVanillagrid = (vg: Vanillagrid, gridList: Record<string, Grid>, targetElement?: HTMLElement) => {
    if(!vg._initialized) throw new Error('Please initialize vanillagrid');
    const targetEl = targetElement ? targetElement : document;
    const vanillagridBoxList: NodeListOf<HTMLElement> = targetEl.querySelectorAll('[data-vanillagrid]');

    vanillagridBoxList.forEach((vanillagridBox: any) => {
        const grid = vanillagridBox._gridId ? gridList[vanillagridBox._gridId] : null;
        if(grid && grid._isMounted) {
            grid.elements.gridHeader.removeEventListener('dblclick', grid.handler.gridHeader_dblclick);
            grid.elements.gridHeader.removeEventListener('click', grid.handler.gridHeader_click);
            grid.elements.gridBody.removeEventListener('mousemove', grid.handler.gridBody_mousemove);
            grid.elements.gridBody.removeEventListener('mouseleave', grid.handler.gridBody_mouseleave);
            grid.elements.gridBody.removeEventListener('mouseenter', grid.handler.gridBody_mouseenter);
            grid.elements.gridBody.removeEventListener('dblclick', grid.handler.gridBody_dblclick);
            grid.elements.grid.removeEventListener('click', grid.handler.gridElement_click);
            grid.elements.grid.removeEventListener('mousedown', grid.handler.gridElement_mousedown);
            grid.elements.grid.removeEventListener('mousemove', grid.handler.gridElement_mousemove);
            grid.elements.grid.removeEventListener('mouseleave', grid.handler.gridElement_mouseleave);
            
            removeAllChild(vanillagridBox);
            grid._isMounted = false;
            delete gridList[vanillagridBox._gridId];
        }
    });
};
