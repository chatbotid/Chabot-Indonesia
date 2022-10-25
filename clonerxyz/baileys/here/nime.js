const fetch =  require('node-fetch');
const { load }= require('cheerio');
const str_replace = require('str_replace');
async function start() {
    function ran(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
        }
var url = ('https://62.182.83.93/')

const response = await fetch(url);
const body = await response.text();

let $ = load(body);

const title = $('.home_index > a');
const imgs = $('.home_index > a > .amv > amp-img');

let row =''
let row2 =''
title.each((_, e) => {
    row += '' + $(e).attr('href') + '';
    row += '\n'
});

imgs.each((_, e) => {
    row2 += '' + $(e).attr('src') + '';
    row2 += '\n'
});
//const res = str_replace('\n', '', row)
//const res = str_replace('http:undefined', 'https://media.discordapp.net/attachments/927421589916631098/1006496104671613038/2831361782.jpg', row)
console.log(row)
console.log(row2)
}

start();