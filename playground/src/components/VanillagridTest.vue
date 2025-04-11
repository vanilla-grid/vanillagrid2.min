<template>
  <div ref="gridWrap">
    <button @click="setGrid1Data">getGridData 1</button>
    <button @click="setGrid2Data">setGridData 3</button>
    <div data-vanillagrid data-id="grid1" height="200px">
        <div data-col id="col1" header="header" data-type="text" width="600"></div>
    </div>
    <div data-vanillagrid data-id="grid2" locked-color="false" height="400px">
        <div data-col id="dept" header="Click the Sigma button to the left of the header;filter1(mask);dept " data-type="mask" format="AAA99" width="100" locked="true" row-merge="true"></div>
        <div data-col id="f_nm" header=";filter2(text);first name" data-type="text" width="120" align="center" locked="true"></div>
        <div data-col id="l_nm" header=";filter3(text);last name" data-type="text" width="120" align="center" locked="true" col-merge="true"></div>
        <div data-col id="d_o_j" header=";filter4(month);DOJ" data-type="month" width="120" locked="true"></div>
        <div data-col id="e_id" header="sort1(text);;" data-type="text" width="120" align="center" locked="true" footer="MAX;MIN;AVG;SUM"></div>
        <div data-col id="salary" header="sort2(number);;salary" data-type="number" format="$ #,###.00" width="150" footer="$$MAX;$$MIN;$$AVG;$$SUM"></div>
        <div data-col id="status" header="Please double click;checkbox;status" data-type="checkbox" width="80"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Vanillagrid, GridMethods } from 'vanillagrid2';
import { ref } from 'vue';
import { getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';

const { proxy } = getCurrentInstance()!;
const vg: Vanillagrid = (proxy as any)!.$vg;
const gridWrap = ref<HTMLElement | null>(null);

const setGrid1Data = () => {
  const grid: GridMethods = vg.getGrid("grid1")!;
  const data = [
      {
          col1 : 'This is a text dataType.\nDouble-click to create an editor.\nPress F2 to create an editor.\nWhen you press the enter key, editor focus.\nTry it!',
      },
  ];
  console.log(grid);
  grid.load(data);
};
const setGrid2Data = () => {
  const data = [
      {
          dept : "AAA01",
          f_nm : "James",
          l_nm : "Smith",
          d_o_j : "201603",
          e_id : "7",
          salary : 100000,
          status : "Y",
      },
      {
          dept : "AAA01",
          f_nm : "Johnson",
          l_nm : "Johnson",
          d_o_j : "200103",
          e_id : "2",
          salary : 200000,
          status : "Y",
      },
      {
          dept : "AAA01",
          f_nm : "Michael",
          l_nm : "Williams",
          d_o_j : "200803",
          e_id : "4",
          salary : 150000,
          status : "N",
      },
      {
          dept : "AAA01",
          f_nm : "Smith",
          l_nm : "Smith",
          d_o_j : "202403",
          e_id : "46",
          salary : 50000,
          status : "Y",
      },
      {
          dept : "AAA01",
          f_nm : "William",
          l_nm : "Brown",
          d_o_j : "202203",
          e_id : "25",
          salary : 70000,
          status : "N",
      },
      {
          dept : "AAA01",
          f_nm : "Charles",
          l_nm : "Jones",
          d_o_j : "202103",
          e_id : "27",
          salary : 30000,
          status : "N",
      },
      {
          dept : "AAA02",
          f_nm : "David",
          l_nm : "Smith",
          d_o_j : "201403",
          e_id : "12",
          salary : 180000,
          status : "N",
      },
      {
          dept : "AAA02",
          f_nm : "James",
          l_nm : "Jones",
          d_o_j : "202303",
          e_id : "26",
          salary : 80000,
          status : "N",
      },
      {
          dept : "AAA02",
          f_nm : "Richard",
          l_nm : "Garcia",
          d_o_j : "202203",
          e_id : "24",
          salary : 60000,
          status : "Y",
      },
      {
          dept : "AAA02",
          f_nm : "David",
          l_nm : "Miller",
          d_o_j : "202403",
          e_id : "48",
          salary : 90000,
          status : "Y",
      },
      {
          dept : "AAA02",
          f_nm : "Joseph",
          l_nm : "Davis",
          d_o_j : "202403",
          e_id : "34",
          salary : 40000,
          status : "Y",
      },
      {
          dept : "AAA02",
          f_nm : "Richard",
          l_nm : "Miller",
          d_o_j : "202303",
          e_id : "35",
          salary : 50000,
          status : "Y",
      },
      {
          dept : "BBB01",
          f_nm : "Joseph",
          l_nm : "Davis",
          d_o_j : "200403",
          e_id : "3",
          salary : 140000,
          status : "Y",
      },
      {
          dept : "BBB01",
          f_nm : "Thomas",
          l_nm : "Johnson",
          d_o_j : "200903",
          e_id : "9",
          salary : 110000,
          status : "N",
      },
      {
          dept : "BBB01",
          f_nm : "Charles",
          l_nm : "Brown",
          d_o_j : "200703",
          e_id : "11",
          salary : 130000,
          status : "Y",
      },
      {
          dept : "BBB01",
          f_nm : "James",
          l_nm : "Rodriguez",
          d_o_j : "201303",
          e_id : "14",
          salary : 120000,
          status : "N",
      },
      {
          dept : "BBB02",
          f_nm : "Richard",
          l_nm : "Garcia",
          d_o_j : "200803",
          e_id : "10",
          salary : 190000,
          status : "Y",
      },
      {
          dept : "BBB02",
          f_nm : "David",
          l_nm : "Martinez",
          d_o_j : "202403",
          e_id : "37",
          salary : 60000,
          status : "Y",
      },
      {
          dept : "BBB02",
          f_nm : "Robert",
          l_nm : "Rodriguez",
          d_o_j : "202303",
          e_id : "31",
          salary : 90000,
          status : "N",
      },
      {
          dept : "BBB02",
          f_nm : "James",
          l_nm : "Williams",
          d_o_j : "202403",
          e_id : "40",
          salary : 60000,
          status : "Y",
      },
  ];
  const grid: GridMethods = vg.getGrid("grid2")!;
  console.log(grid);
  grid.load(data);
};

onMounted(()=>{
  if(!gridWrap.value) return;
  vg.mountGrid(gridWrap.value);
})
onBeforeUnmount(()=>{
  if(!gridWrap.value) return;
  vg.unmountGrid(gridWrap.value);
})
</script>
