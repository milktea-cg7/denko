function reloadTomorrow() {
	// 電力API
	if (Ti.Network.online == false) {
		alert("network error");
	} else {
		var url = "http://setsuden.yahooapis.jp/v1/Setsuden/electricPowerForecast?appid=ynYRcOmxg66g_IPnv.hvpZhBuOT7lbm36e_WbiNgpDNOsdKwwDQ87hBovlQXfODf&output=json&results=24";
		var httpClient = Ti.Network.createHTTPClient();

		// connect
		httpClient.open("GET", url, false);

		// onload
		httpClient.onload = function() {
			tableViewTomorrow.data = [];
			winTomorrow.title = "電力予報";
			var json = JSON.parse(httpClient.responseText).ElectricPowerForecasts.Forecast;
			for (var i = 0; i < json.length; i++) {
				var per = Math.round(json[i].Usage.$ / json[i].Capacity.$ * 100);
				var rest = 100 - per;
				
				// グラフデータ
				var chd = "t:" + per + "," + rest;
				
				// グラフカラー
				var chco = "ffaa00,ffff00";
			
				var imageUrl = 
					"http://chart.apis.google.com/chart?cht=p&chs=48x48" + 
					"&chd=" + chd + 
					"&chco=" + chco;
				
				// テーブルのレコードデータ作成
				var row = Ti.UI.createTableViewRow();
				row.className = "energy";
				row.height = 64;
				row.add(Ti.UI.createImageView({
					image:imageUrl,
					left:8, top:8, 
					width:48, height:48
				}));
				row.add(Ti.UI.createLabel({
					text:json[i].Hour + "時 " + per + "%",
					left:64, top:8, 
					height:16
				}));
				row.add(Ti.UI.createLabel({
					text:(json[i].Usage.$ / 10000) + "万kW / " + (json[i].Capacity.$ / 10000) + "万kW",
					left:64, top:32, 
					height:16
				}));
				
				// テーブルに追加
				tableViewTomorrow.appendRow(row);
			}
		};
		// error
		httpClient.onerror = function(error) {
			alert(error);
		};

		// send
		httpClient.send();
	}
}

