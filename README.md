# Visualization of Suicide Statistics in Turkey (2000–2022)

This project visualizes data from **TÜİK’s “Suicides by Method and Gender (2000–2022)”** dataset using a fully client-side, SVG-based bar chart.  
It demonstrates how Excel data can be read and visualized directly in the browser using plain JavaScript and the **XLSX.js** library.

---

## Contents

| File | Description |
|------|--------------|
| `index.html` | Main interface that allows the user to upload an Excel file. |
| `barChart.js` | Processes the dataset and generates an SVG bar chart dynamically. |
| `intiharlar_2000_2022.xlsx` | Raw dataset obtained from TÜİK. |
| `Report.docx` | Technical documentation describing the implementation details. |

---

## How It Works

1. Open `index.html` in a browser.  
2. Click the **“Please select the xlsx file”** button and choose the file `intiharlar_2000_2022.xlsx`.  
3. The browser reads the file using `FileReader` and **XLSX.js**.  
4. The function `plotSvg()` in `barChart.js` creates a dual-series bar chart (male/female).  
5. The chart automatically generates titles, axes, labels, and colors based on the dataset.

---

## Technologies Used

- JavaScript (Vanilla)
- SVG (Scalable Vector Graphics)
- XLSX.js for reading Excel files
- HTML5 and DOM manipulation

---

## Functional Components

| Function | Description |
|-----------|-------------|
| `init()` | Initializes the file input process. |
| `parseXlsx()` | Parses the Excel content into JSON format. |
| `plotSvg()` | Draws the bar chart, including axes and labels. |
| `createSvg()`, `createTitle()`, `createAxes()`, `createBars()` | Responsible for constructing the SVG structure step by step. |

---
