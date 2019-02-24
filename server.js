const express = require('express');
const bodyParser = require('body-parser');
const Db = require('./database');
const Logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/events', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;

    Logger.log('info', 'HTTP GET /events', {
        from,
        to
    });

    return Db.listEvents(from, to)
        .then(data => {
            Logger.log('debug', 'ListEvents Response: ', {
                response: data
            });
            res.status(200).json(data);
        })
        .catch(err => {
            Logger.log('error', 'Error in ListEvents', err);
            res.status(500, {
                error: err
            });
        });
});

app.get('/events/summary', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const timeframe = req.query.by;

    Logger.log('info', 'HTTP GET /events/summary', {
        from,
        to,
        timeframe
    });

    return Db.summaryEvents(from, to, timeframe)
        .then(data => {
            Logger.log('debug', 'SummaryEvents Response: ', {
                response: data
            });
            res.status(200).json(data);
        })
        .catch(err => {
            Logger.log('error', 'Error in SummaryEvents', err);
            res.status(500, {
                error: err
            });
        });
});

app.post('/events/clear', (req, res) => {
    return Db.clear()
        .then(data => {
            Logger.log('debug', 'Clear Success');
            res.status(200).json({ status: 'ok' });
        })
        .catch(err => {
            Logger.log('error', 'Error in Clear', err);
            res.status(500, {
                error: err
            });
        });
});

app.post('/events', (req, res) => {
    const { date, user, type, message, otheruser } = req.body;
    
    Logger.log('info', 'HTTP POST /events', {
        date,
        user,
        type,
        message,
        otheruser
    });

    return Db.insert({date, user, type, message, otheruser})
        .then(() => {
            Logger.log('debug', 'InsertEvent Success');
            res.status(200).json({ status: 'ok' });
        })
        .catch(err => {
            Logger.log('error', 'Error in InsertEvent', err);
            res.status(500, {
                error: err
            });
        });
});

app.listen(port, () => {
    Logger.log('info', 'Express server listening on port ' + port);
});
