'use strict'
const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);
var schedule = require('node-schedule');

var internetAvailable = require("internet-available");

var controller = require('./controller');
var schedule = require('node-schedule');
const user = require('../node_layer/routes/user');
var internetAvailable = require("internet-available");
require('../public/js/date');


//time scheduler
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 7)];
rule.hour = 15;
rule.minute = 13;


//delete all data before insert


var id = '';
var location = '';
var brand = '';
var time = '';
var startDate = '';
var today = Date.parse('t').toString('yyyy-M-d');
var type = '';

function woow() {

    internetAvailable().then(function () {
        //     user.deleteTrendsData(function (data) {
        //
        //         if(data===true){
        //             user.getCountryDataToSearch(function (data) {
        //
        //                 for (var i = 0; i < data.recordset.length; i++) {
        //
        //                     id = data.recordset[i].TG_ID;
        //                     location = data.recordset[i].C_CO;
        //                     brand = data.recordset[i].BRAND;
        //                     time = data.recordset[i].TIME_RANGE;
        //                     type = "country";
        //                     timeCal(time);
        //                    var ans= controller.helloGoogleGiveMeTrend(id, brand, location, startDate, today, type,function (data) {
        //
        //                         console.log("wade hariiiiiiiiiiiiiiiiiiiiiiiiiii");
        //                    });
        //
        //                 }
        //             });
        //         }
        //     });


        user.deleteTrendsData().then(function (data) {
            if (data === true) {

                var s = user.getCountryDataToSearch().then(function (res) {
                    for (var i = 0; i < res.recordset.length; i++) {
                        console.log("count ::::::::::::::::: " + i);
                        id = res.recordset[i].TG_ID;
                        location = res.recordset[i].C_CO;
                        brand = res.recordset[i].BRAND;
                        time = res.recordset[i].TIME_RANGE;
                        type = "country";
                        timeCal(time);
                        console.log("runnn : " + i);
                      controller.helloGoogleGiveMeTrend(id, brand, location, startDate, today, type).then(function (data) {
                          // user.getAllProvinceByCountry(location).then(function (res) {
                          //
                          //     for (var k = 0; k < res.recordset.length; k++) {
                          //
                          //         console.log(id+" ++++ "+ brand+" ++++ "+ res.recordset[k].P_CO+" ++++ "+ startDate+" ++++ "+ today+" ++++ "+ type);
                          //         // controller.helloGoogleGiveMeTrend(id, brand, res.recordset[k].P_CO, startDate, today, type).then(function (data) {
                          //         //
                          //         // })
                          //     }
                          // })


                        })

                    }
                    console.log("for loop finished");
                    province();

                })
            }
        })

        refreshTimeUpdata();
        // province().then(function (result) {
        // })


        console.log("Internet available : " + new Date().toLocaleString());
    }).catch(function () {
        console.log("No internet :  " + new Date().toLocaleString());
    });
}


//schedule method
var j = schedule.scheduleJob(rule, function () {

});


function timeCal(time) {
    switch (time) {
        case 'Last Week':
            startDate = Date.today().addWeeks(-1).toString('yyyy-M-d');
            break;
        case 'Last Month':
            startDate = Date.today().addMonths(-1).toString('yyyy-M-d');
            break;
        case 'Last 3 Month':
            startDate = Date.today().addMonths(-3).toString('yyyy-M-d');
            break;
        case 'Last 6 Month':
            startDate = Date.today().addMonths(-6).toString('yyyy-M-d');
            break;
        case 'Last 12 Month':
            startDate = Date.today().addMonths(-12).toString('yyyy-M-d');
            break;
        case 'Last 3 years':
            startDate = Date.today().addYears(-3).toString('yyyy-M-d');
            break;
    }
}


let province = function () {

    return new Promise(function (resolve, reject) {
        user.getCountryDataToSearch().then(function (data) {

            for (var i = 0; i < data.recordset.length; i++) {

                var iid = data.recordset[i].TG_ID;
                location = data.recordset[i].C_CO;
                brand = data.recordset[i].BRAND;
                time = data.recordset[i].TIME_RANGE;
                type = "province";
                timeCal(time);

                user.getAllProvinceByCountry(location).then(function (res) {
                    for (var k = 0; k < res.recordset.length; k++) {

                        console.log(iid+" ++++ "+ brand+" ++++ "+ res.recordset[k].P_CO+" ++++ "+ startDate+" ++++ "+ today+" ++++ "+ type);
                        // controller.helloGoogleGiveMeTrend(id, brand, res.recordset[k].P_CO, startDate, today, type).then(function (data) {
                        //
                        // })
                    }
                })

            }
        })


        resolve(true);

    })

}


function refreshTimeUpdata() {
    var time = new Date().toLocaleTimeString();
   user.updateRefreshTime(today,time).then(function (data) {
       
   })
}

module.exports.woow = woow;