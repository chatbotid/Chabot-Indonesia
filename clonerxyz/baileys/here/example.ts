import { Boom } from '@hapi/boom'
//const { MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState } from '../src'
const msgRetryCounterMap: MessageRetryMap = { }
const startSock = async() => {
	const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
	const { version, isLatest } = await fetchLatestBaileysVersion()
	const sock = makeWASocket({
		version,
		printQRInTerminal: true,
		auth: state,
		msgRetryCounterMap,
	})
	const sendMessageWTyping = async(msg: AnyMessageContent, jid: string) => {
		await sock.presenceSubscribe(jid)
		await delay(500)

		await sock.sendPresenceUpdate('composing', jid)
		await delay(2000)

		await sock.sendPresenceUpdate('paused', jid)

		await sock.sendMessage(jid, msg)
	}
	sock.ev.process(
		async(events) => {
			if(events['connection.update']) {
				const update = events['connection.update']
				const { connection, lastDisconnect } = update
				if(connection === 'close') {
					if((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
						startSock()
					} else {
					}
				}
				else if(connection === 'open') {
				
				}
			}
			if(events['messages.upsert']) {
				const upsert = events['messages.upsert']
				console.log('recv messages ', JSON.stringify(upsert, undefined, 2))
				
				if(upsert.type === 'notify') {
					for(const msg of upsert.messages) {

						if(msg.message?.extendedTextMessage?.text === 'menu' || msg.message?.conversation === 'menu' || msg.message?.extendedTextMessage?.text === 'Menu' || msg.message?.conversation === 'Menu' || msg.message?.extendedTextMessage?.text === '.Menu' || msg.message?.conversation === '.Menu' || msg.message?.extendedTextMessage?.text === '.menu' || msg.message?.conversation === '.menu') {
							await sock!.readMessages([msg.key])
							const buttons = [
							  {buttonId: 'id1', buttonText: {displayText: 'about aleya'}, type: 1},
							  {buttonId: 'id2', buttonText: {displayText: 'menus'}, type: 1},
							]
							const buttonMessage = {
								image: {url: '/root/bot/cantik.png'},
 								caption : "𝙡𝙚𝙩 𝙟𝙪𝙨𝙩𝙞𝙘𝙚 𝙗𝙚𝙜𝙪𝙣 𝙩𝙝𝙤𝙪𝙜𝙝𝙩 𝙩𝙝𝙚 𝙝𝙚𝙖𝙫𝙚𝙣𝙨 𝙛𝙖𝙡𝙡",
								footerText: ' ',
								headerType: 4,
								buttons: buttons,
							}
							
							await sendMessageWTyping(buttonMessage, msg.key.remoteJid!)
						}
						else if(msg.message?.buttonsResponseMessage?.selectedButtonId === 'id2' || msg.message?.extendedTextMessage?.text === 'menus' || msg.message?.conversation === 'menus' )
						{
	                    await sock!.readMessages([msg.key])
	                        const sections = [
								{
								title: " ",
								rows: [
									{title:'how to use klik here'},
									{title:'tle aku cinta kamu'},
									{title:'update anime'},
									{title:'tlj arigato'},
									{title:'strg'},
									{title:'rmeme'},
									{title:'nh'},
									{title:'gs siapa yang paling ganteng di indonesia'},
									{title:'ys indonesia raya'},
									{title:'anotes aku sayang kamu'},
									{title:'enotes aku sayang kamu/tapi kamu sayang dia'},
									{title:'rlnotes aku sayang kamu'},
									{title:'cnotes'},
									{title:'notes'},
									{title:'tid siapa nama kamu'},
									{title:'strd'},
									{title:'!profile'},
									{title:'vn'},
									{title:'spk test'},
									{title:'sts'},
									{title:'yt https://youtu.be/tPEE9ZwTmy0'},
									{title:'ymp3 https://youtu.be/tPEE9ZwTmy0'}
								]
								},
							]
							  
							  const listMessage = {
							  text: "𝙡𝙚𝙩 𝙟𝙪𝙨𝙩𝙞𝙘𝙚 𝙗𝙚𝙜𝙪𝙣 𝙩𝙝𝙤𝙪𝙜𝙝𝙩 𝙩𝙝𝙚 𝙝𝙚𝙖𝙫𝙚𝙣𝙨 𝙛𝙖𝙡𝙡",
							  ListType: 2,
							  buttonText : "MENU",
							  sections
							}

							await sendMessageWTyping(listMessage, msg.key.remoteJid!)
						}
                        else if (msg.message?.buttonsResponseMessage?.selectedButtonId === 'id1'){
                            await sock!.readMessages([msg.key])
                            await sendMessageWTyping({text: "𝙏𝙝𝙚 𝙬𝙤𝙧𝙡𝙙 𝙞𝙨𝙣'𝙩 𝙥𝙚𝙧𝙛𝙚𝙘𝙩. 𝘽𝙪𝙩 𝙞𝙩'𝙨 𝙩𝙝𝙚𝙧𝙚 𝙛𝙤𝙧 𝙪𝙨, 𝙙𝙤𝙞𝙣𝙜 𝙩𝙝𝙚 𝙗𝙚𝙨𝙩 𝙞𝙩 𝙘𝙖𝙣. 𝙩𝙝𝙖𝙩'𝙨 𝙬𝙝𝙖𝙩 𝙢𝙖𝙠𝙚𝙨 𝙞𝙩 𝙨𝙤 𝙙𝙖𝙢𝙣 𝙗𝙚𝙖𝙪𝙩𝙞𝙛𝙪𝙡.\n ~ 𝙍𝙤𝙮 𝙈𝙪𝙨𝙩𝙖𝙣𝙜 (𝙁𝙪𝙡𝙡 𝙈𝙚𝙩𝙖𝙡 𝘼𝙡𝙘𝙝𝙚𝙢𝙞𝙨𝙩).\n\n\n 𝙎𝙤 𝙝𝙚𝙧𝙚 𝙞'𝙢 𝘼𝙡𝙚𝙮𝙖 𝙜𝙞𝙩𝙖 𝙩𝙤 𝙘𝙪𝙧𝙚 𝙮𝙤𝙪𝙧 𝙙𝙚𝙥𝙧𝙚𝙨𝙨𝙞𝙤𝙣 \n\n version bot : v1.9.2-lite"}, msg.key.remoteJid!)
                        }
						else if (msg.message?.extendedTextMessage?.text?.startsWith('bl') || msg.message?.conversation?.startsWith('bl')){
							var it = (msg.message?.extendedTextMessage?.text?.slice(3) || msg.message?.conversation?.slice(3))
							await sock!.readMessages([msg.key])
							const id = (''+it+'@s.whatsapp.net')
							const templateButtons = [
								{index: 1, urlButton: {displayText: 'cek disini !!', url: 'https://github.com/adiwajshing/Baileys'}},
								//{index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
								//{index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
							]
							  const buttonMessage = {
								  image: {url: '/root/bot/cantik.png'},
								  caption : "𝙏𝙝𝙚 𝙬𝙤𝙧𝙡𝙙 𝙞𝙨𝙣'𝙩 𝙥𝙚𝙧𝙛𝙚𝙘𝙩. 𝘽𝙪𝙩 𝙞𝙩'𝙨 𝙩𝙝𝙚𝙧𝙚 𝙛𝙤𝙧 𝙪𝙨, 𝙙𝙤𝙞𝙣𝙜 𝙩𝙝𝙚 𝙗𝙚𝙨𝙩 𝙞𝙩 𝙘𝙖𝙣. 𝙩𝙝𝙖𝙩'𝙨 𝙬𝙝𝙖𝙩 𝙢𝙖𝙠𝙚𝙨 𝙞𝙩 𝙨𝙤 𝙙𝙖𝙢𝙣 𝙗𝙚𝙖𝙪𝙩𝙞𝙛𝙪𝙡.\n ~ 𝙍𝙤𝙮 𝙈𝙪𝙨𝙩𝙖𝙣𝙜 (𝙁𝙪𝙡𝙡 𝙈𝙚𝙩𝙖𝙡 𝘼𝙡𝙘𝙝𝙚𝙢𝙞𝙨𝙩).\n\n\n 𝙎𝙤 𝙝𝙚𝙧𝙚 𝙞'𝙢 𝘼𝙡𝙚𝙮𝙖 𝙜𝙞𝙩𝙖 𝙩𝙤 𝙘𝙪𝙧𝙚 𝙮𝙤𝙪𝙧 𝙙𝙚𝙥𝙧𝙚𝙨𝙨𝙞𝙤𝙣 \n\n ",
								  //caption : {displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'},
								  headerType: 4,
								  //url : 'https://4sekawan.xyz',
								  //buttons: buttons,
								  templateButtons: templateButtons,
							  }
							  
							  await sendMessageWTyping(buttonMessage, id)
                        }
					}
				}
			}
		}
	)

	return sock
}

startSock()