function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {}, {
        preset: 'islands#blackIcon',
        openBalloonOnClick: false,
    });
}

function getAddress(coords) {
    return ymaps.geocode(coords).then(function (res) {
        let firstGeoObject = res.geoObjects.get(0);
        return firstGeoObject.getAddressLine();
    });
}

function getMonth(date) {
    const month = date.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}

function getDate(date) {
    const day = date.getDate();
    return day < 10 ? '0' + day : '' + day;
}

module.exports = {
    createPlacemark: createPlacemark,
    getAddress: getAddress,
    getMonth: getMonth,
    getDate: getDate
}