// transform raw data into canvas coordinate system
function createTransform(domain, range){
		// domain is a two-element array of the data bounds [domain_min, domain_max]
		// range is a two-element array of the screen bounds [range_min, range_max]
		// this gives you two equations to solve:
		// range_min = alpha * domain_min + beta
		// range_max = alpha * domain_max + beta
	 		// a solution would be:

	    var domain_min = domain[0]
	    var domain_max = domain[1]
	    var range_min = range[0]
	    var range_max = range[1]

	    // formulas to calculate the alpha and the beta
	   	var alpha = (range_max - range_min) / (domain_max - domain_min)
	    var beta = range_max - alpha * domain_max

	    // returns the function for the linear transformation (y= a * x + b)
	    return function(x){
	      return alpha * x + beta;
	    }

	}

window.onload = function() {
	var data = document.getElementById('rawdata').innerHTML;
	var data_split = data.split("\n");
	var dates = []
	var temperatures = []
	
	for (i = 0; i < data_split.length; i++) {
		var date = data_split[i].split(",")[0]
		var date_part_one = date.slice(0, 4)
		var date_part_two = date.slice(4, 6)
		var date_part_three = date.slice(6, 8)
		var newdate = new Date(date_part_one + '/' + date_part_two + '/' + date_part_three);
		dates = dates.concat(newdate)
		temperatures = temperatures.concat(parseInt((data_split[i].split(",")[1]).replace(/\s/g, "")))
	}


	// assuming <canvas> is sopported by our browser
	var canvas = document.getElementById('canvas'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
	var ctx = canvas.getContext('2d');

	// transform data
	// temperatures_transformed = createTransform(temperatues)

	console.log(data_split)
	console.log(dates)
	console.log(temperatures)
	// console.log(temperatures_transformed)
}

