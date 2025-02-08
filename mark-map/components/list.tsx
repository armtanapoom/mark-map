import { Navigation, Globe, ArrowUpRight, BookPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';

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

        return `${distance.toFixed(2)} KM.`;
    }
    return (
        <>
            {locations.map((item: Location, index: number) => {
                return (
                    <div className='flex justify-between border rounded-xl p-4 my-4 hover:bg-blue-100' key={index} >
                        <div className=''>
                            <strong className='pb-1 flex'><Globe color="#2563eb" className='mr-4' />{item.properties.ct_tn}</strong>
                            <div className='pb-1 flex py-2'><Navigation /><p className='px-4'>{`latitude : ${item.geometry.coordinates[1].toFixed(6)}, longitude : ${item.geometry.coordinates[0].toFixed(6)}`}</p></div>
                            <div className='pb-1 flex py-2'><BookPlus /><a
                                className="px-4 text-blue-500 underline"
                                href={`https://www.google.com/search?q=${item.properties.ct_tn}`}
                                target="_blank"
                            >
                                ข้อมูลเพิ่มเติม
                            </a></div>
                        </div>
                        <div className=' flex  items-center'>
                            {myLocation && (
                                <Chip className='mx-4' label={calculateDistance(item.geometry.coordinates[1], item.geometry.coordinates[0])} color="primary" variant="outlined" />

                            )}
                            <ArrowUpRight style={{ cursor: 'pointer' }} color="#2563eb" onClick={() => { selectLocation(item) }} />
                        </div>
                    </div>

                )
            })}
        </>
    )
}
