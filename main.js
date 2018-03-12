const electron = require('electron');
const path = require('path');
const url = require('url');
require('./node_layer/dao/userDao').data();
// SET ENV
process.env.NODE_ENV = 'development';
var automate=require('./Google Trend/Automate');
const user = require('./node_layer/routes/user');
const {app, BrowserWindow, ipcMain} = electron;



// automate.woow();

let mainWindow;

//listen for app to be readyState
app.on('ready', function () {

    //create new window
    mainWindow = new BrowserWindow({
        resizable: false,
        width: 900, height: 600
        // webPreferences: {
        //
        //     nodeIntegration: false
        // }
    });
    //load html file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/dashboard.html'),
        protocol: 'file:',
        slashes: true,
    }));
    // mainWindow.setMenu(null);
});


ipcMain.on('synchronous-message', (event, email, password) => {
    user.findUser(email, password, function (data) {
        if (data === ('success')) {
            event.returnValue = data;

        } else {

        }
    });
})

ipcMain.on('comboData', (event, check) => {
    if (check === "countryData") {
        user.countryData(function (data) {
            event.returnValue = data;
        });
    }
});

ipcMain.on('TableData', (event, check) => {
    if (check === "tableData") {
        user.tableData(function (data) {
            event.returnValue = data;
        });
    }
});
ipcMain.on('selectedComboData', (event, check) => {
    user.selectedComboData(function (data) {
        event.returnValue = data;
    });
});
ipcMain.on('selectedTimeRangeData', (event, check) => {
    user.selectedTimeRangeData(function (data) {
        event.returnValue = data;
    });
});
ipcMain.on('addBrand', (event, brand, newCountry, newTimerange) => {
    user.addBrand(brand, newCountry, newTimerange, function (data) {
        event.returnValue = data;
    });
});
ipcMain.on('ChangeCountryandTimeRange', (event, oldCountry, newCountry, oldTimerange, newTimerange) => {
    user.changeCountryandTimeRange(oldCountry, newCountry, oldTimerange, newTimerange, function (data) {
        event.returnValue = data;
    });
});
ipcMain.on('deleteBrand', (event, brand) => {
    user.deleteBrands(brand, function (data) {
        event.returnValue = data;
    });
});
ipcMain.on('ee', (event, run) => {
   automate.woow();
   event.returnValue='';

});