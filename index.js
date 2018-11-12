var request = require('request');
require('dotenv').config();
var fs = require('fs');
var csv = require('fast-csv');
const Json2csvParser = require('json2csv').Parser;

var Sentiment = require('sentiment');
var sentiment = new Sentiment();

var apiToken = process.env.API_TOKEN;
var aid = process.env.AID;
const fields = [ 'user', 'score', 'comparative', 'analyzedWords', 'positiveWords', 'negativeWords' ];
const json2csvParser = new Json2csvParser(fields);

var jsonResult = [];
analyze = (userData) => {
	var result = sentiment.analyze(userData['TEXT_FROM_INPUT']);
	var output = {
		user: userData['USER_ID_FROM_INPUT'],
		score: result.score,
		comparative: result.comparative,
		analyzedWords: result.words,
		positiveWords: result.positive,
		negativeWords: result.negative
	};
	jsonResult.push(output);
	parser.resume();
};

var termData = fs.createReadStream('INPUT_FILE_HERE.csv');
var parser = csv
	.fromStream(termData, { headers: true })
	.on('data', function(data) {
		parser.pause();
		analyze(data);
	})
	.on('end', function() {
		var csv = json2csvParser.parse(jsonResult);
		fs.writeFile('./OUTPUT_FILE_HERE.csv', csv);
	});
