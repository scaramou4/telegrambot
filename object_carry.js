function createButtons(rates) {
    let result = [];
    for (const currency in rates) {
        let row = 0;
        let rowArr = [];
        let button = {};
        for (let i = 0; i < 3; i += 1) {
            button.text = currency;
            button.callback_query = currency;
            rowArr.push(button);
        }
        row += 1;
        result.push(rowArr);
    };

    return result;
};
