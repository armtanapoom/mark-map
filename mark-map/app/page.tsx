"use client"
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import axios from "axios";
import List from "../components/list"

type Location = {
  id: string
  properties: {
    ct_tn: string;
    latitude: number;
    longitude: number;
  };
};

export default function Home() {

  const perPage = 5

  const [page, setPage] = useState(1)
  const [length, setLength] = useState(0)
  const [locations, setLocations] = useState<Location[] | []>([])
  const [totalLocation, setTotalLocation] = useState(0)
  const [countLocation, setCountLocation] = useState(0)

  useEffect(() => {
    getLocation()
  }, [page])

  const getLocation = async () => {
    await axios
      .get(`https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC&collectionCreatedBy=60f539a5a44d2d7219fac3e3&offset=${(page - 1) * perPage}&limit=${perPage}`)
      .then((response) => {
        console.log(response.data);
        setTotalLocation(response.data.numberMatched)
        setCountLocation(response.data.numberReturned)
        setLocations(response.data.features)
        const countLength = response.data.numberMatched / perPage;

        if (countLength >= 1) {
          setLength(Math.ceil(countLength))
        } else {
          setLength(1)
        }

      })
      .catch((err) => {
        console.log("err", err);

      });
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className='pb-10 pt-5 px-6 md:px-10'>
      <div className="flex justify-between items-center pb-10">
        <div>
          <h1 className="text-2xl">Mark Map</h1>
          <p>total location : {totalLocation}</p>
        </div>
        <div>
          <div className="badge badge-outline">{countLocation} locations</div>
        </div>
      </div>
      <div className=" pb-4">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <Search className="h-4 w-4 opacity-70" />
        </label>

      </div>
      <div className='grid grid-cols-1 md:grid-cols-2  gap-4'>
        <div>
          <p>MapView</p>
        </div>
        <div>
          <List locations={locations} page={page} />
          <div className='flex justify-center mt-4'>
            <Pagination count={length} page={page} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
