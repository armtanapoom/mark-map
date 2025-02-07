import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker, Popup } from 'maplibre-gl';

type Location = {
    id: string
    properties: {
        ct_tn: string;
        latitude: string;
        longitude: string;
    };
};

export default function MapView({ locations, mapCenter, currentLocation }: { locations: Location[] | [], mapCenter?: [number, number], currentLocation: [number, number] | null }) {

    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {

        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: mapCenter || [0, 0],
            zoom: 1
        });

        mapRef.current = map;

        locations.forEach(location => {
            new Marker()
                .setLngLat([parseFloat(location.properties.longitude), parseFloat(location.properties.latitude)])
                .setPopup(new Popup().setHTML(`
                    <h1>${location.properties.ct_tn}</h1><br/>
                    <p>Coordinates: Lat: ${location.properties.latitude}, Lng: ${location.properties.longitude}</p>
                `))
                .addTo(map);
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
            <div id="map" className="w-full" style={{ height: 550 }} />;
        </>
    )
}
