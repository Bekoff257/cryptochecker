const Telegraf = require('telegraf');
const axios = require('axios')
require('dotenv').config();
const TOKEN=process.env.TOKEN

const bot = new Telegraf('6256425639:AAHkwmcst9kOvIUaR-CvjfaPlzySRWWUOBc');

const apiKey = '26ccc30ad068a5408d97a3f157ede8d4e15db88e30b5b94e829db82385acd94f';

bot.command('start', ctx => {
    sendStartMessage(ctx);
})

bot.action('start', ctx => {
    ctx.deleteMessage();
    sendStartMessage(ctx);
})

function sendStartMessage(ctx){
    let startMessage = `Assalomu Alaykum, xush kelibsiz, bu bot sizga crytpocrency narxlari haqida malumot beradi`;
    bot.telegram.sendMessage(ctx.chat.id, startMessage,
        {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "Kripto Narxlari", callback_data: 'price'}
                ],
                [
                    {text: "Coin Market Cap", url: 'https://coinmarketcap.com/'}
                ],
            ]
        }
    })
}

bot.action('price', ctx => {
    let priceMessage = `Narxlar Haqida Ma'lumot Oling. Quyidagi kriptovalyutalardan birini tanlang`;
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, priceMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "BTC", callback_data: 'price-BTC'},
                    {text: "ETH", callback_data: 'price-ETH'}
                ],
                [
                    {text: "BCH", callback_data: 'price-BCH'},
                    {text: "LTC", callback_data: 'price-LTC'}
                ],
                [
                    {text: "Menyuga qaytish", callback_data: 'start'},
                ],
            ]
        }
    })
})

let priceActionList = ['price-BTC', 'price-ETH', 'price-BCH', 'price-LTC'];
bot.action(priceActionList, async ctx => {
    console.log(ctx.match);
    let symbol = ctx.match.split('-')[1];
    console.log(symbol);

    try{
        let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey}`)
        let data = res.data.DISPLAY[symbol].USD
        

        console.log(data);

        let message = 

`
Kripto-Valyuta: ${symbol}
Narxi: ${data.PRICE}
Ochish: ${data.OPENDAY}
Balandligi: ${data.HIGHDAY}
Pastligi: ${data.LOWDAY}
Ta'minot: ${data.SUPPLY}
Market Cap: ${data.MKTCAP}
`;

ctx.deleteMessage();
bot.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
        inline_keyboard: [
            [
                {text: 'Narxlarga qaytish', callback_data: 'price'}
            ]
        ]
    }
})
    }catch(err){
        console.log(err);
    }
})

// https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR&api_key=26ccc30ad068a5408d97a3f157ede8d4e15db88e30b5b94e829db82385acd94f
bot.launch();

