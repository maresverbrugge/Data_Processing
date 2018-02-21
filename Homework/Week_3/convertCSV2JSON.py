import csv
import json

# open csv file and make json file
csvfile = open('CSV_data.csv', 'r')
jsonfile = open('JSON_data.json', 'w')

fieldnames = ("STN", "Date", "View")
reader = csv.DictReader(csvfile, fieldnames)
# fill json file
for row in reader:
	if row["STN"][0] is not "#":
		json.dump(row, jsonfile, indent = 4)