d3.csv('colleges.csv').then(function(data) {
    data.forEach(d => {
        d.debt = parseFloat(d["Median Debt"]);
        d.earnings = parseFloat(d["Mean Earnings 8 years After Entry"]);
        d.name = d.Name;
        d.type = d.Control;
        d.region = d.Region;
    })

    console.log(d3.extent(data, d => d.debt));
    console.log(d3.extent(data, d => d.earnings));

    /*var debtScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.debt))
        .range([0,750]);

    var earningScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.earnings))
        .range([600, 0]);*/

    var debtScale = d3.scaleLinear()
        .domain([0, 28000])
        .range([100, 850]);

    var earningScale = d3.scaleLinear()
        .domain([0, 130000])
        .range([650, 50]);

    // good
    var xAxis = d3.axisBottom(debtScale);
    var yAxis = d3.axisLeft(earningScale);

    var svg = d3.select('svg');

    svg.append("g")
        .attr("class", "x axis")
        .attr('transform', 'translate(0, 650)')
        .call(xAxis)

    svg.append("text")
        .attr("class", "x label")
        .attr("x", 450)
        .attr("y", 690)
        .style("font-size", "20px")
        .text("Median Debt");

    svg.append("g")
        .attr("class", "y axis")
        .attr('transform', 'translate(100, 0)')
        .call(yAxis)

    svg.append("text")
        .attr("class", "y label")
        .attr("x", 140)
        .attr("y", 225)
        .attr("transform", "rotate(90, 40, 200)")
        .style("font-size", "20px")
        .text("Mean Earnings 8 Years after Entry");

    svg.append("text")
        .attr("transform", 'translate(290, 30)')
        .text("You'll Earn More than What You Went in Debt for")
        .style("font-size", "20px");

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => debtScale(d.debt))
        .attr("cy", d => earningScale(d.earnings))
        .attr("r", 5)
        .style("fill", d => d.type === "Public" ? "green" : "purple")
        .style("opacity", 0.7);

});