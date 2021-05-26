// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40, 
    bottom : 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXaxis = "smokes"
var chosenYaxis = "obesity"

d3.csv("assets/data/data.csv").then(function(data){
    data.forEach(function(data){
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.abbr = data.abbr;
        console.log(data.obesity)
    });

    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.smokes)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(data, d => d.obesity)])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d.smokes))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        //unsure if this line does anything, first attempt at putting text inside circles
        .attr("text", d=> d.abbr)
   
    //don't know if there's a better way to do this. Attempting to add text over the circles
    //in a manner similar to adding text on the axes, while setting x and y values similar to circlesGroup
    var textGroup = chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d.smokes))
        .attr("y", d => yLinearScale(d.obesity))
        .style("font-size", "1em")
        .text(d => d.abbr)

    console.log(circlesGroup)

    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80, -60])
        .html(function(d) {
            return(`State: ${d.abbr} <br>Smoking: ${d.smokes} <br>Obesity: ${d.obesity}`)
        });

    chartGroup.call(toolTip);

    //event listener for tooltip
    circlesGroup.on("click", function(data){
        toolTip.show(data, this);
    })

    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Obesity (%)")

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Smokers (%)")
})
