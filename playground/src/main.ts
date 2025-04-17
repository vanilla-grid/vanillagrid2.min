import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { getVanillagrid, getVanillagridConfig } from 'vanillagrid2';
import type { Vanillagrid } from 'vanillagrid2';

const app = createApp(App);

// 1. Vanillagrid 객체 생성
const vgConfig = getVanillagridConfig();
vgConfig.attributes.defaultGridInfo.monthFormat = 'mm. yyyy'
vgConfig.footerFormula = {
    "CHECK_COUNT" : function (colValues) {
        let count = 0;
        colValues.forEach((val) => {
            if(val === 'Y') count = count + 1;
        });
        return String(count);
    }
}
vgConfig.dataType = {
    radio : {
        //cell의 style에 justify-content, text-align 속성을 지정한다.
        cellStyle: {
            justifyContent: "center",
            textAlign: "center",
        },
        //cell이 선택된 상태에서 'Enter' key가 눌리면 해당 cell의 value를 "Y"로 변경한다.
        onSelectedAndKeyDown : function (event, gridId, data) {
            if(event.key === 'Enter' || event.key === ' ') {
                vg.getGrid(gridId)!.setColSameValue(data.colId, "N", true);
                vg.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, "Y", true);
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
            return false;
        },
        //cell을 마우스로 선택하면 cell의 value를 "Y"로 변경한다.
        onClick : function (event, gridId, data) {
            vg.getGrid(gridId)!.setColSameValue(data.colId, "N", true);
            vg.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, "Y", true);
        },
        //value를 그대로 반환한다.
        getValue: function (gridId, value) {
            return value;
        },
        //value가 "Y"일 때 "true"를 아니면 "false"를 반환한다.
        getText: function (gridId, value) {
            const text = value === "Y" ? "true" : "false";
            return text;
        },
        //radio type의 input이며 data가 "Y"일 때 checked 상태인 html 요소를 반환한다.
        getChildNode: function (gridId, data) {
            const childNode: any = document.createElement("input");
            childNode.setAttribute("type", "radio");
            childNode.setAttribute("name", data.name? data.name : data.colId);
            childNode.setAttribute("value", "" + data.rowIndex);
            childNode._gridId = gridId;
            childNode.rowIndex = data.rowIndex;
            childNode.colId = data.colId;
            childNode.checked = data.value === "Y";
            return childNode;
        },
        //filter는 체크된 값은 "●", 아닌 값은 "○"를 적용한다.
        getFilterValue: function (gridId, value) {
            const filterValue = value === "Y" ? "●" : "○";
            return filterValue;
        },
    }
}

const vg: Vanillagrid = getVanillagrid(vgConfig);
vg.init();
// 2. 전역 속성으로 등록
app.config.globalProperties.$vg = vg;

// 3. 앱 마운트
app.use(router).mount('#app');
