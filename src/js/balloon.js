let _placesMap,
    _yMap,
    _clusterer,
    _geoObjects;

let closeButton;
let sendButton;

const getAddress = require('./helpers.js').getAddress;
const getMonth = require('./helpers.js').getMonth;
const getDate = require('./helpers.js').getDate;
const createPlacemark = require('./helpers.js').createPlacemark;
const yellTemplate = require('../yell-template.hbs');
const Place = require('./place.js').place;

const yellBalloon = document.querySelector('#yell-balloon');

const showBalloon = async(coords, placesMap, yMap, clusterer, geoObjects) => {
    _placesMap = placesMap;
    _yMap = yMap;
    _clusterer = clusterer;
    _geoObjects = geoObjects;
    _showBalloon(coords);
};

const _showBalloon = async(coords) => {
    let places = _placesMap.has(coords) ? _placesMap.get(coords) : [];
    renderBalloon(coords, places);
};

async function renderBalloon(coords, places) {

    const address = await getAddress(coords);

    //debugger;
    yellBalloon.innerHTML = '';
    yellBalloon.classList.remove('c-yell_hidden');
    yellBalloon.innerHTML = yellTemplate({
        address: address,
        places: places
    });

    closeButton = yellBalloon.querySelector('#close-button');
    sendButton = yellBalloon.querySelector('#send-button');

    closeButton.addEventListener('click', e => {
        yellBalloon.classList.add('c-yell_hidden');
    });

    sendButton.addEventListener('click', e => {
        const nameInput = yellBalloon.querySelector('#comment-name');
        const locationInput = yellBalloon.querySelector('#comment-location');
        const textInput = yellBalloon.querySelector('#comment-text');
        const date = new Date();
        let dateStr = `${getDate(date)}.${getMonth(date)}.${date.getFullYear()}`;

        //place.addComment(comment);

        let placemark = createPlacemark(coords);

        placemark.events.add('click', placemarkHandler);
        _yMap.geoObjects.add(placemark);
        _geoObjects.push(placemark);

        _clusterer.add(_geoObjects);

        const place = new Place(address, nameInput.value, locationInput.value, dateStr, textInput.value, placemark);

        placemark.properties.set({
            balloonContentHeader: place.location,
            balloonContentBody: `<a href="" class="placemark__link">${place.address}</a>`,
            balloonContentFooter: place.date
        });


        places.push(place);
        _placesMap.set(coords, places);

        nameInput.value = '';
        locationInput.value = '';
        textInput.value = '';

        renderBalloon(coords, places);
    });
}

const placemarkHandler = async e => {
    const placemark = e.get('target');
    const coords = placemark.geometry.getCoordinates();

    if (!placemark) {
        return;
    }

    await _showBalloon(coords);
};

module.exports = showBalloon;