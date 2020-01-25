'use strict';
var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = w.innerWidth  || e.clientWidth  || g.clientWidth,
	y = w.innerHeight || e.clientHeight || g.clientHeight;

var temperature,
	humidity,
	co,
	butan,
	clock,
	forecast,
	qualityPics,
	qualityText,
	pixiApp,
	refreshButton,
	disconnectButton,
	deviceList,
	deviceNumber,
	textList,
	areaList;

var curTime = new Date().getTime(),
	nextTime,
	firstFlag = false;

var textStyles = {
	"default": {
		fontFamily: "Arial",
		fontSize: "16px",
		fill: "#cccccc",
		align: "center"
	},
	"def":{
		fontFamily: "Arial",
		fontSize: "16px",
		fontStyle: "bold",
		fill: "#ff8888",
		align: "center"	
	},
	"devicename": {
		fontSize: "24px",
		fontStyle: "bold",
		fill: "#ff8888",
		align: "center"
	},
	"ms": {
		fontSize: "16px",
		fontStyle: "italic",
		fill: "#4488ff",
		align: "center"
	},
	"pixi": {
		fontSize: "16px",
		fill: "#efefef",
		align: "center"
	},
	"emoji":{
		fontSize: "32px",
		align: "center"
	},
	"clock":{
		fontSize: "16px",
		fill:"#FFFF00",
		align: "center"
	},
	"mk":{
		fontsize: "16px",
		fill: "#000000",
		align: "center"
	},
	"ma":{
		fontsize: "16px",
		fill: "#ff8888",
		align: "center"
	}
}

var battery = {
    service: "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
    level: "beb5483e-36e1-4688-b7f5-ea07361b26a8"
};

var path = "./img/"
var app = {
    initiliaze: function() {
		pixiApp = new PIXI.Application(x, y, {backgroundColor : 0x00ff80});
		document.body.appendChild(pixiApp.view);
		document.addEventListener('deviceready', this.onDeviceReady, false);
		this.createButtons();
		this.restartValues();
    },
	restartValues: function(){
		
		
		var texture = new PIXI.Texture.fromImage(path + "button.png");
		var texture1 = new PIXI.Texture.fromImage(path + "button1.png");
		var texture2 = new PIXI.Texture.fromImage(path + "button2.png");
		var texture3 = new PIXI.Texture.fromImage(path + "button3.png");
		var texture4 = new PIXI.Texture.fromImage(path + "button4.png");
		var texture5 = new PIXI.Texture.fromImage(path + "button5.png");
		var texture6 = new PIXI.Texture.fromImage(path + "button6.png");
		
		areaList = [];
		
		var clockArea = new PIXI.Sprite(texture2);
		clockArea.x = 10;
		clockArea.y = 10;
		clockArea.width  = (x * 0.5) - 20;
		clockArea.height = (y * 0.20) - 20;
		pixiApp.stage.addChild(clockArea);
		areaList.push(clockArea);
		
		var weatherArea = new PIXI.Sprite(texture3);
		weatherArea.x = (x * 0.5) + 10;
		weatherArea.y = 10;
		weatherArea.width  = (x * 0.5) - 20;
		weatherArea.height = (y * 0.20) - 20;
		pixiApp.stage.addChild(weatherArea);
		areaList.push(weatherArea);
		
		var qualityArea = new PIXI.Sprite(texture);
		qualityArea.x = 10;
		qualityArea.y = (y * 0.20) + 10;
		qualityArea.width  = x - 20;
		qualityArea.height = (y * 0.20) - 20;
		pixiApp.stage.addChild(qualityArea);
		areaList.push(qualityArea);
		
		var tempArea = new PIXI.Sprite(texture1);
		tempArea.x = 10;
		tempArea.y = (y * 0.40) + 10;
		tempArea.width = (x * 0.5) - 20;
		tempArea.height = (y * 0.20) - 20;
		pixiApp.stage.addChild(tempArea);
		areaList.push(tempArea);
		
		var humArea = new PIXI.Sprite(texture4);
		humArea.x = (x * 0.5) + 10;
		humArea.y = (y * 0.40) + 10;
		humArea.width = (x * 0.5) - 20;
		humArea.height = (y * 0.20) - 20;
		pixiApp.stage.addChild(humArea);
		areaList.push(humArea);
		
		var coArea = new PIXI.Sprite(texture5);
		coArea.x = 10;
		coArea.y = (y * 0.60) + 10;
		coArea.width = (x * 0.5) - 20;
		coArea.height = (y * 0.20) - 20;
		pixiApp.stage.addChild(coArea);
		areaList.push(coArea);
		
		var butArea = new PIXI.Sprite(texture6);
		butArea.x = (x * 0.5) + 10;
		butArea.y = (y * 0.60) + 10;
		butArea.width = (x * 0.5) - 20;
		butArea.height = (y * 0.20) - 20;
		pixiApp.stage.addChild(butArea);
		areaList.push(butArea);
		
		textList = [];
        temperature = new MultiStyleText("", textStyles);
		temperature.x = x * 0.25;
		temperature.y = y * 0.50;
		temperature.anchor.set(0.5);
		pixiApp.stage.addChild(temperature);
		textList.push(temperature);

		humidity = new MultiStyleText("", textStyles);
		humidity.x = x * 0.75;
		humidity.y = y * 0.50;
		humidity.anchor.set(0.5);
		pixiApp.stage.addChild(humidity);
		textList.push(humidity);

		co = new MultiStyleText("", textStyles);
		co.x = x * 0.25;
		co.y = y * 0.70;
		co.anchor.set(0.5);
		pixiApp.stage.addChild(co);
		textList.push(co);

		butan = new MultiStyleText("", textStyles);
		butan.x = x * 0.75;
		butan.y = y * 0.70;
		butan.anchor.set(0.5);
		pixiApp.stage.addChild(butan);
		textList.push(butan);

		clock = new MultiStyleText("", textStyles);
		clock.x = x * 0.25;
		clock.y = y * 0.10;
		clock.anchor.set(0.5);
		pixiApp.stage.addChild(clock);
		textList.push(clock);

		forecast = new MultiStyleText("", textStyles);
		forecast.x = x * 0.75;
		forecast.y = y * 0.10;
		forecast.anchor.set(0.5);
		pixiApp.stage.addChild(forecast);
		textList.push(forecast);

		qualityPics = new MultiStyleText("", textStyles);
		qualityPics.x = x * 0.25;
		qualityPics.y = y * 0.30;
		qualityPics.anchor.set(0.5);
		pixiApp.stage.addChild(qualityPics);
		textList.push(qualityPics);

		qualityText = new MultiStyleText("", textStyles);
		qualityText.x = x * 0.75;
		qualityText.y = y * 0.30;
		qualityText.anchor.set(0.5);
		pixiApp.stage.addChild(qualityText);
		textList.push(qualityText);
	},
	createButtons: function(){
		var texture7 = new PIXI.Texture.fromImage(path + "button_disconnect.png");
		var texture8 = new PIXI.Texture.fromImage(path + "button_refresh.png");
				
		disconnectButton = new PIXI.Sprite(texture7);
		disconnectButton.x = x * 0.5;
		disconnectButton.y = y * 0.90;
		disconnectButton.width = x - 20;
		disconnectButton.height = (y * 0.15) - 20;
		disconnectButton.anchor.set(0.5);
		disconnectButton.interactive = true;
		disconnectButton.buttonMode = true;
		disconnectButton
					.on('touchstart', app.disconnect)
					.on('touchend', app.buttonsUp);
		pixiApp.stage.addChild(disconnectButton);

		refreshButton = new PIXI.Sprite(texture8);
		refreshButton.x = x * 0.5;
		refreshButton.y = y * 0.90;
		refreshButton.width = x - 20;
		refreshButton.height = (y * 0.15) - 20;
		refreshButton.anchor.set(0.5);
		refreshButton.interactive = true;
		refreshButton.buttonMode = true;
		refreshButton
					.on("touchstart", app.refreshDeviceList)
					.on('touchend', app.buttonsUp);
		pixiApp.stage.addChild(refreshButton);
	},
    onDeviceReady: function() {
        app.refreshDeviceList();
		app.showMainPage();
    },
    refreshDeviceList: function() {
		if(deviceList){		
			deviceList.forEach(function(device){
				pixiApp.stage.removeChild(device);
			});
		}
        deviceList = []; // empties the list
		deviceNumber = 0;
        // scan for all devices
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        console.log(JSON.stringify(device));
        
        var texture1 = new PIXI.Texture.fromImage(path + "button1.png");
        var listButton = new PIXI.Sprite(texture1);
        listButton.x = x * 0.5;
        listButton.y = 2;
        listButton.width = x - 20;
        listButton.anchor.set(0.5);
        listButton.interactive = true;
        listButton.buttonMode = true;
		listButton
				.on('touchstart', app.connect)
				.on('touchend', app.buttonsUp);
				
        deviceList.push(listButton);
		pixiApp.stage.addChild(listButton);
				
        var listItem = new MultiStyleText("", textStyles);
        var html = '<devicename>' + device.name + '</devicename>\n' +
               'RSSI: <ms>' + device.rssi + '</ms>\tID: <ms>' +
                device.id + '</ms>';

        listItem.id = device.id;  // TODO
        listItem.text = html;
		listItem.x = x * 0.5;
		listItem.y = 2;
		listItem.anchor.x = 0.5;
		listItem.interactive = true;
		listItem.buttonMode = true;
		listItem
				.on('touchstart', app.connect)
				.on('touchend', app.buttonsUp);
				
        deviceList.push(listItem);
		pixiApp.stage.addChild(listItem);
		listItem.y += (listItem.height + 10) * deviceNumber++;
		listButton.y = listItem.y + (listItem.height / 2) + 5;
		listButton.height = listItem.height + 6;
		listButton.id = device.id;

    },
	buttonsUp: function(){
		this.data = null; 
		this.isdown = false;
	},
    connect: function(e) {
		this.data = event.data;
		this.isdown = true;
        var deviceId = this.id,
            onConnect = function() {
				alert(deviceId + " entering...");
                disconnectButton.id = deviceId;
                app.showDetailPage();
				app.getWeatherLocation();
				ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError);
            };
		alert("Try to connect " + deviceId);
        ble.connect(deviceId, onConnect, app.onError);
    },
    onBatteryLevelChange: function(data) {
        var message = new Uint8Array(data);
 		var message1 = String.fromCharCode.apply(null, message);
		var valueList = message1.split("#");
        temperature.text = "<mk>Temp\n</mk><def>" + valueList[0] + "°C</def>";
		humidity.text = "<mk>Humidity\n</mk><def>%" + valueList[1] + "</def>";
		co.text = "<mk>CO\n</mk><def>" + valueList[3] + "ppm</def>";
		butan.text = "<mk>BUTANE\n</mk><def>" + valueList[2] + "ppm</def>";
		clock.text = "<clock>" + new Date().getHours() + " : " + new Date().getMinutes() + " : " +
					 	new Date().getSeconds() + "</clock>";
		if(valueList[4][0].toUpperCase() == "G"){
			qualityPics.text = "<mk>Air Quality\n</mk><emoji>😎</emoji>";
			qualityText.text = "<devicename>GOOD</devicename>";		
		}else if(valueList[4][0].toUpperCase() == "N"){
			qualityPics.text = "<mk>Air Quality\n</mk><emoji>😐</emoji>";
			qualityText.text = "<devicename>NORMAL</devicename>";		
		}else if(valueList[4][0].toUpperCase() == "B"){
			qualityPics.text = "<mk>Air Quality\n</mk><emoji>😟</emoji>";
			qualityText.text = "<devicename>BAD</devicename>";
			if(!firstFlag){
				firstFlag = true;
				curTime = new Date().getTime();
				app.notifyUser();
			}
			nextTime = new Date().getTime();
			console.log(nextTime - curTime);
			if(nextTime - curTime >= 300000){
				app.notifyUser();
				curTime = nextTime;
			}
		}
    },
    readBatteryState: function(event) {
        console.log("readBatteryState");
        var deviceId = event.target.dataset.deviceId;
        ble.read(deviceId, battery.service, battery.level, app.onReadBatteryLevel, app.onError);
    },
    onReadBatteryLevel: function(data) {
        var message = new Uint8Array(data);
 		var message1 = String.fromCharCode.apply(null, message);
		var valueList = message1.split("#");
        temperature.text = "<mk>Temp\n</mk><def>" + valueList[0] + "°C</def>";
		humidity.text = "<mk>Humidity\n</mk><def>%" + valueList[1] + "</def>";
		co.text = "<mk>CO\n</mk><def>" + valueList[2] + "ppm</def>";
		butan.text = "<mk>BUTANE\n</mk><def>" + valueList[3] + "ppm</def>";
		clock.text = new Date().getHours() + " : " + new Date().getMinutes() + " : " +
					 new Date().getSeconds();
		if(valueList[4][0].toUpperCase() == "G"){
			qualityPics.text = "Air Quality\n<emoji>😎</emoji>";
			qualityText.text = "GOOD";		
		}else if(valueList[4][0].toUpperCase() == "N"){
			qualityPics.text = "Air Quality\n<emoji>😐</emoji>";
			qualityText.text = "NORMAL";		
		}else if(valueList[4][0].toUpperCase() == "B"){
			qualityPics.text = "Air Quality\n<emoji>😟</emoji>";
			qualityText.text = "BAD";
			nextTime = new Date();
			if(nextTime - curTime >= 300000){
				app.notifyUser();
				curTime = nextTime;
			}
		}
    },
    disconnect: function(event) {
        this.data = event.data;
		this.isdown = true;
		var deviceId = this.id;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        deviceList.forEach(function(device){
			device.alpha = 1;
			device.buttonMode = true;
			device.interactive = true;
		});
		
		areaList.forEach(function(area){
			area.alpha = 0;
		});
		
		textList.forEach(function(text){
			text.alpha = 0;
		});

		disconnectButton.alpha = 0;
		disconnectButton.buttonMode = false;
		disconnectButton.interactive = false;

		refreshButton.alpha = 1;
		refreshButton.buttonMode = true;
		refreshButton.interactive = true;
    },
    showDetailPage: function() {
        deviceList.forEach(function(device){
			device.alpha = 0;
			device.buttonMode = false;
			device.interactive = false;
		});
		
		areaList.forEach(function(area){
			area.alpha = 1;
		});

		textList.forEach(function(text){
			text.alpha = 1;
		});

		disconnectButton.alpha = 1;
		disconnectButton.buttonMode = true;
		disconnectButton.interactive = true;

		refreshButton.alpha = 0;
		refreshButton.buttonMode = false;
		refreshButton.interactive = false;
    },
	getWeatherLocation: function() {

    	navigator.geolocation.getCurrentPosition
    	(app.onWeatherSuccess, app.onWeatherError, { enableHighAccuracy: true });
	},
	onWeatherSuccess: function (position) {

    	var Latitude = position.coords.latitude;
    	var Longitude = position.coords.longitude;

    	app.getWeather(Latitude, Longitude);
	},
	getWeather: function(latitude, longitude){
		var OpenWeatherAppKey = "30248b6896820dd6b6757bfe2e73be1a";
		var queryString =
      		'http://api.openweathermap.org/data/2.5/weather?lat='
      			+ latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';
		app.getJSON(queryString, function(err, data){
			if(err !== null){
				console.log("error")
				forecast.text = "NOT FOUND"
			}else{
				console.log("OK");
				forecast.text = "<mk>" + data.name + "</mk>\n"+
									"<ms>" + Math.floor(5 * (data.main.temp - 32) / 9) + "°C</ms>\n"+
									"<ma>" + data.weather[0].main + "</ma>"
				//alert(data.name + "\n" + data.main.temp + "\n" + data.weather[0].main);
			}
		});
	},
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    },
	onWeatherError: function(error){
    	console.log('code: ' + error.code + '\n' +
        	'message: ' + error.message + '\n');
	},
	getJSON: function(url, callback){
    	var xhr = new XMLHttpRequest();
    	xhr.open('GET', url, true);
    	xhr.responseType = 'json';
    	xhr.onload = function() {
      		var status = xhr.status;
      		if (status === 200) {
        		callback(null, xhr.response);
      		} else {
        		callback(status, xhr.response);
			}
    	};
    	xhr.send();
	},
	notifyUser: function(){
		cordova.plugins.notification.local.schedule({
    		id: 1,
    		title: "Something Wrong",
    		text: "Check your Air Quality!!!\n😟",
			foreground: true,
			icon: path + "logo.jpg"
		});
	}
};

window.onload = function(){
	app.initiliaze();
}
