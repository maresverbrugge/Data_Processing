window.onload = function() {
	var legend = d3.select(".legend")
	.append("g")
	.attr("class", "legend")
	
	// set colors
	var color = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]
	// set text
	var words = ["std.dev", "0 < 1", "1 < 2", "2 < 3", "3 < 4", "4 < 5"]
	// define the size of coloured squares
	var legendRectSize = 50;
	// provide spacing
	var legendSpacing = 4;
	var width = 960;
	var length = 500;

	legend.selectAll(".legend")
	.data(color)
	.enter()
	.append("rect")
	// add x and y to set rects in place
	.attr("x", 0)
	.attr("y", function(d, i) { return legendRectSize + i*(legendRectSize+legendSpacing); })
	.attr("width", legendRectSize)
	.attr("height", legendRectSize)
	.attr("fill", function(d, i) { return d; });  
	
	legend.selectAll(".text")
	.data(words)
	.enter()
	.append("text")
	.attr("x", legendRectSize + legendSpacing)
	.attr("y", function(d, i) { return 0.5 * legendRectSize + i*(legendRectSize+legendSpacing); })
	.text(function(d, i) { return d; });                
	
	// console.log(legend);
}
