const request = require('request');

const samples = 100;

const quarter = Math.floor(samples * 0.25);
const maxEnters = quarter;
const maxHighfives = quarter;
const maxLeaves = quarter;

const getRandom = max => Math.floor(Math.random() * max);

const enters = getRandom(maxEnters);
const highfives = getRandom(maxHighfives);
const leaves = getRandom(maxLeaves);
const comments = samples - enters - highfives - leaves;
const sampleSet = {
    enters,
    comments,
    highfives,
    leaves
};

const userSamples = 100;
const messageSamples = 1000;

const from = '2019-01-01T00:00:00Z';
const to = '2019-01-30T11:59:59Z';

const fromDate = new Date(from);
const toDate = new Date(to);

const getRandomType = (sampleSet) => {
    const randomNum = getRandom(4);
    let type = '';
    switch(randomNum) {
        case 0:
            type = 'enter';
            sampleSet.enters--;
            break;
        case 1: 
            type = 'comment';
            sampleSet.comments--;
            break;
        case 2:
            type = 'highfive';
            sampleSet.highfives--;
            break;
        case 3:
            type = 'leave';
            sampleSet.leaves--;
            break;
    }
    return {type, sampleSet};
}

const getRandomUser = 'user_' + getRandom(userSamples);
const getRandomMessage = 'message_' + getRandom(messageSamples);
const goFiftyFifty = () => getRandom(2);      // 0 or 1 with 50% probability
const getRandomDate = (from, to) => {
    const fromUtc = from.getTime();
    const toUtc = to.getTime();
    return new Date(fromUtc + Math.random() * (toUtc - fromUtc));
}

console.log(`Sample Count = ${samples}`);
console.log(`Randomly assigned types: enters(${enters}), comments(${comments}), highfives(${highfives}), leaves(${leaves})`);
console.log(`${from} = ${fromDate} UTC`);
console.log(`${to} = ${toDate} UTC`);

const event = {
    date: getRandomDate(fromDate, toDate).toISOString(),
    user: getRandomUser,
    type: getRandomType(sampleSet).type,
    message: goFiftyFifty() === 0? null: getRandomMessage,
    otheruser: goFiftyFifty() === 0? null: getRandomUser
};
console.log(event);
// for (let i = 0; i < samples; i++) {
// }

request.post('http://localhost:3000/events', event, (error, response, body) => {
    console.log('==== Submit Event Response ====');
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
})

// request(`http://localhost:3000/events?from=${from}&to=${to}`, (error, response, body) => {
//     console.log('==== List Event Response ====');
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);
//     console.log('body:', body);    
// });

// const timeframe = 'hour';

// request(`http://localhost:3000/events/summary?from=${from}&to=${to}&by=${timeframe}`, (error, response, body) => {
//     console.log('==== Event Summary Response ====');
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);
//     console.log('body:', body);
// })

// request(`http://localhost:3000/clear`, (error, response, body) => {
//     console.log('==== Clear Data Response ====');
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);
//     console.log('body:', body);
// })