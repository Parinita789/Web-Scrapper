const { v4: uuidv4 } = require('uuid');
const Url = require('../models/url');
const param = require('../models/param');

exports.getUrl = (url) => {
    return new Promise((resolve, reject) => {
        let query = { url: url }
        Url.findOne(query).then(url => {
            let data = url == null ? false : true;
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

exports.getNotVisitedUrl = () => {
    return new Promise((resolve, reject) => {
        let query = { is_visited: false };
        let options = { url: 1, _id: 0 };
        Url.find(query, options).limit(20).then(urls => {
            resolve(urls)
        }).catch(err => {
            reject(err)
        })
    })
}

exports.updateCount = (url) => {
    return new Promise((resolve, reject) => {
        let query = { url };
        Url.findOne(query).then(result => {
            if (result !== null) {
                let updateData = { $set: { count: result.count + 1 } };
                let options = { upsert: false, new: false};
                Url.findOneAndUpdate(query, updateData, options).then(urls => {
                    resolve('success')
                }).catch(err => {
                    reject(err)
                })
            } else {
                reject('Record not found to update')
            }
        }).catch(err => {
            reject(err);
        })
    })
}

exports.updateUrl = (url) => {
    return new Promise((resolve, reject) => {
        let query = { url };
        Url.findOne(query).then(result => {
            if (result !== null) {
                let updateData = { $set: { is_visited: true } };
                let options = { upsert: false, new: false};
                Url.findOneAndUpdate(query, updateData, options).then(urls => {
                    resolve('success')
                }).catch(err => {
                    reject(err)
                })
            } else {
                reject('Record not found to update')
            }
        }).catch(err => {
            reject(err);
        })
    })
}

exports.save = (url) => {
    return new Promise((resolve, reject) => {
        let query = { url: url }
        Url.findOne(query).then(result => {
            if (result == null) {
                let data = {
                    id: uuidv4(),
                    url: url,
                    is_visited: false
                }
                let newUrl = new Url(data);
                newUrl.save().then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            } else {
                resolve('success')
            }
        }).catch(err => {
            reject(err)
        })
    })
}

exports.saveKeyword = (keyword) => {
    return new Promise((resolve, reject) => {
        let query = { keyword };
        param.findOne(query).then(result => {
            if (!result) {
                let data = {
                    id: uuidv4(),
                    keyword: keyword
                }
                let newKeyword = new param(data);
                newKeyword.save().then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            } else {
                resolve('success')
            }
        }).catch(err => {
            reject(err)
        })
    })
}