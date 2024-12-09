var svg = d3.select('svg');

var debtScale;
var earningScale;
var populationScale;

// for bar chart
var raceScale;
var percentScale;
const races = ["White", "Black", "Asian", "Hispanic", "American Indian", "Pacific Islander", "Biracial"];

// svg for the bar chart
var bar_chart = d3.select("#race-chart").select("#chart-svg");
var chartHeight = 400;

var xAxis;
var yAxis;

var regions;

var college_data;
var curr_name = "Selected College";

function onRegionChange() {
    var select = d3.select('#selectRegion').node();
    var region = select.options[select.selectedIndex].value;
    filterRegions(region);
}


d3.csv('colleges.csv').then(function(data) {
    college_data = data;
    regions = data;

    data.forEach(d => {
        d.debt = parseFloat(d["Median Debt"]);
        d.earnings = parseFloat(d["Mean Earnings 8 years After Entry"]);
        d.name = d.Name;
        d.type = d.Control;
        d.region = d.Region;
        d.population = d["Undergrad Population"];
        d.admission_rate = d['Admission Rate'];
        d.tuition = parseFloat(d['Average Cost']);
    })

    console.log(d3.extent(data, d => d.debt));
    console.log(d3.extent(data, d => d.earnings));

    /*var debtScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.debt))
        .range([0,750]);

    var earningScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.earnings))
        .range([600, 0]);*/

    debtScale = d3.scaleLinear()
        .domain([0, 28000])
        .range([100, 850]);

    earningScale = d3.scaleLinear()
        .domain([0, 130000])
        .range([650, 50]);

    populationScale = d3.scaleLinear()
        .domain([0, 51000])
        .range([5, 15]);


    // for the bar chart
    raceScale = d3.scaleBand()
        .domain(races)
        .range([0, 500]);

    percentScale = d3.scaleLinear()
        .domain([0, 100])
        .range([chartHeight, 7]);
    
    // good
    xAxis = d3.axisBottom(debtScale);
    yAxis = d3.axisLeft(earningScale);

    // for the bar chart
    xAxisBar = d3.axisBottom(raceScale);
    yAxisBar = d3.axisLeft(percentScale);

    svg.append("g")
        .attr("class", "x axis")
        .attr('transform', 'translate(0, 650)')
        .call(xAxis)

    svg.append("text")
        .attr("class", "x label")
        .attr("x", 450)
        .attr("y", 690)
        .style("font-size", "20px")
        .text("Median Debt ($)");

    svg.append("g")
        .attr("class", "y axis")
        .attr('transform', 'translate(100, 0)')
        .call(yAxis)

    svg.append("text")
        .attr("class", "y label")
        .attr("x", 140)
        .attr("y", 225)
        .attr("transform", "translate(-190, 460)rotate(-90)")
        .style("font-size", "20px")
        .text("Mean Earnings 8 Years after Entry ($)");

    svg.append("text")
        .attr("transform", 'translate(200, 40)')
        .text("US College's Median Debt vs Mean Earnings 8 Years after Entry by Region")
        .style("font-size", "16px");   

    bar_chart.append("g")
        .attr("transform", "translate(50, 450)")
        .call(xAxisBar)

    bar_chart.append("g")
        .attr("transform", "translate(50, 50)")
        .call(yAxisBar)

    bar_chart.append("text")
        .attr("transform", 'translate(260, 490)')
        .text("Race")

    bar_chart.append("text")
        .attr("transform", "translate(15, 300)rotate(-90)")
        .style("font-size", "14px")
        .text("Percentage of Race (%)");


    filterRegions('all-regions');

});

var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('border', '1px solid black')
    .style('padding', '5px')
    .style('border-radius', '5px')
    .style('opacity', 0);

function filterRegions(region) {
    var filteredRegions;

    if (region === 'all-regions') {
        filteredRegions = regions;
    }
    else {
        filteredRegions = regions.filter(d => d.region === region);
    }

    filteredRegions = filteredRegions.filter(d =>
        !isNaN(d.debt) &&
        !isNaN(d.earnings) &&
        d.admission_rate !== 0
    );

    const circles = svg.selectAll("circle")
        .data(filteredRegions, function(d) {
            return d.region
        });

    circles.enter()
        .append("circle")
        .attr("cx", d => debtScale(d.debt))
        .attr("cy", d => earningScale(d.earnings))
        .attr("r", d => populationScale(d.population))
        .style("fill", d => d.type === "Public" ? "green" : "purple")
        .style("opacity", 0.6)
        .on("mouseover", function(d) {
            tooltip.html(`<strong>${d.name}</strong><br>
                           Median Debt: $${d.debt.toLocaleString()}<br>
                           Mean Earnings: $${d.earnings.toLocaleString()}<br>
                           Admission Rate: ${(d.admission_rate * 100).toFixed(2)}%<br>
                           Average Cost: $${d.tuition.toLocaleString()}<br`)
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY + 5) + 'px')
                    .style("opacity", 1)
                    .style("font-size", "14px")
                    //console.log("Mouse Position:", d3.event.pageX, d3.event.pageY); //debugging ignore
            curr_name = d.name
            updateBarChart(d.name);
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0); //tooltip not visible
        })


    circles.attr("cx", d => debtScale(d.debt))
        .attr("cy", d => earningScale(d.earnings))
        .attr("r", d => populationScale(d.population));

    circles.exit().remove()

}

function updateBarChart(college_name) {
    console.log("curr name: " + curr_name);
    // find the college in the data
    const college = college_data.find(d => d.name === college_name);
    console.log(college);
    // console.log(races[0] + ": " + college['% ' + races[0]]);
    // console.log(races[1] + ": " + college['% ' + races[1]]);
    // console.log(races[2] + ": " + college['% ' + races[2]]);
    // console.log(races[3] + ": " + college['% ' + races[3]]);
    // console.log(races[4] + ": " + college['% ' + races[4]]);
    // console.log(races[5] + ": " + college['% ' + races[5]]);
    // console.log(races[6] + ": " + college['% ' + races[6]]);

    
    const data_races = ["% White", "% Black", "% Asian", "% Hispanic", "% American Indian", "% Pacific Islander", "% Biracial"];
    
    // filter race breakdown
    const raceBreakdown = Object.keys(college)
        .filter(race => data_races.includes(race))
        .reduce((filtered, race) => {
            filtered[race] = college[race];
            return filtered;
        }, {});

    console.log(raceBreakdown);
    
    bar_chart.selectAll("rect").remove();

    bar_chart.select(".chart-title").remove();
        
    const bars = bar_chart.selectAll("rect")
        .data(Object.keys(raceBreakdown));

    bars.enter()
        .append("rect")
        .attr("x", (a, b) => b * 71 + 71)
        .attr("y", d => percentScale(raceBreakdown[d]*100)+50)
        .attr("width", 30)
        .attr("height", d => chartHeight - percentScale(raceBreakdown[d]*100))
        .style("fill", "darkblue")
        .style("opacity", 0.7);

    bars.exit().remove();

    bar_chart.append("text")
        .attr("class", "chart-title")
        .attr("transform", 'translate(50, 30)')
        .text(`Percentage Breakdown of Race at ${curr_name}`)
        .style("font-size", "14px")

    bar_chart.select(".chart-title").exit().remove();
}