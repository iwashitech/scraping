const puppeteer = require('puppeteer');
const fs = require('fs');

const url_list = fs.readFileSync("./url_list.txt", 'utf8');
const urls = url_list.toString().split('\n');
const tempDir = './temp_html';

if (!fs.existsSync(tempDir)){
  fs.mkdirSync(tempDir);
}

(async () => {
  for (const url of urls) {
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      defaultViewport: { width: 1600, height: 800 }
    });
    const page = await browser.newPage();

    // var totalRequests = 0;
    let imgList = [];
    page.on('response', (response) => {
      if (response.url().includes("/img/")) {
        // console.log(response.url());
        imgList.push(response.url());
      }
      // totalRequests = totalRequests + 1;
    });

    await page.goto(`${url}`);
    // await page.waitForNavigation({ waitUntil: 'networkidle2' });
    // console.log(totalRequests);
    const imgTags = imgList.sort().reduce((acc, cur) => {
      return `${acc}<div><img src="${cur}"></div>\n`
    }, '');

    // console.log(imgTags);
    fs.writeFileSync(`${tempDir}/${url.replace(':', '_').replace(/\//g, '_').replace(/\?/g, '_')}.html`, imgTags);

    await browser.close();
  }
})();