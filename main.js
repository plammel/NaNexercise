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

		var loadScriptSources = function(webs, onComplete) {
			this.loaded= 0;
			this.that = this;
			
			webs.forEach((web, i, array) => {
				request(web.url, (error, response, body) => {
					var $ = cheerio.load(body);
					var srcs = [];

					$('script').each(function () {
						var src = $(this).attr('src');
						if(src) {
							srcs[srcs.length] = src;
						}
					});
					web.sources = srcs;
					that.loaded++;
					if(that.loaded == array.length) {
						onComplete(webs);
					}
				});
			});
		}	

		var printWebs = function (webs) {
			console.log('\n' + ' -------- PRINT WEBS -------- ' + '\n');
			console.log(webs);
		}
		
		return csv()
			.fromFile(csvFilePath)
			.on('json',(jsonObj)=>{
				webs[webs.length] = new Web(jsonObj.name, jsonObj.url); 
			})
			.on('done',(error)=>{
				return loadScriptSources(webs, printWebs);
			})
	}
}

app.run();
