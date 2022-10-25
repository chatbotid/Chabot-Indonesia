const str_replace = require('str_replace');
//const fs = require('fs')
const puppeteer = require('puppeteer')
const args = process.argv.slice(2);
const url = str_replace('\[', ' ', args)
const crawl = async (url) => {
  try {
    //console.log(`Crawling ${url}`)
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
    const page = await browser.newPage()
    await page.goto(url)
    const selector = '.style-scope.ytd-video-renderer > .style-scope.yt-img-shadow'
    const selector2 = '.style-scope.ytd-video-renderer > #video-title'
    await page.waitForSelector(selector)
    await page.waitForSelector(selector2)
	let list = [];
    const links = await page.$$eval(selector, list =>list.map(n => n.getAttribute('src')))
    const links2 = await page.$$eval(selector2, list =>list.map(n => n.getAttribute('aria-label')))
    const links3 = await page.$$eval(selector2, list =>list.map(n => n.getAttribute('href')))
	//console.log(links3)
	//const imghd = str_replace('/watch?v=', '', links3)
	//console.log(imghd)
								for (let i = 0; i < 4 ; i++) {
								list.push({
								img: `https://i.ytimg.com/vi/${links3[i].slice(9)}/hqdefault.jpg`,
								desc: links2[i],
								urls: `https://youtube.com${links3[i]}`
								})
								}
	
	await browser.close()

	console.log(list)
	var omaga = list.map(function(obj) {
    return obj.img;
	});
	console.log(omaga)
  }
   catch (err) {
    console.log(err)
  }
}

crawl(url)
