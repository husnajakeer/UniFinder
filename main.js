d3.csv('colleges.csv').then(function(data) {
    data.forEach(d => {
        d.debt = +d["Median Debt"];
        d.earnings = +d["Mean Earnings 8 years After Entry"];
    })

    function scaleDebt(debt) {
        return debtScale(debt);
    }

    function scaleEarnings(earnings) {
        return earningScale(earnings);
    }

    var debtScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.debt))
        .range([400, 8000]);

    var earningScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.earnings))
        .range([6000, 0]);

    var xAxis = d3.axisBottom(debtScale);
    var yAxis = d3.axisLeft(earningScale);

    var svg = d3.select('svg');

    svg.append("g")
        .attr("class", "x axis")
        .attr('transform', 'translate(0, 500)')
        .call(xAxis)

    svg.append("g")
        .attr("class", "y axis")
        .attr('transform', 'translate(50, 10)')
        .call(yAxis)

    svg.append("text")
        .attr("transform", 'translate(450, 30)')
        .text("Debt")

});