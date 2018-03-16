import csv
import json

# open csv file and make json file
csvfile = open('indices.csv', 'r')
jsonfile = open('JSON_indices.json', 'w')

fieldnames = ("Country", "Purchasing Power Index", "Safety Index", "Health Care Index")
reader = csv.DictReader(csvfile, fieldnames, delimiter=";")

# make empty dict
dicty = {}
inner_dict = {}
# fill json file

for row in reader:
	inner_dict = {"Purchasing Power Index": row["Purchasing Power Index"], "Safety Index": row["Safety Index"], "Health Care Index": row["Health Care Index"]}
	dicty[row["Country"]] = inner_dict

json.dump(dicty, jsonfile, indent = 4)