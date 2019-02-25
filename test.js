const request = require('sync-request');

const samples = 100;


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

const from = '2019-01-01T06:00:00Z';
const to = '2019-01-30T11:59:59Z';

const fromDate = new Date(from);
const toDate = new Date(to);

const getRandomType = (sampleSet) => {
    let type = null;

    const sum = Object.values(sampleSet).reduce((acc, cur) => acc + cur);
    if (sum === 0) {
        return type;
    }
    
    const randomNum = getRandom(4);
    
    switch(randomNum) {
        case 0:
            if (sampleSet.enters === 0) {
                return getRandomType(sampleSet);
            } else {
                type = 'enter';
                sampleSet.enters--;
            }
            break;
        case 1: 
            if (sampleSet.comments === 0) {
                return getRandomType(sampleSet);
            } else {
                type = 'comment';
                sampleSet.comments--;
            }    
            break;
        case 2:
            if (sampleSet.highfives === 0) {
                return getRandomType(sampleSet);
            } else {
                type = 'highfive';
                sampleSet.highfives--;
            }
            break;
        case 3:
            if (sampleSet.leaves === 0) {
                return getRandomType(sampleSet);
            } else {    
                type = 'leave';
                sampleSet.leaves--;
            }
            break;
    }
    return type;
}

const getRandomUser = () => 'user_' + getRandom(userSamples);
const getRandomMessage = () => 'message_' + getRandom(messageSamples);
const goFiftyFifty = () => getRandom(2);      // 0 or 1 with 50% probability
const getRandomDate = (from, to) => {
    const fromUtc = from.getTime();
    const toUtc = to.getTime();
    return new Date(fromUtc + Math.random() * (toUtc - fromUtc));
}

let res;

console.log('==== Clear Data Response: START ====');
res = request('POST', 'http://localhost:3000/events/clear', { json: {} });
console.log('statusCode = ' + res.statusCode);
console.log('body = ' + res.getBody('utf-8'));
console.log('==== Clear Data Response: END ====');

console.log(`Sample Count = ${samples}`);
console.log(`Randomly assigned types: enters(${enters}), comments(${comments}), highfives(${highfives}), leaves(${leaves})`);
console.log(`${from} = ${fromDate} UTC`);
console.log(`${to} = ${toDate} UTC`);

console.log('sampleSet = ');
console.log(sampleSet);
const stat = {
    day: {},
    hour: {},
    minute: {}
};

for (let i = 0; i < samples; i++) {
    const type = getRandomType(sampleSet);
    if (type === null) {
        console.log(`Sample index(0~${samples}): ${i}`);
    }
    console.log('type = ' + type);
    console.log('sampleSet = ');
    console.log(sampleSet);

    const randomDate = new Date(getRandomDate(fromDate, toDate));
    const dateIso = randomDate.toISOString();

    const event = {
        date: dateIso,
        user: getRandomUser(),
        message: goFiftyFifty() === 0? null: getRandomMessage(),
        otheruser: goFiftyFifty() === 0? null: getRandomUser(),
        type
    };
    console.log(event);

    console.log('==== Submit Event Response: START ====');
    res = request('POST', 'http://localhost:3000/events', { json: event });
    console.log('statusCode = ' + res.statusCode);
    console.log('body = ' + res.getBody('utf-8'));
    console.log('==== Submit Event Response: END ====');
    
    const hour = randomDate.getHours();
    const minute = randomDate.getMinutes();
    const rolledUpByDayDate = new Date(randomDate.setHours(0, 0, 0 , 0));
    const rolledUpByHourDate = new Date(randomDate.setHours(hour, 0, 0, 0));
    const rolledUpByMinuteDate = new Date(randomDate.setHours(hour, minute, 0, 0));

    const rolledUpByDay = rolledUpByDayDate.toISOString();
    const rolledUpByHour = rolledUpByHourDate.toISOString();
    const rolledUpByMinute = rolledUpByMinuteDate.toISOString();

    console.log('iso string       = ' + randomDate.toISOString());
    console.log('rolled up day    = ' + rolledUpByDay);
    console.log('rolled up hour   = ' + rolledUpByHour);
    console.log('rolled up minute = ' + rolledUpByMinute);

    const prop = type + 's';
    console.log('prop = ' + prop);
    if (!stat.day[rolledUpByDay]) {
        stat.day[rolledUpByDay] = {
            enters: 0,
            leaves: 0,
            comments: 0,
            highfives: 0
        };
    }
    stat.day[rolledUpByDay][prop]++;
    
    if (!stat.hour[rolledUpByHour]) {
        stat.hour[rolledUpByHour] = {
            enters: 0,
            leaves: 0,
            comments: 0,
            highfives: 0
        };
    }
    stat.hour[rolledUpByHour][prop]++;
    
    if (!stat.minute[rolledUpByMinute]) {
        stat.minute[rolledUpByMinute] = {
            enters: 0,
            leaves: 0,
            comments: 0,
            highfives: 0
        };
    }
    stat.minute[rolledUpByMinute][prop]++;
}

console.log('stat');
console.log(stat);

console.log('==== List Event Response: START ====');
res = request('GET', `http://localhost:3000/events?from=${from}&to=${to}`);
console.log('statusCode = ' + res.statusCode);
console.log('body: ');
const listEventJson = JSON.parse(res.getBody());
console.log(JSON.stringify(listEventJson, undefined, 4));
console.log('==== List Event Response: END ====');
if (listEventJson.events.length === samples) {
    console.log('SUCCESS: The number of events in ListEvent response is matching with the sample size');
} else {
    console.log('ERROR: The number of events in ListEvent response does NOT match with the sample size');
}


const timeframes = ['day', 'hour', 'minute'];
timeframes.forEach(timeframe => {
    console.log('==== Event Summary Response: START ====');
    res = request('GET', `http://localhost:3000/events/summary?from=${from}&to=${to}&by=${timeframe}`);
    // console.log('statusCode = ' + res.statusCode);
    // console.log('body: ');
    const summaryEventJson = JSON.parse(res.getBody());
    // console.log(JSON.stringify(summaryEventJson, undefined, 4));
    console.log('==== Event Summary Response: END ====');
    let success = true;
    summaryEventJson.events.forEach(event => {
        // console.log('event');
        // console.log(event);
        const statItem = stat[timeframe][event.date];
        // console.log('statItem');
        // console.log(statItem);

        Object.keys(statItem).forEach(key => {
            if (statItem[key] !== parseInt(event[key])) {
                success = false;
                console.log('ERROR: Expected stat and response from event summary does NOT match');
            } else {
                // console.log('SUCCESS');
            }
        })
    });
    if (success) {
        console.log(`For timeframe-${timeframe}, the test is SUCCESS`);
    } else {
        console.log(`For timeframe-${timeframe}, the test is FAILURE`);
    }
});
