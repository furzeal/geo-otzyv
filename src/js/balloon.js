let _placesMap,
    _yMap,
    _clusterer,
    _geoObjects;

let closeButton;
let sendButton;
let activeClusterBalloon;

const getAddress = require('./helpers.js').getAddress;
const getMonth = require('./helpers.js').getMonth;
const getDate = require('./helpers.js').getDate;
const createPlacemark = require('./helpers.js').createPlacemark;
const yellTemplate = require('../yell-template.hbs');
const Place = require('./place.js').place;

const yellBalloon = document.querySelector('#yell-balloon');

const balloonInit = async(coords, placesMap, yMap, clusterer, geoObjects) => {
    _placesMap = placesMap;
    _yMap = yMap;
    _clusterer = clusterer;
    _geoObjects = geoObjects;

    _clusterer.events.add('balloonopen', e => {
        console.dir(e.get('target'), e.get('target').balloon);
        activeClusterBalloon = e.get('target')
    });

    _showBalloon(coords);
};

const _showBalloon = async(coords) => {
    const coordsHash = getCoordsHash(coords);
    let places = _placesMap.has(coordsHash) ? _placesMap.get(coordsHash) : [];
    renderBalloon(coords, places);
};

const getCoordsHash = coords => coords[0].toString() + coords[1].toString();

async function renderBalloon(coords, places) {

    if (activeClusterBalloon) {
        activeClusterBalloon.close();
        activeClusterBalloon = null;
    }
    const address = await getAddress(coords);

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

        let placemark = createPlacemark(coords);

        placemark.events.add('click', placemarkHandler);
        _yMap.geoObjects.add(placemark);
        _geoObjects.push(placemark);

        _clusterer.add(_geoObjects);

        const place = new Place(address, nameInput.value, locationInput.value, dateStr, textInput.value, placemark);

        placemark.properties.set({
            balloonContentHeader: place.location,
            balloonContentBody: `<a href="" class="placemark__link" data-x="${coords[0]}" data-y="${coords[1]}">${place.address}</a>`,
            balloonContentFooter: place.date,
        });


        places.push(place);
        _placesMap.set(getCoordsHash(coords), places);

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

document.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains('placemark__link')) {
        const x = Number(target.dataset['x']);
        const y = Number(target.dataset['y']);
        _showBalloon([x, y]);
    }

});

module.exports = balloonInit;