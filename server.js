const express = require('express')
const app = express()
const AV = require('leanengine')

// setting
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// use leancloud
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
})
app.use(AV.express())

// root router
app.get('/', (req, res) => res.send('hello world !'))

// movie-canlendar
app.get('/movie-calendar', function (req, res) {
	const year = req.query.year
	const month = req.query.month
	const date = req.query.date
	const movieCalendarQuery = new AV.Query('moon_data')

	if (year === undefined || +year !== 2017) {
		res.send({
			error: 'year is undefined or is not legal'
		})
		return false
	}
	if (month === undefined || +month < 1 || +month > 12) {
		res.send({
			error: 'month is undefined or is not legal'
		})
		return false
	}
	if (date === undefined || +date < 1 || +month > 31) {
		res.send({
			error: 'date is undefined or is not legal'
		})
		return false
	}
	movieCalendarQuery.contains('date', month + '月' + date + '日')
	movieCalendarQuery.find().then(function (results) {
		if (results && results.length > 0) {
			res.send(results[0].attributes)
		} else {
			res.send({
				error: 'no data'
			})
		}
	}, function (error) {
		res.send(error)
	});
})

app.listen(3000, function () {
  console.log('API Server is listening on port 3000, Good Luck!')
})