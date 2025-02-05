

type Location = {
    id: string
    properties: {
        ct_tn: string;
        latitude: number;
        longitude: number;
    };
};

export default function List({ locations, page }: { locations: Location[] | [], page: number }) {



    return (
        <>
            <p>ListView page:{page}</p>
            {locations.map((item: Location, index: number) => {
                return (
                    <div className='border rounded-xl p-4 my-2' key={index}>
                        <div>
                            <strong>{item.properties.ct_tn}</strong>
                            <p>Coordinates: {item.properties.latitude}, {item.properties.longitude}</p>
                        </div>
                    </div>

                )
            })}
        </>
    )
}
