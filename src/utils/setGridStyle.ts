import type { Grid } from "../types/grid";
import type { GridCssInfo } from "../types/gridInfo";
import { extractNumberAndUnit, getAdjustHexColor, getColorShade, getCssTextFromObject, getHexColorFromColorName, getInvertColor, getMostLightHexColor, removeAllChild } from "./utils";

export const getGridCssStyle = (grid: Grid) => {
    const gId = grid.data.id;
    const csses: any = {};
    csses['.' + gId + '_vanillagrid'] = {
        'width': grid.data.gridCssInfo.width,
        'height': grid.data.gridCssInfo.height,
        'display': grid.data.gridInfo.visible ? 'block' : 'none',
        'border': '1px solid ' + grid.data.gridCssInfo.gridBorderColor,
        'overflow': 'auto',
        'background-color': '#fff',
        'margin': grid.data.gridCssInfo.margin,
        'padding': grid.data.gridCssInfo.padding,
        'font-family': grid.data.gridCssInfo.gridFontFamily,
    };
    csses['.' + gId + '_v-g'] = {
        'background-color': grid.data.gridCssInfo.bodyBackColor,
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
        'display': grid.data.gridInfo.headerVisible ? 'grid' : 'none',
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
        'background-color': grid.data.gridCssInfo.headerCellBackColor,
        'justify-content': 'center',
        'text-align': 'center',
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.headerCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.headerCellBorderColor,
        'color': grid.data.gridCssInfo.headerCellFontColor,
    };
    csses['.' + gId + '_h-v-g-d select'] = {
        'color': '#333',
    };
    csses['.' + gId + '_h-v-g-d option'] = {
        'color': '#333',
    };
    csses['.' + gId + '_b-v-g-d'] = {
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'background-color': grid.data.gridCssInfo.bodyCellBackColor,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'color': grid.data.gridCssInfo.bodyCellFontColor,
    };
    csses['.' + gId + '_f-v-g-d'] = {
        'justify-content': 'center',
        'text-align': 'center',
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'background-color': grid.data.gridCssInfo.footerCellBackColor,
        'border-top': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.footerCellBorderColor,
        'color': grid.data.gridCssInfo.footerCellFontColor,
    };
    csses['.' + gId + '_f-v-g-d-value'] = {
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
    };
    csses['.' + gId + '_b-v-g-d-alter'] = {
        'align-items' : grid.data.gridCssInfo.verticalAlign,
        'background-color': grid.data.gridCssInfo.alterRowBackColor,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'color': grid.data.gridCssInfo.alterRowFontColor,
    };
    csses['.' + gId + '_b-v-g-d-locked'] = {
        'background-color': grid.data.gridCssInfo.lockCellBackColor,
        'border-bottom': grid.data.gridCssInfo.horizenBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'border-right': grid.data.gridCssInfo.verticalBorderSize + 'px solid ' + grid.data.gridCssInfo.bodyCellBorderColor,
        'color': grid.data.gridCssInfo.lockCellFontColor,
    };
    csses['.' + gId + '_v-g-d'] = {
        'font-size': grid.data.gridCssInfo.cellFontSize,
        'display': 'flex',
        'min-height': grid.data.gridCssInfo.cellMinHeight,
        'overflow': 'hidden',
        'white-space': 'nowrap',
        'padding-left': '5px',
        'padding-right': '5px',
    };
    if (grid.data.gridCssInfo.overflowWrap) csses['.' + gId + '_v-g-d']['overflow-wrap'] = grid.data.gridCssInfo.overflowWrap;
    if (grid.data.gridCssInfo.wordBreak) csses['.' + gId + '_v-g-d']['word-break'] = grid.data.gridCssInfo.wordBreak;
    if (grid.data.gridCssInfo.whiteSpace) csses['.' + gId + '_v-g-d']['white-space'] = grid.data.gridCssInfo.whiteSpace;

    csses['.' + gId + '_editor'] = {
        'font-size': grid.data.gridCssInfo.cellFontSize,
        'background-color': grid.data.gridCssInfo.editorBackColor,
        'border': 'none',
        'color': grid.data.gridCssInfo.editorFontColor,
        'overflow' : 'hidden',
        'resize': 'none',
        'box-sizing': 'border-box',
        'font-family': grid.data.gridCssInfo.gridFontFamily,
        'text-align': 'inherit',
    };
    csses['.' + gId + '_editor:focus'] = {
        'outline': 'none',
    };
    csses['.' + gId + '_mouseover-cell'] = {
        'background-color': grid.data.gridCssInfo.mouseoverCellBackColor + ' !important',
        'color': grid.data.gridCssInfo.mouseoverCellFontColor + ' !important',
    };
    csses['.' + gId + '_selected-cell'] = {
        'background-color': grid.data.gridCssInfo.selectCellBackColor + ' !important',
        'color': grid.data.gridCssInfo.selectCellFontColor + ' !important',
    };
    csses['.' + gId + '_selected-col'] = {
        'background-color': grid.data.gridCssInfo.selectColBackColor,
        'color': grid.data.gridCssInfo.selectColFontColor,
    };
    csses['.' + gId + '_selected-row'] = {
        'background-color': grid.data.gridCssInfo.selectRowBackColor,
        'color': grid.data.gridCssInfo.selectRowFontColor,
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
        'font-size': grid.data.gridCssInfo.cellFontSize,
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
        'height': (extractNumberAndUnit(grid.data.gridCssInfo.cellMinHeight)!.number * 0.85) + 'px',
        'line-height': (extractNumberAndUnit(grid.data.gridCssInfo.cellMinHeight)!.number * 0.85) + 'px',
        'font-size': grid.data.gridCssInfo.cellFontSize,
        'cursor': 'pointer',
        'border': 'none',
        'color': grid.data.gridCssInfo.buttonFontColor,
        'background-color': grid.data.gridCssInfo.buttonBackColor,
        'box-shadow': '0.75px 0.75px 1px 0.25px ' + grid.data.gridCssInfo.buttonBorderColor,
    }
    csses['.' + gId + '_data-value-button:hover'] = {
        'color': grid.data.gridCssInfo.buttonHoverFontColor,
        'background-color': grid.data.gridCssInfo.buttonHoverBackColor,
    }
    csses['.' + gId + '_data-value-button:active'] = {
        'color': grid.data.gridCssInfo.buttonActiveFontColor,
        'background-color': grid.data.gridCssInfo.buttonActiveBackColor,
        'box-shadow': '0px 0px 0.5px 0.25px ' + grid.data.gridCssInfo.buttonBorderColor,
    }
    csses['.' + gId + '_data-value-button:focus'] = {
        'outline': 'none',
    }
    csses['.' + gId + '_data-value-button:disabled'] = {
        'opacity': '0.7',
    }
    csses['.' + gId + '_data-value-link'] = {
        'color': grid.data.gridCssInfo.linkFontColor,
        'text-decoration': grid.data.gridCssInfo.linkHasUnderLine ? 'underline' : 'none',
    }
    csses['.' + gId + '_data-value-link:visited'] = {
        'color': grid.data.gridCssInfo.linkVisitedFontColor,
    }
    csses['.' + gId + '_data-value-link:hover'] = {
        'color': grid.data.gridCssInfo.linkHoverFontColor + ' !important',
    }
    csses['.' + gId + '_data-value-link:active'] = {
        'color': grid.data.gridCssInfo.linkActiveFontColor + ' !important',
    }
    csses['.' + gId + '_data-value-link:focus'] = {
        'color': grid.data.gridCssInfo.linkFocusFontColor + ' !important',
    }
    return csses;
};
export const setGridCssStyle = (grid: Grid) => {
    const gId = grid.data.id;
    let cssText = '';
    const csses = getGridCssStyle(grid);
    const cssKeys = Object.keys(csses);
    for(let i = 0; i < cssKeys.length; i++) {
        cssText = cssText + cssKeys[i] + ' {' + getCssTextFromObject(csses[cssKeys[i]]) + '}\n';
    }

    let styleElement: any = document.getElementById(gId + '_styles-sheet');
    if (styleElement) {
        removeAllChild(styleElement);
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
};
export const setColorSet = (cssInfo: GridCssInfo) => {
    let color = cssInfo.color;
    if (!color) color = '#f3f3f3';
    if (color !== 'black' && color !== '#000' && color !== '#000000'
        && getHexColorFromColorName(color) === '#000000') throw new Error('Please enter the correct color.');
    color = getHexColorFromColorName(color);
    const isLight = getColorShade(color) === 'light';
    const fontColor = isLight ? '#333333' : '#ffffff';
    const alterRowColorModify = getMostLightHexColor(color);
    
    cssInfo.gridBorderColor = getAdjustHexColor(color, '-4f');
    cssInfo.bodyBackColor = '#ffffff';

    cssInfo.headerCellBackColor = color;
    cssInfo.headerCellBorderColor = getAdjustHexColor(color, '-4f');
    cssInfo.headerCellFontColor = fontColor;

    cssInfo.footerCellBackColor = color;
    cssInfo.footerCellBorderColor = getAdjustHexColor(color, '-4f');
    cssInfo.footerCellFontColor = fontColor;

    cssInfo.bodyCellBackColor = '#ffffff';
    cssInfo.bodyCellBorderColor = getAdjustHexColor(color, '-f');
    cssInfo.bodyCellFontColor = '#333333';

    cssInfo.editorBackColor = '#fefefe';
    cssInfo.editorFontColor = '#333333';

    cssInfo.selectCellBackColor = getAdjustHexColor(color, '-2f');
    cssInfo.selectCellFontColor = fontColor;

    cssInfo.selectColBackColor = getAdjustHexColor(color, '-2f');
    cssInfo.selectColFontColor = fontColor;

    cssInfo.selectRowBackColor = getAdjustHexColor(alterRowColorModify, isLight ? '-f' : '-2f');
    cssInfo.selectRowFontColor = '#333333';

    cssInfo.mouseoverCellBackColor = color;
    cssInfo.mouseoverCellFontColor = fontColor;

    cssInfo.lockCellBackColor = getAdjustHexColor(alterRowColorModify, isLight ? '-6' : '-1f');
    cssInfo.lockCellFontColor = '#666666';

    cssInfo.alterRowBackColor = alterRowColorModify;
    cssInfo.alterRowFontColor = '#333333';
    
    cssInfo.buttonFontColor = fontColor;
    cssInfo.buttonBackColor = color
    cssInfo.buttonBorderColor = getAdjustHexColor(color, isLight ? '-cf' : '-4f');
    cssInfo.buttonHoverFontColor = fontColor;
    cssInfo.buttonHoverBackColor = getAdjustHexColor(color, '-f');
    cssInfo.buttonActiveFontColor = fontColor;
    cssInfo.buttonActiveBackColor = getAdjustHexColor(color, '-2f');

    cssInfo.linkFontColor = getAdjustHexColor(color, isLight ? '-cf' : '0');
    cssInfo.linkHoverFontColor = getAdjustHexColor(color, isLight ? '-4f' : 'af');
    cssInfo.linkActiveFontColor = getAdjustHexColor(color, isLight ? '-cf' : '0');
    cssInfo.linkVisitedFontColor = getAdjustHexColor(color, isLight ? '-5f' : '2f');
    cssInfo.linkFocusFontColor = getAdjustHexColor(color, isLight ? '-4f' : 'bf');
};
export const setInvertColor = (cssInfo: GridCssInfo) => {
    cssInfo.gridBorderColor = getInvertColor(cssInfo.gridBorderColor);
    cssInfo.headerCellBackColor = getInvertColor(cssInfo.headerCellBackColor);
    cssInfo.headerCellBorderColor = getInvertColor(cssInfo.headerCellBorderColor);
    cssInfo.headerCellFontColor = getInvertColor(cssInfo.headerCellFontColor);
    cssInfo.footerCellBackColor = getInvertColor(cssInfo.footerCellBackColor);
    cssInfo.footerCellBorderColor = getInvertColor(cssInfo.footerCellBorderColor);
    cssInfo.footerCellFontColor = getInvertColor(cssInfo.footerCellFontColor);
    cssInfo.bodyBackColor = getInvertColor(cssInfo.bodyBackColor);
    cssInfo.bodyCellBackColor = getInvertColor(cssInfo.bodyCellBackColor);
    cssInfo.bodyCellBorderColor = getInvertColor(cssInfo.bodyCellBorderColor);
    cssInfo.bodyCellFontColor = getInvertColor(cssInfo.bodyCellFontColor);
    cssInfo.editorBackColor = getInvertColor(cssInfo.editorBackColor);
    cssInfo.editorFontColor = getInvertColor(cssInfo.editorFontColor);
    cssInfo.selectCellBackColor = getInvertColor(cssInfo.selectCellBackColor);
    cssInfo.selectCellFontColor = getInvertColor(cssInfo.selectCellFontColor);
    cssInfo.selectColBackColor = getInvertColor(cssInfo.selectColBackColor);
    cssInfo.selectColFontColor = getInvertColor(cssInfo.selectColFontColor);
    cssInfo.selectRowBackColor = getInvertColor(cssInfo.selectRowBackColor);
    cssInfo.selectRowFontColor = getInvertColor(cssInfo.selectRowFontColor);
    cssInfo.mouseoverCellBackColor = getInvertColor(cssInfo.mouseoverCellBackColor);
    cssInfo.mouseoverCellFontColor = getInvertColor(cssInfo.mouseoverCellFontColor);
    cssInfo.lockCellBackColor = getInvertColor(cssInfo.lockCellBackColor);
    cssInfo.lockCellFontColor = getInvertColor(cssInfo.lockCellFontColor);
    cssInfo.alterRowBackColor = getInvertColor(cssInfo.alterRowBackColor);
    cssInfo.alterRowFontColor = getInvertColor(cssInfo.alterRowFontColor);
    cssInfo.buttonFontColor = getInvertColor(cssInfo.buttonFontColor);
    cssInfo.buttonBorderColor = getInvertColor(cssInfo.buttonBorderColor);
    cssInfo.buttonBackColor = getInvertColor(cssInfo.buttonBackColor);
    cssInfo.buttonHoverFontColor = getInvertColor(cssInfo.buttonHoverFontColor);
    cssInfo.buttonHoverBackColor = getInvertColor(cssInfo.buttonHoverBackColor);
    cssInfo.buttonActiveFontColor = getInvertColor(cssInfo.buttonActiveFontColor);
    cssInfo.buttonActiveBackColor = getInvertColor(cssInfo.buttonActiveBackColor);
    cssInfo.linkFontColor = getInvertColor(cssInfo.linkFontColor);
    cssInfo.linkHoverFontColor = getInvertColor(cssInfo.linkHoverFontColor);
    cssInfo.linkActiveFontColor = getInvertColor(cssInfo.linkActiveFontColor);
    cssInfo.linkVisitedFontColor = getInvertColor(cssInfo.linkVisitedFontColor);
    cssInfo.linkFocusFontColor = getInvertColor(cssInfo.linkFocusFontColor);
};