"use client"
import { Map, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import axios from "axios";
import ListView from "../components/list"
import MapView from '@/components/map';
import Loading from '@/components/loading';

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

export default function Home() {

  const [isLoading, setIsLoading] = useState(false)
  const [viewType, setViewType] = useState('list')
  const [page, setPage] = useState(1)
  const [length, setLength] = useState(0)
  const [locations, setLocations] = useState<Location[] | []>([])
  const [totalLocation, setTotalLocation] = useState(0)
  const [perPage, setPerPage] = useState(200)
  const [offsetData, setOffsetData] = useState(0)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    getMyLocation()
  }, [])


  useEffect(() => {
    setOffsetData((page - 1) * perPage)
    getLocation()

  }, [page, perPage])

  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("current location : lng :", longitude, " lat :", latitude);

      if (longitude && latitude) {
        setCurrentLocation([longitude, latitude])
      }
    })
  }

  const getLocation = async () => {
    setIsLoading(true)
    await axios
      .get(`https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC&collectionCreatedBy=60f539a5a44d2d7219fac3e3&offset=${(page - 1) * perPage}&limit=${perPage}`)
      .then((response) => {
        console.log(response.data);
        setTotalLocation(response.data.numberMatched)
        setLocations(response.data.features)
        const lastData = response.data.features[response.data.features.length - 1]
        const lat = parseFloat(lastData.geometry.coordinates[1])
        const lng = parseFloat(lastData.geometry.coordinates[0])
        if (lat && lng) {
          setMapCenter([lng, lat])
        } else {
          setMapCenter(currentLocation ?? [16.4438628, 102.737692])
        }
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
    const lat = item.geometry.coordinates[1]
    const lng = item.geometry.coordinates[0]
    if (lat && lng) {
      setMapCenter([lng, lat])
    } else {
      setMapCenter(currentLocation ?? [16.4438628, 102.737692])
    }
    setViewType('map')

  }

  return (
    <>
      <div className="flex justify-between items-center p-10 bg-gradient-to-r from-blue-50 to-blue-100">
        <div>
          <h1 className="text-2xl">Mark Map</h1>
          <p className='text-blue-600'>total location : {totalLocation.toLocaleString()}</p>
        </div>
        <div>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-blue-600">จำนวนรายการต่อหน้า</span>
            </div>
            <select className="select select-bordered" onChange={(e) => setPerPage(Number(e.target.value))} value={perPage}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
          </label>
        </div>
      </div>
      <div className='pb-10 pt-5 px-6 md:px-10'>
        <Loading isLoading={isLoading} />
        <div className='flex justify-between items-center'>
          <div>
            <p>ลำดับที่ {offsetData + 1} - {offsetData + perPage}</p>
          </div>
          <div className="join">
            <button className="join-item btn" onClick={() => setViewType('list')}><List />List View</button>
            <button className="join-item btn" onClick={() => setViewType('map')}><Map />Map View</button>
          </div>

        </div>
        {viewType == 'list' ? (
          <>
            <div>
              <ListView locations={locations} selectLocation={selectLocation} />
            </div>

          </>
        ) : (
          <div className='py-6'>
            <MapView locations={locations} mapCenter={mapCenter} currentLocation={currentLocation} />
          </div>
        )}
        <div className='flex justify-center mt-4'>

          <Pagination count={length} page={page} onChange={handleChange} />
        </div>
      </div>
    </>
  );
}
