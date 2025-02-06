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

export default function MapView({ locations, mapCenter, selectedLocation }: { locations: Location[] | [], mapCenter?: [number, number], selectedLocation?: Location | null }) {

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

        return () => map.remove();
    }, [locations]);

    useEffect(() => {
        if (!mapRef.current || !mapCenter) return;
        const map = mapRef.current;
        map.flyTo({ center: mapCenter, zoom: 5 });

        new Popup({ closeOnClick: false })
            .setLngLat(mapCenter)
            .setHTML(`
                <h1>${selectedLocation ? selectedLocation.properties.ct_tn : '-'}</h1><br/>
                Coordinates:: Lat ${mapCenter[1]}, Lng: ${mapCenter[0]}</p>
            `)
            .addTo(map);
    }, [mapCenter, selectedLocation]);

    return (
        <>
            <div id="map" className="w-full" style={{ height: 550 }} />;
        </>
    )
}
