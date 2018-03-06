import csv
import json

# open csv file and make json file
csvfile = open('data.csv', 'r')
jsonfile = open('JSON_data.json', 'w')

fieldnames = ("STN", "Datum", "AverageTemp", "MinimumTemp", "MaximumTemp")
reader = csv.DictReader(csvfile, fieldnames)
# fill json file
a = []
for row in reader:
	if row["STN"][0] is not "#":
		dicty = {}
		dicty["Datum"] = row["Datum"]
		dicty["AverageTemp"] = row["AverageTemp"]
		dicty["MinimumTemp"] = row["MinimumTemp"]
		dicty["MaximumTemp"] = row["MaximumTemp"]
		a.append(dicty)
		
json.dump(a, jsonfile, indent = 4)