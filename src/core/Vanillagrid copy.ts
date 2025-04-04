

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
            const vg = this;
            const vanillagrids: NodeListOf<HTMLElement> = document.querySelectorAll('vanilla-grid');
            for(const vanillagrid of vanillagrids) {
                if(!vanillagrid.getAttribute('id'))  throw new Error(`The grid's id is a required attribute.`);
                vg.gridIds.push(vanillagrid.getAttribute('id')!);
            }
            if (new Set(vg.gridIds).size !== vg.gridIds.length) throw new Error('There is a duplicate grid ID.');
            if (vg.gridIds.length <= 0) return;

            let gridIndex = 1;
            for(const vanillagrid of vanillagrids) {
                const gridHeaderCells: Cell[][] = [];
                const gridFooterCells: Cell[][] = [];
                const gridBodyCells: Cell[][] = [];
                let tempGridData: Cell, tempRows: Cell[];
                const colInfos: CellColInfo[] = [];
                let colCount = 0;
                
                const gId = utils.getAttributeWithCheckRequired('id', vanillagrid);
                if(!gId) throw new Error('Please insert id attribute in vanillgrid div');
                vanillagrid.classList.add(gId + '_vanillagrid');
                
                const grid = document.createElement('v-g') as any;
                grid.gId = gId;
                grid.info = {
                    gIndex : gridIndex,
                    gType : 'g',
                    gName : utils.nvl(vanillagrid.getAttribute('name'), gId) as string,
                    gLocked : utils.nvl(utils.getAttributeOnlyBoolean('locked', vanillagrid), vg.defaultGridInfo.locked),
                    gLockedColor : utils.nvl(utils.getAttributeOnlyBoolean('locked-color', vanillagrid), vg.defaultGridInfo.lockedColor),
                    gResizable : utils.nvl(utils.getAttributeOnlyBoolean('resizable', vanillagrid), vg.defaultGridInfo.resizable),
                    gRedoable : utils.nvl(utils.getAttributeOnlyBoolean('redoable', vanillagrid), vg.defaultGridInfo.redoable),
                    gRedoCount : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('redo-count', vanillagrid), vg.defaultGridInfo.redoCount),
                    gVisible : utils.nvl(utils.getAttributeOnlyBoolean('visible', vanillagrid), vg.defaultGridInfo.visible),
                    gHeaderVisible : utils.nvl(utils.getAttributeOnlyBoolean('header-visible', vanillagrid), vg.defaultGridInfo.headerVisible),
                    gRownumVisible : utils.nvl(utils.getAttributeOnlyBoolean('rownum-visible', vanillagrid), vg.defaultGridInfo.rownumVisible),
                    gRownumSize : utils.nvl(vanillagrid.getAttribute('rownum-size'), vg.defaultGridInfo.rownumSize),
                    gStatusVisible : utils.nvl(utils.getAttributeOnlyBoolean('status-visible', vanillagrid), vg.defaultGridInfo.statusVisible),
                    gSelectionPolicy : utils.nvl((utils.isIncludeEnum(selectionPolicyUnit, utils.toLowerCase(vanillagrid.getAttribute('selection-policy'))) ? utils.toLowerCase(vanillagrid.getAttribute('selectionPolicy')) : ''), vg.defaultGridInfo.selectionPolicy),
                    gNullValue : utils.nvl(vanillagrid.getAttribute('null-value'), vg.defaultGridInfo.nullValue),
                    gDateFormat : utils.nvl(vanillagrid.getAttribute('date-format'), vg.defaultGridInfo.dateFormat),
                    gMonthFormat : utils.nvl(vanillagrid.getAttribute('month-format'), vg.defaultGridInfo.monthFormat),
                    gAlterRow : utils.nvl(utils.getAttributeOnlyBoolean('alter-row', vanillagrid), vg.defaultGridInfo.alterRow),
                    gFrozenColCount : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('frozen-col-count', vanillagrid), vg.defaultGridInfo.frozenColCount),
                    gFrozenRowCount : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('frozen-row-count', vanillagrid), vg.defaultGridInfo.frozenRowCount),
                    gSortable : utils.nvl(utils.getAttributeOnlyBoolean('sortable', vanillagrid), vg.defaultGridInfo.sortable),
                    gFilterable : utils.nvl(utils.getAttributeOnlyBoolean('filterable', vanillagrid), vg.defaultGridInfo.filterable),
                    gAllCheckable : utils.nvl(utils.getAttributeOnlyBoolean('all-checkable', vanillagrid), vg.defaultGridInfo.allCheckable),
                    gCheckedValue : utils.nvl(vanillagrid.getAttribute('checked-value'), vg.defaultGridInfo.checkedValue),
                    gUncheckedValue : utils.nvl(vanillagrid.getAttribute('unchecked-value'), vg.defaultGridInfo.uncheckedValue),
                    gRownumLockedColor : null,
                    gStatusLockedColor : null,
                }
                gridIndex++;
                grid.info.gRownumLockedColor = utils.nvl(utils.getAttributeOnlyBoolean('rownum-locked-color', vanillagrid), grid.info.gLocked);
                grid.info.gStatusLockedColor = utils.nvl(utils.getAttributeOnlyBoolean('status-locked-color', vanillagrid), grid.info.gLocked);
                if (grid.info.gCheckedValue === grid.info.gUncheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
                
                grid.cssInfo = {
                    width : utils.nvl(vanillagrid.getAttribute('width'), vg.defaultGridCssInfo.width),
                    height : utils.nvl(vanillagrid.getAttribute('height'), vg.defaultGridCssInfo.height),
                    margin : utils.nvl(vanillagrid.getAttribute('margin'), vg.defaultGridCssInfo.margin),
                    padding : utils.nvl(vanillagrid.getAttribute('padding'), vg.defaultGridCssInfo.padding),
                    sizeLevel : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('size-level', vanillagrid), vg.defaultGridCssInfo.sizeLevel),
                    verticalAlign : utils.nvl((utils.isIncludeEnum(verticalAlignUnit, utils.toLowerCase(vanillagrid.getAttribute('vertical-align'))) ? utils.toLowerCase(vanillagrid.getAttribute('vertical-align')) : ''), vg.defaultGridCssInfo.verticalAlign),
                    horizenBorderSize : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('horizen-border-size', vanillagrid), vg.defaultGridCssInfo.horizenBorderSize),
                    verticalBorderSize : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('vertical-border-size', vanillagrid), vg.defaultGridCssInfo.verticalBorderSize),
                    gridFontFamily : utils.nvl(vanillagrid.getAttribute('grid-font-family'), vg.defaultGridCssInfo.gridFontFamily),
                    editorFontFamily : utils.nvl(vanillagrid.getAttribute('editor-font-family'), vg.defaultGridCssInfo.editorFontFamily),
                    color : utils.nvl(vanillagrid.getAttribute('color'), vg.defaultGridCssInfo.color),
                    colorSet : utils.nvl(vanillagrid.getAttribute('color-set'), vg.defaultGridCssInfo.colorSet),
                    overflowWrap : utils.nvl(vanillagrid.getAttribute('overflow-wrap'), vg.defaultGridCssInfo.overflowWrap),
                    wordBreak : utils.nvl(vanillagrid.getAttribute('word-break'), vg.defaultGridCssInfo.wordBreak),
                    whiteSpace : utils.nvl(vanillagrid.getAttribute('white-space'), vg.defaultGridCssInfo.whiteSpace),
                    linkHasUnderLine : utils.nvl(utils.getAttributeOnlyBoolean('link-has-under-line', vanillagrid), vg.defaultGridCssInfo.linkHasUnderLine),
                    invertColor : utils.nvl(utils.getAttributeOnlyBoolean('invert-color', vanillagrid), vg.defaultGridCssInfo.invertColor),
                    gridBorderColor : utils.nvl(vanillagrid.getAttribute('grid-border-color'), vg.defaultGridCssInfo.gridBorderColor),
                    headerCellBackColor : utils.nvl(vanillagrid.getAttribute('header-cell-back-color'), vg.defaultGridCssInfo.headerCellBackColor),
                    headerCellBorderColor : utils.nvl(vanillagrid.getAttribute('header-cell-border-color'), vg.defaultGridCssInfo.headerCellBorderColor),
                    headerCellFontColor : utils.nvl(vanillagrid.getAttribute('header-cell-font-color'), vg.defaultGridCssInfo.headerCellFontColor),
                    footerCellBackColor : utils.nvl(vanillagrid.getAttribute('footer-cell-back-color'), vg.defaultGridCssInfo.footerCellBackColor),
                    footerCellBorderColor : utils.nvl(vanillagrid.getAttribute('footer-cell-border-color'), vg.defaultGridCssInfo.footerCellBorderColor),
                    footerCellFontColor : utils.nvl(vanillagrid.getAttribute('footer-cell-font-color'), vg.defaultGridCssInfo.footerCellFontColor),
                    bodyBackColor : utils.nvl(vanillagrid.getAttribute('body-back-color'), vg.defaultGridCssInfo.bodyBackColor),
                    bodyCellBackColor : utils.nvl(vanillagrid.getAttribute('body-cell-back-color'), vg.defaultGridCssInfo.bodyCellBackColor),
                    bodyCellBorderColor : utils.nvl(vanillagrid.getAttribute('body-cell-border-color'), vg.defaultGridCssInfo.bodyCellBorderColor),
                    bodyCellFontColor : utils.nvl(vanillagrid.getAttribute('body-cell-font-color'), vg.defaultGridCssInfo.bodyCellFontColor),
                    editorBackColor : utils.nvl(vanillagrid.getAttribute('editor-back-color'), vg.defaultGridCssInfo.editorBackColor),
                    editorFontColor : utils.nvl(vanillagrid.getAttribute('editor-font-color'), vg.defaultGridCssInfo.editorFontColor),
                    selectCellBackColor : utils.nvl(vanillagrid.getAttribute('select-cell-back-color'), vg.defaultGridCssInfo.selectCellBackColor),
                    selectCellFontColor : utils.nvl(vanillagrid.getAttribute('select-cell-font-color'), vg.defaultGridCssInfo.selectCellFontColor),
                    selectColBackColor : utils.nvl(vanillagrid.getAttribute('selectCol-back-color'), vg.defaultGridCssInfo.selectColBackColor),
                    selectColFontColor : utils.nvl(vanillagrid.getAttribute('selectCol-font-color'), vg.defaultGridCssInfo.selectColFontColor),
                    selectRowBackColor : utils.nvl(vanillagrid.getAttribute('selectRow-back-color'), vg.defaultGridCssInfo.selectRowBackColor),
                    selectRowFontColor : utils.nvl(vanillagrid.getAttribute('selectRow-font-color'), vg.defaultGridCssInfo.selectRowFontColor),
                    mouseoverCellBackColor : utils.nvl(vanillagrid.getAttribute('mouseover-cell-back-color'), vg.defaultGridCssInfo.mouseoverCellBackColor),
                    mouseoverCellFontColor : utils.nvl(vanillagrid.getAttribute('mouseover-cell-font-color'), vg.defaultGridCssInfo.mouseoverCellFontColor),
                    lockCellBackColor : utils.nvl(vanillagrid.getAttribute('lock-cell-back-color'), vg.defaultGridCssInfo.lockCellBackColor),
                    lockCellFontColor : utils.nvl(vanillagrid.getAttribute('lock-cell-font-color'), vg.defaultGridCssInfo.lockCellFontColor),
                    alterRowBackColor : utils.nvl(vanillagrid.getAttribute('alter-row-back-color'), vg.defaultGridCssInfo.alterRowBackColor),
                    alterRowFontColor : utils.nvl(vanillagrid.getAttribute('alter-row-font-color'), vg.defaultGridCssInfo.alterRowFontColor),
                    buttonFontColor : utils.nvl(vanillagrid.getAttribute('button-font-color'), vg.defaultGridCssInfo.buttonFontColor),
                    buttonBorderColor : utils.nvl(vanillagrid.getAttribute('buttonBorderColor'), vg.defaultGridCssInfo.buttonBorderColor),
                    buttonBackColor : utils.nvl(vanillagrid.getAttribute('button-back-color'), vg.defaultGridCssInfo.buttonBackColor),
                    buttonHoverFontColor : utils.nvl(vanillagrid.getAttribute('buttonHover-font-color'), vg.defaultGridCssInfo.buttonHoverFontColor),
                    buttonHoverBackColor : utils.nvl(vanillagrid.getAttribute('buttonHover-back-color'), vg.defaultGridCssInfo.buttonHoverBackColor),
                    buttonActiveFontColor : utils.nvl(vanillagrid.getAttribute('buttonActive-font-color'), vg.defaultGridCssInfo.buttonActiveFontColor),
                    buttonActiveBackColor : utils.nvl(vanillagrid.getAttribute('buttonActive-back-color'), vg.defaultGridCssInfo.buttonActiveBackColor),
                    linkFontColor : utils.nvl(vanillagrid.getAttribute('link-font-color'), vg.defaultGridCssInfo.linkFontColor),
                    linkHoverFontColor : utils.nvl(vanillagrid.getAttribute('linkHover-font-color'), vg.defaultGridCssInfo.linkHoverFontColor),
                    linkActiveFontColor : utils.nvl(vanillagrid.getAttribute('linkActive-font-color'), vg.defaultGridCssInfo.linkActiveFontColor),
                    linkVisitedFontColor : utils.nvl(vanillagrid.getAttribute('linkVisited-font-color'), vg.defaultGridCssInfo.linkVisitedFontColor),
                    linkFocusFontColor : utils.nvl(vanillagrid.getAttribute('linkFocus-font-color'), vg.defaultGridCssInfo.linkFocusFontColor),
                    cellFontSize : null,
                    cellMinHeight : null,
                };
                grid.cssInfo.cellFontSize = utils.nvl(vanillagrid.getAttribute('cell-font-size'), ((grid.cssInfo.sizeLevel! + 15) / 20) * vg.defaultGridCssInfo.cellFontSize + 'px');
                grid.cssInfo.cellMinHeight = utils.nvl(vanillagrid.getAttribute('cell-min-height'), ((grid.cssInfo.sizeLevel! + 15) / 20) * vg.defaultGridCssInfo.cellMinHeight + 'px');
                if (grid.cssInfo.colorSet){
                    grid.cssInfo.color = utils.getColorFromColorSet(grid.cssInfo.colorSet);
                    utils.setColorSet(grid.cssInfo);
                }
                else {
                    utils.setColorSet(grid.cssInfo);
                }
                if (grid.cssInfo.invertColor) {
                    utils.setInvertColor(grid.cssInfo);
                }

                grid.classList.add(gId + '_v-g');
                const gridHeader: GridHeader = document.createElement('v-g-h');
                gridHeader.gId = gId;
                gridHeader.gType = 'gh';
                gridHeader.classList.add(gId + '_v-g-h');
                const gridBody: GridBody = document.createElement('v-g-b');
                gridBody.gId = gId;
                gridBody.gType = 'gb';
                gridBody.classList.add(gId + '_v-g-b');
                const gridFooter: GridFooter = document.createElement('v-g-f');
                gridFooter.gId = gId;
                gridFooter.gType = 'gf';
                gridFooter.classList.add(gId + '_v-g-f');

                let headerRowCount = 1;
                let styleWidth;
                let footerRowCount = 0;
                Array.from(vanillagrid.querySelectorAll('v-col')).forEach(col => {
                    let headers = col.getAttribute('header');
                    if (!headers) headers = col.getAttribute('id')
                    
                    headerRowCount = headerRowCount > headers!.split(';').length ? headerRowCount : headers!.split(';').length;
                    
                    if (col.getAttribute('footer')) footerRowCount = footerRowCount > col.getAttribute('footer')!.split(';').length ? footerRowCount : col.getAttribute('footer')!.split(';').length;

                    styleWidth = col.getAttribute('width') ? ' ' + col.getAttribute('width') : ' ' + vg.defaultColInfo.originWidth;
                    let unit = utils.extractNumberAndUnit(styleWidth).unit;
                    if (!unit) {
                        styleWidth = styleWidth + 'px';
                        unit = 'px';
                    }
                    if (!utils.isIncludeEnum(enumWidthUnit, unit)) throw new Error('Width units can only be pixel or %.');
                    
                });
                let rownumSize = grid.info.gRownumVisible ? grid.info.gRownumSize + ' ' : '0px ';
                let statusSize = grid.info.gStatusVisible ? '60px ' : '0px ';

                let colInfo: CellColInfo ={
                    cId : 'v-g-rownum',
                    cIndex : 1,
                    cName : 'rownum',
                    cHeader : new Array(headerRowCount),
                    cUntarget : false,
                    cRowMerge : false,
                    cColMerge : false,
                    cColVisible : grid.info.gRownumVisible,
                    cRowVisible : true,
                    cRequired : false,
                    cResizable : false,
                    cSortable : false,
                    cFilterable : false,
                    cOriginWidth : rownumSize,
                    cDataType : 'text',
                    cSelectSize : null,
                    cLocked : true,
                    cLockedColor : grid.info.gRownumLockedColor,
                    cFormat : null,
                    cCodes : null,
                    cDefaultCode : null,
                    cMaxLength : null,
                    cMaxByte : null,
                    cMaxNumber : null,
                    cMinNumber : null,
                    cRoundNumber : null,
                    cFilterValues : null,
                    cFilterValue : null,
                    cFilter : false,
                    cAlign : 'center',
                    cVerticalAlign : null,
                    cOverflowWrap : null,
                    cWordBreak : null,
                    cWhiteSpace : null,
                    cBackColor : null,
                    cFontColor : null,
                    cFontBold : false,
                    cFontItalic : false,
                    cFontThruline : false,
                    cFontUnderline : false,
                    cFooter: null,
                };
                colInfo.cHeader![0] = '',
                colInfos.push(colInfo);

                colInfo = {
                    cId : 'v-g-status',
                    cIndex : 2,
                    cName : 'status',
                    cHeader : new Array(headerRowCount),
                    cUntarget : true,
                    cRowMerge : false,
                    cColMerge : false,
                    cColVisible : grid.info.gStatusVisible,
                    cRowVisible : true,
                    cRequired : false,
                    cResizable : false,
                    cSortable : false,
                    cFilterable : false,
                    cOriginWidth : statusSize,
                    cDataType : 'code',
                    cSelectSize : null,
                    cLocked : true,
                    cLockedColor : grid.info.gStatusLockedColor,
                    cFormat : null,
                    cCodes : ['C','U','D'],
                    cDefaultCode : null,
                    cMaxLength : null,
                    cMaxByte : null,
                    cMaxNumber : null,
                    cMinNumber : null,
                    cRoundNumber : null,
                    cFilterValues : null,
                    cFilterValue : null,
                    cFilter : false,
                    cAlign : 'center',
                    cVerticalAlign : null,
                    cOverflowWrap : null,
                    cWordBreak : null,
                    cWhiteSpace : null,
                    cBackColor : null,
                    cFontColor : null,
                    cFontBold : false,
                    cFontItalic : false,
                    cFontThruline : false,
                    cFontUnderline : false,
                    cFooter: null,
                };
                colInfo.cHeader![0] = 'status';
                colInfos.push(colInfo);

                colCount = 2;
                Array.from(vanillagrid.querySelectorAll('v-col') as NodeListOf<HTMLElement>).forEach(col => {
                    colCount++;
                    if (!col.getAttribute('id')) throw new Error('Column ID is required.');
                    if (colInfos.some(colInfo => colInfo.cId === col.getAttribute('id'))) throw new Error('Column ID is primary key.');
                    colInfo = {
                        cId : col.getAttribute('id')!,
                        cIndex : colCount,
                        cName : null,
                        cHeader : null,
                        cUntarget : null,
                        cRowMerge : null,
                        cColMerge : null,
                        cColVisible : null,
                        cRowVisible : null,
                        cRequired : null,
                        cResizable : null,
                        cSortable : null,
                        cFilterable : null,
                        cOriginWidth : null,
                        cDataType : null,
                        cSelectSize : null,
                        cLocked : null,
                        cLockedColor : null,
                        cFormat : null,
                        cCodes : null,
                        cDefaultCode : null,
                        cMaxLength : null,
                        cMaxByte : null,
                        cMaxNumber : null,
                        cMinNumber : null,
                        cRoundNumber : null,
                        cFilterValues : null,
                        cFilterValue : null,
                        cFilter : null,
                        cAlign : null,
                        cVerticalAlign : null,
                        cOverflowWrap : null,
                        cWordBreak : null,
                        cWhiteSpace : null,
                        cBackColor : null,
                        cFontColor : null,
                        cFontBold : null,
                        cFontItalic : null,
                        cFontThruline : null,
                        cFontUnderline : null,
                        cFooter: null,
                    };
                    colInfo.cName = utils.nvl(utils.toLowerCase(col.getAttribute('name')), colInfo.cId);

                    if (col.getAttribute('header')) {
                        colInfo.cHeader = col.getAttribute('header')!.split(';');
                        for(let i = colInfo.cHeader.length; i < headerRowCount; i++) {
                            colInfo.cHeader.push('');
                        }
                    }
                    else {
                        colInfo.cHeader = new Array(headerRowCount);
                        colInfo.cHeader[0] = colInfo.cId;
                    }
                    
                    if (col.getAttribute('footer')) {
                        colInfo.cFooter = col.getAttribute('footer')!.split(';');
                        for(let i = colInfo.cFooter.length; i < footerRowCount; i++) {
                            colInfo.cFooter.push('');
                        }
                    }
                    
                    let dataType = utils.toLowerCase(col.getAttribute('data-type'));
                    if (!dataType) dataType = vg.defaultColInfo.dataType;
                    if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
                    colInfo.cDataType = dataType;
                    colInfo.cUntarget = utils.nvl(utils.getAttributeOnlyBoolean('untarget', col), grid.info.gSelectionPolicy === 'none');
                    colInfo.cRowMerge = utils.nvl(utils.getAttributeOnlyBoolean('row-merge', col), vg.defaultColInfo.rowMerge);
                    colInfo.cColMerge = utils.nvl(utils.getAttributeOnlyBoolean('col-merge', col), vg.defaultColInfo.colMerge);
                    colInfo.cColVisible = utils.nvl(utils.getAttributeOnlyBoolean('visible', col), vg.defaultColInfo.colVisible);
                    colInfo.cRowVisible = true;
                    colInfo.cRequired = utils.nvl(utils.getAttributeOnlyBoolean('required', col), vg.defaultColInfo.required);
                    colInfo.cResizable = utils.nvl(utils.getAttributeOnlyBoolean('resizable', col), vg.defaultColInfo.resizable);
                    colInfo.cSortable = utils.nvl(utils.getAttributeOnlyBoolean('sortable', col), vg.defaultColInfo.sortable);
                    colInfo.cFilterable = utils.nvl(utils.getAttributeOnlyBoolean('filterable', col), vg.defaultColInfo.filterable);
                    if (colInfo.cDataType === 'checkbox') colInfo.cSortable = false;
                    styleWidth = col.getAttribute('width') ? col.getAttribute('width') : vg.defaultColInfo.originWidth;
                    if (!utils.extractNumberAndUnit(styleWidth).unit) {
                        styleWidth = styleWidth + 'px';
                    }
                    colInfo.cOriginWidth = styleWidth;
                    colInfo.cSelectSize = utils.nvl((utils.isIncludeEnum(enumWidthUnit, utils.extractNumberAndUnit(col.getAttribute('select-size')).unit) ? col.getAttribute('select-size') : ''), vg.defaultColInfo.selectSize);
                    colInfo.cLocked = utils.nvl(utils.getAttributeOnlyBoolean('locked', col), grid.info.gLocked);
                    colInfo.cLockedColor = utils.nvl(utils.getAttributeOnlyBoolean('locked-color', col), grid.info.gLockedColor);
                    colInfo.cFormat = utils.nvl(col.getAttribute('format'), vg.defaultColInfo.format);
                    colInfo.cCodes = col.getAttribute('codes') ? col.getAttribute('codes')!.split(';') : vg.defaultColInfo.codes;
                    colInfo.cDefaultCode = utils.nvl(col.getAttribute('default-code'), vg.defaultColInfo.defaultCode);
                    colInfo.cMaxLength = utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('max-length', col), vg.defaultColInfo.maxLength);
                    colInfo.cMaxByte = utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('max-byte', col), vg.defaultColInfo.maxByte);
                    colInfo.cMaxNumber = utils.nvl(utils.getAttributeOnlyNumber('max-number', col), vg.defaultColInfo.maxNumber);
                    colInfo.cMinNumber = utils.nvl(utils.getAttributeOnlyNumber('min-number', col), vg.defaultColInfo.minNumber);
                    colInfo.cRoundNumber = utils.nvl(utils.getAttributeOnlyNumberInteger('round-number', col), vg.defaultColInfo.roundNumber);

                    colInfo.cFilterValues = new Set();
                    colInfo.cFilterValue = colInfo.cFilterable ? '$$ALL' : null;
                    colInfo.cFilter = false;

                    colInfo.cAlign = utils.nvl((utils.isIncludeEnum(alignUnit, utils.toLowerCase(col.getAttribute('align'))) ? utils.toLowerCase(col.getAttribute('align')) : ''), vg.defaultColInfo.align);
                    colInfo.cVerticalAlign = utils.nvl((utils.isIncludeEnum(verticalAlignUnit, utils.toLowerCase(col.getAttribute('vertical-align'))) ? utils.toLowerCase(col.getAttribute('vertical-align')) : ''), vg.defaultColInfo.verticalAlign);
                    colInfo.cOverflowWrap = utils.nvl(col.getAttribute('overflow-wrap'), vg.defaultColInfo.overflowWrap);
                    colInfo.cWordBreak = utils.nvl(col.getAttribute('word-break'), vg.defaultColInfo.wordBreak);
                    colInfo.cWhiteSpace = utils.nvl(col.getAttribute('white-space'), vg.defaultColInfo.whiteSpace);
                    colInfo.cBackColor = utils.nvl(utils.toLowerCase(col.getAttribute('back-color')), vg.defaultColInfo.backColor);
                    colInfo.cFontColor = utils.nvl(utils.toLowerCase(col.getAttribute('font-color')), vg.defaultColInfo.fontColor);
                    colInfo.cFontBold = utils.nvl(utils.getAttributeOnlyBoolean('font-bold', col), vg.defaultColInfo.fontBold);
                    colInfo.cFontItalic = utils.nvl(utils.getAttributeOnlyBoolean('font-italic', col), vg.defaultColInfo.fontItalic);
                    colInfo.cFontThruline = utils.nvl(utils.getAttributeOnlyBoolean('font-thruline', col), vg.defaultColInfo.fontThruline);
                    colInfo.cFontUnderline = utils.nvl(utils.getAttributeOnlyBoolean('font-underline', col), vg.defaultColInfo.fontUnderline);
                    
                    colInfos.push(colInfo);
                    vanillagrid.removeChild(col);
                });






















                const gridFunc: GridMethods = {} as unknown as GridMethods;
                Object.keys(grid).forEach(key => {
                    if (typeof grid[key] === 'function' && !key.startsWith('__')) {
                        (gridFunc as any)[key] = (...param: any[]) => {
                            return grid[key](...param);
                        }
                    }
                });
                utils.deepFreeze(gridFunc);
                (window as any)[gId] = gridFunc;
                GRIDS[gId] = gridFunc;
                


                gridHeader.addEventListener('dblclick', function (e: any) {
                    if (utils.onHeaderDragging) return;
                    let headerCell;
                    if (e.target.gType === 'ghd') {
                        headerCell = e.target;
                    }
                    else if (e.target.gType === 'sort'){
                        headerCell = e.target.parentNode;
                    }
                    else {
                        return;
                    }
                    if (utils.doEventWithCheckChanged(headerCell.gId, '_onBeforeDblClickHeader', headerCell.row, headerCell.cId) === false) {
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                    }
                    if (e.target.cDataType === 'checkbox' && grid.info.gAllCheckable && headerCell.isLastCell) {
                        grid.setColSameValue(e.target.cIndex, !utils.getCheckboxCellTrueOrFalse(grid._getCell(1, e.target.cIndex)), true);
                        return;
                    }

                    if (!grid.info.gSortable) return;
                    if (!grid.__getColInfo(headerCell.cId).cSortable) return;
                    if (!headerCell.isLastCell) return;
                    
                    grid.sort(headerCell.cId, !grid.variables._sortToggle[headerCell.cId]);
                    
                    const removeSpans = headerCell.parentNode.querySelectorAll('.' + headerCell.gId + '_sortSpan');
                    removeSpans.forEach((el: any) => {
                        el.parentNode.removeChild(el);
                    });
                    let sortSpan: any;
                    if(grid.variables._sortToggle[headerCell.cId]) {
                        if(vg.sortAscSpan && vg.sortAscSpan instanceof HTMLElement && vg.sortAscSpan.nodeType === 1) {
                            sortSpan = vg.sortAscSpan.cloneNode(true);
                        }
                        else {
                            sortSpan = document.createElement('span');
                            sortSpan.style.fontSize = '0.5em';
                            sortSpan.style.paddingLeft = '5px';
                            sortSpan.innerText = '▲';
                        }
                    }
                    else {
                        if(vg.sortDescSpan && vg.sortDescSpan instanceof HTMLElement && vg.sortDescSpan.nodeType === 1) {
                            sortSpan = vg.sortDescSpan.cloneNode(true);
                        }
                        else {
                            sortSpan = document.createElement('span');
                            sortSpan.style.fontSize = '0.5em';
                            sortSpan.style.paddingLeft = '5px';
                            sortSpan.innerText = '▼';
                        }
                    }
                    sortSpan.gId = headerCell.gId;
                    sortSpan.isChild = true;
                    sortSpan.gType = 'sort';
                    sortSpan.classList.add(headerCell.gId + '_sortSpan');
                    sortSpan.classList.add(grid.variables._sortToggle[headerCell.cId] ? headerCell.gId + '_ascSpan' : headerCell.gId + '_descSpan');
                    headerCell.append(sortSpan);

                    utils.doEventWithCheckChanged(headerCell.gId, '_onAfterDblClickHeader', headerCell.row, headerCell.cId);
                });
                gridHeader.addEventListener('click', function (e: any) {
                    let headerCell;
                    if (e.target.gType === 'ghd') {
                        headerCell = e.target;
                        if (utils.doEventWithCheckChanged(headerCell.gId, '_onBeforeClickHeader', headerCell.row, headerCell.cId) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        utils.doEventWithCheckChanged(headerCell.gId, '_onAfterClickHeader', headerCell.row, headerCell.cId)
                    }
                    else if (e.target.gType === 'filter'){
                        headerCell = e.target.parentNode;
                        if (utils.doEventWithCheckChanged(headerCell.gId, '_onClickFilter', headerCell.row, headerCell.cId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        const removeSpans = headerCell.parentNode.querySelectorAll('.' + headerCell.gId + '_filterSelect');
                        const filterSelect = e.target.querySelectorAll('.' + headerCell.gId + '_filterSelect')[0];
                        removeSpans.forEach((el: any) => {
                            if (filterSelect !== el && el.value === 'ALL') el.style.display = 'none';
                        });
                        if (filterSelect.style.display === 'none') {
                            filterSelect.style.display = 'block';
                        }
                        else {
                            filterSelect.style.display = 'none';
                        }
                    }
                });
                gridBody.addEventListener('mousemove', function (e) {
                    if (utils.isDragging) {
                        utils.mouseX = e.clientX;
                        utils.mouseY = e.clientY;
                    }
                });
                gridBody.addEventListener('mouseleave',function (e: any) {
                    if (utils.isDragging) {
                        const mouseX = e.clientX;
                        const mouseY = e.clientY;
                        
                        const deltaX = mouseX - utils.mouseX;
                        const deltaY = mouseY - utils.mouseY;
                        
                        let direction = '';

                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            
                            direction = deltaX > 0 ? 'right' : 'left';
                        } else {
                            
                            direction = deltaY > 0 ? 'down' : 'up';
                        }
                        utils.startScrolling(e.target.gId, direction);
                    }
                });
                gridBody.addEventListener('mouseenter', function (e) {
                    if (utils.scrollInterval) {
                        utils.stopScrolling();
                    }
                });
                gridBody.addEventListener('dblclick', function (e: any) {
                    let cell;
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else {
                        cell = e.target;
                    }
                    if (cell.gType !== 'gbd') return;
                    if (utils.doEventWithCheckChanged(cell.gId, '_onBeforeDblClickCell', cell.row, cell.cId) === false) return;
                    if (['select','checkbox','button','link'].indexOf(cell.cDataType) >= 0) return;
                    utils.createGridEditor(cell);
                    utils.doEventWithCheckChanged(cell.gId, '_onAfterDblClickCell', cell.row, cell.cId)
                });
                grid.addEventListener('click', function (e: any) {
                    if (!e.target.gType) return;
                    let cell
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else {
                        cell = e.target;
                    }
                    if (!cell) return;
                    if (cell.cUntarget || cell.gType !== 'gbd') {
                        return;
                    }
                    if(cell.firstChild && cell.firstChild.nType !== 'select') {
                        if (utils.doEventWithCheckChanged(cell.gId, '_onBeforeClickCell', cell.row, cell.cId) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                    }
                    if (e.target.nType) {
                        switch (e.target.nType) {
                            case 'checkbox':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickCheckbox', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                utils.editOldValue = e.target.parentNode.cValue;
                                break;
                            case 'button':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickButton', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                break;
                            case 'link':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickLink', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.cDataType === key) {
                            if(vg.dataType[key].onClick) {
                                if(typeof vg.dataType[key].onClick !== 'function') throw new Error('onClick must be a function.');
                                if((vg.dataType as any)[key].onClick(e, grid.__getData(cell)) === false) {
                                    return;
                                }
                            }
                        }
                    });
                    utils.doEventWithCheckChanged(cell.gId, '_onAfterClickCell', cell.row, cell.cId);
                })
                grid.addEventListener('mousedown', function (e: any) {
                    if (!e.target.gType) return;
                    let cell;
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else {
                        cell = e.target;
                    }
                    if (cell.cUntarget || cell.gType !== 'gbd') {
                        return;
                    }
                    if (e.target.nType) {
                        switch (e.target.nType) {
                            case 'select':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onBeforeClickCell', cell.row, cell.cId) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickSelect', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                utils.editOldValue = e.target.value;
                                break;
                            default:
                                break;
                        }
                    }
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.cDataType === key) {
                            if(vg.dataType[key].onMousedown) {
                                if(typeof vg.dataType[key].onMousedown !== 'function') throw new Error('onMousedown must be a function.');
                                if((vg.dataType as any)[key].onMousedown(e, grid.__getData(cell)) === false) {
                                    return;
                                }
                            }
                        }
                    });
                    utils.activeGrid = this;
                    utils.isDragging = true;
                    if (this.info.gSelectionPolicy === 'range' && e.shiftKey && this.variables._targetCell) {
                        utils.unselectCells(this.gId);
                        utils.selectCells(this.variables._targetCell, cell);
                    }
                    else {
                        utils.selectCell(cell);
                    }
                });
                grid.addEventListener('mousemove', function (e: any) {
                    let cell;
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else if (e.target.gType === 'gbd'){
                        cell = e.target;
                    }
                    if (!cell) return;

                    if (this.info.gSelectionPolicy !== 'range') return;
                    if (utils.mouseoverCell === cell) return;
                    utils.mouseoverCell = cell;
                    
                    if (utils.isDragging && this.variables._targetCell) {
                        
                        utils.unselectCells(this.gId);
                        utils.selectCells(this.variables._targetCell, cell);
                    }
                });
                grid.addEventListener('mouseleave', function (e: any) {
                    if (this.info.gSelectionPolicy !== 'range') return;
                    utils.mouseoverCell = null;

                    if (utils.isDragging) {
                        utils.isDragging = false;
                    }
                });
                (utils as any)[gId] = grid;
                grid.append(gridHeader);
                grid.append(gridBody);
                grid.append(gridFooter);
                vanillagrid.append(grid);

                grid.events = {}
                if ((window as any)[gId + '_onActiveCell']) {
                    grid.events[gId + '_onActiveCell'] = (window as any)[gId + '_onActiveCell'];
                }
                else {
                    (window as any)[gId + '_onActiveCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onActiveCell'] = (window as any)[gId + '_onActiveCell'];
                }
                if ((window as any)[gId + '_onActiveCells']) {
                    grid.events[gId + '_onActiveCells'] = (window as any)[gId + '_onActiveCells'];
                }
                else {
                    (window as any)[gId + '_onActiveCells'] = (startRow: number, startColId: string, endRow: number, endColId: string) => {return true};
                    grid.events[gId + '_onActiveCells'] = (window as any)[gId + '_onActiveCells'];
                }
                if ((window as any)[gId + '_onActiveRow']) {
                    grid.events[gId + '_onActiveRow'] = (window as any)[gId + '_onActiveRow'];
                }
                else {
                    (window as any)[gId + '_onActiveRow'] = (row: number) => {return true};
                    grid.events[gId + '_onActiveRow'] = (window as any)[gId + '_onActiveRow'];
                }
                if ((window as any)[gId + '_onActiveRows']) {
                    grid.events[gId + '_onActiveRows'] = (window as any)[gId + '_onActiveRows'];
                }
                else {
                    (window as any)[gId + '_onActiveRows'] = (startRow: number, endRow: number) => {return true};
                    grid.events[gId + '_onActiveRows'] = (window as any)[gId + '_onActiveRows'];
                }
                if ((window as any)[gId + '_onActiveCol']) {
                    grid.events[gId + '_onActiveCol'] = (window as any)[gId + '_onActiveCol'];
                }
                else {
                    (window as any)[gId + '_onActiveCol'] = (colId: string) => {return true};
                    grid.events[gId + '_onActiveCol'] = (window as any)[gId + '_onActiveCol'];
                }
                if ((window as any)[gId + '_onActiveCols']) {
                    grid.events[gId + '_onActiveCols'] = (window as any)[gId + '_onActiveCols'];
                }
                else {
                    (window as any)[gId + '_onActiveCols'] = (startColId: string, endColId: string) => {return true};
                    grid.events[gId + '_onActiveCols'] = (window as any)[gId + '_onActiveCols'];
                }
                if ((window as any)[gId + '_onBeforeChange']) {
                    grid.events[gId + '_onBeforeChange'] = (window as any)[gId + '_onBeforeChange'];
                }
                else {
                    (window as any)[gId + '_onBeforeChange'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onBeforeChange'] = (window as any)[gId + '_onBeforeChange'];
                }
                if ((window as any)[gId + '_onAfterChange']) {
                    grid.events[gId + '_onAfterChange'] = (window as any)[gId + '_onAfterChange'];
                }
                else {
                    (window as any)[gId + '_onAfterChange'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onAfterChange'] = (window as any)[gId + '_onAfterChange'];
                }
                if ((window as any)[gId + '_onBeforeClickCell']) {
                    grid.events[gId + '_onBeforeClickCell'] = (window as any)[gId + '_onBeforeClickCell'];
                }
                else {
                    (window as any)[gId + '_onBeforeClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeClickCell'] = (window as any)[gId + '_onBeforeClickCell'];
                }
                if ((window as any)[gId + '_onAfterClickCell']) {
                    grid.events[gId + '_onAfterClickCell'] = (window as any)[gId + '_onAfterClickCell'];
                }
                else {
                    (window as any)[gId + '_onAfterClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterClickCell'] = (window as any)[gId + '_onAfterClickCell'];
                }
                if ((window as any)[gId + '_onClickSelect']) {
                    grid.events[gId + '_onClickSelect'] = (window as any)[gId + '_onClickSelect'];
                }
                else {
                    (window as any)[gId + '_onClickSelect'] = (row: number, colId: string, selectNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickSelect'] = (window as any)[gId + '_onClickSelect'];
                }
                if ((window as any)[gId + '_onClickCheckbox']) {
                    grid.events[gId + '_onClickCheckbox'] = (window as any)[gId + '_onClickCheckbox'];
                }
                else {
                    (window as any)[gId + '_onClickCheckbox'] = (row: number, colId: string, checkboxNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickCheckbox'] = (window as any)[gId + '_onClickCheckbox'];
                }
                if ((window as any)[gId + '_onClickButton']) {
                    grid.events[gId + '_onClickButton'] = (window as any)[gId + '_onClickButton'];
                }
                else {
                    (window as any)[gId + '_onClickButton'] = (row: number, colId: string, buttonNude: HTMLElement) => {return true};
                    grid.events[gId + '_onClickButton'] = (window as any)[gId + '_onClickButton'];
                }
                if ((window as any)[gId + '_onClickLink']) {
                    grid.events[gId + '_onClickLink'] = (window as any)[gId + '_onClickLink'];
                }
                else {
                    (window as any)[gId + '_onClickLink'] = (row: number, colId: string, linkNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickLink'] = (window as any)[gId + '_onClickLink'];
                }
                if ((window as any)[gId + '_onBeforeDblClickCell']) {
                    grid.events[gId + '_onBeforeDblClickCell'] = (window as any)[gId + '_onBeforeDblClickCell'];
                }
                else {
                    (window as any)[gId + '_onBeforeDblClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeDblClickCell'] = (window as any)[gId + '_onBeforeDblClickCell'];
                }
                if ((window as any)[gId + '_onAfterDblClickCell']) {
                    grid.events[gId + '_onAfterDblClickCell'] = (window as any)[gId + '_onAfterDblClickCell'];
                }
                else {
                    (window as any)[gId + '_onAfterDblClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterDblClickCell'] = (window as any)[gId + '_onAfterDblClickCell'];
                }
                if ((window as any)[gId + '_onBeforeClickHeader']) {
                    grid.events[gId + '_onBeforeClickHeader'] = (window as any)[gId + '_onBeforeClickHeader'];
                }
                else {
                    (window as any)[gId + '_onBeforeClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeClickHeader'] = (window as any)[gId + '_onBeforeClickHeader'];
                }
                if ((window as any)[gId + '_onAfterClickHeader']) {
                    grid.events[gId + '_onAfterClickHeader'] = (window as any)[gId + '_onAfterClickHeader'];
                }
                else {
                    (window as any)[gId + '_onAfterClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterClickHeader'] = (window as any)[gId + '_onAfterClickHeader'];
                }
                if ((window as any)[gId + '_onBeforeDblClickHeader']) {
                    grid.events[gId + '_onBeforeDblClickHeader'] = (window as any)[gId + '_onBeforeDblClickHeader'];
                }
                else {
                    (window as any)[gId + '_onBeforeDblClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeDblClickHeader'] = (window as any)[gId + '_onBeforeDblClickHeader'];
                }
                if ((window as any)[gId + '_onAfterDblClickHeader']) {
                    grid.events[gId + '_onAfterDblClickHeader'] = (window as any)[gId + '_onAfterDblClickHeader'];
                }
                else {
                    (window as any)[gId + '_onAfterDblClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterDblClickHeader'] = (window as any)[gId + '_onAfterDblClickHeader'];
                }
                if ((window as any)[gId + '_onEditEnter']) {
                    grid.events[gId + '_onEditEnter'] = (window as any)[gId + '_onEditEnter'];
                }
                else {
                    (window as any)[gId + '_onEditEnter'] = (row: number, colId: string, editorNode: HTMLElement) => {return true};
                    grid.events[gId + '_onEditEnter'] = (window as any)[gId + '_onEditEnter'];
                }
                if ((window as any)[gId + '_onEditEnding']) {
                    grid.events[gId + '_onEditEnding'] = (window as any)[gId + '_onEditEnding'];
                }
                else {
                    (window as any)[gId + '_onEditEnding'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onEditEnding'] = (window as any)[gId + '_onEditEnding'];
                }
                if ((window as any)[gId + '_onClickFilter']) {
                    grid.events[gId + '_onClickFilter'] = (window as any)[gId + '_onClickFilter'];
                }
                else {
                    (window as any)[gId + '_onClickFilter'] = (row: number, colId: string, filterNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickFilter'] = (window as any)[gId + '_onClickFilter'];
                }
                if ((window as any)[gId + '_onChooseFilter']) {
                    grid.events[gId + '_onChooseFilter'] = (window as any)[gId + '_onChooseFilter'];
                }
                else {
                    (window as any)[gId + '_onChooseFilter'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onChooseFilter'] = (window as any)[gId + '_onChooseFilter'];
                }
                if ((window as any)[gId + '_onPaste']) {
                    grid.events[gId + '_onPaste'] = (window as any)[gId + '_onPaste'];
                }
                else {
                    (window as any)[gId + '_onPaste'] = (startRow: number, startColId: string, clipboardText: string) => {return true};
                    grid.events[gId + '_onPaste'] = (window as any)[gId + '_onPaste'];
                }
                if ((window as any)[gId + '_onCopy']) {
                    grid.events[gId + '_onCopy'] = (window as any)[gId + '_onCopy'];
                }
                else {
                    (window as any)[gId + '_onCopy'] = (startRow: number, startColId: string, endRow: number, endColId: string) => {return true};
                    grid.events[gId + '_onCopy'] = (window as any)[gId + '_onCopy'];
                }
                if ((window as any)[gId + '_onResize']) {
                    grid.events[gId + '_onResize'] = (window as any)[gId + '_onResize'];
                }
                else {
                    (window as any)[gId + '_onResize'] = (colId: string) => {return true};
                    grid.events[gId + '_onResize'] = (window as any)[gId + '_onResize'];
                }
                if ((window as any)[gId + '_onKeydownEditor']) {
                    grid.events[gId + '_onKeydownEditor'] = (window as any)[gId + '_onKeydownEditor'];
                }
                else {
                    (window as any)[gId + '_onKeydownEditor'] = (event: KeyboardEvent) => {return true};
                    grid.events[gId + '_onKeydownEditor'] = (window as any)[gId + '_onKeydownEditor'];
                }
                if ((window as any)[gId + '_onInputEditor']) {
                    grid.events[gId + '_onInputEditor'] = (window as any)[gId + '_onInputEditor'];
                }
                else {
                    (window as any)[gId + '_onInputEditor'] = (event: InputEvent) => {return true};
                    grid.events[gId + '_onInputEditor'] = (window as any)[gId + '_onInputEditor'];
                }
                if ((window as any)[gId + '_onKeydownGrid']) {
                    grid.events[gId + '_onKeydownGrid'] = (window as any)[gId + '_onKeydownGrid'];
                }
                else {
                    (window as any)[gId + '_onKeydownGrid'] = (event: KeyboardEvent) => {return true};
                    grid.events[gId + '_onKeydownGrid'] = (window as any)[gId + '_onKeydownGrid'];
                }
                Object.freeze(grid.events);
                
                grid._getGridCssStyle = () => {
                    const csses: any = {};
                    csses['.' + gId + '_vanillagrid'] = {
                        'width': grid.cssInfo.width,
                        'height': grid.cssInfo.height,
                        'display': grid.info.gVisible ? 'block' : 'none',
                        'border': '1px solid ' + grid.cssInfo.gridBorderColor,
                        'overflow': 'auto',
                        'background-color': '#fff',
                        'margin': grid.cssInfo.margin,
                        'padding': grid.cssInfo.padding,
                        'font-family': grid.cssInfo.gridFontFamily,
                    };
                    csses['.' + gId + '_v-g'] = {
                        'background-color': grid.cssInfo.bodyBackColor,
                        'display': 'flex',
                        'position': 'relative',
                        'flex-direction': 'column',
                        'height': '100%',
                        'overflow-x': 'auto',
                        'overflow-y': 'auto',
                        '-webkit-user-select': 'none',
                        '-moz-user-select': 'none',
                        '-ms-user-select': 'none',
                        'user-select': 'none',
                    };
                    csses['.' + gId + '_v-g-h'] = {
                        //'position': '-webkit-sticky',
                        'position': 'sticky',
                        'top': '0',
                        'z-index': '250',
                        'display': grid.info.gHeaderVisible ? 'grid' : 'none',
                    };
                    csses['.' + gId + '_v-g-b'] = {
                        'margin-bottom': '22px',
                        'display': 'grid',
                        'position': 'relative',
                    };
                    csses['.' + gId + '_v-g-f'] = {
                        //'position': '-webkit-sticky',
                        'position': 'sticky',
                        'bottom': '0',
                        'z-index': '250',
                        'display': 'grid',
                        'margin-top': 'auto',
                    };
                    csses['.' + gId + '_h-v-g-d'] = {
                        'background-color': grid.cssInfo.headerCellBackColor,
                        'justify-content': 'center',
                        'text-align': 'center',
                        'align-items' : grid.cssInfo.verticalAlign,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.headerCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.headerCellBorderColor,
                        'color': grid.cssInfo.headerCellFontColor,
                    };
                    csses['.' + gId + '_h-v-g-d select'] = {
                        'color': '#333',
                    };
                    csses['.' + gId + '_h-v-g-d option'] = {
                        'color': '#333',
                    };
                    csses['.' + gId + '_b-v-g-d'] = {
                        'align-items' : grid.cssInfo.verticalAlign,
                        'background-color': grid.cssInfo.bodyCellBackColor,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'color': grid.cssInfo.bodyCellFontColor,
                    };
                    csses['.' + gId + '_f-v-g-d'] = {
                        'justify-content': 'center',
                        'text-align': 'center',
                        'align-items' : grid.cssInfo.verticalAlign,
                        'background-color': grid.cssInfo.footerCellBackColor,
                        'border-top': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.footerCellBorderColor,
                        'color': grid.cssInfo.footerCellFontColor,
                    };
                    csses['.' + gId + '_f-v-g-d-value'] = {
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                    };
                    csses['.' + gId + '_b-v-g-d-alter'] = {
                        'align-items' : grid.cssInfo.verticalAlign,
                        'background-color': grid.cssInfo.alterRowBackColor,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'color': grid.cssInfo.alterRowFontColor,
                    };
                    csses['.' + gId + '_b-v-g-d-locked'] = {
                        'background-color': grid.cssInfo.lockCellBackColor,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'color': grid.cssInfo.lockCellFontColor,
                    };
                    csses['.' + gId + '_v-g-d'] = {
                        'font-size': grid.cssInfo.cellFontSize,
                        'display': 'flex',
                        'min-height': grid.cssInfo.cellMinHeight,
                        'overflow': 'hidden',
                        'white-space': 'nowrap',
                        'padding-left': '5px',
                        'padding-right': '5px',
                    };
                    if (grid.cssInfo.overflowWrap) csses['.' + gId + '_v-g-d']['overflow-wrap'] = grid.cssInfo.overflowWrap;
                    if (grid.cssInfo.wordBreak) csses['.' + gId + '_v-g-d']['word-break'] = grid.cssInfo.wordBreak;
                    if (grid.cssInfo.whiteSpace) csses['.' + gId + '_v-g-d']['white-space'] = grid.cssInfo.whiteSpace;

                    csses['.' + gId + '_editor'] = {
                        'font-size': grid.cssInfo.cellFontSize,
                        'background-color': grid.cssInfo.editorBackColor,
                        'border': 'none',
                        'color': grid.cssInfo.editorFontColor,
                        'overflow' : 'hidden',
                        'resize': 'none',
                        'box-sizing': 'border-box',
                        'font-family': grid.cssInfo.gridFontFamily,
                        'text-align': 'inherit',
                    };
                    csses['.' + gId + '_editor:focus'] = {
                        'outline': 'none',
                    };
                    csses['.' + gId + '_mouseover-cell'] = {
                        'background-color': grid.cssInfo.mouseoverCellBackColor + ' !important',
                        'color': grid.cssInfo.mouseoverCellFontColor + ' !important',
                    };
                    csses['.' + gId + '_selected-cell'] = {
                        'background-color': grid.cssInfo.selectCellBackColor + ' !important',
                        'color': grid.cssInfo.selectCellFontColor + ' !important',
                    };
                    csses['.' + gId + '_selected-col'] = {
                        'background-color': grid.cssInfo.selectColBackColor,
                        'color': grid.cssInfo.selectColFontColor,
                    };
                    csses['.' + gId + '_selected-row'] = {
                        'background-color': grid.cssInfo.selectRowBackColor,
                        'color': grid.cssInfo.selectRowFontColor,
                    };
                    csses['.' + gId + '_filterSpan'] = {
                        'display': 'block',
                        'font-size': '0.8em',
                        'padding-right': '8px',
                        'cursor': 'pointer',
                    };
                    csses['.' + gId + '_filterSelect'] = {
                        'position': 'absolute',
                        'z-index': '300',
                        'margin': '5px',
                    };
                    csses['.' + gId + '_data-value-select'] = {
                        'font-size': grid.cssInfo.cellFontSize,
                        'cursor': 'pointer',
                        'border': 'none',
                        'background': 'none',
                        'color': 'inherit'
                    }
                    csses['.' + gId + '_data-value-select:focus'] = {
                        'outline': 'none',
                    }
                    csses['.' + gId + '_data-value-checkbox'] = {
                        'cursor': 'pointer',
                    }
                    csses['.' + gId + '_data-value-button'] = {
                        'min-width': '95%',
                        'height': (utils.extractNumberAndUnit(grid.cssInfo.cellMinHeight).number * 0.85) + 'px',
                        'line-height': (utils.extractNumberAndUnit(grid.cssInfo.cellMinHeight).number * 0.85) + 'px',
                        'font-size': grid.cssInfo.cellFontSize,
                        'cursor': 'pointer',
                        'border': 'none',
                        'color': grid.cssInfo.buttonFontColor,
                        'background-color': grid.cssInfo.buttonBackColor,
                        'box-shadow': '0.75px 0.75px 1px 0.25px ' + grid.cssInfo.buttonBorderColor,
                    }
                    csses['.' + gId + '_data-value-button:hover'] = {
                        'color': grid.cssInfo.buttonHoverFontColor,
                        'background-color': grid.cssInfo.buttonHoverBackColor,
                    }
                    csses['.' + gId + '_data-value-button:active'] = {
                        'color': grid.cssInfo.buttonActiveFontColor,
                        'background-color': grid.cssInfo.buttonActiveBackColor,
                        'box-shadow': '0px 0px 0.5px 0.25px ' + grid.cssInfo.buttonBorderColor,
                    }
                    csses['.' + gId + '_data-value-button:focus'] = {
                        'outline': 'none',
                    }
                    csses['.' + gId + '_data-value-button:disabled'] = {
                        'opacity': '0.7',
                    }
                    csses['.' + gId + '_data-value-link'] = {
                        'color': grid.cssInfo.linkFontColor,
                        'text-decoration': grid.cssInfo.linkHasUnderLine ? 'underline' : 'none',
                    }
                    csses['.' + gId + '_data-value-link:visited'] = {
                        'color': grid.cssInfo.linkVisitedFontColor,
                    }
                    csses['.' + gId + '_data-value-link:hover'] = {
                        'color': grid.cssInfo.linkHoverFontColor + ' !important',
                    }
                    csses['.' + gId + '_data-value-link:active'] = {
                        'color': grid.cssInfo.linkActiveFontColor + ' !important',
                    }
                    csses['.' + gId + '_data-value-link:focus'] = {
                        'color': grid.cssInfo.linkFocusFontColor + ' !important',
                    }
                    return csses;
                }

                grid._setGridCssStyle = () => {
                    let cssText = '';
                    const csses = grid._getGridCssStyle();
                    const cssKeys = Object.keys(csses);
                    for(let i = 0; i < cssKeys.length; i++) {
                        cssText = cssText + cssKeys[i] + ' {' + utils.getCssTextFromObject(csses[cssKeys[i]]) + '}\n';
                    }

                    let styleElement: any = document.getElementById(gId + '_styles-sheet');
                    if (styleElement) {
                        utils.removeAllChild(styleElement);
                        styleElement.appendChild(document.createTextNode(cssText));
                    }
                    else {
                        styleElement = document.createElement('style');
                        styleElement.setAttribute('id', gId + '_styles-sheet');
                        if (styleElement.styleSheet) {
                            styleElement.styleSheet.cssText = cssText;
                        }
                        else {
                            styleElement.appendChild(document.createTextNode(cssText));
                        }
                        document.getElementsByTagName('head')[0].appendChild(styleElement);
                    }
                }

                grid._setGridCssStyle();
            }



            vg._VanillaGrid = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                }
            }
            if (!customElements.get('v-g')) customElements.define('v-g', vg._VanillaGrid);

            vg._GridHeader = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    if (!this.style.gridTemplateColumns.includes('%')) {
                        const _grid: any = window[(this as any).gId];
                        let totalWidth = 0;
                        for(let col = 1; col < _grid.getColCount(); col++) {
                            totalWidth += utils.extractNumberAndUnit(_grid.getColOriginWidth(col)).number;
                        }
                        this.style.width = totalWidth + 'px';
                    }
                }
            }
            if (!customElements.get('v-g-h')) customElements.define('v-g-h', vg._GridHeader);

            vg._GridBody = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    if (!this.style.gridTemplateColumns.includes('%')) {
                        const _grid: any = window[(this as any).gId];
                        let totalWidth = 0;
                        for(let col = 1; col < _grid.getColCount(); col++) {
                            totalWidth += utils.extractNumberAndUnit(_grid.getColOriginWidth(col)).number;
                        }
                        this.style.width = totalWidth + 'px';
                    }
                }
            }
            if (!customElements.get('v-g-b')) customElements.define('v-g-b', vg._GridBody);

            vg._GridFooter = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    if (!this.style.gridTemplateColumns.includes('%')) {
                        const _grid: any = window[(this as any).gId];
                        let totalWidth = 0;
                        if(!_grid._getFooterCells() || _grid._getFooterCells().length <= 0) return;
                        for(let col = 1; col < _grid.getColCount(); col++) {
                            totalWidth += utils.extractNumberAndUnit(_grid.getColOriginWidth(col)).number;
                        }
                        this.style.width = totalWidth + 'px';
                    }
                }
            }
            if (!customElements.get('v-g-f')) customElements.define('v-g-f', vg._GridFooter);

            vg._GridData = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    const _grid: any = window[(this as any).gId];
                    const _gridInfo: any = _grid.getGridInfo();
                    
                    this.style.removeProperty('display');
                    this.style.removeProperty('align-items');
                    this.style.removeProperty('justify-content');
                    this.style.removeProperty('text-align');
                    this.style.removeProperty('z-index');

                    function extractNumberAndUnit (val: string): any {
                        if (val === null || val === undefined) return '';
                        val = '' + val.trim();
                        const regex = /^(\d+)(\D*)$/;
                        const match = val.match(regex);
                        if (match) {
                            const unit = match[2] === '' ? 'px' : match[2];
                            return { number: parseInt(match[1], 10), unit: unit };
                        } else {
                            return '';
                        }
                    }

                    function isCellVisible (cell: Cell) {
                        if (!cell) return;
                        return !(cell.cColVisible === false || cell.cRowVisible === false || cell.cFilter === true);
                    }

                    function getOnlyNumberWithNaNToNull (value: any) {
                        const returnValue = Number(value);
                        if (isNaN(returnValue)) {
                            return null;
                        }
                        return returnValue;
                    }

                    function getOnlyNumberWithNaNToZero (value: any) {
                        const returnValue = Number(value);
                        if (isNaN(returnValue)) {
                            return 0;
                        }
                        return returnValue;
                    }

                    function getFirstCellValidNumber (grid: any, footerCell: Cell) {
                        let returnNumber;
                        let tempCell;
                        for(let r = 1; r < grid.getRowCount(); r++ ) {
                            tempCell = grid._getCell(r, footerCell.col);
                            if (!isCellVisible(tempCell)) continue;
                            returnNumber = getOnlyNumberWithNaNToNull(tempCell.cValue);
                            if (returnNumber) return returnNumber;
                        }
                        return null;
                    }

                    switch ((this as any).gType) {
                        case 'ghd': 
                            this.innerText = (this as any).cValue;
                            
                            if (_gridInfo.frozenRowCount <= 0 && (this as any).col <= _gridInfo.frozenColCount) {
                                let leftElement;
                                let leftElementOffsetWidth = 0

                                for(let c = (this as any).col - 1; c > 0; c--) {
                                    leftElement = _grid._getHeaderCell((this as any).row, c);
                                    if (!leftElement) {
                                        leftElementOffsetWidth = leftElementOffsetWidth + 0;
                                    }
                                    else if (leftElement.rowMerge) {
                                        let r = (this as any).row - 1;
                                        let spanNode = _grid._getHeaderCell(r, c);
                                        while(spanNode) {
                                            if (r < 0) break;
                                            if (!spanNode.rowMerge) {
                                                break;
                                            }
                                            r--;
                                            spanNode = _grid._getHeaderCell(r, c);
                                        }
                                        leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                                    }
                                    else {
                                        leftElementOffsetWidth = leftElementOffsetWidth + _grid._getHeaderCell((this as any).row, c).offsetWidth;
                                    }
                                }
                                this.style.position = 'sticky',
                                this.style.zIndex = String(300 + _grid.getColCount() - (this as any).col),
                                this.style.left = leftElementOffsetWidth + 'px';
                                (this as any).frozenCol = true;
                            }
                            
                            if ((this as any).rowMerge) {
                                let r = (this as any).row - 1;
                                let spanNode = _grid._getHeaderCell(r, (this as any).col);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode.rowMerge) {
                                        
                                        spanNode.style.gridRowEnd = this.style.gridRowEnd;
                                        spanNode.rowSpan = spanNode.rowSpan ? spanNode.rowSpan + 1 : 1;
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                        break;
                                    }
                                    r--;
                                    spanNode = _grid._getHeaderCell(r, (this as any).col);
                                }
                                this.style.display = 'none';
                            }
                            
                            if ((this as any).colMerge) {
                                let c = (this as any).col - 1;
                                let spanNode = _grid._getHeaderCell((this as any).row, c);
                                while(spanNode) {
                                    if (c < 0) break;
                                    if (!spanNode.colMerge) {
                                        if (spanNode.cId === 'v-g-rownum' || spanNode.cId === 'v-g-status') break;
                                        spanNode.style.gridColumnEnd = this.style.gridColumnEnd;
                                        spanNode.style.width = extractNumberAndUnit(spanNode.style.width).number + this.offsetWidth + 'px';
                                        spanNode.colSpan = spanNode.colSpan ? spanNode.colSpan + 1 : 1;
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                        break;
                                    }
                                    c--;
                                    spanNode = _grid._getHeaderCell((this as any).row, c);
                                }
                                this.style.display = 'none';
                            }
                            
                            if (!(this as any).cColVisible || !(this as any).cRowVisible) {
                                this.style.display = 'none';
                            }
                            
                            if (_grid.getHeaderRowCount() === (this as any).row) {
                                let targetCell: any = this;
                                if ((this as any).rowMerge) {
                                    for(let r = (this as any).row - 1; r > 0; r--) {
                                        targetCell = _grid._getHeaderCell(r, (this as any).col);
                                        if (targetCell.rowSpan) break;
                                    }
                                }
                                if (targetCell) targetCell.isLastCell = true;
                            }
                            
                            if (_gridInfo.filterable === true && _grid.getColInfo((this as any).cId).filterable &&
                                _grid.getHeaderRowCount() === (this as any).row && (this as any).cId !== 'v-g-rownum' && (this as any).cId !== 'v-g-status') {
                                let filterSpan: any;
                                const vgFilterSpan = _grid._getFilterSpan();
                                if(vgFilterSpan && vgFilterSpan instanceof HTMLElement && vgFilterSpan.nodeType === 1) {
                                    filterSpan = vgFilterSpan.cloneNode(true);
                                }
                                else {
                                    filterSpan = document.createElement('span');
                                    filterSpan.innerText = 'σ';
                                }
                                filterSpan.gId = (this as any).gId;
                                filterSpan.isChild = true;
                                filterSpan.gType = 'filter';
                                filterSpan.classList.add((this as any).gId + '_filterSpan'); 

                                const filterSelect: any = document.createElement('select');
                                filterSelect.classList.add((this as any).gId + '_filterSelect'); 
                                filterSelect.style.display = 'none';
                                filterSelect.gId = (this as any).gId;
                                filterSelect.cId = (this as any).cId;

                                filterSelect.addEventListener('mousedown', function (e: any) {
                                    this.filterOldValue = e.target.value;
                                })

                                filterSelect.addEventListener('change', function (e: any) {
                                    const filterNewValue = e.target.value;
                                    if ((window as any)[e.target.parentNode.parentNode.gId + '_onChooseFilter'](e.target.parentNode.parentNode.row, e.target.parentNode.parentNode.cId, this.filterOldValue, filterNewValue) === false) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        return;
                                    }
                                    _grid._doFilter();
                                    if (filterNewValue === '$$ALL') {
                                        this.style.display = 'none';
                                    }
                                });

                                filterSpan.append(filterSelect);

                                let targetCell: any = this;
                                if ((this as any).rowMerge) {
                                    for(let r = (this as any).row - 1; r > 0; r--) {
                                        targetCell = _grid._getHeaderCell(r, (this as any).col);
                                        if (targetCell.rowSpan) break;
                                    }
                                }
                                if (targetCell) targetCell.insertBefore(filterSpan, targetCell.firstChild);  
                            }

                            this.classList.add((this as any).gId + '_h-v-g-d');
                            break;
                        case 'gfd': 
                            
                            if (_gridInfo.frozenRowCount <= 0 && (this as any).col <= _gridInfo.frozenColCount) {
                                let leftElement;
                                let leftElementOffsetWidth = 0

                                for(let c = (this as any).col - 1; c > 0; c--) {
                                    leftElement = _grid._getFooterCell((this as any).row, c);
                                    if (!leftElement) {
                                        leftElementOffsetWidth = leftElementOffsetWidth + 0;
                                    }
                                    else if (leftElement.rowMerge) {
                                        let r = (this as any).row - 1;
                                        let spanNode = _grid._getFooterCell(r, c);
                                        while(spanNode) {
                                            if (r < 0) break;
                                            if (!spanNode.rowMerge) {
                                                break;
                                            }
                                            r--;
                                            spanNode = _grid._getFooterCell(r, c);
                                        }
                                        leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                                    }
                                    else {
                                        leftElementOffsetWidth = leftElementOffsetWidth + _grid._getFooterCell((this as any).row, c).offsetWidth;
                                    }
                                }
                                this.style.position = '-webkit-sticky',
                                this.style.zIndex = '300',
                                this.style.left = leftElementOffsetWidth + 'px';
                                (this as any).frozenCol = true;
                            }
                            
                            if ((this as any).cFooter) {
                                this.classList.add((this as any).gId + '_f-v-g-d-value');
                                let preSibling;
                                try {
                                    preSibling = _grid._getFooterCell((this as any).row, (this as any).col - 1);
                                } catch (error) {
                                    preSibling = null;
                                }
                                if (preSibling) {
                                    preSibling.classList.add((this as any).gId + '_f-v-g-d-value');
                                }
                                if (Object.values(footerUnit).includes((this as any).cFooter)) {
                                    let footerNumber;
                                    let tempNumber;
                                    let tempCell;
                                    switch ((this as any).cFooter) {
                                        case '$$MAX':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                tempNumber = getFirstCellValidNumber(_grid, (this as any));
                                                footerNumber = tempNumber;
                                                for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    tempNumber = getOnlyNumberWithNaNToNull(tempCell.cValue);
                                                    if (tempNumber !== null && tempNumber > footerNumber!) {
                                                        footerNumber = tempNumber;
                                                    }
                                                }
                                            }
                                            break;
                                        case '$$MIN':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                tempNumber = getFirstCellValidNumber(_grid, (this as any));
                                                footerNumber = tempNumber;
                                                for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    tempNumber = getOnlyNumberWithNaNToNull(tempCell.cValue);
                                                    if (tempNumber !== null && tempNumber < footerNumber!) {
                                                        footerNumber = tempNumber;
                                                    }
                                                }
                                            }
                                            break;
                                        case '$$SUM':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                footerNumber = 0;
                                                for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell.cValue)) * 100000) / 100000;
                                                }
                                            }
                                            break;
                                        case '$$AVG':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                footerNumber = 0;
                                                tempNumber = 0;
                                                let count = 0;
                                                for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell.cValue)) * 100000) / 100000;
                                                    if (tempCell.cValue !== null && tempCell.cValue !== undefined && !isNaN(tempCell.cValue)) {
                                                        count++;
                                                    }
                                                }
                                                if (count === 0) {
                                                    footerNumber = null
                                                }
                                                else  {
                                                    footerNumber = (footerNumber/count).toFixed(2);
                                                }
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                    if (footerNumber === null || footerNumber === undefined) {
                                        footerNumber = '-'
                                    }
                                    else {
                                        footerNumber = utils.getFormatNumber(_grid.getColFormat((this as any).col), footerNumber)
                                    }
                                    (this as any).innerText = footerNumber;
                                    (this as any).cValue = footerNumber;
                                }
                                else if (typeof (this as any).cFooter === 'function') {
                                    const functionResult = (this as any).cFooter(_grid.getValues());
                                    this.innerText = functionResult;
                                    (this as any).cValue = functionResult;
                                }
                                else {
                                    this.innerText = (this as any).cFooter;
                                    (this as any).cValue = (this as any).cFooter;

                                    const vgFooterFormula = _grid._getFooterFormula();
                                    if(vgFooterFormula.constructor === Object) {
                                        Object.keys(vgFooterFormula).forEach(key => {
                                            if((this as any).cFooter === key) {
                                                const result = vgFooterFormula[key](_grid.getColValues((this as any).cIndex));
                                                this.innerText = result;
                                                (this as any).cValue = result;
                                            }
                                        });
                                    }
                                }
                            }
                            if ((this as any).cAlign) {
                                this.style.justifyContent = (this as any).cAlign;
                                this.style.textAlign = (this as any).cAlign;
                            }
                            if ((this as any).col === _grid.getColCount()) {
                                this.classList.add((this as any).gId + '_f-v-g-d-value');
                            }
                            if (!(this as any).cColVisible || !(this as any).cRowVisible) {
                                this.style.display = 'none';
                            }
                            this.classList.add((this as any).gId + '_f-v-g-d');
                            break;
                        case 'gbd': 
                            
                            switch ((this as any).cDataType) {
                                case 'text':
                                case 'mask':
                                    this.style.justifyContent = 'left';
                                    this.style.textAlign = 'left';
                                    break;
                                case 'number':
                                    this.style.justifyContent = 'right';
                                    this.style.textAlign = 'right';
                                    break;
                                case 'date':
                                case 'month':
                                case 'code':
                                case 'select':
                                case 'checkbox':
                                case 'button':
                                case 'link':
                                    this.style.justifyContent = 'center';
                                    this.style.textAlign = 'center';
                                    break;
                                default:
                                    this.style.justifyContent = 'center';
                                    this.style.textAlign = 'center';

                                    const dataTypeStyle = _grid._getDataTypeStyle();
                                    Object.keys(dataTypeStyle).forEach((key) => {
                                        if((this as any).cDataType === key) {
                                            if(dataTypeStyle[key].constructor !== Object) throw new Error('Cellstyle can only be inserted in object type.');
                                            Object.keys(dataTypeStyle[key]).forEach((styleKey) => {
                                                (this as any).style[styleKey] = dataTypeStyle[key][styleKey];
                                            });
                                        }
                                    });
                                    break;
                            }
                            while (this.firstChild) {
                                this.removeChild(this.firstChild);
                            }
                            this.append(_grid._getCellChildNode(this));
                            
                            if ((this as any).row <= _gridInfo.frozenRowCount) {
                                let headerOffsetHeight = _grid._getHeader().offsetHeight;
                                let topElement;
                                let topElementOffsetHeight = 0;
                                for(let r = (this as any).row - 1; r > 0; r--) {
                                    topElement = _grid._getCell(r, (this as any).col);
                                    if (!topElement) {
                                        topElementOffsetHeight = topElementOffsetHeight + 0;
                                    }
                                    else if (topElement.colMerge) {
                                        let c = (this as any).col - 1;
                                        let spanNode = _grid._getCell(r, c);
                                        while(spanNode) {
                                            if (c < 0) break;
                                            if (!spanNode.colMerge) {
                                                break;
                                            }
                                            c--;
                                            spanNode = _grid._getCell(r, c);
                                        }
                                        topElementOffsetHeight = topElementOffsetHeight + spanNode.offsetHeight;
                                    }
                                    else {
                                        topElementOffsetHeight = topElementOffsetHeight + _grid._getCell(r, (this as any).col).offsetHeight;
                                    }
                                }
                                this.style.position = 'sticky';
                                this.style.zIndex = '200';
                                this.style.top = headerOffsetHeight + topElementOffsetHeight + 'px';
                                if ((this as any).row === _gridInfo.frozenRowCount) this.style.borderBottom = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                                (this as any).frozenCol = true;
                            }
                            
                            if (_gridInfo.frozenRowCount <= 0 && (this as any).col <= _gridInfo.frozenColCount) {
                                let leftElement;
                                let leftElementOffsetWidth = 0

                                for(let c = (this as any).col - 1; c > 0; c--) {
                                    leftElement = _grid._getCell((this as any).row, c);
                                    if (!leftElement) {
                                        leftElementOffsetWidth = leftElementOffsetWidth + 0;
                                    }
                                    else if (leftElement.rowMerge) {
                                        let r = (this as any).row - 1;
                                        let spanNode = _grid._getCell(r, c);
                                        while(spanNode) {
                                            if (r < 0) break;
                                            if (!spanNode.rowMerge) {
                                                break;
                                            }
                                            r--;
                                            spanNode = _grid._getCell(r, c);
                                        }
                                        leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                                    }
                                    else {
                                        leftElementOffsetWidth = leftElementOffsetWidth + _grid._getCell((this as any).row, c).offsetWidth;
                                    }
                                }
                                this.style.position = 'sticky';
                                this.style.zIndex = '200';
                                if ((this as any).col === _gridInfo.frozenColCount) this.style.borderRight = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                                this.style.left = leftElementOffsetWidth + 'px';
                                (this as any).frozenRow = true;
                            }
                            
                            if ((this as any).rowMerge) {
                                let r = (this as any).row - 1;
                                let spanNode = _grid._getCell(r, (this as any).col);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode.rowMerge) {
                                        spanNode.style.gridRowEnd = this.style.gridRowEnd;
                                        if (!spanNode.cVerticalAlign) spanNode.style.alignItems = 'center';
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                        break;
                                    }
                                    r--;
                                    spanNode = _grid._getCell(r, (this as any).col);
                                }
                                
                                if (isCellVisible(spanNode)) {
                                    this.style.display = 'none';
                                }
                            }
                            
                            if ((this as any).colMerge) {
                                let c = (this as any).col - 1;
                                let spanNode = _grid._getCell((this as any).row, c);
                                while(spanNode) {
                                    if (c < 0) break;
                                    if (!spanNode.colMerge) {
                                        spanNode.style.gridColumnEnd = this.style.gridColumnEnd;
                                        
                                        if (!spanNode.cAlign) spanNode.style.justifyContent = 'center';
                                        if (!spanNode.cAlign) spanNode.style.textAlign = 'center';
                                        if (!spanNode.cVerticalAlign) spanNode.style.alignItems = 'center';
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                        break;
                                    }
                                    c--;
                                    spanNode = _grid._getCell((this as any).row, c);
                                }
                                this.style.display = 'none';
                            }
                            
                            if ((this as any).cAlign) {
                                this.style.justifyContent = (this as any).cAlign;
                                this.style.textAlign = (this as any).cAlign;
                            }

                            if ((this as any).cVerticalAlign) {
                                switch ((this as any).cVerticalAlign.toLowerCase()) {
                                    case 'top':
                                        this.style.alignItems = 'flex-start';
                                        break;
                                    case 'bottom':
                                        this.style.alignItems = 'flex-end';
                                        break;
                                    default:
                                        this.style.alignItems = 'center';
                                        break;
                                }
                            }
                            if ((this as any).cOverflowWrap) this.style.overflowWrap = (this as any).cOverflowWrap;
                            if ((this as any).cWordBreak) this.style.wordBreak = (this as any).cWordBreak;
                            if ((this as any).cWhiteSpace) this.style.whiteSpace = (this as any).cWhiteSpace;
                            if ((this as any).cBackColor) this.style.backgroundColor = (this as any).cBackColor;
                            if ((this as any).cFontColor) (this as any).firstChild.style.color = (this as any).cFontColor;
                            if ((this as any).cFontBold) (this as any).firstChild.style.fontWeight = 'bold';
                            if ((this as any).cFontItalic) (this as any).firstChild.style.fontStyle = 'italic';
                            if ((this as any).cFontThruline) (this as any).firstChild.style.textDecoration = 'line-through';
                            if ((this as any).cFontUnderline) (this as any).firstChild.style.textDecoration = 'underline';
                            if (!(this as any).cColVisible || !(this as any).cRowVisible) {
                                this.style.display = 'none';
                            }
                            if ((this as any).cFilter) {
                                this.style.display = 'none';
                            }
                            
                            if (_gridInfo.alterRow && (this as any).row % 2 === 0) {
                                this.classList.add((this as any).gId + '_b-v-g-d-alter');
                                this.classList.remove((this as any).gId + '_b-v-g-d');
                            }
                            else {
                                this.classList.add((this as any).gId + '_b-v-g-d');
                                this.classList.remove((this as any).gId + '_b-v-g-d-alter');
                            }
                            if ((this as any).cLocked && (this as any).cLockedColor) {
                                this.classList.add((this as any).gId + '_b-v-g-d-locked');
                            }
                            else {
                                this.classList.remove((this as any).gId + '_b-v-g-d-locked');
                            }
                            if((this as any).cLocked) {
                                if ((this as any).cDataType === 'select' && this.firstChild && (this as any).firstChild.nType == 'select') {
                                    (this as any).firstChild.disabled = true;
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                                else if ((this as any).cDataType === 'checkbox' && this.firstChild && (this as any).firstChild.nType == 'checkbox') {
                                    (this as any).firstChild.disabled = true;
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                            }
                            if ((this as any).cUntarget) {
                                if ((this as any).cDataType === 'button' && this.firstChild && (this as any).firstChild.nType == 'button') {
                                    (this as any).firstChild.disabled = true;
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                                else if ((this as any).cDataType === 'link' && this.firstChild && (this as any).firstChild.nType == 'link') {
                                    (this as any).firstChild.style.opacity = '0.8';
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    this.classList.add((this as any).gId + '_v-g-d');

                    this.addEventListener('mouseover', function (e) {
                        if (!(this as any).cUntarget && (this as any).gType === 'gbd') {
                            this.classList.add((this as any).gId + '_mouseover-cell');
                            if ((this as any).cDataType === 'link') {
                                const childList = this.querySelectorAll('*');
                                childList.forEach(child => {
                                    child.classList.add((this as any).gId + '_mouseover-cell');
                                });
                            }
                        }
                    });

                    this.addEventListener('mouseout', function (e) {
                        if (!(this as any).cUntarget && (this as any).gType === 'gbd') {
                            this.classList.remove((this as any).gId + '_mouseover-cell');
                            if ((this as any).cDataType === 'link') {
                                const childList = this.querySelectorAll('*');
                                childList.forEach(child => {
                                    child.classList.remove((this as any).gId + '_mouseover-cell');
                                });
                            }
                        }
                    });
                }
            }
            if (!customElements.get('v-g-d')) customElements.define('v-g-d', vg._GridData); 
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
