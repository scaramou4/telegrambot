const getRates = require("./exchange_rates");
const TelegramAPI = require('node-telegram-bot-api');
const token = '5970057015:AAGRrSbEauXnm24AHJgOcSk2Ke39luhdhyk';
const fs = require ('fs');
const bot = new TelegramAPI(token, {polling: true});
let currencyCode = 'USD';
let lastDate = '2022-12-21';
const start = () => {

    const currency = (chatId) => {
        const buttons = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text: 'USD', callback_data: 'USD'}, {text: 'EUR', callback_data: 'EUR'}, {text: 'UZS', callback_data: 'UZS'}],
                    [{text: 'GBP', callback_data: 'GBP'}, {text: 'BGN', callback_data: 'BGN'}, {text: 'KZT', callback_data: 'KZT'}],
                    [{text: 'BYN', callback_data: 'BYN'}, {text: 'KGS', callback_data: 'KGS'}, {text: 'CAD', callback_data: 'CAD'}],
                    [{text: 'TRY', callback_data: 'TRY'}, {text: 'CHF', callback_data: 'CHF'}, {text: 'JPY', callback_data: 'JPY'}]
                ]
            })
        }
        return bot.sendMessage(chatId, 'Выберите валюту', buttons);
    };

    bot.setMyCommands([
        {command: '/start', description: 'Начать'},
        {command: '/info', description: 'Информация о курсах'},
        {command: '/currency', description: 'Выбрать валюту'},
    ])

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        currencyCode = msg.data;
        return bot.sendMessage(chatId, `Выбрана валюта ${currencyCode}.\nВведите сумму:`);
    });

    bot.on('message', async msg => {
        //обновление файла
        let today = new Date();
        function formatDate(date) {
            var dd = date.getDate();
            if (dd < 10) dd = '0' + dd;
            var mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;
            var yy = date.getFullYear() ;
            return yy + '-' + mm + '-' + dd;
        }

        //если дата сегодня не равна дате в файле - запускается обновление файла
        let currentDate = formatDate(today);
        if (currentDate !== lastDate) {
            getRates;
            console.log('файл обновлен');
            console.log(`last ${lastDate}, in file ${formatDate(today)}`);
            // вызываем файл и читаем из него данные
            fs.readFile('rates.json', 'utf-8', (_error, data) => {
                messageReply(_error, data, msg);
            });
            lastDate = currentDate;
        }

        // диалог
        async function messageReply(_error, data, msg) {
            const fileData = JSON.parse(data);
            let text = msg.text.replace(/\s/g, '');
            const chatId = msg.chat.id;

            if (text === "/start") {
                // bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c4a/4ce/c4a4ce46-dc17-3777-be23-d29ebbd4e25c/12.jpg');
                await bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name}`);
                return currency(chatId);
            }

            if (text === "/info") {
                const ratesDate = fileData.date;
                console.log(fileData.rates);
                const rates = fileData.rates;
                let result = '';
                for (const prop in rates) {
                    result = `${result} \n${prop}: ${rates[prop]}`;
                }

                await bot.sendMessage(chatId, `Загружены курсы на ${ratesDate}`);
                return bot.sendMessage(chatId, `${result}`);
            }

            if (text === "/currency") {
                return currency(chatId);
            }

            if (!isNaN(text)) { // нам ввели число
                const result1 = (text / fileData.rates[currencyCode]).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                const result2 = (text * fileData.rates[currencyCode]).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                text = text.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                await bot.sendMessage(chatId, `${text} ${currencyCode} = ${result1} рублей`);
                return bot.sendMessage(chatId, `${text} рублей = ${result2} ${currencyCode}`);
            }

            return bot.sendMessage(chatId, `Не понял. Введите сумму или команду`);
        }
    });
};

start();