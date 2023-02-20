const randomInt = (start, end) => {
    let number;
    while (true) {
        number = Math.floor(Math.random() * 10 ** Math.ceil(Math.log10(end)))
        if (number >= start && number <= end) return number; 
    }
};

module.exports = randomInt;