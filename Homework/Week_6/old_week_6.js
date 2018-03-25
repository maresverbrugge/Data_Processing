/* 
Mares Verbrugge
10519505

NOTE:
I split my data into two files to show you that I know how to use "queue", 
following the rules for this assignment, eventhough it is not necessary for this data set
*/

window.onload = function() {
	
	// load data using queue, see note in header
	queue()
		.defer(d3.json, 'JSON_QOL.json')
		.defer(d3.json, 'JSON_indices.json')
		.defer(d3.json, 'JSON_QOL2013.json')
		.defer(d3.json, 'JSON_indices2013.json')
		.awaitAll(mainFunction)

	function mainFunction(error, dataArray) {
		if (error) throw error;

		var dataBarchartJSON = dataArray[0];
		var dataGroupedBarchartJSON = dataArray[1];

		// costom the dimensions of the canvas
		var margin = {top: 20, right: 120, bottom: 50, left: 40},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;
	    
		// call function draw barchart and initial grouped barchart
		drawBarchart();
		drawGroupedBarchart();

		// function to draw barchart
		function drawBarchart() {

			// add the SVG element
			var svg = d3.select(".barchart")
				.attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom);
			var g = svg.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// set the ranges of the canvas
			var x = d3.scaleBand().range([0, width]).padding(0.1);;
			var y = d3.scaleLinear().range([height, 0]);

			// make data into array
			var dataBarchart = d3.entries(dataBarchartJSON)

			// make data proper type (number)
	    	dataBarchart.forEach(function(d) {
		        d.value = +d.value;
		    });

			// scale the range of the data
		    x.domain(dataBarchart.map(function(d) { return d.key; }));
		    y.domain([0, d3.max(dataBarchart, function(d) { return d.value; })]);

		    // add x axis
		    g.append("g")
		    	.attr("class", "axis x_axis")
		    	.attr("transform", "translate(0," + height + ")")
		    	.call(d3.axisBottom(x))
		    	.selectAll("text")
		    	.attr("y", 0)
			    .attr("x", 9)
			    .attr("dy", ".35em")
			    .attr("transform", "rotate(90)")
			    .style("text-anchor", "start");

			// add y axis
			g.append("g")
				.attr("class", "axis y_axis")
				.call(d3.axisLeft(y))
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 600)
				.attr("dy", "0.71em")
				.attr("fill", "#000")
				.text("Quality of Life Index");

			// make tooltip to show country name and QoL value when hoverd over bar
			var tool_tip = d3.tip()
		      .attr("class", "d3-tip")
		      .offset([-8, 0]);

			svg.call(tool_tip);

			// add bar chart
			g.selectAll(".bar")
				.data(dataBarchart)
				.enter().append("rect")
				.attr("class", function(d) { return d.key; })
				.attr("x", function(d) { return x(d.key); })
				.attr("width", x.bandwidth())
				.attr("y", function(d) { return y(d.value); })
				.attr("height", function(d) { return height - y(d.value); })
				
				/* tooltip to show values when hovered over
				from: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7 */
				.on("mouseover", function(d) {
					// console.log(d);
					tool_tip.html(function() { return "Country: " + d.key + "<br>" + "QoL score:" + d.value; });
					tool_tip.show()
				})

				.on("mouseout", function () {
					tool_tip.hide()
				})

				// select country when clicked on
				.on("click", function() { 
					var selected = d3.select(this).attr("class"); 
					// console.log(selected)
					
					// var newData = prepareData(selected);
					// console.log(newData);
					
					// update grouped barchart with selected country
					updateGrouped(selected);
				});
		}
		
		// function to draw grouped barchart
		function drawGroupedBarchart() {

			// draw initial grouped barchart with Netherlands as middle group
			var preparedData = prepareData("Netherlands");
			var dataGroupedBarchart = preparedData.groupedData;

			// add the SVG element
			var svg = d3.select(".groupedBarchart")
				.attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			var g = svg.append("g")
			  	.attr('class', 'testing')
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// set the ranges of the canvas
			var x0 = d3.scaleBand()
				.rangeRound([0, width])
				.padding(0.1);
			var x1 = d3.scaleBand();
			var y = d3.scaleLinear()
				.range([height, 0]);

			// make color range for bars
			var color = d3.scaleOrdinal(d3.schemeCategory10);

			var countryNames = preparedData.names;
			var indicesNames = dataGroupedBarchart[0].map(function(d) { return d.key; });
			// console.log(indicesNames)

			// scale the range of the data
		    x0.domain(countryNames);
		    x1.domain(indicesNames).rangeRound([0, x0.bandwidth()]);
		    y.domain([0, d3.max(dataGroupedBarchart, function(country) { return d3.max(country, function(d) { return +d.value; }); })]);
			
			// add x axis
		    g.append("g")
		    	.attr("class", "axis x_axis")
		    	.attr("transform", "translate(0," + height + ")")
		    	.call(d3.axisBottom(x0))

		    // add y axis
			g.append("g")
				.attr("class", "axis y_axis")
				.call(d3.axisLeft(y).ticks(null, "s"))

			// make tooltip to show scores on index when hovered over bar
			var tool_tip = d3.tip()
		      .attr("class", "d3-tip")
		      .offset([-8, 0]);
		      
			svg.call(tool_tip);

			// add grouped bars to chart
			var groups = g.selectAll(".slice")
				.data(dataGroupedBarchart)
				.enter().append("g")
				.attr("class", "g")
				.attr("transform",function(d, i) { return "translate(" + x0(countryNames[i]) + ",0)"; })
				.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				.attr("x", function(d) { return x1(d.key); })
				.attr("y", function(d) { return y(d.value); })
				.attr("width", x1.bandwidth())
				.attr("height", function(d) { return height - y(d.value); })
				.attr("fill", function(d) { return color(d.key); })
				/* tooltip to show values when hovered over
				from: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7 */
				.on("mouseover", function(d) {
					tool_tip.html(function() { return d.key + " : " + d.value; });
					tool_tip.show()
				})

				.on("mouseout", function () {
					tool_tip.hide()
				});

			// add legend to chart
			var legend = g.append("g")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
				.attr("text-anchor", "end")
				.selectAll("g")
				.data(indicesNames.slice().reverse())
				.enter().append("g")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			legend.append("rect")
				.attr("x", width - 19)
				.attr("width", 19)
				.attr("height", 19)
				.attr("fill", color);

			legend.append("text")
				.attr("x", width - 24)
				.attr("y", 9.5)
				.attr("dy", "0.32em")
				.text(function(d) { return d; });

		}

		function updateGrouped(newData) {
			// remove previous barchart
			d3.select(".testing").remove();

			var preparedData = prepareData(newData);
			var dataGroupedBarchart = preparedData.groupedData;
			// console.log(dataGroupedBarchart)

			// add new SVG element
			var svg = d3.select(".groupedBarchart")
				.attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			var g = svg.append("g")
			  	.attr("class", "testing")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// set the ranges of the canvas
			x0 = d3.scaleBand()
				.rangeRound([0, width])
				.padding(0.1);
			var x1 = d3.scaleBand();
			var y = d3.scaleLinear()
				.range([height, 0]);

			// make color range for bars
			var color = d3.scaleOrdinal(d3.schemeCategory10);

			var countryNames = preparedData.names;
			var indicesNames = dataGroupedBarchart[0].map(function(d) { return d.key; });
			// console.log(indicesNames)

			// scale the range of the data
		    x0.domain(countryNames);
		    x1.domain(indicesNames).rangeRound([0, x0.bandwidth()]);
		    y.domain([0, d3.max(dataGroupedBarchart, function(country) { return d3.max(country, function(d) { return +d.value; }); })]);
			
			// add x axis
		    g.append("g")
		    	.attr("class", "axis x_axis")
		    	.attr("transform", "translate(0," + height + ")")
		    	.call(d3.axisBottom(x0))

		    // add y axis
			g.append("g")
				.attr("class", "axis y_axis")
				.call(d3.axisLeft(y).ticks(null, "s"))

			// make tooltip to show scores on index when hovered over bar
			var tool_tip = d3.tip()
		      .attr("class", "d3-tip")
		      .offset([-8, 0]);
		      
			svg.call(tool_tip);

			var groups = g.selectAll(".slice")
				.data(dataGroupedBarchart)
				.enter().append("g")
				.attr("class", "g")
				.attr("transform",function(d, i) { return "translate(" + x0(countryNames[i]) + ",0)"; })
				.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				.attr("x", function(d) { return x1(d.key); })
				.attr("y", function(d) { return y(d.value); })
				.attr("width", x1.bandwidth())
				.attr("height", function(d) { return height - y(d.value); })
				.attr("fill", function(d) { return color(d.key); })
				/* tooltip to show values when hovered over
				from: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7 */
				.on("mouseover", function(d) {
					tool_tip.html(function() { return d.key + " : " + d.value; });
					tool_tip.show()
				})

				.on("mouseout", function () {
					tool_tip.hide()
				});

			// add legend to chart
			var legend = g.append("g")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
				.attr("text-anchor", "end")
				.selectAll("g")
				.data(indicesNames.slice().reverse())
				.enter().append("g")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			legend.append("rect")
				.attr("x", width - 19)
				.attr("width", 19)
				.attr("height", 19)
				.attr("fill", color);

			legend.append("text")
				.attr("x", width - 24)
				.attr("y", 9.5)
				.attr("dy", "0.32em")
				.text(function(d) { return d; });

		}

		// function to prepare data for grouped barchart
		function prepareData(selected) {
			
			// show country with highest score, lowest and selected country in between
			var countries = ["Denmark", selected, "Vietnam"];
			var data = [];
			countries.forEach(function(d) {
				data.push(d3.entries(dataGroupedBarchartJSON[d]));
			});
			return {
				names: countries,
				groupedData: data
			}
		}
	}
};


// TO DO:
// - tooltip barchart werkend maken : show country name and QoL index score
// - tooltip grouped barchart maken :show country name and values for indices
// - bootstrap element maken (is titel voldoende/interactief element?) (scope)
// - titels bij elke chart maken
// - assen kloppend maken
// - as labels leesbaar en juiste grootte maken

// - storytelling maken (scope)
// - explain design choices in seperate pdf document (ook pushen!) (scope)
// - css js en html file ordenen, welke code waarin
// - HTML VALIDATOR!

// - tooltip grouped barchart: highlight indices as mouse hovers
// - update functie verbeteren
// - bedenken wat er gebeurt als je op denemarken of vietnam klikt

// - fix bugs
// - optimize design
// - optimize code + console log eruit halen