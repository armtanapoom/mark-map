import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker, Popup } from 'maplibre-gl';

type Location = {
    id: string
    properties: {
        ct_en: string;
        ct_tn: string;
        latitude: string;
        longitude: string;
    };
    geometry: {
        coordinates: [number, number]
    }
};

export default function MapView({ locations, mapCenter, currentLocation }: { locations: Location[] | [], mapCenter?: [number, number], currentLocation: [number, number] | null }) {

    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {

        const map = new maplibregl.Map({
            container: 'map',
            style: '/style.json',
            center: mapCenter || [0, 0],
            zoom: 1
        });

        mapRef.current = map;

        locations.forEach(location => {
            if (location.geometry.coordinates[0] && location.geometry.coordinates[1]) {
                let iconLocation = null
                let markerElementLocation = null
                switch (location.properties.ct_en) {
                    case "Cambodia":
                        iconLocation = "url('/combodia.png')"
                        break;
                    case "Vietnam":
                        iconLocation = "url('/vietnam.png')"
                        break;
                    case "China":
                        iconLocation = "url('/china.png')"
                        break;
                    case "Indonesia":
                        iconLocation = "url('/indo.png')"
                        break;
                    case "Myanmar":
                        iconLocation = "url('/myanmar.png')"
                        break;
                    case "Thailand":
                        iconLocation = "url('/thai.png')"
                        break;
                    case "Laos":
                        iconLocation = "url('/lao.png')"
                        break;
                }

                if (iconLocation) {
                    markerElementLocation = document.createElement("div");
                    markerElementLocation.className = 'marker';
                    markerElementLocation.style.width = "40px";
                    markerElementLocation.style.height = "40px";
                    markerElementLocation.style.backgroundImage = iconLocation;
                    markerElementLocation.style.backgroundSize = "cover";
                }
                new Marker(markerElementLocation ? { element: markerElementLocation } : undefined)
                    .setLngLat([location.geometry.coordinates[0], location.geometry.coordinates[1]])
                    .setPopup(new Popup().setHTML(`
                        <h1>${location.properties.ct_tn}</h1><br/>
                        <p>Coordinates: latitude: ${location.geometry.coordinates[1].toFixed(6)}, longitude: ${location.geometry.coordinates[0].toFixed(6)}</p><br/>
                        <a  href="https://www.google.com/search?q=${location.properties.ct_tn}" target="_blank"}>ข้อมูลเพิ่มเติม</a>
                    `))
                    .addTo(map);

            }
        });
        map.setZoom(5);
        if (currentLocation) {
            const markerElement = document.createElement("div");
            markerElement.className = 'marker';
            markerElement.style.width = "40px";
            markerElement.style.height = "40px";
            markerElement.style.backgroundImage = "url('/user-location.png')";
            markerElement.style.backgroundSize = "cover";

            new Marker({ element: markerElement })
                .setLngLat(currentLocation)
                .setPopup(new Popup().setHTML(`
                    <h1>My Location</h1>
                `))
                .addTo(map);
        }

        return () => map.remove();
    }, [locations, currentLocation]);

    useEffect(() => {
        if (!mapRef.current || !mapCenter) return;
        const map = mapRef.current;


        map.flyTo({ center: mapCenter, zoom: 8 });

    }, [mapCenter]);


    return (
        <>
            <div id="map" className="w-full" style={{ height: 550 }} />
        </>
    )
}
