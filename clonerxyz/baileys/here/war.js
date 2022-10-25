"use strict"
const { default:makeWASocket, WA_DEFAULT_EPHEMERAL, makeCacheableSignalKeyStore, AnyMessageContent, MessageOptions, delay, downloadMediaMessage, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState, MessageType, proto} = require('@adiwajshing/baileys');
const app = require('express')();
const http = require('http').Server(app);
const port = process.env.PORT || 3017;
const { writeFile }  = require('fs/promises')
const { Boom } = require('@hapi/boom')
const MAIN_LOGGER = require('@adiwajshing/baileys/lib/Utils/logger');
const { createSticker, StickerTypes } = require('wa-sticker-formatter')
const { exec } = require("child_process")
const pino = require('pino')
const re = /kon.*/ig;
const re2 = /okeh.*/ig;
const rere = /\*.mp4/ig;
const re3 = /al.*/ig;
const re4 = /aleya.*/ig;
const re5 = /say.*/ig;
const re6 = /git.*/ig;
const re7 = /gita.*/ig;
const fs = require('fs');
function addLeadingZeros(n) {
if (n <= 9) {
return "0" + n;
}
return n
}
let {req,params,tagNum,tagText} = "";
const qrcode = require('qrcode-terminal');
const str_replace = require('str_replace');
const gTTS = require('gtts');
const translate = require('translate-google');
let msgRetryCounterMap;
msgRetryCounterMap = MessageRetryMap;
const logger = pino();
const useStore = !process.argv.includes('--no-store')
const store = useStore ? makeInMemoryStore({ logger }) : undefined
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./baileys_store_multi.json')
}, 10_000)
const startSock = async() => {
	const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
	const { version, isLatest } = await fetchLatestBaileysVersion()
	
	const sock = makeWASocket({
		version,
		printQRInTerminal: true,
		auth: state,
		keys: makeCacheableSignalKeyStore(state.keys, pino({level: "silent"})),
		msgRetryCounterMap,
		logger,
		//browser: Browsers.baileys('Desktop'),
		//browser: browsers.macOS('Desktop'),
		browser: ['chrome', 'Desktop', '10'],
		syncFullHistory: true,
		getMessage: async key => {
			if(store) {
				const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
				return msg?.message || undefined
			}

			// only if store is present
			return {
				conversation: 'hello'
			}
		}
	})
app.get('/send/:tagNum/:tagText', (req, res) => {
		const sendid = async() => {
		const now = new Date();
		let formattedDate = now.getFullYear() + "-" + addLeadingZeros(now.getMonth() + 1) + "-" + addLeadingZeros(now.getDate()) + " " + addLeadingZeros(now.getHours()) + ":" + addLeadingZeros(now.getMinutes()) + ":" + addLeadingZeros(now.getSeconds())
		await sock.sendMessage(`${req?.params?.tagNum}@s.whatsapp.net`, {text: `${formattedDate}${req?.params?.tagText}`})
		}
		sendid();
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({text:""+req.params.tagText+""}));
});
app.get('/sendz/:tagNum/:tagText', (req, res) => {
	const sendid = async() => {
	const now = new Date();
	let formattedDate = now.getFullYear() + "-" + addLeadingZeros(now.getMonth() + 1) + "-" + addLeadingZeros(now.getDate()) + " " + addLeadingZeros(now.getHours()) + ":" + addLeadingZeros(now.getMinutes()) + ":" + addLeadingZeros(now.getSeconds())
	await sock.sendMessage(`${req?.params?.tagNum}@s.whatsapp.net`, {text: `${req?.params?.tagText}`})
	}
	sendid();
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({text:""+req.params.tagText+""}));
});
app.get('/sendg/:tagNum/:tagText', (req, res) => {
	const sendid = async() => {
	const now = new Date();
	let formattedDate = now.getFullYear() + "-" + addLeadingZeros(now.getMonth() + 1) + "-" + addLeadingZeros(now.getDate()) + " " + addLeadingZeros(now.getHours()) + ":" + addLeadingZeros(now.getMinutes()) + ":" + addLeadingZeros(now.getSeconds())
	await sock.sendMessage(`${req?.params?.tagNum}@g.us`, {text: `${formattedDate}${req?.params?.tagText}`})
	}
	sendid();
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({text:""+req.params.tagText+""}));
});
sock.ev.process(
		async(events) => {
			if(events['connection.update']) {
				const update = events['connection.update']
				const { connection, lastDisconnect } = update
				if(connection === 'close') {
					
				}
				if(lastDisconnect?.error?.output?.statusCode === DisconnectReason.restartRequired) {
						startSock()
				}
				if(lastDisconnect?.error?.output?.statusCode === DisconnectReason.timedOut) {
				}
				else if(connection === 'open') {
				
				}
			}
			if(events['creds.update']) {
				await saveCreds()
			}
			if(events['chats.set']) {
				const { chats, isLatest } = events['chats.set']
				//console.log(`recv ${chats.length} chats (is latest: ${isLatest})`)
			}
			if(events['messages.set']) {
				const { messages, isLatest } = events['messages.set']
				//console.log(`recv ${messages.length} messages (is latest: ${isLatest})`)
			}

			if(events['contacts.set']) {
				const { contacts, isLatest } = events['contacts.set']
				//console.log(`recv ${contacts.length} contacts (is latest: ${isLatest})`)
			}

			if(events['messages.upsert']) {
				const upsert = events['messages.upsert']
				console.log('recv messages ', JSON.stringify(upsert, undefined, 2))
				if(upsert.type === 'notify') {
					try {
					for(const msg of upsert.messages) {   
						const body = (msg.message?.extendedTextMessage?.text);
						const group = (msg.message?.conversation);
						const namez = (msg.pushName);
						const didi = (msg.key.remoteJid)
						const didix = str_replace('@s.whatsapp.net','', didi)
						const alls = (msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.message?.listResponseMessage?.title || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption)
						const list = (msg.message?.listResponseMessage?.title);
						const stsx = (msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption);
						const btrx = (msg.message?.buttonsResponseMessage?.selectedDisplayText);
						const sendMessageWTyping = async(msg, didi, options={}) => {
							await sock.presenceSubscribe(didi)
							await delay(500)

							await sock.sendPresenceUpdate('composing', didi)
							await delay(2000)

							await sock.sendPresenceUpdate('paused', didi)

							await sock.sendMessage(didi, msg, options)
						}
						
						console.log(`nomor : ${didix} nama : ${namez} [pesan : ${alls}]`)
						fs.appendFileSync('keyid.txt', ''+didix+'\n' ,(err)=> {
						  if(err){
							console.log('error',err);
						  }
						  //console.log('DONE');
						})
						
						if(alls === 'menu' || alls === 'Menu' || alls === '.menu' || alls === 'p' || alls === 'P' ) {
							await sock.readMessages([msg.key])
							const buttons = [
							  {buttonId: 'id1', buttonText: {displayText: 'about aleya'}, type: 1},
							  {buttonId: 'id2', buttonText: {displayText: 'menus'}, type: 1},
							]
							const buttonMessage = {
								image: {url: 'https://i1.sndcdn.com/artworks-000169121990-vmcy92-t500x500.jpg'},
 								caption : "𝙡𝙚𝙩 𝙟𝙪𝙨𝙩𝙞𝙘𝙚 𝙗𝙚𝙜𝙪𝙣 𝙩𝙝𝙤𝙪𝙜𝙝𝙩 𝙩𝙝𝙚 𝙝𝙚𝙖𝙫𝙚𝙣𝙨 𝙛𝙖𝙡𝙡",
								footerText: ' ',
								headerType: 4,
								buttons: buttons,
							}
							
							await sendMessageWTyping(buttonMessage, msg.key.remoteJid)
						}
						else if(msg.message?.buttonsResponseMessage?.selectedButtonId === 'id2' || body === 'menus' || group === 'menus' )
						{
	                    await sock.readMessages([msg.key])
	                        const sections = [
								{
								title: " ",
								rows: [
									{title:'how to use klik here'},
									{title:'tle aku cinta kamu'},
									{title:'tlj arigato'},
									{title:'tli another world'},
									{title:'update anime'},
									{title:'strg'},
									{title:'rmeme'},
									{title:'nh'},
									{title:'gs siapa yang paling ganteng di indonesia'},
									{title:'ys indonesia raya'},
									{title:'strd'},
									{title:'vn'},
									{title:'spk test'},
									{title:'sts'},
									{title:'fpp'},
									{title:'al kamu cinta aku ?'},
									{title:'aleya hobi kamu apa ?'},
									{title:'yt https://youtu.be/tPEE9ZwTmy0'},
									{title:'ymp3 https://youtu.be/tPEE9ZwTmy0'},
									{title:'td https://vt.tiktok.com/ZSRQhYrMG/'}
									
								]
								},
							]
							  
							  const listMessage = {
							  text: "𝙡𝙚𝙩 𝙟𝙪𝙨𝙩𝙞𝙘𝙚 𝙗𝙚𝙜𝙪𝙣 𝙩𝙝𝙤𝙪𝙜𝙝𝙩 𝙩𝙝𝙚 𝙝𝙚𝙖𝙫𝙚𝙣𝙨 𝙛𝙖𝙡𝙡",
							  ListType: 2,
							  buttonText : "MENU",
							  sections
							}

							await sendMessageWTyping(listMessage, msg.key.remoteJid)
						}
                        else if (msg.message?.buttonsResponseMessage?.selectedButtonId === 'id1'){
                            await sock.readMessages([msg.key])
                            await sendMessageWTyping({text: "𝙏𝙝𝙚 𝙬𝙤𝙧𝙡𝙙 𝙞𝙨𝙣'𝙩 𝙥𝙚𝙧𝙛𝙚𝙘𝙩. 𝘽𝙪𝙩 𝙞𝙩'𝙨 𝙩𝙝𝙚𝙧𝙚 𝙛𝙤𝙧 𝙪𝙨, 𝙙𝙤𝙞𝙣𝙜 𝙩𝙝𝙚 𝙗𝙚𝙨𝙩 𝙞𝙩 𝙘𝙖𝙣. 𝙩𝙝𝙖𝙩'𝙨 𝙬𝙝𝙖𝙩 𝙢𝙖𝙠𝙚𝙨 𝙞𝙩 𝙨𝙤 𝙙𝙖𝙢𝙣 𝙗𝙚𝙖𝙪𝙩𝙞𝙛𝙪𝙡.\n ~ 𝙍𝙤𝙮 𝙈𝙪𝙨𝙩𝙖𝙣𝙜 (𝙁𝙪𝙡𝙡 𝙈𝙚𝙩𝙖𝙡 𝘼𝙡𝙘𝙝𝙚𝙢𝙞𝙨𝙩).\n\n\n 𝙎𝙤 𝙝𝙚𝙧𝙚 𝙞'𝙢 𝘼𝙡𝙚𝙮𝙖 𝙜𝙞𝙩𝙖 𝙩𝙤 𝙘𝙪𝙧𝙚 𝙮𝙤𝙪𝙧 𝙙𝙚𝙥𝙧𝙚𝙨𝙨𝙞𝙤𝙣 \n\n version bot : v2.9.2-lite"}, msg.key.remoteJid)
                        }
						else if (alls === 'bl2'){
							await sendMessageWTyping(
								{
								//,
								image: {url: 'https://i1.sndcdn.com/artworks-000169121990-vmcy92-t500x500.jpg'},
								caption: 'https://4sekawan.xyz', 
								contextInfo: {
									forwardingScore: 449,
									isForwarded: true,
									externalAdReply: {
										title : 'https://4sekawan.xyz',
										body : '4sekawan.xyz',
										previewType: 'PHOTO',
        								thumbnailUrl: 'https://i1.sndcdn.com/artworks-000169121990-vmcy92-t500x500.jpg',
										sourceUrl:'4sekawan.xyz',
										
									}
								}
							}, msg.key.remoteJid)
                        }
						else if (alls === 'bl'){
							const templateButtons = [
								{index: 1, urlButton: {displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'}},
								//{index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
								//{index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
							]
							
							const templateMessage = {
								viewOnceMessage: {
									message: {
										templateMessage: {
											hydratedTemplate:{
												hydratedContentText: " ",
												hydratedFooterText: ' ',
												hydratedButtons: templateButtons
											}
										}
									}
								}
							}
							await sock.readMessages([msg.key])
							await sock.relayMessage(msg.key.remoteJid, templateMessage, {})
                        }

						else if (alls?.startsWith('cl')){
							const txt = (alls?.split("|")[1])
							const it = (alls?.split("|")[2])
							//console.log(`${it} ${txt}`)
							await sock.readMessages([msg.key])
							await sendMessageWTyping({text: `${txt}`}, it)
                        }
						else if (alls?.startsWith('https://anobo')){
							const links = (alls)
							const fetch =  require('node-fetch');
								const cheerio = require('cheerio');
								const str_replace = require('str_replace');
								async function start() {
									const axios = require('axios');
									const html = await axios.get(links);
									const $ = await cheerio.load(html.data);
									const row2 = $(".column-three-fourth").find("#mediaplayer").attr('src')
									const row3 = $(".sisi.entry-content").find("amp-img").attr('src')
								
								console.log(row2);
								console.log(row3);
							await sock.readMessages([msg.key])
							await sendMessageWTyping(
								{
								//,
								image: {url: `${row3}`},
								caption: `${row2}`, 
								contextInfo: {
									forwardingScore: 449,
									isForwarded: true,
									externalAdReply: {
										title : `${links}`,
										body : `${links}`,
										previewType: 'PHOTO',
        								thumbnailUrl: `${row3}`,
										sourceUrl:'anoboy.lol',
										
									}
								}
							}, msg.key.remoteJid)
						}
						start()
                        }
						else if (alls === 'https://'){
							const links = (alls)
							const fetch =  require('node-fetch');
								const cheerio = require('cheerio');
								const str_replace = require('str_replace');
								async function start() {
									const axios = require('axios');
									const html = await axios.get(links);
									const $ = await cheerio.load(html.data);
									const row2 = $(".column-three-fourth").find("#mediaplayer").attr('src')
									const row3 = $(".sisi.entry-content").find("amp-img").attr('src')
								
								console.log(row2);
								console.log(row3);
							await sock.readMessages([msg.key])
							await sendMessageWTyping(
								{
								//,
								image: {url: `${row3}`},
								caption: `${row2}`, 
								contextInfo: {
									forwardingScore: 449,
									isForwarded: true,
									externalAdReply: {
										title : `${links}`,
										body : `${links}`,
										previewType: 'PHOTO',
        								thumbnailUrl: `${row3}`,
										sourceUrl:'anoboy.lol',
										
									}
								}
							}, msg.key.remoteJid)
						}
						start()
                        }
						else if (body === '1' || group === '1'){
                            await sock.readMessages([msg.key])
							
                            await sendMessageWTyping({text: "hallo", contextInfo: { forwardingScore: 2, isForwarded: true }, }, msg.key.remoteJid, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL })
                        }
						else if (alls?.startsWith('tle') || alls?.startsWith('Tle')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							translate(''+it+'', {from: 'auto', to: 'en'}).then( async res => {
								console.log(res)
								await sendMessageWTyping({text: `${res}`}, msg.key.remoteJid)
							}).catch( async err => {
								console.error(err)
								await sendMessageWTyping({text: `${err}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('tlj') || alls?.startsWith('Tlj')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							translate(''+it+'', {from: 'auto', to: 'ja'}).then( async res => {
								console.log(res)
								await sendMessageWTyping({text: `${res}`}, msg.key.remoteJid)
							}).catch( async err => {
								console.error(err)
								await sendMessageWTyping({text: `${err}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('tli') || alls?.startsWith('Tli')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							translate(''+it+'', {from: 'auto', to: 'id'}).then( async res => {
								console.log(res)
								await sendMessageWTyping({text: `${res}`}, msg.key.remoteJid)
							}).catch( async err => {
								console.error(err)
								await sendMessageWTyping({text: `${err}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('how') || alls?.startsWith('How')){
                            await sock.readMessages([msg.key])
							exec('cat menu.txt', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('strg') || alls?.startsWith('Strg')){
                            await sock.readMessages([msg.key])
							exec('ls ./doujin | shuf -n 1', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str2 = stdout.replace(/\r?\n|\r/g, "");
								await sendMessageWTyping({image: {url: `./doujin/${str2}`}}, msg.key.remoteJid)
							})
                        }
						
						else if (alls?.startsWith('vn') || alls?.startsWith('Vn')){
                            await sock.readMessages([msg.key])
							exec('ls ./vn | shuf -n 1', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str2 = stdout.replace(/\r?\n|\r/g, "");
								await sendMessageWTyping({audio: {url: `./vn/${str2}`}, mimetype: 'audio/mp4'}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('spk') || alls?.startsWith('Spk')){
                            await sock.readMessages([msg.key])
							const it = (list?.slice(4) || body?.slice(4) || group?.slice(4))
							if (it === ''){
							await sendMessageWTyping({text: `kata-kata nya kakak belom`}, msg.key.remoteJid)
							}
							else {
								//const speech = ``+ it +`` ;
								console.log(it)
								const name = Math.random();
								const gtts = new gTTS(it, 'id');
								gtts.save(`./dlyt/${name}.mp3`, function (err, result){
									if(err) { throw new Error(err); }
									console.log("Text to speech converted!");
									async function spkz(){
									await sendMessageWTyping({audio: {url: `./dlyt/${name}.mp3`}, mimetype: 'audio/mp4'}, msg.key.remoteJid)
									}
									spkz()
								});
								
								 
							}
                        }
						else if (alls?.startsWith('strd') || alls?.startsWith('Strd')){
                            await sock.readMessages([msg.key])
							const name = Math.random().toString(36).slice(8);
							
							exec(''+name+'=$(ls ./doujin | shuf -n 1) && ffmpeg -i  ./doujin/"$'+name+'" -v quiet ./doujin/'+name+'.webp  && ls ./doujin/'+name+'.webp', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str2 = stdout.replace(/\r?\n|\r/g, "");
								if (str2 === './doujin/'+name+'.webp'){
									const mediaData = await fs.readFileSync(`${str2}`)
										const stickerOptions = {
											pack: 'vtuber kesayangan kita', // pack name
											author: 'aleya gita', // author name
											categories: ['😘', '🎉'], 
											type: StickerTypes.FULL, // sticker type
											quality: 100, // quality of the output file
										}
										const generateSticker = await createSticker(mediaData, stickerOptions)
									//await sendMessageWTyping({sticker: {url: `./img/${name}.webp`}, stickerOptions}, msg.key.remoteJid)
									await sendMessageWTyping({ sticker: generateSticker }, msg.key.remoteJid)
									//await sendMessageWTyping({sticker: {url: `${str2}`}}, msg.key.remoteJid)
									}
								else {await sendMessageWTyping({text: `kecepetan mas sabar`}, msg.key.remoteJid)}
								
								
								
							})
                        }
						else if (alls?.startsWith('sts') || alls?.startsWith('Sts')){
                            await sock.readMessages([msg.key])
								const name = Math.random().toString(36).slice(8);
								const pathget =  (msg.message?.imageMessage?.mimetype || msg.message?.videoMessage?.mimetype)
								const size = (msg.message?.videoMessage?.fileLength)
								console.log(pathget)
								if ( size > 1000000) {
									await sendMessageWTyping({text: `kegedean mas file nya`}, msg.key.remoteJid)
								}
								else {
								
								const path = str_replace('image/', '', pathget);
								const pathclean = str_replace('video/', '', path);
								const buffer = await downloadMediaMessage(
									msg,
									'buffer',
									{ },
									{ 
										//logger,
										// pass this so that baileys can request a reupload of media
										// that has been deleted
										reuploadRequest: sock.updateMediaMessage
									}
								)
								// save to file
								await writeFile(`./img/${name}.${pathclean}`, buffer)
								const folder = ('./img/')
								exec('ffmpeg -i '+folder+name+'.'+pathclean+' -v quiet -vcodec libwebp -filter:v fps=fps=20 -lossless 0  -compression_level 3 -q:v 70 -loop 1 -preset picture -an -vsync 0  '+folder+name+'.webp', async(error, stdout, stderr) => {
									if (error) {
										console.log(`error: ${error.message}`);
										//return;
									}
									if (stderr) {
										console.log(`stderr: ${stderr}`);
										//return;
									}
									if (fs.existsSync(`./img/${name}.webp`)) {
										const mediaData = await fs.readFileSync(`./img/${name}.webp`)
										const stickerOptions = {
											pack: 'vtuber kesayangan kita', // pack name
											author: 'aleya gita', // author name
											type: StickerTypes.FULL, // sticker type
											quality: 100, // quality of the output file
										}
										const generateSticker = await createSticker(mediaData, stickerOptions)
									//await sendMessageWTyping({sticker: {url: `./img/${name}.webp`}, stickerOptions}, msg.key.remoteJid)
									await sendMessageWTyping({ sticker: generateSticker }, msg.key.remoteJid)
									}
									else {await sendMessageWTyping({text: `kegedean mas file nya`}, msg.key.remoteJid)}
								})
								//await delay(6000)
							}
								
                        }
						else if (alls?.startsWith('nh') || alls?.startsWith('Nh')){
                            await sock.readMessages([msg.key])
							try {
							exec('node nhen.js | shuf -n 1', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str4 = stdout.replace(/\r?\n|\r/g, "");
								if (str4 === '') {
								await sendMessageWTyping({text: `kecepetan mas sabar`}, msg.key.remoteJid)
								}
								else {
								await sendMessageWTyping({image: {url: `${str4}`}}, msg.key.remoteJid)
								}
							})
						}catch (e) {
							await sendMessageWTyping({text: `kecepetan mas sabar`}, msg.key.remoteJid)
							}
							
                        }
						else if (alls?.startsWith('rmeme') || alls?.startsWith('Rmeme')){
                            await sock.readMessages([msg.key])
							exec('node meme.js', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								const str3 = stdout.replace(/\r?\n|\r/g, "");
								await sendMessageWTyping({image: {url: `${str3}`}}, msg.key.remoteJid)
							})
                        }
						else if (alls?.startsWith('update anime') || alls?.startsWith('anime')){
                            	await sock.readMessages([msg.key])
								const fetch =  require('node-fetch');
								const cheerio = require('cheerio');
								const str_replace = require('str_replace');
								async function start() {
									const axios = require('axios');
									const html = await axios.get("https://62.182.83.93/");
									const $ = await cheerio.load(html.data);
								  
									const row2 = $(".home_index").find('[rel=bookmark]').map(function () {
									  return {
										//numbers: $(this).text().trim(),
										title: $(this).attr('href'),
									  }
									}).toArray();
								  
								console.log(row2);
								const sections = [
									{
									title: " ",
									rows: row2
								},
								]
								const now = new Date();
								const listMessage2 = {
								text: `*update anime ${now}*`,
								ListType: 2,
								buttonText : "OPEN",
								sections
								}
								await sendMessageWTyping(listMessage2, msg.key.remoteJid)
								}

								start();	
                        }
						else if (alls?.startsWith('gs') || alls?.startsWith('Gs')){
                            await sock.readMessages([msg.key])
							const linkz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const query = ('https://google.com/search?q=' + linkz + '')
							await sock.readMessages([msg.key])
							const puppeteer = require("puppeteer")
							const str_replace = require('str_replace');
							const args = process.argv.slice(2);
							//const url = str_replace('\[', ' ', args)
							;(async () => {
							
							const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
							//const browser = await puppeteer.launch({ headless: false })
							const page = await browser.newPage()
							await page.goto(query)

							/* Run javascript inside the page */
							const data = await page.evaluate(() => {
								const list = []
								const items = document.querySelectorAll(".yuRUbf")

								for (const item of items) {
								list.push({
									title: item.querySelector(".yuRUbf > a").getAttribute('href'),
									//description: item.querySelector(".yuRUbf > a > h3").innerHTML,
									//link: item.querySelector(".dXiKIc > a").getAttribute('href'),
								})
								}

								return list
							})
							//const output = str_replace('\[', ' ', data)
							console.log(data)
							await browser.close()
							const sections = [
								{
								title: " ",
								rows: data
							},
							]
							const now = new Date();
							const listMessage2 = {
							text: `*search result ${now}*`,
							ListType: 2,
							buttonText : "OPEN",
							sections
							}
							await sendMessageWTyping(listMessage2, msg.key.remoteJid)
							})()
								
								

								
                            
                        }
						else if (alls?.startsWith('ys') || alls?.startsWith('Ys')){
                            await sock.readMessages([msg.key])
							const ysz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const query = ('https://www.youtube.com/results?search_query=' + ysz + '')
							const { exec } = require("child_process")
							const str_replace = require('str_replace');
							//const fs = require('fs')
							const puppeteer = require('puppeteer')
							const args = process.argv.slice(2);
							//const url = str_replace('\[', ' ', args)
							const crawl = async (url) => {
							  try {
								//console.log(`Crawling ${url}`)
								const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium',args: ['--no-sandbox'],})
								const page = await browser.newPage()
								await page.goto(query)
								const selector = '.style-scope.ytd-video-renderer > #img'
								const selector2 = '.style-scope.ytd-video-renderer > #video-title'
								await page.waitForSelector(selector)
								await page.waitForSelector(selector2)
								let list = [];
								const links = await page.$$eval(selector, list =>list.map(n => n.getAttribute('src')))
								const links2 = await page.$$eval(selector2, list =>list.map(n => n.getAttribute('aria-label')))
								const links3 = await page.$$eval(selector2, list =>list.map(n => n.getAttribute('href')))
								//const imghd = str_replace('/watch?v=', ' ', links3)
								for (let i = 0; i < 5 ; i++) {
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
								var omaga2 = list.map(function(obj) {
								return obj.desc;
								});
								var omaga3 = list.map(function(obj) {
								return obj.urls;
								});
								for (let i = 0; i < 5 ; i++) {
								//console.log(omaga)
								const buttons = [
								  {buttonId: `y${links3[i].slice(9)}`, buttonText: {displayText: `yt ${omaga3[i]}`}, type: 1},
								  {buttonId: `ym${links3[i].slice(9)}`, buttonText: {displayText: `ymp3 ${omaga3[i]}`}, type: 1},
								]
								await sendMessageWTyping(
								{
								//,
								image: {url: `${omaga[i]}`},
								caption: `${omaga3[i]}`, 
								height:0,
								buttons: buttons,
								//width:30,
								contextInfo: {
									forwardingScore: 449,
									isForwarded: true,
									externalAdReply: {
										title : `${omaga2[i]}`,
										body : `${omaga2[i]}`,
										previewType: 'PHOTO',
        								thumbnailUrl: `${omaga[i]}`,
										sourceUrl:'youtube.com',
										
									}
								}
							}, msg.key.remoteJid)
								
							}
							  }
							   catch (err) {
								console.log(err)
							  }
							}

							crawl(query)
							
							
												
                        }
						else if (alls?.startsWith('fpp') || alls?.startsWith('Fpp')){
                            await sock.readMessages([msg.key])
							const ysz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const query = ('https://fikfap.com')
							const { exec } = require("child_process")
							exec("node fikfap.js " + query + "", async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								await sendMessageWTyping({text: `sabar dulu mas`}, msg.key.remoteJid)
								//console.log(`stdout: ${stdout}`);
								await sendMessageWTyping({ video: { url: `${stdout}` }, mimetype: 'video/mp4'}, msg.key.remoteJid)
							})	
												
                        }
						else if (alls?.startsWith('yt') || alls?.startsWith('Yt') || btrx?.startsWith('yt')){
							await sock.readMessages([msg.key])
							const ysz = (list?.slice(2) || body?.slice(2) || group?.slice(2) || btrx?.slice(2))
							const name = Math.random().toString(36).slice(8);
							const { exec } = require("child_process")
							
							exec('cp ./dlyt/pr0gm.mp4 ./dlyt/'+name+'.mp4 && ./yt-dlp -f "(mp4)[height<480]" -o ./dlyt/'+name+'.mp4 --max-filesize 56121471 --force-overwrites ' + ysz + '', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
									await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
									await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
								}
								
									//const str_replace = require('str_replace');
									//const outyt = str_replace('\n','', stdout)
									await sendMessageWTyping({text: `proccess downloading..`}, msg.key.remoteJid)
									await delay (10000)
									if (fs.existsSync('./dlyt/'+name+'.mp4')) {
										await sendMessageWTyping({ video: { url: './dlyt/'+name+'.mp4' }, mimetype: 'video/mp4'}, msg.key.remoteJid)
									  }
									else {
										await sendMessageWTyping({text: `kegedean mas file nya`}, msg.key.remoteJid)
									}
									
									
							})
						
													
							}
							else if (alls?.startsWith('ymp3') || alls?.startsWith('Ymp3') || btrx?.startsWith('ymp3')){
								await sock.readMessages([msg.key])
								const ysz = (list?.slice(4) || body?.slice(4) || group?.slice(4) || btrx?.slice(4))
								const name = Math.random().toString(36).slice(8);
								const { exec } = require("child_process")
								exec('./yt-dlp -S "res:144" --extract-audio --audio-format mp3 -o ./dlyt/'+name+'.mp3 --max-filesize 56121471 --force-overwrites ' + ysz + '', async(error, stdout, stderr) => {
									if (error) {
										console.log(`error: ${error.message}`);
										//return;
										await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
									}
									if (stderr) {
										console.log(`stderr: ${stderr}`);
										//return;
										await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
									}
										//const str_replace = require('str_replace');
										//const outyt = str_replace('\n','', stdout)
										await sendMessageWTyping({text: `proccess downloading..`}, msg.key.remoteJid)
										await delay (10000)
										if (fs.existsSync('./dlyt/'+name+'.mp3')) {
										await sendMessageWTyping({ audio: { url: './dlyt/'+name+'.mp3' }, mimetype: 'audio/mp4'}, msg.key.remoteJid)
										}
										else {
											await sendMessageWTyping({text: `kegedean mas file nya`}, msg.key.remoteJid)
										}
								})
														
								}
								else if (alls?.startsWith('td') || alls?.startsWith('Td')) {
									await sock.readMessages([msg.key])
									const it = (list?.slice(2) || body?.slice(2) || group?.slice(2))
									const str_replace = require('str_replace');
									//const output = str_replace(' ', '', it);
									const name = Math.random().toString(36).slice(8);
									const { exec } = require("child_process");
									exec(''+name+'=$(node tik.js' +it+ ') && curl "$'+name+'" -s -o ./vid/'+name+'.mp4 && ls ./vid | grep '+name+'.mp4', async (error, stdout, stderr) => {
										if (error) {
											await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
											//return;
										}
										if (stderr) {
											await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
											//return;
										}
										console.log(stdout)
										const yuu = str_replace('\n', '', stdout);
										const yuio = (''+name+'.mp4')
										if (yuu === yuio){
										await sendMessageWTyping({ video: { url: './vid/'+name+'.mp4' }, mimetype: 'video/mp4'}, msg.key.remoteJid)
										}
										else {
										await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
										}
									})
								}
						else if (alls?.startsWith('fc') || alls?.startsWith('Fc')){
                            await sock.readMessages([msg.key])
							const fcz = (list?.slice(2) || body?.slice(2) || group?.slice(2))
							const fcx = (list?.slice(3) || body?.slice(3) || group?.slice(3))
							console.log(msg.key.remoteJid);
							if (msg.key.remoteJid === '62822xxxx@s.whatsapp.net' || msg.key.remoteJid === '62822xxxx-1604388272@g.us'){
							const { exec } = require("child_process")
							exec(""+fcz+"", async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
									await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
									await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
								}
								//console.log(`stdout: ${stdout}`);
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})	
						}
							else if(msg.key.remoteJid !== '62822xxxx@s.whatsapp.net' || msg.key.remoteJid !== '62822xxxx-1604388272@g.us'){
								await sendMessageWTyping({text: `sabar dulu ya `}, msg.key.remoteJid)
							}
												
                        }

						else if (alls?.startsWith('cpu') || alls?.startsWith('Cpu')){
                            await sock.readMessages([msg.key])
							exec('sh a.sh', async(error, stdout, stderr) => {
								if (error) {
									console.log(`error: ${error.message}`);
									//return;
								}
								if (stderr) {
									console.log(`stderr: ${stderr}`);
									//return;
								}
								await sendMessageWTyping({text: `${stdout}`}, msg.key.remoteJid)
							})
                            
                        }
						else if (didi !== "62822xxxx-1604xxxxx@g.us"){
							const message = alls?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
							if (alls?.startsWith('aleya') || alls?.startsWith('Aleya') ){
								const text = (list?.slice(5) || body?.slice(5) || group?.slice(5))
								const axios = require('axios');
								async function doPostRequest() {
									let res = await axios.get('https://api.simsimi.net/v2/?text= '+text+'&lc=id&cf=false');
									let data = res.data;
									console.log(data);
									const str2 = data?.success.replace(/Sim.*/ig, "Aleya gita");
									await sock.readMessages([msg.key])
									
									await sendMessageWTyping({text: `${str2}`}, msg.key.remoteJid )
								}
	
								doPostRequest();
								
							}
							else if (alls?.startsWith('al') || alls?.startsWith('Al') ){
								const text = (list?.slice(2) || body?.slice(2) || group?.slice(2))
								const axios = require('axios');
								async function doPostRequest() {
									let res = await axios.get('https://api.simsimi.net/v2/?text= '+text+'&lc=id&cf=false');
									let data = res.data;
									const str2 = data?.success.replace(/sim.*/ig, "Aleya gita");
									await sock.readMessages([msg.key])
									await sendMessageWTyping({text: `${str2}`}, msg.key.remoteJid )
								}
	
								doPostRequest();
								
							}
							else if (alls?.startsWith('git') || alls?.startsWith('Git') ){
								const text = (list?.slice(3) || body?.slice(3) || group?.slice(3))
								const axios = require('axios');
								async function doPostRequest() {
									let res = await axios.get('https://api.simsimi.net/v2/?text= '+text+'&lc=id&cf=false');
									let data = res.data;
									const str2 = data?.success.replace(/sim.*/ig, "Aleya gita");
									await sock.readMessages([msg.key])
									await sock.sendMessage(msg.key.remoteJid, {text: `${str2}`})
								}
	
								doPostRequest();
								
							}
							else if (alls?.startsWith('gita') || alls?.startsWith('Gita') ){
								const text = (list?.slice(4) || body?.slice(4) || group?.slice(4))
								const axios = require('axios');
								async function doPostRequest() {
									let res = await axios.get('https://api.simsimi.net/v2/?text= '+text+'&lc=id&cf=false');
									let data = res.data;
									const str2 = data?.success.replace(/sim.*/ig, "Aleya gita");
									await sock.readMessages([msg.key])
									await sendMessageWTyping({text: `${str2}`}, msg.key.remoteJid )
								}
	
								doPostRequest();
								
							}
							else if (alls?.match(re) || alls?.match(re2) || alls?.match(re4) || alls?.match(re5) || alls?.match(re6) || alls?.match(re7)) {
								const text = (body || group)
								const axios = require('axios');
								async function doPostRequest() {
									let res = await axios.get('https://api.simsimi.net/v2/?text= '+text+'&lc=id&cf=false');
									let data = res.data;
									const str2 = data?.success.replace(/sim.*/ig, "Aleya gita");
									await sock.readMessages([msg.key])
									await sendMessageWTyping({text: `${str2}`}, msg.key.remoteJid )
								}
								doPostRequest();	
								}
							}
						
					}
					
				}
				catch (e) {
					console.log(e);
					}
				}
			
			}
		}
	)

	return sock
}

startSock()
http.listen(port, () => {
	console.log(`server is runn`);
});
