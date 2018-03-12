const userDao = require('../dao/userDao');

function findUser(email, password, callback) {
    callback("success");
}

function countryData(callback) {
    userDao.getCountryData((data) => {
        callback(data);
    });
}

function addBrand(brand, newCountry, newTimerange, callback) {
    userDao.addBrand(brand, newCountry, newTimerange, (data) => {
        callback(data);
    });
}

function tableData(callback) {
    userDao.getTableData((data) => {
        callback(data);
    });
}

function selectedComboData(callback) {
    userDao.getSelectedComboData((data) => {
        callback(data);
    });
}

function selectedTimeRangeData(callback) {
    userDao.getSelectedTimeRangeData((data) => {
        callback(data);
    });
}

function changeCountryandTimeRange(oldCountry, newCountry, oldTimerange, newTimerange, callback) {
    userDao.changeCountryTimeRange(oldCountry, newCountry, oldTimerange, newTimerange, function (data) {
        callback(data);
    });
}

function deleteBrands(brand, callback) {
    userDao.deleteBrand(brand, function (data) {
        callback(data);
    });
}

function getCountryDataToSearch() {
    return new Promise((resolve, reject) => {
        userDao.getCountryDataToSearch(function (data) {
            resolve(data);
        });
    });
}

/////////////////////////////////////////// Google Trend Data Save //////////////////////////////////////////////////////////////

function saveCountryWebTrends(id, time, trend) {
    return new Promise((resolve, reject) => {
        userDao.saveCountryWebTrend(id, time, trend).then(function (data) {
            resolve(data);
        })
    });
}

function saveCountryImgTrends(id, time, trend) {
    return new Promise((resolve, reject) => {
        userDao.saveCountryImgTrend(id, time, trend).then(function (data) {
            resolve(data);
        });
    });
}

function saveCountryYoutubeTrends(id, time, trend) {
    return new Promise((resolve, reject) => {
        userDao.saveCountryYoutubeTrend(id, time, trend).then(function (data) {
            resolve(data);
        })
    });
}

function deleteTrendsData() {

    return new Promise((resolve, reject) => {
        userDao.deleteTrendData().then(function (data) {

            resolve(data);
        })
    });
}

function getAllProvinceByCountry(country) {
    return new Promise((resolve, reject) => {
        userDao.getAllProvinceByCountry(country, function (data) {
            resolve(data);
        });
    });
}

function updateRefreshTime(date, time) {
    return new Promise((resolve, reject) => {
        userDao.refreshTimeUpdate(date, time).then(function (data) {
            resolve(data);
        })
    })
}

function getUpdateTime() {
    return new Promise((resolve, reject) => {
        userDao.getRefreshTime().then(function (data) {
            resolve(data);
        })
    })
}


module.exports.findUser = findUser;
module.exports.countryData = countryData;
module.exports.tableData = tableData;
module.exports.selectedComboData = selectedComboData;
module.exports.selectedTimeRangeData = selectedTimeRangeData;
module.exports.changeCountryandTimeRange = changeCountryandTimeRange;
module.exports.addBrand = addBrand;
module.exports.deleteBrands = deleteBrands;
module.exports.getCountryDataToSearch = getCountryDataToSearch;
module.exports.saveCountryWebTrends = saveCountryWebTrends;
module.exports.saveCountryImgTrends = saveCountryImgTrends;
module.exports.saveCountryYoutubeTrends = saveCountryYoutubeTrends;
module.exports.deleteTrendsData = deleteTrendsData;
module.exports.getAllProvinceByCountry = getAllProvinceByCountry;
module.exports.updateRefreshTime = updateRefreshTime;
module.exports.getUpdateTime = getUpdateTime;
