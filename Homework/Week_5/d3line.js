/* 
Mares Verbrugge
10519505
*/

window.onload = function() {

	// costom the dimensions of the canvas
	var margin = {top: 20, right: 120, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	
	var g = d3.select(".linegraph")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

	var color = d3.schemeCategory10;

	// set the ranges of the canvas
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
	var z = d3.scaleOrdinal(color);

	// make line function
	var line = d3.line()
		.x(function(d) { return x(d.date); })
    	.y(function(d) { return y(d.value); });
	
	var parseTime = d3.timeParse("%Y%m%d");

	// load data
	d3.json("JSON_data.json", function(error, data) {

		// throw error if necessary
		if (error) throw error;
	
		var color_domain = [];
		var min_temp = 10000;
		var max_temp = -10000;
		data["1995"].forEach(function(d) {

			// make list color_domain for three different lines with colors
			color_domain.push(d.Name);
			d["value"].forEach(function(i) {

				// make data usable for chart
				i["value"] = +i["value"]

				// find minimum and maximum temperatures (for y-axis)
				if (i["value"] < min_temp) {
					min_temp = i["value"]
				}
				if (i["value"] > max_temp) {
					max_temp = i["value"]
				}

				// make data usable for chart
				i["date"] = parseTime(i.date)
			});


		});

		// set domains
		x.domain([data["1995"][0]["value"][0]["date"], data["1995"][0]["value"][364]["date"]]);
		y.domain([min_temp, max_temp]);
		z.domain(color_domain)

		// add x axis
		g.append("g")
			.attr("class", "axis x_axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// add y axis
		g.append("g")
			.attr("class", "axis y_axis")
			.call(d3.axisLeft(y))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("fill", "#000")
			.text("Temperature (0.1) in ºC");

		// add three g's voor each line
		var temp_lines  = g.selectAll(".lines")
			.data(color_domain)
			.enter().append("g")
			.attr("class", "lines");

		// draw lines
		temp_lines.append("path")
			.attr("class", "line")
			.attr("d", function(d, i) { return line(data["1995"][i]["value"]); })
			.style("stroke", function(d) { return z(d); })

		// add text to lines to explain what you are looking at (sort of legend)
		temp_lines.append("text")
			.datum(function(d, i) { console.log(i); return {id: d, value: data["1995"][i]["value"][364]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
			.attr("x", 3)
			.attr("dy", "0.35em")
			.style("fill", function(d) { return z(d.id); })
			.text(function(d) { return d.id; });

		// add title to graph
		g.append("text")
			.attr("x", (width / 2))             
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")  
			.style("font-size", "16px") 
			.style("font-weight", "bold") 
			.text("Temperatures in 1995 measured by KNMI in De Bilt, The Netherlands");		
		
		// TO DO:
		// 1. create tooltip/interactivity
		// 2. make update/data of year 2017
	});
};