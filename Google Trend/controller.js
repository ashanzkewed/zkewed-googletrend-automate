const {ExploreTrendRequest} = require('./index')
const search = require('./SearchProviders');
var user = require('../node_layer/routes/user');

// 'use strict'


function helloGoogleGiveMeTrend(id, brand, location, startDate, today, type) {
    return new Promise((resolve, reject) => {

        // pullDataFromGoogle('web', id, brand, location, startDate, today, type).then(function (data) {
        //
        //             if(data===true){
        //                 console.log(brand +" -------- "+"web");
        //                 pullDataFromGoogle('images', id, brand, location, startDate, today, type).then(function (data1) {
        //                     if(data1===true){
        //                         console.log(brand +" -------- "+"images");
        //                         pullDataFromGoogle('youtube', id, brand, location, startDate, today, type).then(function (data2) {
        //                             if(data1===true){
        //                                 console.log(brand +" -------- "+"youtube");
        //                                 resolve(true);
        //                             }
        //                         })
        //                     }
        //                 })
        //             }
        // })
        pullDataFromGoogle('web', id, brand, location, startDate, today, type).then(function (data) {
           return pullDataFromGoogle('images', id, brand, location, startDate, today, type);
        }).then(function (data) {
           return pullDataFromGoogle('youtube', id, brand, location, startDate, today, type);
        }).then(function (data)
        {
            console.log('real resolve : '+data);
            resolve(data);
        })

    //     webTrend(id, brand, location, startDate, today, type, function (data) {
    //         if (data === true) {
    //             ImageTrend(id, brand, location, startDate, today, type, function (data) {
    //                 if (data === true) {
    //                     YoutubeTrend(id, brand, location, startDate, today, type, function (data) {
    //                         resolve(true);
    //                     });
    //                 }
    //
    //             });
    //         }
    //     });
    });


}


function webTrend(id, brand, location, startDate, today, type, callback) {

}

function ImageTrend(id, brand, location, startDate, today, type, callback) {
    pullDataFromGoogle('images', id, brand, location, startDate, today, type, function (data) {
        callback(data);
    });
}

function YoutubeTrend(id, brand, location, startDate, today, type, callback) {
    pullDataFromGoogle('youtube', id, brand, location, startDate, today, type, function (data) {
        callback(data);
    });
}


 function pullDataFromGoogle(searchType, id, brand, location, startDate, today, type) {
    return new Promise((resolve, reject) => {
        var explor = new ExploreTrendRequest();
         explor.searchProvider(searchType)
            .addKeyword(brand, geo = location)
            .between(startDate, today)
            .download().then(csv => {
            // console.log("csv ::::  " + csv)
            console.log("csv toString ::::  " + csv.toString());
            saveTrendData(id, type, csv, searchType, location).then(function (result) {
                // console.log("woow : " + result)
                explor = null;
                resolve(result);

            })


        }).catch(error => {
            explor = null;
            console.log('[!] Failed fetching csv data due to an error', error)
        })
    })


}


var saveTrendData = function (id, type, csv, searchType, location) {
    return new Promise(function (resolve, reject) {
        if (type === 'country') {


            if (searchType === 'web') {
                // console.log(searchType + " === " + location + "====" + id);
                var ans = '';
                for (var i = 1; i < csv.length; i++) {
                    var time = csv[i][0];
                    var trend = csv[i][1];
                    user.saveCountryWebTrends(id, time, trend).then(function (data) {
                        // console.log('wwwwwwwwwwwwwwwwww : ' + data);
                    })
                }
                resolve(true)

            } else if (searchType === 'images') {
                // console.log(searchType + " === " + location + "====" + id);
                var ans = '';
                for (var i = 1; i < csv.length; i++) {
                    var time = csv[i][0];
                    var trend = csv[i][1];
                    user.saveCountryImgTrends(id, time, trend).then(function (data) {
                        // console.log('iiiiiiiiiiiiiiiiiiii  : ' + data);
                    })

                }
                resolve(true)

            } else if (searchType === 'youtube') {
                // console.log(searchType + " === " + location + "====" + id);
                var ans = '';
                for (var i = 1; i < csv.length; i++) {
                    var time = csv[i][0];
                    var trend = csv[i][1];
                    user.saveCountryYoutubeTrends(id, time, trend).then(function (data) {
                        // console.log('yyyyyyyyyyyyyyyyy : ' + data);
                    })

                }
                resolve(true)

            }


        } else if (type === 'province') {
            if (searchType === 'web') {
                console.log(searchType + " === " + location + "====" + id);

            } else if (searchType === 'images') {
                console.log(searchType + " === " + location + "====" + id);

            } else if (searchType === 'youtube') {
                console.log(searchType + " === " + location + "====" + id);
            }


        } else if (type === 'district') {
            if (searchType === 'web') {

            } else if (searchType === 'images') {

            } else if (searchType === 'youtube') {

            }

        }

    })

}


module.exports.helloGoogleGiveMeTrend = helloGoogleGiveMeTrend;
