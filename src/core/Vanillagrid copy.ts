

function getVanillagrid(): Vanillagrid {
    function VanillagridInstance () {
        /*
        this._VanillaGrid = null;
        this._GridHeader = null;
        this._GridBody = null;
        this._GridFooter = null;
        this._GridData = null;
        */

        this.create = function () {

        }
        this.destroy = function () {
            this.gridIds.forEach((gId: string) => {
                const vanillagrid = document.getElementById(gId);
                const stylesSheet = document.getElementById(gId + '_styles-sheet');
                if (vanillagrid) (vanillagrid as any).parentNode.removeChild(vanillagrid);
                if (stylesSheet) (stylesSheet as any).parentNode.removeChild(stylesSheet);
                delete (window as any)[gId];
            });
            document.removeEventListener('mousedown', this._docEvent_mousedown);
            document.removeEventListener('mouseup', this._docEvent_mouseup);
            document.removeEventListener('keydown', this._docEvent_keydown);
            document.removeEventListener('copy', this._docEvent_copy);
            document.removeEventListener('paste', this._docEvent_paste);
            GRIDS = {};
            this.gridIds = [];
        }
    }
    return new (VanillagridInstance as unknown as VanillagridConstructor)();
}
export default getVanillagrid();
