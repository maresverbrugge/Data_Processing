import csv
import json

# open csv file and make json file
csvfile = open('QOL.csv', 'r')
jsonfile = open('JSON_QOL.json', 'w')

fieldnames = ("Country", "Quality of Life Index")
reader = csv.DictReader(csvfile, fieldnames, delimiter=";")

# make empty dict
dicty = {}

# fill json file
for row in reader:
	dicty[row["Country"]] = row["Quality of Life Index"]

json.dump(dicty, jsonfile, indent = 4)