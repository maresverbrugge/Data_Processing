/* 
Mares Verbrugge
10519505 
Linked Views
Data Processing, March 2018

NOTE:
I split my data into two files to show you that I know how to use "queue", 
following the rules for this assignment, eventhough it is not necessary for this data set
*/

window.onload = function() {
	
	// load data using queue, see note in header
	queue()
		.defer(d3.json, 'Data/JSON_QOL.json')
		.defer(d3.json, 'Data/JSON_indices.json')
		.defer(d3.json, 'Data/JSON_QOL2013.json')
		.defer(d3.json, 'Data/JSON_indices2013.json')
		.awaitAll(mainFunction)

	function mainFunction(error, dataArray) {
		if (error) throw error;

		// set up barchart and grouped barchart:

		var dataBarchartJSON2018 = dataArray[0];
		var dataGroupedBarchartJSON2018 = dataArray[1];
		var dataBarchartJSON2013 = dataArray[2];
		var dataGroupedBarchartJSON2013 = dataArray[3];

		// costom the dimensions of the canvas
		var margin = {top: 20, right: 120, bottom: 50, left: 40},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;
			
	    // add the barchart SVG element
		var barchart = d3.select(".barchart")
			.attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom);
		var gBarchart = barchart.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// add the grouped barchart SVG element
		var groupedBarchart = d3.select(".groupedBarchart")
			.attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		var gGrouped = groupedBarchart.append("g")
		  	.attr('class', 'testing')
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// set the barchart ranges of the canvas
		var xBarchart = d3.scaleBand().range([0, width]).padding(0.1);
		var yBarchart = d3.scaleLinear().range([height, 0]);

		// set the grouped barchart ranges of the canvas
		var x0GroupedBarchart = d3.scaleBand().rangeRound([0, width]).padding(0.1);
		var x1GroupedBarchart = d3.scaleBand();
		var yGroupedBarchart = d3.scaleLinear().range([height, 0]);

		// add x axis to barchart
	    gBarchart.append("g")
	    	.attr("class", "axis x_axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(d3.axisBottom(xBarchart))
	    	.selectAll("text")
	    	.attr("y", 0)
		    .attr("x", 9)
		    .attr("dy", ".35em")
		    .attr("transform", "rotate(90)")
		    .style("text-anchor", "start");

		// add x axis to grouped barchart
	    gGrouped.append("g")
	    	.attr("class", "axis x_axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(d3.axisBottom(x0GroupedBarchart))

		// add y axis to barchart 
		gBarchart.append("g")
			.attr("class", "axis y_axis")
			.call(d3.axisLeft(yBarchart))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 600)
			.attr("dy", "0.71em")
			.attr("fill", "#000")
			.text("Quality of Life Index");

		// add y axis to grouped barchart
		gGrouped.append("g")
			.attr("class", "axis y_axis")
			.call(d3.axisLeft(yGroupedBarchart).ticks(null, "s"))

		// add title to barchart
		gBarchart.append("text")
	        .attr("x", (width / 2))             
	        .attr("y", 0 - (margin.top / 4))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Quality of Life Index for top 60 countries");

	    // add title to grouped barchart
		gGrouped.append("text")
	        .attr("x", (width / 2))             
	        .attr("y", 0 - (margin.top / 4))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px")   
	        .text("Scores on three indices for lowest scoring, selected and highest scoring country");

		// make color range for bars in grouped barchart
		var color = d3.scaleOrdinal(d3.schemeCategory20);
	
		/* make tooltip for grouped barchart
		showing country name and QoL value when hoverd over bar */
		var toolTipBarchart = d3.tip()
	      .attr("class", "d3-tip")
	      .offset([-15, 0]);
		barchart.call(toolTipBarchart);

		/* make tooltip for grouped barchart 
		showing score on index when hovered over bar */
		var toolTipGrouped = d3.tip()
	      .attr("class", "d3-tip")
	      .offset([-8, 0]);
		groupedBarchart.call(toolTipGrouped);

		// function for draw barcharts toggling between data (based on years)
		d3.select(".radio").selectAll("input")
		.on("change", function() { change(this.value); })
		function change(value){
			var year;
			
			if(value === "2018"){
				// make data into array
				var dataBarchart = d3.entries(dataBarchartJSON2018)
				// draw initial grouped barchart with Netherlands as middle group
				var preparedData = prepareData("Netherlands", dataGroupedBarchartJSON2018, "Denmark", "Vietnam");
				var dataGroupedBarchart = preparedData.groupedData;
				var dataGroupedJSON = dataGroupedBarchartJSON2018;
				year = "2018";
								
			}
			else{
				var dataBarchart = d3.entries(dataBarchartJSON2013)
				// draw initial grouped barchart with Netherlands as middle group
				var preparedData = prepareData("Netherlands", dataGroupedBarchartJSON2013, "Switzerland", "Russia");
				var dataGroupedBarchart = preparedData.groupedData;
				var dataGroupedJSON = dataGroupedBarchartJSON2013;
				year = "2013";
			}

			// make data proper type (number)
	    	dataBarchart.forEach(function(d) {
		        d.value = +d.value;
		    });	

			drawBarchart(dataBarchart, year, dataGroupedJSON);
	    	drawGroupedBarchart(dataGroupedBarchart, preparedData, year);
		}


		// function to draw barchart
		function drawBarchart(dataBarchart, year, dataJSON) {
			
			// scale the range of the data
		    xBarchart.domain(dataBarchart.map(function(d) { return d.key; }));
		    yBarchart.domain([0, d3.max(dataBarchart, function(d) { return d.value; })]);

		    // remove previous chart
		    var bars = gBarchart.selectAll(".bar")
					.remove()
					.exit()
					.data(dataBarchart);		

		  	// add bar chart
			bars.enter()
				.append("rect")
				.attr("class", function(d) { return d.key + "_ bar"; })
				.attr("x", function(d) { return xBarchart(d.key); })
				.attr("width", xBarchart.bandwidth())
				.attr("y", function(d) { return yBarchart(d.value); })
				.attr("height", function(d) { return height - yBarchart(d.value); })
				.style("fill", "#2ca02c")
				
				/* tooltip to show values when hovered over
				from: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7 */
				.on("mouseover", function(d) {
					toolTipBarchart.html(function() { return "Country: " + d.key + "<br>" + "QoL score:" + d.value; });
					toolTipBarchart.show()
				})

				.on("mouseout", function () {
					toolTipBarchart.hide()
				})

				// select country when clicked on
				.on("click", function() { 
					var selected = d3.select(this).attr("class").split("_")[0]; 
					
					// update grouped barchart with selected country
					updateGrouped(selected, year, dataJSON);
				});

			// add x axis to barchart
			gBarchart.select(".x_axis")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(xBarchart))
				.selectAll("text")
		    	.attr("y", 0)
			    .attr("x", 9)
			    .attr("dy", ".35em")
			    .attr("transform", "rotate(90)")
			    .style("text-anchor", "start");

			// add y axis to barchart 
			gBarchart.select(".y_axis")
			  .call(d3.axisLeft(yBarchart));
	
		}
	
		// function to draw grouped barchart
		function drawGroupedBarchart(dataGroupedBarchart, preparedData, year) {

			var countryNames = preparedData.names;
			var indicesNames = dataGroupedBarchart[0].map(function(d) { return d.key; });

			// scale the range of the data
		    x0GroupedBarchart.domain(countryNames);
		    x1GroupedBarchart.domain(indicesNames).rangeRound([0, x0GroupedBarchart.bandwidth()]);
		    yGroupedBarchart.domain([0, d3.max(dataGroupedBarchart, function(country) { return d3.max(country, function(d) { return +d.value; }); })]);
			
			// add x axis
		    gGrouped.select(".x_axis")
		    	.call(d3.axisBottom(x0GroupedBarchart))

		    // add y axis
			gGrouped.select(".y_axis")
				.call(d3.axisLeft(yGroupedBarchart).ticks(null, "s"))

			// add grouped bars to chart
			var groups = gGrouped.selectAll(".g")
				.data(dataGroupedBarchart)
				.enter().append("g")
				.attr("class", "g")
				.attr("transform",function(d, i) { return "translate(" + x0GroupedBarchart(countryNames[i]) + ",0)"; })
				.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x1GroupedBarchart(d.key); })
				.attr("y", function(d) { return yGroupedBarchart(d.value); })
				.attr("width", x1GroupedBarchart.bandwidth())
				.attr("height", function(d) { return height - yGroupedBarchart(d.value); })
				.attr("fill", function(d) { return color(d.key); })
				/* tooltip to show values when hovered over
				from: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7 */
				.on("mouseover", function(d) {
					toolTipGrouped.html(function() { return d.key + " : " + d.value; });
					toolTipGrouped.show();
				})

				.on("mouseout", function () {
					toolTipGrouped.hide();
				});

			// add legend to chart
			var legend = gGrouped.append("g")
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

		function updateGrouped(newCountry, year, data) {
			// format data 
			var selections = getHighestLowest(year);
			var preparedData = prepareData(newCountry, data, selections.highest, selections.lowest);
			var dataGroupedBarchart = preparedData.groupedData;
			var countryNames = preparedData.names;
			var indicesNames = dataGroupedBarchart[0].map(function(d) { return d.key; });

			// scale the range of the data
		    x0GroupedBarchart.domain(countryNames);
		    x1GroupedBarchart.domain(indicesNames).rangeRound([0, x0GroupedBarchart.bandwidth()]);
		    yGroupedBarchart.domain([0, d3.max(dataGroupedBarchart, function(country) { return d3.max(country, function(d) { return +d.value; }); })]);
			
			// add x axis
		    gGrouped.select(".x_axis")
		    	.call(d3.axisBottom(x0GroupedBarchart))

		    // add y axis
			gGrouped.select(".y_axis")
				.call(d3.axisLeft(yGroupedBarchart).ticks(null, "s"))

			// call tooltip grouped barchart
			groupedBarchart.call(toolTipGrouped);

			// remove previous bars
		    var newGs = gGrouped.selectAll(".g")
				.remove()
				.exit()
				.data(dataGroupedBarchart);	

			// add new bars
			newGs
				.enter().append("g")
				.attr("class", "g")
				.attr("transform",function(d, i) { return "translate(" + x0GroupedBarchart(countryNames[i]) + ",0)"; })
				.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				.attr("x", function(d) { return x1GroupedBarchart(d.key); })
				.attr("y", function(d) { return yGroupedBarchart(d.value); })
				.attr("width", x1GroupedBarchart.bandwidth())
				.attr("height", function(d) { return height - yGroupedBarchart(d.value); })
				.attr("fill", function(d) { return color(d.key); })
				/* tooltip to show values when hovered over
				from: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7 */
				.on("mouseover", function(d) {
					toolTipGrouped.html(function() { return d.key + " : " + d.value; });
					toolTipGrouped.show()
				})

				.on("mouseout", function () {
					toolTipGrouped.hide()
				});

		}

		// function to prepare data for grouped barchart
		function prepareData(selected, indata, highest, lowest) {
			
			// show country with highest score, lowest and selected country in between
			var countries = [highest, selected, lowest];
			var data = [];
			countries.forEach(function(d) {
				data.push(d3.entries(indata[d]));
			});
			return {
				names: countries,
				groupedData: data
			}
		}

		function getHighestLowest(year) {
			if (year === "2018") {
				return {
					lowest: "Vietnam",
					highest: "Denmark"
				}
			} else {
				return {
					lowest: "Russia",
					highest: "Switzerland"
				}
			}
		}
	}
};

