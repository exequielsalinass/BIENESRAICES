/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  // el valor de la derecha es el predeterminado, el de la izquierda es cuando alguien hizo un post con errores, para que se quede guardada la ubicacion\r\n  // fijarse en archivo crear.pug, de ahí saco estos valores\r\n  const lat = -32.9838598;\r\n  const lng = -68.7887384;\r\n  const mapa = L.map(\"mapa\").setView([lat, lng], 13);\r\n  let marker;\r\n\r\n  // Utilizar Provider y Geocoder para obtener el nombre de las calles\r\n  const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n\r\n  //El Pin y configuracion de leaflet (opcion gratis a google)\r\n  marker = new L.marker([lat, lng], {\r\n    draggable: true, // Poder mover el pin\r\n    autoPan: true, // Se mueve el mapa si muevo el pin\r\n  }).addTo(mapa);\r\n\r\n  //Detectar el movimiento del pin y sus coordenadas\r\n  marker.on(\"moveend\", (e) => {\r\n    marker = e.target;\r\n\r\n    const posicion = marker.getLatLng();\r\n\r\n    // console.log(posicion)\r\n\r\n    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)); // Centrar el mapa al soltar el pin\r\n\r\n    // Leer la info de las calles al soltar el Pin\r\n    geocodeService\r\n      .reverse()\r\n      .latlng(posicion, 13)\r\n      .run((error, result) => {\r\n        /* console.log(result) */\r\n\r\n        // Logo arriba del pin\r\n        marker.bindPopup(result.address.LongLabel);\r\n\r\n        //Llenar campos en el front de archivo crear.pug\r\n        document.querySelector(\".calle\").textContent =\r\n          result.address?.Address ?? \"\";\r\n        document.querySelector(\"#calle\").value = result.address?.Address ?? \"\";\r\n        document.querySelector(\"#lat\").value = result.latlng?.lat ?? \"\";\r\n        document.querySelector(\"#lng\").value = result.latlng?.lng ?? \"\";\r\n      });\r\n  });\r\n})();\r\n\n\n//# sourceURL=webpack://bienesraices/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;