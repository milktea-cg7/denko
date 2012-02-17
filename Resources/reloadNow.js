function reloadNow() {
	// 電力API
	if (Ti.Network.online == false) {
		alert("network error");
	} else {
		var url = "http://tepco-usage-api.appspot.com/quick.txt";
		var httpClient = Ti.Network.createHTTPClient();

		// connect
		httpClient.open("GET", url, false);

		// onload
		httpClient.onload = function() {
			var tmp = httpClient.responseText.split(",");
			winNow.title = tmp[0] + "の消費電力";

			var per = Math.round(tmp[1] / tmp[2] * 100);
			var rest = 100 - per;
			
			// グラフデータ
			var chd = "t:" + per + "," + rest;

			// グラフカラー
			var chco = "ffaa00,ffff00";
			
			labelNowImage.image = 
				"http://chart.apis.google.com/chart?cht=p3&chf=bg,s,000000&chs=256x256" + 
				"&chd=" + chd + 
				"&chco=" + chco;

			labelNowTime.text = "消費率 " + per + "%";
			labelNowDenki.text = tmp[1] + "万kW / " + tmp[2] + "万kW";
		};

		// error
		httpClient.onerror = function(error) {
			alert(error);
		};

		// send
		httpClient.send();
	}
}
