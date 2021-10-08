
// CHART INIT ------------------------------

// create svg with margin convention

// create scales without domains

// create axes and axis title containers

// (Later) Define update parameters: measure type, sorting direction

async function getData() {
    await d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
        console.log('coffee data ', coffeeData);
        update(data, type);
        return data;
    });
}
let buttonClick = false;
let type = d3.select("#group-by").node().value;
console.log("type is ", type);

let sort = d3.select("#sort-button").node().value;

const coffeeData = getData();

const margin = {top:20, left:50, right:20, bottom:20};

const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select('.chart')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//let storeRange = d3.extent(coffeeData, d=>d.stores);

const xScale = d3.scaleBand()
    //.domain(coffeeData.map(d=>d.company))
    .rangeRound([0,width])
    .paddingInner(0.1);

const yScale = d3.scaleLinear()
    //.domain([0,storeRange[1]])
    .range([height,0]);

const xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(5, "s");
  
const yAxis = d3.axisLeft()
      .scale(yScale);

svg.append("g")
      .attr("class", "axis x-axis");

svg.append("g")
      .attr("class", "axis y-axis");


function update(data, type){
    //console.log('button value ', d3.select("#sort-button").node().value);
    if (d3.select("#sort-button").node().value == "ascending"){
        data.sort((a, b) => a[type] - b[type]);
        d3.select("#sort-button").node().value = "descending";
           
    }
    else {
        data.sort((a,b) => b[type]-a[type]);
        d3.select("#sort-button").node().value = "ascending";
    }
    //console.log('button value now ', d3.select("#sort-button").node().value);
    // Update scale domains
	xScale.domain(data.map(d=>d.company));

	yScale.domain(d3.extent(data, d=>d[type]));

	const bars = svg.selectAll('.bar')
        .data(data, function(d) { return d.company; });
	
	// Implement the enter-update-exist sequence
    bars
        .enter()
        .append("rect")
        .merge(bars)
        .transition()
        .delay(function(d, i) { return i * 100; })
        .duration(1000)
        .attr("class", "bar")
        .attr("x", function(d) {
        return xScale(d.company);
        })
        .attr("y", function(d) {
        return yScale(d[type]);
        })
        .attr("height", function(d) {
        return height - yScale(d[type]);
        })
        .attr("width", xScale.bandwidth())
        .style("fill", "steelblue");
	// Update axes and axis title
    
    const xAxis = d3.axisBottom()
      .scale(xScale);
  
    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.select(".x-axis")
        .transition()
        .duration(1500)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.select(".y-axis")
        .transition()
        .duration(1500)
        .attr("transform", `translate(0,0)`)
        .call(yAxis);

    svg.select("text.axis-title").remove().transition()
    .delay(function(d, i) { return i * 100; })
    .duration(1000);

    svg
      .append("text")
      .transition()
    .duration(1000)
      .attr("class", "axis-title")
      .attr('x', -45)
      .attr('y', -5)
      .text(function(d) {
        if (type == 'stores')
            return "Stores"
        else
            return "Billions USD";
        });
    

}

function handler(event) {
    //console.log('handler');
    d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
        type = d3.select("#group-by").node().value;
        console.log('update - type is ', type);
        update(data, type);
    });
}

// TODO: Define an event listener for the dropdown menu
//       Call filterData with the selected category
let elem = document.querySelector('#group-by');
console.log('elem is ', elem);
elem.addEventListener('change', handler);
console.log('complete');

