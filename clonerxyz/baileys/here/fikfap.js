const str_replace = require('str_replace');
//const fs = require('fs')
const puppeteer = require('puppeteer')
const args = process.argv.slice(2);
const url = str_replace('\[', ' ', args)
const crawl = async (url) => {
  try {
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
    const page = await browser.newPage()
    await page.goto(url)
    const selector2 = '.h-full.w-full.object-cover.object-center.pointer-events-none.rounded-md'
    await page.waitForSelector(selector2)
    const links2 = await page.$$eval(selector2, list =>list.map(n => n.getAttribute('src')))
    console.log(links2[1]);
    await page.close()
    await browser.close()
  }
   catch (err) {
    console.log(err)
  }
}

crawl(url)
