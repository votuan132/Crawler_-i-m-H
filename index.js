const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');


var domain = 'https://diemthi.tuyensinh247.com';

var request = [];
var dataJson = JSON.parse(fs.readFileSync('data.json', {encoding: 'utf8'}));
var DataCrawler_s = dataJson.map(function(item){
	request.push(getData(item));
});

Promise.all(request).then(function(data){
	fs.writeFileSync('crawler.json', JSON.stringify(data), {encoding: 'utf8'});
});


function getData(item){
	return new Promise(function(reject, resolve){
		Crawler(domain + item.url).then(function(data){
			console.log('Đã lấy được điểm của trường '+ item.name);
			var dataReturn = {
				id: item.id,
				code: item.code,
				name: item.name,
				alias: item.alias,
				url: item.url,
				name_kd: item.name_kd,
				diem: data
			};
			reject(dataReturn);
		});

	});
}

// var url = 'https://diemthi.tuyensinh247.com/diem-chuan/dai-hoc-cong-nghiep-det-may-ha-noi-CCM.html';


async function Crawler(url){

	var dataReturn = [];
	await axios.get(url).then(function(data){
		var $ = cheerio.load(data.data);
		var list = $('.bg_white').each(function(){
			var d = $(this).eq(0);
			var td = d.children('td');
			var data = {
				stt: td.eq(0).text(),
				manghanh: td.eq(1).text(),
				tennghanh: td.eq(2).text(),
				khoi: td.eq(3).text(),
				diem: td.eq(4).text(),
				ghichu: td.eq(5).text()
			};

			dataReturn.push(data);
		});
		
	});
	return dataReturn;
}