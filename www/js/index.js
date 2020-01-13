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
	deviceNumber;

var textStyles = {
	"default": {
		fontFamily: "Arial",
		fontSize: "12px",
		fill: "#cccccc",
		align: "left"
	},
	"devicename": {
		fontSize: "24px",
		fontStyle: "bold",
		fill: "#ff8888",
		align: "left"
	},
	"ms": {
		fontSize: "16px",
		fontStyle: "italic",
		fill: "#4488ff",
		align: "left"
	},
	"pixi": {
		fontSize: "16px",
		fill: "#efefef",
		align: "left"
	}
}
var battery = {
    service: "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
    level: "beb5483e-36e1-4688-b7f5-ea07361b26a8"
};

var app = {
    initiliaze: function() {
		pixiApp = new PIXI.Application(x, y, {backgroundColor : 0xFFFFFF});
		document.body.appendChild(pixiApp.view);
		document.addEventListener('deviceready', this.onDeviceReady, false);
		this.createButtons();
		this.restartValues();
    },
	restartValues: function(){
        temperature = new MultiStyleText("", textStyles);
		temperature.x = x * 0.25;
		temperature.y = y * 0.30;
		temperature.anchor.set(0.5);
		pixiApp.stage.addChild(temperature);

		humidity = new MultiStyleText("", textStyles);
		humidity.x = x * 0.75;
		humidity.y = y * 0.30;
		humidity.anchor.set(0.5);
		pixiApp.stage.addChild(humidity);

		co = new MultiStyleText("", textStyles);
		co.x = x * 0.25;
		co.y = y * 0.50;
		co.anchor.set(0.5);
		pixiApp.stage.addChild(co);

		butan = new MultiStyleText("", textStyles);
		butan.x = x * 0.75;
		butan.y = y * 0.50;
		butan.anchor.set(0.5);
		pixiApp.stage.addChild(butan);

		clock = new MultiStyleText("", textStyles);
		clock.x = x * 0.25;
		clock.y = y * 0.10;
		clock.anchor.set(0.5);
		pixiApp.stage.addChild(clock);

		forecast = new MultiStyleText("", textStyles);
		forecast.x = x * 0.75;
		forecast.y = y * 0.10;
		forecast.anchor.set(0.5);
		pixiApp.stage.addChild(forecast);

		qualityPics = new MultiStyleText("", textStyles);
		qualityPics.x = x * 0.25;
		qualityPics.y = y * 0.70;
		qualityPics.anchor.set(0.5);
		pixiApp.stage.addChild(qualityPics);

		qualityText = new MultiStyleText("", textStyles);
		qualityText.x = x * 0.75;
		qualityText.y = y * 0.70;
		qualityText.anchor.set(0.5);
		pixiApp.stage.addChild(qualityText);
	},
	createButtons: function(){
		disconnectButton = new MultiStyleText("disconnect", textStyles);
		disconnectButton.x = x * 0.5;
		disconnectButton.y = y * 0.95;
		disconnectButton.anchor.set(0.5);
		disconnectButton.interactive = true;
		disconnectButton.buttonMode = true;
		disconnectButton
					.on('touchstart', app.disconnect)
					.on('touchend', app.buttonsUp);
		pixiApp.stage.addChild(disconnectButton);

		refreshButton = new MultiStyleText("refresh", textStyles);
		refreshButton.x = x * 0.5;
		refreshButton.y = y * 0.95;
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
        deviceList = []; // empties the list
		deviceNumber = 0;
        // scan for all devices
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        console.log(JSON.stringify(device));
        var listItem = new MultiStyleText("", textStyles);
        var html = '<devicename>' + device.name + '</devicename>\n' +
               'RSSI: <pixi>' + device.rssi + '</pixi><ms>||' +
                device.id + '</ms>';

        listItem.id = device.id;  // TODO
        listItem.text = html;
		listItem.x = 0;
		listItem.y = (y / 5) * (deviceNumber++);
		listItem.interactive = true;
		listItem.buttonMode = true;
		listItem
				.on('touchstart', app.connect)
				.on('touchend', app.buttonsUp);
        deviceList.push(listItem);
		pixiApp.stage.addChild(listItem);

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
                // TODO check if we have the battery service
                // TODO check if the battery service can notify us
                //ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError);
                disconnectButton.id = deviceId;
                app.showDetailPage();
				ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError);
            };
		alert("Try to connect " + deviceId);
        ble.connect(deviceId, onConnect, app.onError);
    },
    onBatteryLevelChange: function(data) {
        var message = new Uint8Array(data);
 		var message1 = String.fromCharCode.apply(null, message);
		var valueList = message1.split("#");
        //var a = new Uint8Array(data);
        temperature.text = valueList[0];
		humidity.text = valueList[1];
		co.text = valueList[2];
		butan.text = valueList[3];
		clock.text = 1;
		forecast.text = 2;
		qualityPics.text = 3;
		qualityText.text = 4;
    },
    readBatteryState: function(event) {
        console.log("readBatteryState");
        var deviceId = event.target.dataset.deviceId;
        ble.read(deviceId, battery.service, battery.level, app.onReadBatteryLevel, app.onError);
    },
    onReadBatteryLevel: function(data) {
        console.log(data);
        var message = JSON.stringify(data);
		var valueList = message.split("#");
        //var a = new Uint8Array(data);
        temperature.text = valueList[0];
		humidity.text = valueList[1];
		co.text = valueList[2];
		butan.text = valueList[3];
		clock.text = 1;
		forecast.text = 2;
		qualityPics.text = 3;
		qualityText.text = 4;
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
		disconnectButton.alpha = 1;
		disconnectButton.buttonMode = true;
		disconnectButton.interactive = true;

		refreshButton.alpha = 0;
		refreshButton.buttonMode = false;
		refreshButton.interactive = false;
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};

window.onload = function(){
	app.initiliaze();
}
