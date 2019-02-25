# kindhealth
Backend Programming Challenge


## PostgreSQL installation

sudo apt-get install postgresql postgresql-contrib

sudo update-rc.d postgresql enable

sudo service postgresql start

https://www.godaddy.com/garage/how-to-install-postgresql-on-ubuntu-14-04/

But in Ubuntu system, there is no default password set

sudo -u postgres psql postgres
\password postgres

passwd
passwd
\q

```
administrator@allen:~/code/coding-challenge/backend-challenge-kh$ sudo -u postgres psql postgres
psql (10.3 (Ubuntu 10.3-1))
Type "help" for help.

postgres-# \password postgres
Enter new password: 
Enter it again: 
postgres-# \q

```

http://connect.boundlessgeo.com/docs/suite/4.6/dataadmin/pgGettingStarted/firstconnect.html

sudo -i (root)
su - postgres
psql

http://localhost:3000/event/summary?from=2019-02-20T08:08:12.983Z&to=2019-02-20T08:08:13.983Z


PSQL commands
CREATE DATABASE kindhealth;
CREATE TABLE event(
    event_id serial PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    "user" VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    message VARCHAR(355),
    otheruser VARCHAR (50)
);

DROP TABLE event;

INSERT INTO event (date, "user", type)
VALUES
('1995-10-01t09:00:00Z','Doc','enter'),
('1995-10-02t09:00:00Z','Doc2','leave'),
('1995-10-03t09:00:00Z','Doc3','leave'),
('1995-10-04t09:00:00Z','Doc4','comment'),
('1995-10-05t09:00:00Z','Doc5','comment'),
('1995-10-06t09:00:00Z','Doc6','comment'),
('1995-10-07t09:00:00Z','Doc7','highfive'),
('1995-10-08t09:00:00Z','Doc8','highfive'),
('1995-10-09t09:00:00Z','Doc9','highfive'),
('1995-10-10t09:00:00Z','Doc10','highfive');

DELETE FROM event;

SELECT * FROM event WHERE date >= '1995-10-04t08:00:00Z' AND date <= '1995-10-09t10:00:00Z';

SELECT 
    DATE_TRUNC('minute', date),
    COUNT(CASE type WHEN 'enter' THEN 1 ELSE NULL END) as enters,
    COUNT(CASE type WHEN 'leave' THEN 1 ELSE NULL END) as leaves,
    COUNT(CASE type WHEN 'comment' THEN 1 ELSE NULL END) as comments,
    COUNT(CASE type WHEN 'highfive' THEN 1 ELSE NULL END) as highfives
FROM event WHERE date >= '1995-10-01t08:00:00Z' AND date <= '1995-10-14t10:00:00Z'
GROUP BY DATE_TRUNC('minute', date);


