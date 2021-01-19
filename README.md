# menu-reader-rest-service

Handles Client-REST-Calls

## API
| Path          | Parameter   | Function                           |
|---------------|-------------|------------------------------------|
| /             | none        | online check                       |
| /current-week | none        | get the data for current week      |
| /week/:weekId | weekId a number | get the data for given weeknum |


### Run with
        
    node app.js

### Environment Variables 
    
- MONGODB_CONNECTION_STRING
- MONGODB_WEEKDAYMEAL_COLLECTION
