'use strict';

const config = require('./config');
const database = require('./db/connection');
const db = require('./db/dbOperations');
const Semaphore = require('./semaphore');
const { deepVisitUrl } = require('./scrape');
const sem = new Semaphore(config.MAX_WORKER);

database.connect(config.DB_URL, config.options);

const originalUrl = 'https://medium.com';

async function scrapeUrl(url) {
    try {
        //check url in DB
        let existingUrl = await db.getUrl(url);
        if (!existingUrl) {
            //save url in Db with is_visited marked false
            await db.save(url);
        }

        while (true) {
            // get all non visited url from DB
            let nonVisitedUrls = await db.getNotVisitedUrl();
            // console.log(nonVisitedUrls,  nonVisitedUrls.length)
            if (nonVisitedUrls && nonVisitedUrls.length === 0) {
                return;
            } else {
                for (let i = 0; i < nonVisitedUrls.length; i++) {
                    sem.take((done) => {
                        deepVisitUrl(nonVisitedUrls[i].url).then({}).catch({})
                        setTimeout(done, 2000);
                    })
                }
            }
            await sleep();
        }
    } catch (err) {
        return err;
    }
}

async function sleep() {
    return new Promise((resolve, reject) => setTimeout(resolve, 2000));
}

scrapeUrl(originalUrl)


