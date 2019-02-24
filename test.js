const request = require('request');

const samples = 10;


const maxRatio = 0.30;
const maxNum = Math.floor(samples * maxRatio);
const maxEnters = maxNum;
const maxHighfives = maxNum;
const maxLeaves = maxNum;

const getRandom = max => Math.floor(Math.random() * max);

const enters = getRandom(maxEnters);
const highfives = getRandom(maxHighfives);
const leaves = getRandom(maxLeaves);
const comments = samples - enters - highfives - leaves;
let sampleSet = {
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
    return {type, newSampleSet: sampleSet};
}

const getRandomUser = () => 'user_' + getRandom(userSamples);
const getRandomMessage = () => 'message_' + getRandom(messageSamples);
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


for (let i = 0; i < samples; i++) {
    const {type, newSampleSet} = getRandomType(sampleSet);
    
    console.log('type = ' + type);
    console.log('newSampleSet = ');
    console.log(newSampleSet);

    const event = {
        date: getRandomDate(fromDate, toDate).toISOString(),
        user: getRandomUser(),
        message: goFiftyFifty() === 0? null: getRandomMessage(),
        otheruser: goFiftyFifty() === 0? null: getRandomUser(),
        type
    };
    console.log(event);

    request.post('http://localhost:3000/events', { json: event }, (error, response, body) => {
        console.log('==== Submit Event Response ====');
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
    });
    sampleSet = newSampleSet  
}


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