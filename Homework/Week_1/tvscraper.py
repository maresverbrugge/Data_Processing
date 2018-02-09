#!/usr/bin/env python
# Name: Mares Verbrugge
# Student number: 10519505
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    # collect the 50 highest rated series
    serie_containers = dom.find_all('div', class_ = 'lister-item mode-advanced')

    # make list of information for every serie
    information_serie = []
    
    # make list for all 50 series
    top_tv_series = []

    # loop trough series, obtaining information for every serie
    for serie in serie_containers:
        title = serie.h3.a.text
        information_serie.append(title)
        
        rating = serie.strong.text
        information_serie.append(rating)
        
        genre = (serie.find('span', class_= 'genre').text).strip()
        information_serie.append(genre)
        
        # Dear corrector, I'm having trouble scraping the actors of the
        # imdb website. I don't know what to do if the class doesn't have a "name"...
        # I tried:
        # actors1 = first_serie.find('p', class_= '').text
        # print(actors1)
        information_serie.append('X')
        
        runtime = (serie.find('span', class_= 'runtime').text)[0:2]
        information_serie.append(runtime)

        top_tv_series.append(information_serie)
        information_serie = []

    # return list that contains 50 lists with information for every serie
    return top_tv_series

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    writer.writerows(tvseries)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
