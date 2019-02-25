#bin/bash
curl -H "Content-Type: application/json" -X POST -d '{"date": "2019-01-01T09:00:00Z", "user": "Doc", "type": "enter"}' http://localhost:3000/events

