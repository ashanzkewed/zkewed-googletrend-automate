'use strict'
const sql = require("mssql/msnodesqlv8");

const pool = new sql.ConnectionPool({
    database: 'ZKEWED_GTREND_AUTOMATE',
    server: 'ASHAN',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
})

function data() {
    pool.connect();
}

function getCountryData(callback) {
    pool.request().query('SELECT COUNTRY_NAME FROM T_COUNTRY', (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result);
    })
}

function getTableData(callback) {
    pool.request().query('SELECT * FROM T_GTREND', (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result);
    })
}

function addBrand(brand, newCountry, newTimerange, callback) {
    getCountryCode(newCountry, function (data) {
        var sql = "INSERT INTO T_GTREND (BRAND,C_CO,TIME_RANGE)VALUES('" + brand + "','" + data + "','" + newTimerange + "')";
        pool.request().query(sql, (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            console.log(JSON.stringify(result));
            callback(result);
        })
    });
}


function getSelectedComboData(callback) {
    pool.request().query('select COUNTRY_NAME from T_COUNTRY t1,T_GTREND t2 where t1.C_CO=t2.C_CO', (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result);
    })
}

function getSelectedTimeRangeData(callback) {
    pool.request().query('select distinct TIME_RANGE from T_GTREND', (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result);
    })
}

function changeCountryTimeRange(oldCountry, newCountry, oldTimerange, newTimerange, callback) {
    //we have to find out newCountry name from C_CO code,firstly
    let value = 0;
    getCountryCode(newCountry, (data) => {
        //data is the new C_CO code
        changeCountry(oldCountry, data, function (data) {
            value = data;
        })
        changeTimeRange(oldTimerange, newTimerange, function (data) {
            value = value + data;
            callback(value > 0);
        });
    });
}

function getCountryCode(countryName, callback) {
    pool.request().query("select C_CO from T_COUNTRY where COUNTRY_NAME='" + countryName + "'", (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result.recordset[0].C_CO);
    })
}

function changeCountry(oldCountry, newCOUNTRY, callback) {
    var sql = "UPDATE T_GTREND SET C_CO = REPLACE(C_CO, '" + oldCountry + "','" + newCOUNTRY + "')"
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result.rowsAffected[0]);
    })
}

function changeTimeRange(oldTimerange, newTimerange, callback) {
    var sql = "UPDATE T_GTREND SET TIME_RANGE = REPLACE(TIME_RANGE, '" + oldTimerange + "','" + newTimerange + "')";
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result.rowsAffected[0]);
    })
}

function deleteBrand(brand, callback) {
    var sql = "select TG_ID from T_GTREND where BRAND='" + brand + "'";
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        var brandId = result.recordset[0].TG_ID;
        deleteDistrictTrendDataByBrand(brandId, function (data) {
            deleteProvinceTrendDataByBrand(brandId, function (data) {
                deleteCountryTrendDataByBrand(brandId, function (data) {
                    var sql = "delete  from T_GTREND where BRAND='" + brand + "'";
                    pool.request().query(sql, (err, result) => {
                        if (err) {
                            console.log(err);
                            process.exit(0);
                        }
                        callback(result);
                    })
                })
            })
        })

    })


}

function getCountryDataToSearch(callback) {

    var sql = "select * from T_GTREND";
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);

            process.exit(0);
        }

        callback(result);
    })

}

/////////////////////////////////////////// Google Trend Data Save //////////////////////////////////////////////////////////////
function saveCountryWebTrend(id, time, trend) {
    return new Promise((resolve, reject) => {
        var sql = "insert into T_COUNTRY_GTREND (TG_Id,TIME,WEB)VALUES('" + id + "','" + time + "','" + trend + "')";

        pool.request().query(sql, (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            resolve(true);
        });
    });
}

function saveCountryImgTrend(id, time, trend) {
    return new Promise((resolve, reject) => {
        var sql = "UPDATE T_COUNTRY_GTREND SET IMAGE='" + trend + "' WHERE TIME='" + time + "' and TG_ID='" + id + "'";
        pool.request().query(sql, (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            resolve(true);

        })
    })
}

function saveCountryYoutubeTrend(id, time, trend) {
    return new Promise((resolve, reject) => {
        var sql = "UPDATE T_COUNTRY_GTREND SET YOUTUBE='" + trend + "' WHERE TIME='" + time + "' and TG_ID='" + id + "'";
        pool.request().query(sql, (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            resolve(true);
        })
    })
}

function deleteTrendData() {
    return new Promise((resolve, reject) => {

        var sql = "delete from T_COUNTRY_GTREND";
        pool.request().query(sql, (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }

            resolve(true);
        })
    })
}

function deleteDistrictTrendDataByBrand(brandId, callback) {
    var sql = "delete from T_DISTRICT_GTREND WHERE  TG_ID='" + brandId + "' ";
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(true);
    })
}

function deleteProvinceTrendDataByBrand(brandId, callback) {
    var sql = "delete from T_PROVINCE_GTREND WHERE  TG_ID='" + brandId + "' ";
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(true);
    })
}

function deleteCountryTrendDataByBrand(brandId, callback) {
    var sql = "delete from T_COUNTRY_GTREND WHERE  TG_ID='" + brandId + "' ";
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(true);
    })
}

function getAllProvinceByCountry(country, callback) {

    var sql = "select P_CO from T_PROVINCE where C_CO ='" + country + "' ";
    pool.request().query(sql, (err, result) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        callback(result);
    })
}

function refreshTimeUpdate(date, time) {
    return new Promise((resolve, reject) => {
        var sql = "UPDATE T_UPDATE_TIME SET UPDATE_DATE='" + date + "', UPDATE_TIME='" + time + "'  where TU_ID='1'";
        pool.request().query(sql, (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            resolve(result);
        })
    })
}

function getRefreshTime(date, time) {
    return new Promise((resolve, reject) => {
        var sql = "select UPDATE_DATE,UPDATE_TIME from T_UPDATE_TIME where TU_ID='1'";
        pool.request().query(sql, (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            resolve(result);
        })
    })
}


module.exports.getCountryData = getCountryData;
module.exports.getTableData = getTableData;
module.exports.getSelectedTimeRangeData = getSelectedTimeRangeData;
module.exports.getSelectedComboData = getSelectedComboData;
module.exports.changeCountryTimeRange = changeCountryTimeRange;
module.exports.addBrand = addBrand;
module.exports.deleteBrand = deleteBrand;
module.exports.getCountryDataToSearch = getCountryDataToSearch;
module.exports.data = data;
module.exports.saveCountryWebTrend = saveCountryWebTrend;
module.exports.saveCountryImgTrend = saveCountryImgTrend;
module.exports.saveCountryYoutubeTrend = saveCountryYoutubeTrend;
module.exports.deleteTrendData = deleteTrendData;
module.exports.getAllProvinceByCountry = getAllProvinceByCountry;
module.exports.refreshTimeUpdate = refreshTimeUpdate;
module.exports.getRefreshTime = getRefreshTime;
