# -*- coding: utf-8 -*-
"""
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By

import os
user_name = os.environ['USERPROFILE'].replace('\\', '/')

options = Options()
#options.add_argument("--headless")
geckodriverPath = 'geckodriver.exe'
browser = webdriver.Firefox(executable_path=geckodriverPath)
browser.get('https://picsum.photos/')
# png = browser.find_element_by_class_name('content-section-light').screenshot_as_png
png = browser.find_element_by_xpath("/html/body").screenshot_as_png
with open(user_name + '/Desktop/screenshot.png', 'wb') as f:
  f.write(png)
browser.close()