// Include
Ti.include("reloadNow.js");
Ti.include("reloadToday.js");
Ti.include("reloadTomorrow.js");


// 背景 黒
Ti.UI.setBackgroundColor("#000000");

// Tab作成
var tabGroup = Ti.UI.createTabGroup();



// 現在情報 Window + Tab
var winNow = Ti.UI.createWindow({  
    title:"winNow",
    backgroundColor:"#000000"
});
var tabNow = Ti.UI.createTab({  
    icon:"KS_nav_ui.png",
    title:"現在",
    window:winNow
});
//ウィンドウの右上のボタンを設定
var rightButton = Titanium.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
});
winNow.rightNavButton = rightButton;
rightButton.addEventListener('click', function(){
	reloadNow();
});
var labelNowImage = Ti.UI.createImageView({
	image:"",
    	textAlign:"center",
	width:256, height:256
});
winNow.add(labelNowImage);
var labelNowTime = Ti.UI.createLabel({
	text:"",
	color:"#ffffff",
	font:{fontSize:20},
	textAlign:"center",
	top:20, 
	width:280, height:20
});
winNow.add(labelNowTime);
var labelNowDenki = Ti.UI.createLabel({
	text:"",
	color:"#ffffff",
	font:{fontSize:20},
	textAlign:"center",
	top:330, 
	width:280, height:20
});
winNow.add(labelNowDenki);



// 本日情報 Window + Tab
var winToday = Ti.UI.createWindow({  
    title:"winToday",
    backgroundColor:"#000000"
});
var tabToday = Ti.UI.createTab({  
    icon:"KS_nav_ui.png",
    title:"本日",
    window:winToday
});

// tableView
var tableView = Ti.UI.createTableView({ data:[] });
winToday.add(tableView);

// tableView Header
var border = Ti.UI.createView({
	backgroundColor:"#576c89",
	height:2,
	bottom:0
});
var tableHeader = Ti.UI.createView({
	backgroundColor:"#e2e7ed",
	width:320,
	height:60
});
tableHeader.add(border);
var arrow = Ti.UI.createView({
	backgroundImage:"../images/whiteArrow.png",
	width:23,
	height:60,
	bottom:10,
	left:20
});
tableHeader.add(arrow);
var statusLabel = Ti.UI.createLabel({
	text:"Pull to reload",
	left:55,
	width:200,
	bottom:30,
	height:"auto",
	color:"#576c89",
	textAlign:"center",
	font:{fontSize:13,fontWeight:"bold"},
	shadowColor:"#999",
	shadowOffset:{x:0,y:1}
});
tableHeader.add(statusLabel);
var lastUpdatedLabel = Ti.UI.createLabel({
	text:"Last Updated: " + (new Date()).getHours() + ":" + (new Date()).getMinutes(),
	left:55,
	width:200,
	bottom:15,
	height:"auto",
	color:"#576c89",
	textAlign:"center",
	font:{fontSize:12},
	shadowColor:"#999",
	shadowOffset:{x:0,y:1}
});
tableHeader.add(lastUpdatedLabel);
var actInd = Ti.UI.createActivityIndicator({
	left:20,
	bottom:13,
	width:30,
	height:30
});
tableHeader.add(actInd);

tableView.headerPullView = tableHeader;

// 再読込処理（PullDownReload）
var pulling = false;
var reloading = false;

function beginReloading() {
	setTimeout(endReloading,2000);
}

function endReloading() {
	reloadToday();

	tableView.setContentInsets({top:0},{animated:true});
	reloading = false;
	lastUpdatedLabel.text = "Last Updated: " + (new Date()).getHours() + ":" + (new Date()).getMinutes();
	statusLabel.text = "Pull down to refresh...";
	actInd.hide();
	arrow.show();
}

tableView.addEventListener('scroll',function(e){
	var offset = e.contentOffset.y;
	if (offset <= -65.0 && !pulling) {
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(-180);
		pulling = true;
		arrow.animate({transform:t,duration:180});
		statusLabel.text = "Release to refresh...";
	} else if (pulling && offset > -65.0 && offset < 0) {
		pulling = false;
		var t = Ti.UI.create2DMatrix();
		arrow.animate({transform:t,duration:180});
		statusLabel.text = "Pull down to refresh...";
	}
});

tableView.addEventListener('scrollEnd',function(e){
	if (pulling && !reloading && e.contentOffset.y <= -65.0) {
		reloading = true;
		pulling = false;
		arrow.hide();
		actInd.show();
		statusLabel.text = "Reloading...";
		tableView.setContentInsets({top:60},{animated:true});
		arrow.transform=Ti.UI.create2DMatrix();
		beginReloading();
	}
});



// 予報情報 Window + Tab
var winTomorrow = Ti.UI.createWindow({  
    title:"winTomorrow",
    backgroundColor:"#000000"
});
var tabTomorrow = Ti.UI.createTab({  
    icon:"KS_nav_ui.png",
    title:"予報",
    window:winTomorrow
});
var tableViewTomorrow = Ti.UI.createTableView({ data:[] });
winTomorrow.add(tableViewTomorrow);



// 初回読込
reloadNow();
reloadToday();
reloadTomorrow();



//  tab add
tabGroup.addTab(tabNow);
tabGroup.addTab(tabToday);
tabGroup.addTab(tabTomorrow);



// tab open
tabGroup.open();
