async function getRates() {
    const axios = require('axios');
    const fs = require('fs');
    await axios({
        method: 'get',
        url: 'https://www.cbr-xml-daily.ru/latest.js',
        responseType: 'json',
        headers: {"Accept-Encoding": "gzip,deflate, compress"}
    }).then(response => fs.writeFile('rates.json', JSON.stringify(response.data), function (err) {
        console.log((err === null) ? `Загружены курсы на ${response.data.date}` : err);
    }));
}

module.exports = { getRates };