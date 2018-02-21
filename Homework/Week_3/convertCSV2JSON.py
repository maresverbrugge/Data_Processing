import csv
import json

# open csv file and make json file
# csvfilename = 'filename.csv'
# jsonfilename = csvfilename.split('.')[0] + '.json'
csvfile = open('CSV_data.csv', 'r')
jsonfile = open('JSON_data.json', 'w')

# fill json file
fieldnames = ("STN", "Date", "View")
reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
	if row["STN"][0] is not "#":
		json.dump(row, jsonfile, indent = 4)
	# jsonfile.write('\n')

# d3.json("data.json", function(error, data) // run in terminal:
	# if error 
	# throw error)

# run in terminal: > python -m http.server