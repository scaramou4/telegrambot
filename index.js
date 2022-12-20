const getRates = require("./exchange_rates");
const TelegramAPI = require('node-telegram-bot-api');
const token = '5970057015:AAGRrSbEauXnm24AHJgOcSk2Ke39luhdhyk';
const fs = require ('fs');
const bot = new TelegramAPI(token, {polling: true});

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Начать'},
        {command: '/info', description: 'Информация о курсах'},
    ])

    bot.on('message', async msg => {
        //обновление файла
        getRates;

        // вызываем файл и читаем из него данные
        fs.readFile('rates.json', 'utf-8', (_error, data)=> {
            messageReply(_error, data, msg);
        });

        async function messageReply(_error, data, msg) {
            const fileData = JSON.parse(data);
            const rateUZS = fileData.rates.UZS;
            let text = msg.text.replace(/\s/g, '');
            const chatId = msg.chat.id;

            if (text === "/start") {
                // bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c4a/4ce/c4a4ce46-dc17-3777-be23-d29ebbd4e25c/12.jpg');
                return bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name}`);
            }


            if (text === "/info") {
                const ratesDate = fileData.date;
                return bot.sendMessage(chatId, `Загружены курсы на ${ratesDate}`);
            }

            if (!isNaN(text)) { // нам ввели число
                const result1 = (text / rateUZS).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                const result2 = (text * rateUZS).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                text = text.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                await bot.sendMessage(chatId, `${text} сум = ${result1} рублей`);
                return bot.sendMessage(chatId, `${text} рублей = ${result2} сум`);
            }

            return bot.sendMessage(chatId, `Не понял команду`);
        }
    });
};

start();