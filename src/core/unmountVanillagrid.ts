import type { Vanillagrid } from "../types/vanillagrid";
import type { Grid } from "../types/grid";
import { removeAllChild } from "../utils/utils";

export const unmountVanillagrid = (vg: Vanillagrid, gridList: Record<string, Grid>, targetElement?: HTMLElement) => {
    if(!vg._initialized) throw new Error('Please initialize vanillagrid');
    const targetEl = targetElement ? targetElement : document;
    const vanillagridBoxList: NodeListOf<HTMLElement> = targetEl.querySelectorAll('[data-vanillagrid]');

    vanillagridBoxList.forEach((vanillagridBox: any) => {
        removeAllChild(vanillagridBox);
        delete gridList[vanillagridBox._gridId];
    });
}
