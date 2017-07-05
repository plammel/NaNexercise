function run () {
	
		const
		request = require('request'),
		cheerio = require('cheerio'),
		csv=require('csvtojson')
		csvFilePath='list.csv'
	;
	
	var webs = [];
	
	function Web(name, url, sources) {
		this.name = name; 
		this.url = url;
		this.sources = sources;
	} 

	var readScripts = function (url) {
		request(url, function (error, response, body) {
			var $ = cheerio.load(body);
			var srcs = [];
			
			$('script').each(function () {
				var src = $(this).attr('src');
				if(src) {
					srcs[srcs.length] = src;
				}
			});		
		})
	}

	var loadScriptSources = function(websPrint, webs, end, callback) {
		console.log('loadScriptSources ' + webs.length)
		request(webs[0].url, function (error, response, body) {
			var $ = cheerio.load(body);
			var srcs = [];
			
			$('script').each(function () {
				var src = $(this).attr('src');
				if(src) {
					srcs[srcs.length] = src;
				}
			});

			webs[0].sources = srcs;
			console.log('loadScriptSources ' + webs.length + ' > sources loaded');
			
			if (webs.length > 1) {
				return callback(websPrint, webs.slice(1, webs.length+1), end, loadScriptSources);
			} else {
				return printWebs(websPrint);
			}
		})
	}	

	var printWebs = function (webs) {
		console.log('\n' + ' -------- PRINT WEBS -------- ' + '\n');
		console.log(webs);
		
	}

	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		webs[webs.length] = new Web(jsonObj.name, jsonObj.url); 
	})
	.on('done',(error)=>{
		return loadScriptSources(webs, webs, webs.length, loadScriptSources);
	})
}

run();
