import csv
import json

# open csv file and make json file
csvfile = open('data.csv', 'r')
jsonfile = open('JSON_data.json', 'w')

fieldnames = ("STN", "Datum", "AverageTemp", "MinimumTemp", "MaximumTemp")
reader = csv.DictReader(csvfile, fieldnames)

# make empty dict
dicty = {}
# make 2 years with 3 dicts (min, max, average) within 1 list each
dicty["1995"] = [{"Name": "MinimumTemp", "value": []}, {"Name": "MaximumTemp", "value": []}, {"Name": "AverageTemp", "value":[]}]
dicty["2017"] = [{"Name": "MinimumTemp", "value": []}, {"Name": "MaximumTemp", "value": []}, {"Name": "AverageTemp", "value":[]}]

# fill json file
temps = ["MinimumTemp", "MaximumTemp", "AverageTemp"]
for row in reader:
	if row["STN"][0] is not "#" and row["Datum"]:
		if row["Datum"][0:4] == "1995":
			count = 0
			for temp in temps:
				current_point = {"date": row["Datum"], "value": row[temp]}
				dicty["1995"][count]["value"].append(current_point)
				count += 1

		else:
			count = 0
			for temp in temps:
				current_point = {"date": row["Datum"], "value": row[temp]}
				dicty["2017"][count]["value"].append(current_point)
				count += 1
json.dump(dicty, jsonfile, indent = 4)

