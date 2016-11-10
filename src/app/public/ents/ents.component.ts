import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ents',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './ents.component.scss',
  ],
  templateUrl: './ents.component.html'
})
export class EntsComponent {
  lat: number = 52.2139999;
  lng: number = 0.1009631;
  mapStyles = [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#444444"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          // "color": "#f2f2f2"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          // "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          // "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          // "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#449edd"
        },
        {
          "visibility": "on"
        }
      ]
    }
  ];
}
