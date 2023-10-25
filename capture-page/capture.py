# -*- coding: utf-8 -*-
"""
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import re
#import chromedriver_binary
import datetime
import os
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

str_today = str(datetime.datetime.today()).replace(' ', '-').replace(':', '-')
str_today = re.sub('\..+', '', str_today)

user_name = os.environ['USERPROFILE'].replace('\\', '/')
dir_name = user_name + '/Desktop/capture_img' + str_today
SCROLL_BAR = 50

#if not os.path.isdir(dir_name):
os.mkdir(dir_name)

def init():
    options = Options()
    options.add_argument('--headless')
    capabilities = DesiredCapabilities.CHROME.copy()
    capabilities['acceptInsecureCerts'] = True
    #options.add_argument('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.0 Mobile/14C92 Safari/602.1')
    #driver = webdriver.Chrome(options=options)
    driver = webdriver.Chrome(desired_capabilities=capabilities, executable_path='C:/chromedriver_win32/chromedriver.exe', options=options)
    return driver

def go_to_page(url):
    driver.get(url)
    time.sleep(3)

def get_page_prop():
    # For SmartPhone
    #page_width = 414
    page_width = driver.execute_script('return document.body.scrollWidth') + SCROLL_BAR
    page_height = driver.execute_script('return document.body.scrollHeight')
    page_prop = {'page_width': page_width, 'page_height': page_height}    
    return page_prop

def set_page_prop(page_prop):
    driver.set_window_size(page_prop['page_width'], page_prop['page_height'])
    time.sleep(3)

def url_to_shapedurl(url):
    shapedurl = re.sub(r'\\|/|:|\*|\?|"|<|>|\|', '_', url)
    return shapedurl

def save_img(save_file):
    driver.save_screenshot(save_file)

driver = init()

page_list = user_name + '/Desktop/page_list.txt'
with open(page_list) as f:
    pages = f.readlines()

    for url in pages:
        url = url.replace('\n', '')
        shaped_url = url_to_shapedurl(url)
        go_to_page(url)
        page_prop = get_page_prop()
        set_page_prop(page_prop)
        img_file = dir_name + '/' + shaped_url + '.png'
        save_img(img_file)

driver.quit()