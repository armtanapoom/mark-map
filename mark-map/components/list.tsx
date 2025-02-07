import { Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';

type Location = {
    id: string
    properties: {
        ct_tn: string;
        latitude: string;
        longitude: string;
    };
};

type TypeSelectLocation = (item: Location) => void;

export default function ListView({ locations, selectLocation }: { locations: Location[] | [], selectLocation: TypeSelectLocation }) {

    const [myLocation, setMyLocation] = useState<[number, number] | null>(null)
    useEffect(() => {
        getMyLocation()
    }, [])

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setMyLocation([longitude, latitude])
        })
    }

    const calculateDistance = (lat1: number, lon1: number) => {
        const R = 6371;
        const lat2 = myLocation ? myLocation[1] : 0
        const lon2 = myLocation ? myLocation[0] : 0
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;

        return distance.toFixed(2);
    }
    return (
        <>
            {locations.map((item: Location, index: number) => {
                return (
                    <div className='flex justify-between border rounded-xl p-4 my-2' key={index} onClick={() => { selectLocation(item) }}>
                        <div>
                            <strong>{item.properties.ct_tn}</strong>
                            <p>Coordinates: {item.properties.latitude}, {item.properties.longitude}</p>
                        </div>
                        <div className='grid flex flex-col justify-end justify-items-end content-start items-end'>
                            <Navigation style={{ cursor: 'pointer' }} color="#3e9392" />
                            {myLocation && (
                                <p>ระยะห่างประมาณ {calculateDistance(parseFloat(item.properties.latitude), parseFloat(item.properties.longitude))} KM.</p>

                            )}
                        </div>
                    </div>

                )
            })}
        </>
    )
}
