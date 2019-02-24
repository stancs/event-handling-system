#bin/bash
curl -H "Content-Type: application/json" -X POST -d '{"date": "1995-10-01T09:00:00Z", "user": "Doc", "type": "enter"}' http://localhost:3000/events

