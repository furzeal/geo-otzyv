require('./foundation.js');
require('./foundation.css');

const plus = require('./img/plus.svg');
const showBalloon = require('./js/balloon.js');
//const Comment = require('./js/place.js').comment;


let placesMap = new Map();
let yMap;
let clusterer;
let geoObjects = [];

(async() => {
    try {
        await ymaps.ready();

         yMap = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем собственный макет с информацией о выбранном геообъекте.
        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedBlackClusterIcons',
            clusterDisableClickZoom: true,
            gridSize: 110,
            iconColor: '#6f6f6f',
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 260,
            clusterBalloonContentLayoutHeight: 130,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5
            // Настройка внешего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',
            // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
            // clusterBalloonCycling: false,
            // Можно отключить отображение меню навигации.
            // clusterBalloonPagerVisible: false
        });



        yMap.events.add('click', e => {
            let coords = e.get('coords');

            showBalloon(coords, placesMap, yMap, clusterer, geoObjects);

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

// const placemarkHandler = async e=> {
//     const placemark = e.get('target');
//     const coords = placemark.geometry.getCoordinates();
//
//     if (!placemark) {
//         return;
//     }
//
//     await showBaloon(coords);
// };
//
//
// const showBaloon = async coords => {
//
//     let places = placesMap.has(coords) ? placesMap.get(coords): [];
//     renderBalloon(coords, places);
// };
//
//
// async function renderBalloon(coords, places) {
//
//     const address = await getAddress(coords);
//
//     //debugger;
//     yellBalloon.innerHTML = '';
//     yellBalloon.classList.remove('c-yell_hidden');
//     yellBalloon.innerHTML = yellTemplate({
//         address:address,
//         places: places
//     });
//
//     closeButton = yellBalloon.querySelector('#close-button');
//     sendButton = yellBalloon.querySelector('#send-button');
//
//     closeButton.addEventListener('click', e => {
//         yellBalloon.classList.add('c-yell_hidden');
//     });
//
//     sendButton.addEventListener('click', e => {
//         const nameInput = yellBalloon.querySelector('#comment-name');
//         const locationInput = yellBalloon.querySelector('#comment-location');
//         const textInput = yellBalloon.querySelector('#comment-text');
//         const date = new Date();
//         let dateStr = `${getDate(date)}.${getMonth(date)}.${date.getFullYear()}`;
//
//         //place.addComment(comment);
//
//         let placemark = createPlacemark(coords);
//
//         placemark.events.add('click', placemarkHandler);
//         yMap.geoObjects.add(placemark);
//         geoObjects.push(placemark);
//
//         clusterer.add(geoObjects);
//
//         const place  = new Place(address, nameInput.value, locationInput.value, dateStr, textInput.value, placemark);
//         places.push(place);
//         placesMap.set(coords, places);
//
//         nameInput.value='';
//         locationInput.value='';
//         textInput.value='';
//
//         renderBalloon(coords, places);
//     });
// }



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

