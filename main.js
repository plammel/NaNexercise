//module app
var app = {
	
	run: function () {
			const
			request = require('request'),
			cheerio = require('cheerio'),
			csv=require('csvtojson')
			csvFilePath='list.csv'
		;

		function Web(name, url, sources) {
			this.name = name; 
			this.url = url;
			this.sources = sources;
		}
		
		var webs = [];
		
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

		var loadScriptSources = function(websPrint, webs, callback) {
			//log para hacer seguimiento de sincronicidad
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
					return callback(websPrint, webs.slice(1, webs.length+1), loadScriptSources);
				} else {
					return printWebs(websPrint);
				}
			})
		}	

		var printWebs = function (webs) {
			console.log('\n' + ' -------- PRINT WEBS -------- ' + '\n');
			console.log(webs);
		}
		
		return 	csv()
			.fromFile(csvFilePath)
			.on('json',(jsonObj)=>{
				webs[webs.length] = new Web(jsonObj.name, jsonObj.url); 
			})
			.on('done',(error)=>{
				return loadScriptSources(webs, webs, loadScriptSources);
			})
	}
}

app.run();
