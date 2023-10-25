const puppeteer = require('puppeteer');
const VIEWPORT = { width: 1000, height: 5000}; //for PC
// const VIEWPORT = { width: 360, height: 20000}; //for Smart Phone

desktop = require('path').join(require('os').homedir(), 'Desktop')
const fs = require('fs');
const url_list = fs.readFileSync(desktop + '/url_list.txt').toString().split("\n");

const today = new Date();
str_today = '' + today.getFullYear() + ('0'+(today.getMonth()+1)).slice(-2) + ('0'+today.getDate()).slice(-2) + ('0'+today.getHours()).slice(-2) + ('0'+today.getMinutes()).slice(-2) + ('0'+today.getSeconds()).slice(-2);
dir_name = desktop + '/' + 'screenshot' + str_today;
fs.mkdirSync(dir_name);

async function run() {
  try {
    const browser = await puppeteer.launch({headless: true, args:['--no-sandbox'], ignoreHTTPSErrors: true});
    const page = await browser.newPage();

    const targetElementSelector = '.class_name'

    for(i in url_list) {
      url = url_list[i];
      await page.setViewport(VIEWPORT);
      await page.goto(url)

      try {
        await page.waitFor(targetElementSelector)
      } catch (error) {
        console.log('waitFor:' + error)
        reject(error);
        if (i == url_list.length - 1) {
          break;
        } else {
          continue;
        }
      }

      /*
      const clip = await page.evaluate(s => {
        const el = document.querySelector(s)
        // エレメントの高さと位置を取得
        const { width, height, top: y, left: x } = el.getBoundingClientRect()
        return { width, height, x, y }
      }, targetElementSelector)
      */

      formatted_url = url.replace(':', '_').replace('?', '_').replace('=', '_').replace('&', '_').replace(/\//g, '_');
      await page.evaluate((url) => {
        const is_sp = url.match(/\/sp\//)
        if (is_sp) {
          let dom1 = document.querySelector('.want_to_hide_1');
          let dom2 = document.querySelector('.want_to_hide_2');
          dom1.style.display = 'none';
          dom2.style.display = 'none';
        } else {
          let dom = document.querySelector('.want_to_hide');
          dom.style.display = 'none';
        }
      }, url);
      const element = await page.$('.class_name');
      await element.screenshot({path: dir_name + '/' + formatted_url + '.png'});
      // スクリーンショットに位置と大きさを指定してclipする
      //await page.screenshot({ clip, path: dir_name + '/' + url + '.png' });
    }
    await browser.close();
  } catch (error) {
    console.log(error);
    reject(error);
    await browser.close();
  }
}

run()
