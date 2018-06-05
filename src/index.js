require('./foundation.js');
require('./foundation.css');

const plus = require('./img/plus.svg');
const yellTemplate = require('./yell-template.hbs');
const Place = require('./js/place.js').place;
const Comment = require('./js/place.js').comment;

const yellBalloon = document.querySelector('#yell-balloon');


let closeButton;
let sendButton;


let placesMap = new Map();
let yMap;
let clusterer;
let geoObjects = [];

(async() => {
    try {
        await ymaps.ready();

        let yMap = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        });

        let clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedBlackClusterIcons',
            clusterDisableClickZoom: true,
            openBalloonOnClick: false,
            gridSize: 110,
            iconColor: '#6f6f6f'
        });

        yMap.events.add('click', e => {
            let coords = e.get('coords');
            let placemark = createPlacemark(coords);

            placemark.events.add('click', placemarkHandler);
            yMap.geoObjects.add(placemark);
            geoObjects.push(placemark);

            clusterer.add(geoObjects);

            showBaloon(placemark);

            // placemark.properties
            //     .set(getAddress(coords));
        });


        yMap.geoObjects.add(clusterer);
        // var geoObjects=[];
        //     geoObjects.push(new ymaps.Placemark([55.833436, 37.715175], {}, {
        //             preset: 'islands#blackIcon',
        //         }));
        //     geoObjects.push(new ymaps.Placemark([55.833636, 37.715175], {}, {
        //             preset: 'islands#blackIcon',
        //         }));
        //     clusterer.add(geoObjects);
    }
    catch (e) {
        console.error(e);
    }
})();

const placemarkHandler = async e=> {
    const placemark = e.get('target');

    if (!placemark) {
        return;
    }

    await showBaloon(placemark);
};


const showBaloon = async placemark => {

    const coords = placemark.geometry.getCoordinates();
    const address = await getAddress(coords);
    let place;

    if (placesMap.has(coords)) {
        place = placesMap.get(coords);
    }
    else {
        place = new Place(address, []);
        placesMap.set(coords, place);
    }

    renderBalloon(place);
};


function renderBalloon(place) {
    yellBalloon.innerHTML = '';
    yellBalloon.classList.remove('c-yell_hidden');
    yellBalloon.innerHTML = yellTemplate({
        place: place
    });

    const closeButton = yellBalloon.querySelector('#close-button');
    const sendButton = yellBalloon.querySelector('#send-button');

    closeButton.addEventListener('click', e => {
        yellBalloon.classList.add('c-yell_hidden');
    });

    sendButton.addEventListener('click', e => {
        const nameInput = yellBalloon.querySelector('#comment-name');
        const locationInput = yellBalloon.querySelector('#comment-location');
        const textInput = yellBalloon.querySelector('#comment-text');
        const date = new Date();
        let dateStr = `${getDate(date)}.${getMonth(date)}.${date.getFullYear()}`;

        const comment = new Comment(nameInput.value, locationInput.value, dateStr, textInput.value);
        place.addComment(comment);

        nameInput.value='';
        locationInput.value='';
        textInput.value='';

        renderBalloon(place);
    });
}

function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {}, {
        preset: 'islands#blackIcon',
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
    const day = date.getDate() ;
    console.log(day);
    return day < 10 ? '0' + day : '' + day;
}

// function getAddress(coords) {
//     ymaps.geocode(coords).then(function (res) {
//         let firstGeoObject = res.geoObjects.get(0);
//
//         return {
//             // Формируем строку с данными об объекте.
//             iconCaption: [
//                 // Название населенного пункта или вышестоящее административно-территориальное образование.
//                 firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
//                 // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
//                 firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
//             ].filter(Boolean).join(', '),
//             // В качестве контента балуна задаем строку с адресом объекта.
//             balloonContent: firstGeoObject.getAddressLine()
//         };
//     });
// }

// function geocode(address) {
//     if (cache.has(address)) {
//         return Promise.resolve(cache.get(address));
//     }
//
//     return ymaps.geocode(address)
//         .then(result => {
//             const points = result.geoObjects.toArray();
//
//             if (points.length) {
//                 const coors = points[0].geometry.getCoordinates();
//                 cache.set(address, coors);
//                 return coors;
//             }
//         });
// }

