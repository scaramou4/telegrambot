const getRates = require("./exchange_rates");
const TelegramAPI = require('node-telegram-bot-api');
const token = '5970057015:AAGRrSbEauXnm24AHJgOcSk2Ke39luhdhyk';

const bot = new TelegramAPI(token, {polling: true});

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начать'},
        {command: '/time', description: 'Текущее вермя'},
    ])

    bot.on('message', async msg => {
        let text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            // bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c4a/4ce/c4a4ce46-dc17-3777-be23-d29ebbd4e25c/12.jpg');
            return bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name}`);
        }


        if (text === "/time") {
            const today = new Date();
            const now = today.toLocaleTimeString('ru-ru');
            return bot.sendMessage(chatId, `Текущее время ${now}`);
        }

        if (!isNaN(text)) { // нам ввели число
            // const rates = exchange_rates();
            // const rate = rates.rates.
            // const result1 = (text * rates.sum.rub).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            // const result2 = (text * rates.rub.sum).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            // text = text.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            // await bot.sendMessage(chatId, `${text} сум = ${result1} рублей`);
            // return bot.sendMessage(chatId, `${text} рублей = ${result2} сум`);
        }

        return bot.sendMessage(chatId, `Не понял команду`);
    });
};

getRates().then(start());
