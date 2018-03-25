import csv
import json

# open csv file and make json file
csvfile = open('QOL2013.csv', 'r')
jsonfile = open('JSON_QOL2013.json', 'w')

fieldnames = ("Country", "QualityOfLifeIndex")
reader = csv.DictReader(csvfile, fieldnames, delimiter=";")

# make empty dict
dicty = {}

# fill json file
for row in reader:
	dicty[row["Country"]] = row["QualityOfLifeIndex"]

json.dump(dicty, jsonfile, indent = 4)