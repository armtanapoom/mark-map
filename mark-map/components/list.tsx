import { Navigation } from 'lucide-react';

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
    return (
        <>
            {locations.map((item: Location, index: number) => {
                return (
                    <div className='flex justify-between border rounded-xl p-4 my-2' key={index} onClick={() => { selectLocation(item) }}>
                        <div>
                            <strong>{item.properties.ct_tn}</strong>
                            <p>Coordinates: {item.properties.latitude}, {item.properties.longitude}</p>
                        </div>
                        <div>
                            <Navigation style={{ cursor: 'pointer' }} color="#3e9392" />

                        </div>
                    </div>

                )
            })}
        </>
    )
}
