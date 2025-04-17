# Vanillagrid2

**A Simple and Powerful Grid Library, Upgraded for Modern Applications**

[Homepage](https://vanilla-grid.github.io)

> ⚠️ Currently, the homepage only covers the original Vanillagrid (v1) version. 
> There is no dedicated homepage for Vanillagrid2 yet. 
> Please refer to this TypeScript documentation for Vanillagrid2 usage and features.
---

## ✨ Overview

`Vanillagrid2` is the upgraded version of the original `Vanillagrid`, rebuilt entirely using **TypeScript**.  
It provides a lightweight yet powerful grid solution without relying on any external frameworks or libraries.

Compared to the previous version, `Vanillagrid2` introduces key improvements:
- **TypeScript** fully typed architecture.
- **Component-based mounting** for flexible use in frameworks like Vue, React, etc.
- **SSR (Server Side Rendering) compatibility** — grids are mounted dynamically after DOM is ready.
- Improved **customization**, **lifecycle management**, and **global configuration** handling.
- Designed for modern development while maintaining the simple and fast core principles of Vanillagrid.

---

## 📌 Why Vanillagrid2?

- 📜 Built with **TypeScript** for better type safety, scalability, and tooling support.
- 🖥️ **Framework-agnostic**: Easily integrates into any Vanilla JS, Vue, React, or other frontend environments.
- ⚡ **Lightweight and fast**: No dependencies. No heavy libraries involved.
- 🧹 **Component-friendly**: Grids are mounted explicitly into components, not tightly coupled to the global DOM.
- 🌍 **SSR-compatible**: Proper `init()` and `mountGrid()` management makes it usable even on server-rendered pages.
- 🛠️ **Highly customizable**: Modify default behaviors, styles, and extendable data types flexibly.
- 🎨 **Minimal impact on existing CSS/JS**: Designed to avoid conflicts.
- 🔥 **Rich feature set**: Sorting, filtering, editing, undo/redo, selection policies, footer formulas, custom data types, and more.

---

## ⚙️ Installation

### Using npm

```bash
npm install vanillagrid2
```

---

## 🚀 Getting Started

### 1. Import and Initialize Vanillagrid2

```typescript
import { getVanillagrid, getVanillagridConfig } from 'vanillagrid2';

const vgConfig = getVanillagridConfig();
vgConfig.attributes.defaultGridInfo.dateFormat = 'dd-mm-yyyy';

const vg = getVanillagrid(vgConfig);
vg.init();
```

---

### 2. Mount Grids

In your HTML:

```html
<div data-vanillagrid data-id="myGridId" style="height: 300px;">
  <div data-col id="col1" header="Name" data-type="text" width="200"></div>
  <div data-col id="col2" header="Age" data-type="number" width="100"></div>
</div>
```

Mount in code:

```typescript
vg.mountGrid();
// Or mount into a specific HTMLElement
// vg.mountGrid(document.getElementById('yourContainer'));
```

---

### 3. Access and Control Grids

```typescript
const myGrid = vg.getGrid('myGridId');

if (myGrid) {
  myGrid.load([
    { col1: 'Alice', col2: 25 },
    { col1: 'Bob', col2: 30 },
  ]);

  myGrid.setHeaderText('col1', 'Customer Name');
  myGrid.setCellValue(1, 'col2', 28);
}
```

---

### 4. Unmount or Destroy Grids

```typescript
vg.unmountGrid();
vg.destroy();
```

---

## 📋 Key Features

- Header / Footer Management
- Sorting & Filtering Support
- Full JSON-based Data Loading and Export
- Cell Merging, Row/Col Locking, Row Numbering
- Selection Policies (Single, Range, None)
- Undo / Redo with configurable history depth
- Customizable Footer Formulas
- Custom Data Type Extensions (img, radio, tree, etc.)
- Precise Byte-Length Validation for Multi-Byte Characters
- Dynamic Event Handling Hooks (before/after edit, click, paste, etc.)
- Automatic Component-based Grid Mounting
- Compatible with SSR frameworks

---

## 🔄 Custom DataType Example

Vanillagrid2 allows developers to define custom behaviors for cell data types.

```typescript
vgConfig.dataType = {
  radio: {
    cellStyle: {
      justifyContent: 'center',
      textAlign: 'center',
    },
    onSelectedAndKeyDown(event, gridId, data) {
      if (event.key === 'Enter' || event.key === ' ') {
        vg.getGrid(gridId)!.setColSameValue(data.colId, 'N', true);
        vg.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, 'Y', true);
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
      return false;
    },
    onClick(event, gridId, data) {
      vg.getGrid(gridId)!.setColSameValue(data.colId, 'N', true);
      vg.getGrid(gridId)!.setCellValue(data.rowIndex, data.colId, 'Y', true);
    },
    getValue(gridId, value) {
      return value;
    },
    getText(gridId, value) {
      return value === 'Y' ? 'true' : 'false';
    },
    getChildNode(gridId, data) {
      const childNode = document.createElement('input');
      childNode.type = 'radio';
      childNode.name = data.name || data.colId;
      childNode.value = '' + data.rowIndex;
      childNode._gridId = gridId;
      childNode.rowIndex = data.rowIndex;
      childNode.colId = data.colId;
      childNode.checked = data.value === 'Y';
      return childNode;
    },
    getFilterValue(gridId, value) {
      return value === 'Y' ? '●' : '○';
    }
  }
};
```

Use it in your grid column:

```html
<div data-col id="radioCol" data-type="radio"></div>
```

---

## 🔄 Advanced Usage

### Mounting Specific Grids in Components

```typescript
const container = document.getElementById('myComponentSection');
vg.mountGrid(container);
```

### Unmounting Grids when Components are Destroyed

```typescript
const container = document.getElementById('myComponentSection');
vg.unmountGrid(container);
```

### Defining Custom Footer Formulas

```typescript
vgConfig.footerFormula = {
  total: (colValues) => colValues.reduce((sum, value) => sum + (Number(value) || 0), 0).toString()
};
```

### Global Byte Size Configuration (for Multilingual Inputs)

```typescript
vgConfig.checkByte = {
  lessoreq0x7ffByte: 2,
  lessoreq0xffffByte: 3,
  greater0xffffByte: 4,
};
```

### Overriding Default Column Settings

```typescript
vgConfig.attributes.defaultColInfo = {
  dataType: 'text',
  align: 'center',
  resizable: true,
  sortable: true,
  required: false,
  originWidth: '100px',
};
```

---

## 🔄 Event Hook Examples

### Capture Cell Editing Start

```typescript
const grid = vg.getGrid('myGridId');

grid.setOnBeforeEditEnter((row, colId, editorNode) => {
  console.log(`Start editing cell at row ${row}, column ${colId}`);
  return true; // allow edit
});
```

### Validate Value Before Change

```typescript
grid.setOnBeforeChange((row, colId, oldValue, newValue) => {
  if (colId === 'age' && (newValue < 0 || newValue > 150)) {
    alert('Invalid age!');
    return false; // block invalid value
  }
  return true;
});
```

### Customize Behavior After Cell Change

```typescript
grid.setOnAfterChange((row, colId, oldValue, newValue) => {
  console.log(`Cell at row ${row}, column ${colId} changed from ${oldValue} to ${newValue}`);
});
```

### Prevent Cell Selection in Certain Columns

```typescript
grid.setOnBeforeClickCell((row, colId) => {
  if (colId === 'lockedCol') {
    return false; // prevent selection
  }
  return true;
});
```

---

## 🏗️ Architecture Upgrades from Vanillagrid

| Feature                         | Vanillagrid (v1) | Vanillagrid2 (v2)  |
|:--------------------------------|:----------------|:------------------|
| Language                        | ES5             | TypeScript         |
| Grid Mounting                   | Auto mount in document | Explicit component-based mounting |
| SSR Support                     | ❌              | ✅ (init() and mountGrid()) |
| Configuration Handling          | Hard-coded defaults | Configurable through `getVanillagridConfig()` |
| Event Management                | Basic handlers  | Fully extensible event hooks |
| Singleton Management            | Global auto-creation | Explicit singleton creation |
| DataType Extension              | Basic           | Strongly typed and extendable |
| Internal State Encapsulation    | Minimal         | Full internal state management (`_status`) |

---

## 📜 License

MIT License

---

## ✉️ Contact

- **Author**: Hani Son
- **Email**: hison0319@gmail.com

---

## ✅ Let's build better grids with **Vanillagrid2**!
