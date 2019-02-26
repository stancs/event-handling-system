const request = require('sync-request');

// Sample size - Tester can change this number to adjust the number of events that will be stored in the database
const samples = 100;

// Set the numbers of user samples and message samples
const userSamples = 100;
const messageSamples = 1000;

/**
 * Random function: Choose a number between 0, 1, 2, ..., (max-1)
 */
const getRandom = max => Math.floor(Math.random() * max);

// Set random numbers for enters, highfives, leaves, and comments
const maxRatio = 0.30;
const maxNum = Math.floor(samples * maxRatio);
const maxEnters = maxNum;
const maxHighfives = maxNum;
const maxLeaves = maxNum;
const enters = getRandom(maxEnters);
const highfives = getRandom(maxHighfives);
const leaves = getRandom(maxLeaves);
const comments = samples - enters - highfives - leaves;

// Construct a sample set with randomly selected numbers of each type
let sampleSet = {
    enters,
    comments,
    highfives,
    leaves
};

// Set the period (from and to)
const from = '2019-01-01T06:00:00Z';
const to = '2019-01-30T11:59:59Z';

const fromDate = new Date(from);
const toDate = new Date(to);

/**
 * To submit previously assigned event types to the server, counting each type is needed
 * before we send each request to the server.
 * The function returns one of the event type existing in the sample set
 * and decrease the number of that event type to count
 */
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

// Several function to randomly choose user name, messages, and random date
const getRandomUser = () => 'user_' + getRandom(userSamples);
const getRandomMessage = () => 'message_' + getRandom(messageSamples);
const goFiftyFifty = () => getRandom(2);      // 0 or 1 with 50% probability
const getRandomDate = (from, to) => {
    const fromUtc = from.getTime();
    const toUtc = to.getTime();
    return new Date(fromUtc + Math.random() * (toUtc - fromUtc));
}

console.log('========== Test Setup (START) ==========')
console.log(`Sample Count = ${samples}`);
console.log(`Randomly assigned types: enters(${enters}), comments(${comments}), highfives(${highfives}), leaves(${leaves})`);
console.log(`From: ${from} = ${fromDate} UTC`);
console.log(`To  : ${to} = ${toDate} UTC`);
console.log('sampleSet = ');
console.log(sampleSet);
console.log('========== Test Setup (END)    ==========')


// Response object
let res;

// Stat data that stores expected event summary data beforehand
const stat = {
    day: {},
    hour: {},
    minute: {}
};

/**
 * Clear Data Test: Clean all the pre-existing data
 */
console.log('==== Clear Data Response: START ====');
res = request('POST', 'http://localhost:3000/events/clear', { json: {} });
console.log('statusCode = ' + res.statusCode);
console.log('body = ' + res.getBody('utf-8'));
console.log('==== Clear Data Response: END ====');


/**
 * Submit Events Test:
 * Request previously assigned numbers of event types to the server so that those events 
 * will be stored in the database. 
 * Stat is recording the rollup date for day, hour, minute and counting them to compare it with 
 * response data from 'Summary Event' request later
 */
// For each sample, submit the event to the server and record expected stat (by day, hour, minutes)
for (let i = 0; i < samples; i++) {
    const type = getRandomType(sampleSet);
    if (type === null) {
        console.log(`Sample index(0~${samples}): ${i}`);
    }
    // console.log('type = ' + type);
    // console.log('sampleSet = ');
    // console.log(sampleSet);

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

    // console.log('iso string       = ' + randomDate.toISOString());
    // console.log('rolled up day    = ' + rolledUpByDay);
    // console.log('rolled up hour   = ' + rolledUpByHour);
    // console.log('rolled up minute = ' + rolledUpByMinute);

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

// Print out the expected stat data with each roll-up-date (day, hour, minute)
console.log('Expected stat result:');
console.log(stat);

/**
 * List Event Test:
 * Get all the events stored in the server, print them out, and check the numbers are matching
 */
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

/**
 * Summary Event Test:
 * For each roll-up-date type (day, hour, minute), get the response for 'Summary Event' request.
 * Then, compare the response with previously counted stat result to make sure event summary works fine
 */
const timeframes = ['day', 'hour', 'minute'];
timeframes.forEach(timeframe => {
    console.log(`==== Event Summary (${timeframe}) Response: START ====`);
    res = request('GET', `http://localhost:3000/events/summary?from=${from}&to=${to}&by=${timeframe}`);
    console.log('statusCode = ' + res.statusCode);
    // console.log('body: ');
    const summaryEventJson = JSON.parse(res.getBody());
    // Omit this result due to too many lines
    // console.log(JSON.stringify(summaryEventJson, undefined, 4));
    console.log(`==== Event Summary (${timeframe}) Response: END ====`);
    
    // If any of props are different, the overall result is failure
    let success = true;
    
    summaryEventJson.events.forEach(event => {
        const statItem = stat[timeframe][event.date];
        
        Object.keys(statItem).forEach(key => {
            if (statItem[key] !== parseInt(event[key])) {
                success = false;
                console.log('ERROR: Expected stat and response from event summary does NOT match');
            } else {
                // console.log('SUCCESS');
            }
        })
    });

    // Print over-all sucess or failure
    if (success) {
        console.log(`For roll-up-date by ${timeframe}, the test is SUCCESS`);
    } else {
        console.log(`For roll-up-date by ${timeframe}, the test is FAILURE`);
    }
});
