const randomInt = require('./randomInt')

const generateRandomString = (numChar) => {
    let chars1 = [], chars2 = [], chars3 = [];
    for (let i = 0, j = 48; j < 58; i++, j++) chars1[i] = String.fromCharCode(j);
    for (let i = 0, j = 65; j < 91; i++, j++) chars2[i] = String.fromCharCode(j);
    for (let i = 0, j = 97; j < 123; i++, j++) chars3[i] = String.fromCharCode(j);

    let characters = [...chars1, ...chars2, ...chars3];
    let str = []
    
    for (let i = 0; i < numChar; i++) str[i] = characters[randomInt(0, characters.length - 1)];

    return str.join('');
}

module.exports = generateRandomString;