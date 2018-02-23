import csv
import json

# open csv file and make json file
csvfile = open('CSV_data.csv', 'r')
jsonfile = open('JSON_data.json', 'w')

fieldnames = ("STN", "Datum", "View")
reader = csv.DictReader(csvfile, fieldnames)
# fill json file
a = []
for row in reader:
	if row["STN"][0] is not "#":
		dicty = {}
		dicty['Datum'] = row["Datum"]
		dicty["View"] = row["View"][0:5]
		a.append(dicty)
		
json.dump(a, jsonfile, indent = 4)