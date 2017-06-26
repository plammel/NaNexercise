const
    request = require('request'),
    cheerio = require('cheerio'),
	fs = require('fs'),
	csv=require('csvtojson')
	inputFile='list.csv'
;
	
function readScripts(url) {
    request(url, function (error, response, body) {
        var $ = cheerio.load(body);
		var srcs = [];
		
		$('script').each(function () {
            var src = $(this).attr('src');
			if(src) {
				srcs[srcs.length] = src;
			}
        });
		
		console.log("src " + srcs.length + ' / ' + $('script').length);
		console.log(srcs);
    })
}

var run = function () {
	var webs = [];
	const csvFilePath='list.csv';

	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		webs[webs.length] = jsonObj; 
	})
	.on('done',(error)=>{		
		for (i in webs) {
			readScripts(webs[i]);
		}
	})
	
}

run();