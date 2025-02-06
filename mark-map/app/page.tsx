"use client"
import { Search, Map, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import axios from "axios";
import ListView from "../components/list"
import MapView from '@/components/map';
import Loading from '@/components/loading';

type Location = {
  id: string
  properties: {
    ct_tn: string;
    latitude: string;
    longitude: string;
  };
};

export default function Home() {

  const [isLoading, setIsLoading] = useState(false)
  const [viewType, setViewType] = useState('list')
  const [page, setPage] = useState(1)
  const [length, setLength] = useState(0)
  const [locations, setLocations] = useState<Location[] | []>([])
  const [totalLocation, setTotalLocation] = useState(0)
  const [perPage, setPerPage] = useState(5)
  const [offsetData, setOffsetData] = useState(0)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  useEffect(() => {
    setOffsetData((page - 1) * perPage)
    getLocation()
  }, [page, perPage])

  const getLocation = async () => {
    setIsLoading(true)
    await axios
      .get(`https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC&collectionCreatedBy=60f539a5a44d2d7219fac3e3&offset=${(page - 1) * perPage}&limit=${perPage}`)
      .then((response) => {
        console.log(response.data);
        setTotalLocation(response.data.numberMatched)
        setLocations(response.data.features)
        const lastData = response.data.features[response.data.features.length - 1]
        const lat = parseFloat(lastData.properties.latitude)
        const lng = parseFloat(lastData.properties.longitude)
        setMapCenter([lng, lat])
        const countLength = response.data.numberMatched / perPage;

        if (countLength >= 1) {
          setLength(Math.ceil(countLength))
        } else {
          setLength(1)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.log("err", err);
        setIsLoading(false)
      });
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const selectLocation = (item: Location) => {
    setSelectedLocation(item)
    const lat = parseFloat(item.properties.latitude)
    const lng = parseFloat(item.properties.longitude)
    setMapCenter([lng, lat])
    setViewType('map')

  }

  return (
    <div className='pb-10 pt-5 px-6 md:px-10'>
      <Loading isLoading={isLoading} />
      <div className="flex justify-between items-center pb-10">
        <div>
          <h1 className="text-2xl">Mark Map</h1>
          <p>total location : {totalLocation}</p>
        </div>
        <div>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">จำนวนรายการต่อหน้า</span>
            </div>
            <select className="select select-bordered" onChange={(e) => setPerPage(Number(e.target.value))}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
      <div className=" pb-4">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <Search className="h-4 w-4 opacity-70" />
        </label>
      </div>
      <div className='flex justify-between items-center'>
        <div className="join">
          <button className="join-item btn" onClick={() => setViewType('list')}><List />List View</button>
          <button className="join-item btn" onClick={() => setViewType('map')}><Map />Map View</button>
        </div>
        <div>
          <p>ลำดับที่ {offsetData + 1} - {offsetData + perPage}</p>
        </div>

      </div>
      {viewType == 'list' ? (
        <>
          <div>
            <ListView locations={locations} selectLocation={selectLocation} />
          </div>
          <div className='flex justify-center mt-4'>

            <Pagination count={length} page={page} onChange={handleChange} />
          </div>
        </>
      ) : (
        <div className='py-6'>
          <MapView locations={locations} mapCenter={mapCenter} selectedLocation={selectedLocation} />
        </div>
      )}
    </div>
  );
}
