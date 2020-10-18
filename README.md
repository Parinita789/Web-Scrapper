# Web-Scrapper
## Description:

Crawling popular blogging website https://medium.com to find all possible hyperlinks present within the website asynchronously. Maintaining concurrency of 5 request without using ​ throttled-request​ package to limit concurrency or any external scraping or ​ async​ library.

## Technologies Used:
1. Node.js
2. MongoDb

## Project Setup:
1. Install Node.js
2. Install MongoDB
3. Clone the repository
4. Open the cloned project in the terminal
5. Run command `npm install`
6. Run command `node server.js`

----------------------------------------------
            ## Design
----------------------------------------------

1. Store the https://medium.com url in DB and marked it as non-visited url.
2. Enter into a while loop (will exit only when there is no non-visited url in DB.)
- Fetch 10 non-visited urls from the DB at a time(for avoiding heap out of memory exception).
- Loop on all of the child urls fetched
    - For each url check with semaphore and make 5 concurrent request to deepVisitUrl function.
- Sleep for 2s 
    
 3. deepVisitUrl functionalities:
    - Make a GET request to the parentUrl(coming as argument in to the function) and extract all of the hyperlinks and save all the unique params to DB
    - For each child urls check
       - If url already in DB then increase the count.
       - Store the url in DB marked as unvisited.
    - Mark the parentUrl as visited.
    
 4. Repeat step 2 until all urls in Db are visited.   
    
