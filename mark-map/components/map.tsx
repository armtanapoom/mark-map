import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker, Popup } from 'maplibre-gl';
import MapLibreGlDirections, { LoadingIndicatorControl } from "@maplibre/maplibre-gl-directions";

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

interface MapViewProps {
    locations: Location[];
    mapCenter?: [number, number];
    currentLocation: [number, number] | null;
    setNewCenter: (locations: Location) => void
}

export interface MapViewRef {
    toRouting: () => void;
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ locations, mapCenter, currentLocation, setNewCenter }, ref) => {
    const mapRef = useRef<maplibregl.Map | null>(null);
    const diractionRef = useRef<MapLibreGlDirections | null>(null)

    useEffect(() => {

        const map = new maplibregl.Map({
            container: 'map',
            style: '/style.json',
            center: mapCenter || [0, 0],
            zoom: 1
        });
        diractionRef.current = null
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

                    .addTo(map)
                    .getElement().addEventListener('click', () => {
                        newCenter(location)
                    })

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

    useImperativeHandle(ref, () => ({
        toRouting: () => {
            if (!mapRef.current || !mapCenter) return;
            if (!diractionRef.current) {
                const map = mapRef.current;
                const directions = new MapLibreGlDirections(map);
                diractionRef.current = directions
            }
            if (currentLocation && mapCenter) {
                console.log("toRouting", currentLocation, mapCenter);
                const map = mapRef.current;
                const directions = diractionRef.current;

                if (directions) {
                    directions.clear();

                    // Enable interactivity (if needed)
                    directions.interactive = false;

                    // Optionally add the standard loading-indicator control
                    map.addControl(new LoadingIndicatorControl(directions));

                    directions.setWaypoints([
                        currentLocation,
                        mapCenter,
                    ]);
                }
            }
        },
    }));

    const newCenter = (location: Location) => {
        setNewCenter(location)
    }

    return (

        <div id="map" className="w-full" style={{ height: 550 }} />
    )
}

)
MapView.displayName = 'MapView';

export default MapView;
