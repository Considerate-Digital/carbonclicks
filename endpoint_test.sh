#! /bin/bash

echo "firing off fake data to endpoint";
curl  \
  -H "Content-Type : application/json" \
  -d '{ 
    "test_data": "hello" 
  }' \
  -v \
  "http://localhost:5173/public/api/analytics" 
  #-H 'Host: localhost' \
  #-4 \
  #-X POST
   

#curl "http://localhost:5173/" -v

