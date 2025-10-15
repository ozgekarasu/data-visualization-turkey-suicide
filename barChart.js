document.addEventListener("DOMContentLoaded", init);

function init() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
            const data = parseXlsx(event.target.result);
            plotSvg(data);
        });

        reader.readAsBinaryString(file);
    });
}


function parseXlsx(fileContent) {
    const workbook = XLSX.read(fileContent, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return data;
}

function plotSvg(data) {
    const dataToPlot = prepareData(data);
    const maxDataValue = Math.max(...dataToPlot.map(item => Math.max(item.value1, item.value2)));

    // Constants for offsets and dimensions
    const svgWidth = 1600;
    const svgHeight = 800;

    const barPadding = 1;
    const margin = 55;
    const xAxisStartY = svgHeight - margin;
    const yAxisStartX = margin;
    const xAxisLabelYOffset = 15;
    const yAxisLabelXOffset = -10;
    const numYAxisTicks = 5;
    const barSpacing = 15;
    const numBars = dataToPlot.length * 2;
    const totalSpacing = (numBars - 1) * barSpacing;
    const barWidth = (svgWidth - 2 * margin - totalSpacing/2) / numBars;

    const svg = createSvg();
    createTitle();
    createAxes();
    createBars();

    function prepareData(data) {

        let formattedData = [];

        for (let i = 12; i < 101; i+=4) {
            let year = parseInt(data[i - 1][0]);
            let males = data[i][2];
            let females = data[i + 1][2];
            formattedData.push({label: year, value1: males, value2: females });
        }

        return formattedData.reverse();
    }

    function createSvg() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", svgWidth);
        svg.setAttribute("height", svgHeight);
        document.body.appendChild(svg);
        return svg;
    }

    function createTitle() {
        const chartTitle = data[1][0];

        const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        titleText.setAttribute("x", svgWidth / 2);
        titleText.setAttribute("y", margin - xAxisLabelYOffset);     
        titleText.setAttribute("text-anchor", "middle"); 
        titleText.textContent = chartTitle;
        svg.appendChild(titleText);
    }

    
    function createAxes() {
        // Create the x-axis
        const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xAxis.setAttribute("x1", yAxisStartX);
        xAxis.setAttribute("y1", xAxisStartY);
        xAxis.setAttribute("x2", svgWidth);
        xAxis.setAttribute("y2", xAxisStartY);
        xAxis.setAttribute("stroke", "black");
        svg.appendChild(xAxis);

        dataToPlot.forEach((value, index) => {
            const xTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const xTickX = yAxisStartX + index * (2 * barWidth + barSpacing) + barWidth + barSpacing / 2;
            xTick.setAttribute("x1", xTickX);
            xTick.setAttribute("y1", xAxisStartY);
            xTick.setAttribute("x2", xTickX);
            xTick.setAttribute("y2", xAxisStartY - 5);
            xTick.setAttribute("stroke", "black");
            svg.appendChild(xTick);
      
            const xTickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            xTickLabel.setAttribute("x", xTickX);
            xTickLabel.setAttribute("y", xAxisStartY + xAxisLabelYOffset);
            xTickLabel.setAttribute("text-anchor", "middle");
            svg.appendChild(xTickLabel);
        });

        const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xLabel.setAttribute("x", svgWidth / 2); 
        xLabel.setAttribute("y", svgHeight); 
        xLabel.setAttribute("text-anchor", "middle");
        xLabel.textContent = "Years"; 
        svg.appendChild(xLabel);

        const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        yAxis.setAttribute("x1", yAxisStartX);
        yAxis.setAttribute("y1", xAxisStartY);
        yAxis.setAttribute("x2", yAxisStartX);
        yAxis.setAttribute("y2", margin);
        yAxis.setAttribute("stroke", "black");
        svg.appendChild(yAxis);
    
        // Calculate tick marks and labels for the y-axis
        const tickSpacing = maxDataValue / numYAxisTicks;
        for (let i = 0; i <= numYAxisTicks; i++) {
          const tickValue = Math.floor(i * tickSpacing);
    
          const yTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
          const yTickY = xAxisStartY - (tickValue / maxDataValue) * (svgHeight - 2 * margin);
          yTick.setAttribute("x1", yAxisStartX - 5);
          yTick.setAttribute("y1", yTickY);
          yTick.setAttribute("x2", yAxisStartX + 5);
          yTick.setAttribute("y2", yTickY);
          yTick.setAttribute("stroke", "black");
          svg.appendChild(yTick);
    
          const yTickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
          yTickLabel.setAttribute("x", yAxisStartX + yAxisLabelXOffset);
          yTickLabel.setAttribute("y", yTickY);
          yTickLabel.setAttribute("text-anchor", "end");
          yTickLabel.setAttribute("alignment-baseline", "middle");
          yTickLabel.textContent = tickValue;
          svg.appendChild(yTickLabel);
        }

        const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yLabel.setAttribute("x", yAxisStartX);
        yLabel.setAttribute("y", margin - 5);
        yLabel.textContent = "Number of Suicides (Total)";
        svg.appendChild(yLabel);
    }

    function createBars() {

        dataToPlot.forEach((item, index) => {
            const x = yAxisStartX + index * (barWidth * 2 + barSpacing);

            // Create the first bar
            const bar1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            const height1 = (item.value1 / maxDataValue) * (svgHeight - 2 * margin);
            bar1.setAttribute("x", x);
            bar1.setAttribute("y", xAxisStartY - height1);
            bar1.setAttribute("width", barWidth - barPadding);
            bar1.setAttribute("height", height1);
            bar1.setAttribute("fill", "blue"); 
            svg.appendChild(bar1);
    
            const valueLabel1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valueLabel1.setAttribute("x", x + (barWidth / 2));
            valueLabel1.setAttribute("y",  xAxisStartY - margin);
            valueLabel1.setAttribute("writing-mode", "tb-rl"); 
            valueLabel1.setAttribute("text-anchor", "middle");
            valueLabel1.setAttribute("fill", "white");
            valueLabel1.textContent = item.value1;
            svg.appendChild(valueLabel1);


            // Create the second bar
            const bar2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            const height2 = (item.value2 / maxDataValue) * (svgHeight - 2 * margin);
            bar2.setAttribute("x", x + barWidth); 
            bar2.setAttribute("y", xAxisStartY - height2);
            bar2.setAttribute("width", barWidth - barPadding);
            bar2.setAttribute("height", height2);
            bar2.setAttribute("fill", "red"); 
            svg.appendChild(bar2);

            const valueLabel2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valueLabel2.setAttribute("x", x + barWidth + (barWidth / 2));
            valueLabel2.setAttribute("y",  xAxisStartY - margin);
            valueLabel2.setAttribute("writing-mode", "tb-rl"); 
            valueLabel2.setAttribute("text-anchor", "middle");
            valueLabel2.setAttribute("fill", "white");
            valueLabel2.textContent = item.value2;
            svg.appendChild(valueLabel2);

    
            // Create labels
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", x + barWidth / 2 + barSpacing);
            label.setAttribute("y", xAxisStartY + xAxisLabelYOffset * 2);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("fill", "black");
            label.textContent = item.label;
            svg.appendChild(label);

            const label1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label1.setAttribute("x", x + barWidth / 2);
            label1.setAttribute("y", xAxisStartY + xAxisLabelYOffset);
            label1.setAttribute("text-anchor", "middle");
            label1.textContent = "M";
            svg.appendChild(label1);

            const label2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label2.setAttribute("x", x + barWidth * 3 / 2);
            label2.setAttribute("y", xAxisStartY + xAxisLabelYOffset);
            label2.setAttribute("text-anchor", "middle");
            label2.textContent = "F";
            svg.appendChild(label2);
        });
    }

}
