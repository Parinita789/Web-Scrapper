const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db/dbOperations');

const originalUrl = 'https://medium.com';

exports.deepVisitUrl = (url) => {
    return new Promise((resolve, reject) => {
        console.log(`deep visiting... ${url}`)
        // Get all hyperlinks
        extractHyperLikns(url).then(childUrls => {
            for (let childUrl of childUrls) {
                // check if child url in DB
                db.getUrl(childUrl).then(result => {
                    // if url found in DB then update its count otherwise save in DB
                    if (result) {
                        db.updateCount(childUrl).then({}).catch({});
                    } else {
                        db.save(childUrl).then({}).catch({});
                    }
                }).catch(err => {
                    reject(err);
                });
                // mark url as visited in Db
                db.updateUrl(url).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
            }
        }).catch(err => {
            reject(err);
        });
    })
}

function extractHyperLikns(url) {
    return new Promise((resolve, reject) => {
        let childUrls = [];
        // make http call to url and extract the hyperlinks
        axios(url)
            .then(response => {
                if (response.status !== 200) {
                    reject("Error occurred while fetching data");
                } else {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    $('a').filter(function (output) {
                        let data = $(this);
                        let site = data.attr().href;
                        if (site && site !== '#') {
                            if (site.startsWith('/')) {
                                site = originalUrl + site;
                            }
                            if (site.includes('?')) {
                                let url = site.split('?');
                                childUrls.push(url[0]);
                                saveQueryParams(url[1]).then(result => {

                                })
                            } else {
                                childUrls.push(site);
                            }
                            resolve(childUrls)
                        }
                    });
                }
            })
            .catch(err => {
                reject(err)
            });
    })
}

async function saveQueryParams(queryStrings) {
    return new Promise((resolve, reject) => {
        let errorList = [];
        let successList = [];
        let keywords = queryStrings.includes('&') ? queryStrings.split('&') : [queryStrings];
        keywords.forEach(keyword => {
            keyword = keyword.split('=')[0];
            db.saveKeyword(keyword).then(result => {
                successList.push(keyword)
            }).catch(err => {
                errorList.push(keyword);
            });
        });
        let data = {
            errorList: errorList,
            successList: successList
        }
        resolve(data)
    })
}