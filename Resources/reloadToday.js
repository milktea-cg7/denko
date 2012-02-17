function reloadToday() {
	// 電力API
	if (Ti.Network.online == false) {
		alert("network error");
	} else {
		var d = new Date();
		var ymd = (d.getFullYear()) + "/" + (d.getMonth() + 1) + "/" + (d.getDate());
		var url = "http://tepco-usage-api.appspot.com/" + ymd + ".json";
		var httpClient = Ti.Network.createHTTPClient();

		// connect
		httpClient.open("GET", url, false);

		// onload
		httpClient.onload = function() {
			tableView.data = [];
			winToday.title = ymd + "の消費電力";
			var json = JSON.parse(httpClient.responseText);
			if (json.length > 0) {
				for (var i = json.length - 1; i >= 0; i--) {
					var per = Math.round(json[i].usage / json[i].capacity * 100);
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
						text:json[i].hour + "時 " + per + "%",
						left:64, top:8, 
						height:16
					}));
					row.add(Ti.UI.createLabel({
						text:json[i].usage + "万kW / " + json[i].capacity + "万kW",
						left:64, top:32, 
						height:16
					}));
	
					// テーブルに追加
					tableView.appendRow(row);
				}
			} else {
				// テーブルのレコードデータ作成
				var row = Ti.UI.createTableViewRow();
				row.className = "energy";
				row.height = 64;
				row.add(Ti.UI.createImageView({
					image:"",
					left:8, top:8, 
					width:48, height:48
				}));
				row.add(Ti.UI.createLabel({
					text:"none data",
					left:64, top:8, 
					height:16
				}));
				row.add(Ti.UI.createLabel({
					text:"----万kW / ----万kW",
					left:64, top:32, 
					height:16
				}));

				// テーブルに追加
				tableView.appendRow(row);
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

