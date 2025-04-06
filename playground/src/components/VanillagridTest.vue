<template>
  <div ref="editorWrap">
    <button @click="getGridData">getGridData 1</button>
    <button @click="setGridData">setGridData 3</button>
  </div>
</template>

<script setup lang="ts">
/*
import { onMounted } from 'vue';

onMounted(() => {
// Playground 최초 로딩 시 자동 생성 원하면 여기에
});
*/
//import type { Vanillagrid, VanillagridElement } from 'vanillagrid2';
import { ref } from 'vue';
import { getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';

const { proxy } = getCurrentInstance()!;
//const vn: Vanillagrid = (proxy as any)!.$vn;
const editorWrap = ref<HTMLElement | null>(null);

//let gridData;

const getGridData = () => {
  //const grid1: VanillagridElement = vn.getGrid('grid1')!;
  //gridData = grid1.getGridData();
  //console.log(gridData);
};
const setGridData = () => {
  //const grid3: VanillagridElement = vn.getGrid('grid3')!;
  //grid3.setGridData(gridData);
};

onMounted(()=>{
  if(!editorWrap.value) return;
  //vn.mountGrid(editorWrap.value);
})
onBeforeUnmount(()=>{
  if(!editorWrap.value) return;
  //vn.unmountGrid(editorWrap.value);
})
</script>
