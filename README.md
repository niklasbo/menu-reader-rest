# Menu Reader: REST Service

Handles Client-REST-Calls

## Archive Note :ledger:
Due to Covid-19 pandemic this service was archived. Everybody works remotely so there is no need for this anymore.

## API
| Path          | Parameter   | Function                           |
|---------------|-------------|------------------------------------|
| /             | none        | today overview page                |
| /rate         | date and index | rate a meal page                |
| /vote         | date, index and stars | vote endpoint            |
| /current-week | none        | get the data for current week      |
| /week/:weekId | weekId a number | get the data for given weeknum |


### Run with
        
    node app.js

### Environment Variables 
    
- MONGODB_CONNECTION_STRING
- MONGODB_WEEKDAYMEAL_COLLECTION
- MONGODB_MEAL_RATINGS_COLLECTION
