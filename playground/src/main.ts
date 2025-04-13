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
/*
vgConfig.dataType = {
    radio : {
        //cell의 style에 justify-content, text-align 속성을 지정한다.
        cellStyle: {
            justifyContent: "center",
            textAlign: "center",
        },
        //cell이 선택된 상태에서 'Enter' key가 눌리면 해당 cell의 value를 "Y"로 변경한다.
        onSelectedAndKeyDown : function (event, data) {
            if(event.key === 'Enter' || event.key === ' ') {
                window[data.gridId].setColSameValue(data.col, "N", true);
                window[data.gridId].setCellValue(data.row, data.col, "Y", true);
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        },
        //cell을 마우스로 선택하면 cell의 value를 "Y"로 변경한다.
        onClick : function (event, data) {
            window[data.gridId].setColSameValue(data.col, "N", true);
            window[data.gridId].setCellValue(data.row, data.col, "Y", true);
        },
        //value를 그대로 반환한다.
        getValue: function (value) {
            return value;
        },
        //value가 "Y"일 때 "true"를 아니면 "false"를 반환한다.
        getText: function (value) {
            const text = value === "Y" ? "true" : "false";
            return text;
        },
        //radio type의 input이며 data가 "Y"일 때 checked 상태인 html 요소를 반환한다.
        getChildNode: function (data) {
            const childNode = document.createElement("input");
            childNode.setAttribute("type", "radio");
            childNode.setAttribute("name", data.name);
            childNode.setAttribute("value", "" + data.row);
            childNode.gridId = data.gridId;
            childNode.cellRow = data.row;
            childNode.cellCol = data.col;
            childNode.checked = data.value === "Y";
            return childNode;
        },
        //filter는 체크된 값은 "●", 아닌 값은 "○"를 적용한다.
        getFilterValue: function (value) {
            const filterValue = value === "Y" ? "●" : "○";
            return filterValue;
        },
    }
}
*/
//!!!!!!!!!!!!!!!!!!
//1. 이벤트 세팅 기능 필요함!!!
//2. dataType의 각 function들 타입정의 다시.
//3. dataType에서 gridMethods를 사용할 수 있도록 해야함!!!
const vg: Vanillagrid = getVanillagrid(vgConfig);
vg.init();
// 2. 전역 속성으로 등록
app.config.globalProperties.$vg = vg;

// 3. 앱 마운트
app.use(router).mount('#app');
