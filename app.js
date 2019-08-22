const puppeteer = require('puppeteer');
const fs = require('fs');
const del = require('del');
const thePath = __dirname;
var spellList = [];
((async () => {
  const browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto('https://roll20.net/compendium/dnd5e/Spells%20List');
  let links = await page.$$eval('#pagecontent div.header.inapp-hide.single-hide a', items => items.map( item => item.href));
  console.log(links.length+" Spells Found");
  for(let link of links){
    const newPage = await browser.newPage();
    await newPage.goto(link);
    let valid = await newPage.$$eval("#pageAttrs", items => items.length);
    if (valid>0){
      await newPage.evaluate(() => document.querySelectorAll("#pageAttrs li span").forEach(function(node){if(node.getAttribute('class') == undefined){node.parentNode.removeChild(node)}}));
      const name = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.name").innerText);
      const level = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.subtitle.redsubtitle").innerText);
      const castTime = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.single-list > ul > li:nth-child(1)").innerText);
      const range = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.single-list > ul > li:nth-child(2)").innerText);
      const comps = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.single-list > ul > li:nth-child(3)").innerText);
      const duration = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.single-list > ul > li:nth-child(4)").innerText);
      const classes = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.single-list > ul > li:nth-child(5)").innerText);
      const desc = await newPage.evaluate(() => document.querySelector("#pageAttrs > div.listResult.booktemplate.closed.single > div > div.body > div.single-list > ul > li:nth-child(6)").innerText);
      console.log('Copying: '+name);
      spellList.push({
        name:name,
        level:level,
        castTime:castTime,
        range:range,
        comps:comps,
        duration:duration,
        classes:classes,
        desc:desc,
      });
    }
  }
    fs.writeFileSync(`${thePath}/spellList.json`, JSON.stringify(spellList));
})());