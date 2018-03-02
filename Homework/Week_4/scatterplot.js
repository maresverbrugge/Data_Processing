window.onload = function() {
	// costom the dimensions of the canvas
	var margin = {top: 20, right: 30, bottom: 30, left: 20},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	
	var svg = d3.select(".scatterplot")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

	// set the ranges of the canvas
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// set colors
	var color = d3.scale.category10();

	// define and add the axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// load data separeted by ';'
	d3.dsv(';')("scatterplotdata_2.csv", function(error, data) {
		if (error) throw error;

		data.forEach(function(d) {
			d.AverageLifeExpectancy = +d.AverageLifeExpectancy;
			d.AverageWellbeing = +d.AverageWellbeing;
		});

		// scale the range of the data
		// show possible values of wellbeing eventhough data doesn't contain those values
		// (no country scores wellbeing > 8.5)
		min_max_wellbeing = [0, 10]
		x.domain(d3.extent(data, function(d) { return d.AverageLifeExpectancy; })).nice();
		y.domain(min_max_wellbeing).nice();

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + margin.left + "," + height + ")")
		.call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Average Life Expectancy (years)");

  	svg.append("g")
  		.attr("class", "y axis")
  		.attr("transform", "translate(" + margin.left + ",0)")
  		.call(yAxis)
    .append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", 0)
		.attr("y", 10)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Average Wellbeing (0-10)")

	// add the scatterplot
	svg.selectAll(".dot")
		.data(data)
	.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.AverageLifeExpectancy); })
		.attr("cy", function(d) { return y(d.AverageWellbeing); })
		.style("fill", function(d) { return color(d.Region); });

	// add legend	
	var legend = svg.selectAll(".legend")
		.data(color.domain())
	.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	var legendRectSize = 18;

	legend.append("rect")
		.attr("x", margin.left + 240)
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", color);

	legend.append("text")
		.attr("x", margin.left + 230)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
});
}