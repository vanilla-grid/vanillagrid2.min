// vanillagrid2 smoke test — run: npm test (requires prior npm run build)
// jsdom(devDependency)으로 DOM을 구성해 mount→편집→undo/redo까지 검증한다.
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.NodeList = dom.window.NodeList;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
// Node 22+는 globalThis.navigator가 getter 전용 — 이미 존재하므로 그대로 사용
if (!globalThis.requestAnimationFrame) globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);

const M = await import('../dist/Vanillagrid2.bundle.js');
const { getVanillagrid } = M.default ?? M;

let pass = 0, fail = 0;
const eq = (label, actual, expected) => {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a === e) { pass++; }
    else { fail++; console.error(`FAIL ${label}\n  expected: ${e}\n  actual  : ${a}`); }
};
const noThrow = (label, fn) => {
    try { fn(); pass++; }
    catch (err) { fail++; console.error(`FAIL ${label} (threw: ${err.message})`); }
};

document.body.innerHTML = `
<div data-vanillagrid data-id="g1">
    <div data-col id="c1" data-type="text" header="COL1"></div>
    <div data-col id="c2" data-type="number"></div>
    <div data-col id="c3" data-type="text"></div>
</div>`;

const vg = getVanillagrid();
vg.init();
vg.mountGrid();
const grid = vg.getGrid('g1');
eq('getGrid', !!grid, true);

/* 기본 load */
grid.load([
    { c1: 'a1', c2: 10, c3: 'x' },
    { c1: 'b1', c2: 20, c3: 'y' },
    { c1: 'd1', c2: 30, c3: 'z' },
]);
eq('getRowCount', grid.getRowCount(), 3);
eq('getCellValue', grid.getCellValue(1, 'c1'), 'a1');

/* G9: 헤더 행수 팬텀 행 없음 */
eq('G9 getHeaderRowCount', grid.getHeaderRowCount(), 1);

/* 상태 추적 */
grid.setCellValue(1, 'c1', 'a1-mod');
eq('setCellValue', grid.getCellValue(1, 'c1'), 'a1-mod');

/* G1: setRowValues가 지정한 행을 수정 + 미지정 컬럼 보존 */
grid.setRowValues(3, { c1: 'd1-new' });
eq('G1 지정행 수정', grid.getCellValue(3, 'c1'), 'd1-new');
eq('G1 미지정 컬럼 보존', grid.getCellValue(3, 'c2'), 30);
eq('G1 타행 불변', grid.getCellValue(2, 'c1'), 'b1');

/* G2: undo/redo 의미 정상화 */
grid.setCellValue(2, 'c1', 'b1-edit', true);
eq('G2 편집 반영', grid.getCellValue(2, 'c1'), 'b1-edit');
eq('G2 undo 결과', (grid.undo(), grid.getCellValue(2, 'c1')), 'b1');
eq('G2 redo 결과', (grid.redo(), grid.getCellValue(2, 'c1')), 'b1-edit');

/* G3: addCol에 false 지정이 반영 + 값 0 설정 가능 */
grid.addCol('c3', { colId: 'c4', dataType: 'text', sortable: false, filterable: false, locked: true });
eq('G3 sortable:false', grid.getColInfo('c4').sortable, false);
eq('G3 locked:true', grid.getColInfo('c4').locked, true);
grid.setCellData(1, 'c2', { value: 0 });
eq('G3 값 0 설정', grid.getCellValue(1, 'c2'), 0);

/* G7: 숫자 포맷 반올림 캐리 */
grid.setColFormat('c2', '#,##0.##');
grid.setCellValue(1, 'c2', 1234.996);
eq('G7 캐리 전파', grid.getCellText(1, 'c2'), '1,235');
grid.setCellValue(1, 'c2', 1234.5678);
eq('G7 일반 반올림', grid.getCellText(1, 'c2'), '1,234.57');

/* G8: maxByte 절단 시 서로게이트 보존 (기본 4바이트) */
grid.setCellMaxByte(2, 'c1', 5);
grid.setCellValue(2, 'c1', 'a😀b');
eq('G8 이모지 포함 절단', grid.getCellValue(2, 'c1'), 'a😀');
grid.setCellMaxByte(2, 'c1', 4);
grid.setCellValue(2, 'c1', 'a😀b');
eq('G8 쌍 중간 절단 방지', grid.getCellValue(2, 'c1'), 'a');

/* getDefault* 별칭 */
eq('getDefaultGridInfo 별칭', grid.getDefaultGridInfo(), grid.getDefualtGridInfo());
eq('getDefaultColInfo 별칭', grid.getDefaultColInfo(), grid.getDefualtColInfo());

/* 행 추가/삭제 + 상태 */
grid.addRow({ c1: 'new', c2: 1, c3: 'n', c4: 't' });
eq('addRow 상태 C', grid.getRowStatus(4), 'C');
const removed = grid.removeRow(4);
eq('removeRow 반환 상태 D', removed['v-g-status'], 'D');
eq('removeRow 후 행수', grid.getRowCount(), 3);

/* G5: 미마운트 박스가 있어도 unmount/destroy 크래시 없음 */
const extraBox = document.createElement('div');
extraBox.setAttribute('data-vanillagrid', '');
extraBox.setAttribute('data-id', 'g2');
document.body.appendChild(extraBox);
noThrow('G5 unmountGrid(미마운트 박스 포함)', () => vg.unmountGrid());
eq('unmount 후 getGrid', vg.getGrid('g1'), null);
noThrow('G5 destroy', () => vg.destroy());

/* destroy 후 재초기화 가능 */
document.body.innerHTML = `
<div data-vanillagrid data-id="g3">
    <div data-col id="k1" data-type="text"></div>
</div>`;
const vg2 = getVanillagrid();
vg2.init();
noThrow('destroy 후 재mount', () => vg2.mountGrid());
eq('재mount getGrid', !!vg2.getGrid('g3'), true);
vg2.destroy();

console.log(`\nsmoke: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
