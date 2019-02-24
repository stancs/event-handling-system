const pg = require('pg');
const _ = require('lodash');
const Logger = require('./logger');

const connectionString = process.env.DATABASE_URL 
                        || 'postgres://localhost:5432/postgres';

// Filter out properties with NULL values or event_id key in a object since they are not necessary to be displayed
const filterNullProps = obj => _.omitBy(obj, (value, key) => {
    return _.isNil(value) || key === 'event_id';
});

class Database {
    constructor() {
        this.client = new pg.Client(connectionString);
        this.client.connect()
            .then(() => {
                Logger.log('info', "Database connected");
                return this.createTable();
            })
            .catch(err => {
                Logger.log('error', 'Connection Error: ');
                Logger.log('error', err.stack);
            });
    }

    // createDatabase() {
    //     const createDatabaseSql = `CREATE DATABASE kindhealth;`;
    //     return query(createDatabaseSql);
    // }

    createTable() {
        Logger.log('debug', 'Create Table');
        
        const createTableSql = `CREATE TABLE IF NOT EXISTS event(
            event_id serial PRIMARY KEY,
            date TIMESTAMP NOT NULL,
            "user" VARCHAR(50) NOT NULL,
            type VARCHAR(50) NOT NULL,
            message VARCHAR(355),
            otheruser VARCHAR (50)
        );`;

        Logger.log('debug', `SQL: ${createTableSql}`);

        return this.query(createTableSql);
    }

    insert({date, user, type, message, otheruser}) {
        Logger.log('debug', 'Insert Record');

        const message2 = message? `'${message}'`: 'NULL';
        const otheruser2 = otheruser? `'${otheruser}'`: 'NULL';

        const insertSql = `INSERT INTO event (date, "user", type, message, otheruser)
            VALUES
            ('${date}','${user}','${type}',${message2},${otheruser2});`;

        Logger.log('debug', `SQL: ${insertSql}`);

        return this.query(insertSql);
    }

    clear() {
        Logger.log('debug', 'Clear All Records');

        const clearSql = `DELETE FROM event;`;

        Logger.log('debug', `SQL: ${insertSql}`);

        return this.query(clearSql);
    }

    listEvents(from, to) {
        Logger.log('debug', 'List Events');

        const listEventsSql = `SELECT * 
            FROM event WHERE date >= '${from}' 
                AND date <= '${to}';`;
        
        Logger.log('debug', `SQL: ${listEventsSql}`);

        return this.query(listEventsSql, true);
    }

    summaryEvents(from, to, timeframe) {
        Logger.log('debug', 'Summary Events');

        const summaryEventSql = `SELECT 
            DATE_TRUNC('${timeframe}', date) as date,
            COUNT(CASE type WHEN 'enter' THEN 1 ELSE NULL END) as enters,
            COUNT(CASE type WHEN 'leave' THEN 1 ELSE NULL END) as leaves,
            COUNT(CASE type WHEN 'comment' THEN 1 ELSE NULL END) as comments,
            COUNT(CASE type WHEN 'highfive' THEN 1 ELSE NULL END) as highfives
        FROM event WHERE date >= '${from}' AND date <= '${to}'
        GROUP BY DATE_TRUNC('${timeframe}', date);`;

        Logger.log('debug', `SQL: ${summaryEventSql}`);

        return this.query(summaryEventSql, true);
    }

    query(sql, decoration = false) {
        return this.client.query(sql)
            .then(res => {
                Logger.log('debug', 'DB Query Success');

                return decoration? { events: res.rows.map(item => filterNullProps(item)) }: res.rows;
            })
            .catch(err => {
                Logger.log('error', 'DB Query Error: ');
                Logger.log('error', err.stack);
            });
    }
}

module.exports = new Database();