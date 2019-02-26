# kindhealth
Backend Programming Challenge

## Presentation

[Presentation Slides](https://docs.google.com/presentation/d/1tYVyJ_xcO_kjnk1ZsE3bJOZpqGOEKNKtYGQdv9Y7FzY/edit?usp=sharing)

## Installing related NPM packages

This program uses 3rd party npm packages as below:
- body-parser
- express
- lodash
- pg
- sync-request
- winston

To install these packages, Node.js should be installed (`https://nodejs.org/en/`)

In Node.js environment, run this command

```
npm install
```

## PostgreSQL installation
This application uses PostgresSQL as a database. In Ubuntu, the installation process is like this:

### Install DB
1. Install PostgreSQL and necessary server software
```
sudo apt-get install postgresql postgresql-contrib
```

2. Configure PostgreSQL to startup upon server boot
```
sudo update-rc.d postgresql enable
```

3. Start PostgreSQL
```
sudo service postgresql start
```
[https://www.godaddy.com/garage/how-to-install-postgresql-on-ubuntu-14-04/]


### Password Set
On Windows and OS X, the default password is `postgres`, but in Ubuntu, there is no default password set

1. Run the `psql` command from the postgres user account:
```
sudo -u postgres psql postgres
```

2. Set the password:
```
\password postgres
```
3. Enter the password (I set it as `passwd`)

4. Close psql
```
\q
```

[http://connect.boundlessgeo.com/docs/suite/4.6/dataadmin/pgGettingStarted/firstconnect.html
]

## How to start the application
To start the server, the user can enter 'npm start' 

(default log level is `info`)
```
administrator@lydia:~/code/coding-exercise/backend-challenge-kh$ npm start

> backend-challenge-kh@1.0.0 start /home/administrator/code/coding-exercise/backend-challenge-kh
> PGHOST='localhost' PGUSER='postgres' PGDATABASE='postgres' PGPASSWORD='passwd' PGPORT=5432 node server.js

info: Express server listening on port 3000 {"timestamp":"2019-02-25 06:22:46"}
info: Database connected {"timestamp":"2019-02-25 06:22:46"}
```

For development purpose, 'npm run debug' would start the server with `debug` log level.

```
administrator@lydia:~/code/coding-exercise/backend-challenge-kh$ npm run debug

> backend-challenge-kh@1.0.0 debug /home/administrator/code/coding-exercise/backend-challenge-kh
> LOG_LEVEL='debug' npm start


> backend-challenge-kh@1.0.0 start /home/administrator/code/coding-exercise/backend-challenge-kh
> PGHOST='localhost' PGUSER='postgres' PGDATABASE='postgres' PGPASSWORD='passwd' PGPORT=5432 node server.js

info: Express server listening on port 3000 {"timestamp":"2019-02-25 06:25:48"}
info: Database connected {"timestamp":"2019-02-25 06:25:48"}
debug: Create Table {"timestamp":"2019-02-25 06:25:48"}
debug: SQL: CREATE TABLE IF NOT EXISTS event(
            event_id serial PRIMARY KEY,
            date TIMESTAMP WITH TIME ZONE NOT NULL,
            "user" VARCHAR(50) NOT NULL,
            type VARCHAR(50) NOT NULL,
            message VARCHAR(355),
            otheruser VARCHAR (50)
        ); {"timestamp":"2019-02-25 06:25:48"}
debug: DB Query Success {"timestamp":"2019-02-25 06:25:48"}

```

## How to run the test suite

### Individual test script
`/script` folder contains bash shell script files to run individual HTTP GET/POST requests on the local server. 

| shell script     | Test                 | Comments                                |
| -----------------|:--------------------:| ---------------------------------------:|
| event.sh         | Submit Event         |                                         |
| event-error.sh   | Submit Event(error)  | POST parameter is missing (Failure test)|
| clear.sh         | Clear Data           |                                         |
| list.sh          | List Events          |                                         |
| list-error.sh    | List Events(error)   | GET parameter is missing (Failure test) |
| summary.sh       | Event Summary        |                                         |
| summary-error.sh | Event Summary(error) | GET parameter is missing (Failure test) |

[Examples]

```
administrator@lydia:~/code/coding-exercise/backend-challenge-kh/scripts$ ./event.sh 
{"status":"ok"}
```

```
administrator@lydia:~/code/coding-exercise/backend-challenge-kh/scripts$ ./summary.sh 
{"events":[{"date":"2019-01-01T09:00:00.000Z","enters":"1","leaves":"0","comments":"0","highfives":"0"}]}
```

```
administrator@lydia:~/code/coding-exercise/backend-challenge-kh/scripts$ ./summary-error.sh 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Error: Missing Parameter(s)<br> &nbsp; &nbsp;at app.get (/home/administrator/code/coding-exercise/backend-challenge-kh/server.js:46:15)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at next (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/route.js:137:13)<br> &nbsp; &nbsp;at Route.dispatch (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/route.js:112:3)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/layer.js:95:5)<br> &nbsp; &nbsp;at /home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/index.js:281:22<br> &nbsp; &nbsp;at Function.process_params (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/index.js:335:12)<br> &nbsp; &nbsp;at next (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/index.js:275:10)<br> &nbsp; &nbsp;at urlencodedParser (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/body-parser/lib/types/urlencoded.js:91:7)<br> &nbsp; &nbsp;at Layer.handle [as handle_request] (/home/administrator/code/coding-exercise/backend-challenge-kh/node_modules/express/lib/router/layer.js:95:5)</pre>
</body>
</html>
administrator@lydia:~/code/coding-exercise/backend-challenge-kh/scripts$
```

### Batch Test for `Event Summary`
To test `Event Summary` request, plenty of sample data should be stored in advance.

`src/batchTest.js` is generating event data randomly with given sample sizes (default is set as 100) and send HTTP POST request to insert event data to the backend server. There are four types of events-`enter`, `comment`, `highfive`, and `leave`. The batch test script will generate one of these events randomly, and compute the summary beforehand so that the tester can compare it with the `Event Summary` responose.

To run this test script, run `npm run test`

```
administrator@lydia:~/code/coding-exercise/backend-challenge-kh$ npm run test

> backend-challenge-kh@1.0.0 test /home/administrator/code/coding-exercise/backend-challenge-kh
> node src/batchTest.js

========== Test Setup (START) ==========
Sample Count = 100
Randomly assigned types: enters(6), comments(64), highfives(19), leaves(11)
From: 2019-01-01T06:00:00Z = Tue Jan 01 2019 00:00:00 GMT-0600 (Central Standard Time) UTC
To  : 2019-01-30T11:59:59Z = Wed Jan 30 2019 05:59:59 GMT-0600 (Central Standard Time) UTC
sampleSet = 
{ enters: 6, comments: 64, highfives: 19, leaves: 11 }
========== Test Setup (END)    ==========
==== Clear Data Response: START ====
statusCode = 200
body = {"status":"ok"}
==== Clear Data Response: END ====
{ date: '2019-01-23T01:30:33.630Z',
  user: 'user_30',
  message: null,
  otheruser: 'user_52',
  type: 'comment' }
==== Submit Event Response: START ====
statusCode = 200
body = {"status":"ok"}

...

        {
            "date": "2019-01-11T16:36:12.456Z",
            "user": "user_24",
            "type": "comment",
            "message": "message_375"
        }
    ]
}
==== List Event Response: END ====
SUCCESS: The number of events in ListEvent response is matching with the sample size
==== Event Summary (day) Response: START ====
statusCode = 200
==== Event Summary (day) Response: END ====
For roll-up-date by day, the test is SUCCESS
==== Event Summary (hour) Response: START ====
statusCode = 200
==== Event Summary (hour) Response: END ====
For roll-up-date by hour, the test is SUCCESS
==== Event Summary (minute) Response: START ====
statusCode = 200
==== Event Summary (minute) Response: END ====
For roll-up-date by minute, the test is SUCCESS

```


## Note
Due to timezone offset, rolled-up-date might be changed. In the challenge sheet description, it shows that the rolled-up-date for `1985-10-26T09:01:55Z` as below:

- Rolled up date for the day   : `1985-10-26T00:00:00Z`
- Rolled up date for the hour  : `1985-10-26T09:00:00Z`
- Rolled up date for the minute: `1985-10-26T09:01:00Z`

However, this is based on no timezone offset. So this doesn't work when the server is running with active timezone environment.

For example, the timezone in Austin is GMT-06:00. So the time 06:00:00Z UTC means 00:00:00 in AUstin time as you can see as below:
(Left is Date's ISO string and the right one is date description in the current timezone)

```
2019-01-01T06:00:00Z UTC = Tue Jan 01 2019 00:00:00 GMT-0600 (Central Standard Time)
2019-01-30T11:59:59Z UTC = Wed Jan 30 2019 05:59:59 GMT-0600 (Central Standard Time)
```

JavaScript will show date truncation as this:

```
> var a = new Date();
undefined
> a
2019-02-25T14:48:14.445Z
> var b = new Date(a.setHours(0,0,0,0)).toISOString();
undefined
> b
'2019-02-25T06:00:00.000Z'
```

PostgresSQL will do the similar thing with DATE_TRUNC(...) function when time zone is set
(Check the timezone offset is applied as `00:00:00-06`)

```
postgres=# SELECT 
postgres-#             DATE_TRUNC('day', date) as date,
postgres-#             COUNT(CASE type WHEN 'enter' THEN 1 ELSE NULL END) as enters,
postgres-#             COUNT(CASE type WHEN 'leave' THEN 1 ELSE NULL END) as leaves,
postgres-#             COUNT(CASE type WHEN 'comment' THEN 1 ELSE NULL END) as comments,
postgres-#             COUNT(CASE type WHEN 'highfive' THEN 1 ELSE NULL END) as highfives
postgres-#         FROM event WHERE date >= '2019-01-01T00:00:00Z' AND date <= '2019-01-30T23:59:59Z'
postgres-#         GROUP BY DATE_TRUNC('day', date);
          date          | enters | leaves | comments | highfives 
------------------------+--------+--------+----------+-----------
 2019-01-12 00:00:00-06 |      0 |      0 |        2 |         1
 2019-01-14 00:00:00-06 |      1 |      0 |        4 |         2
 2019-01-03 00:00:00-06 |      0 |      0 |        3 |         2
 2019-01-24 00:00:00-06 |      0 |      0 |        4 |         0
 2019-01-25 00:00:00-06 |      1 |      0 |        1 |         1
 2019-01-20 00:00:00-06 |      0 |      0 |        4 |         1
 2019-01-18 00:00:00-06 |      0 |      0 |        2 |         0
 2019-01-04 00:00:00-06 |      0 |      0 |        7 |         0
 2019-01-17 00:00:00-06 |      0 |      0 |        3 |         2
 2019-01-07 00:00:00-06 |      0 |      0 |        2 |         0
 2019-01-19 00:00:00-06 |      0 |      0 |        1 |         0
 2019-01-02 00:00:00-06 |      0 |      0 |        2 |         0
 2019-01-21 00:00:00-06 |      0 |      0 |        6 |         1
 2019-01-08 00:00:00-06 |      0 |      0 |        2 |         1
 2019-01-01 00:00:00-06 |      1 |      0 |        2 |         0
 2019-01-23 00:00:00-06 |      0 |      0 |        2 |         0
 2019-01-06 00:00:00-06 |      0 |      0 |        5 |         2
 2019-01-09 00:00:00-06 |      0 |      0 |        3 |         1
 2019-01-10 00:00:00-06 |      0 |      0 |        4 |         0
 2019-01-29 00:00:00-06 |      0 |      0 |        2 |         1
 2019-01-13 00:00:00-06 |      0 |      0 |        2 |         0
 2019-01-26 00:00:00-06 |      0 |      0 |        3 |         1
 2019-01-11 00:00:00-06 |      0 |      0 |        1 |         1
 2019-01-05 00:00:00-06 |      0 |      0 |        1 |         0
 2019-01-27 00:00:00-06 |      0 |      0 |        1 |         3
 2019-01-22 00:00:00-06 |      1 |      0 |        2 |         0
 2019-01-15 00:00:00-06 |      0 |      0 |        2 |         0
 2019-01-16 00:00:00-06 |      1 |      0 |        1 |         1
(28 rows)
```

So if you run this application in Austin area, the correct rolled-up-date for '1985-10-26T09:01:55Z' wll be like this:

- Rolled up date for the day   : `1985-10-26T06:00:00Z`
- Rolled up date for the hour  : `1985-10-26T09:00:00Z`
- Rolled up date for the minute: `1985-10-26T09:01:00Z`

The statistics and event summary are based on this logic.


