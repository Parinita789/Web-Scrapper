module.exports = {
    DB_URL: 'mongodb://127.0.0.1:27017/web-scrapper' || process.env.DB_URL,
    options: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    },
    MAX_WORKER: 5
}