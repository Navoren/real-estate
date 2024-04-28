/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(true);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/v1/listing/get/${params.listingId}`)
                const data = await res.json()
                console.log(data)
            } catch (error) {
                console.error('Error fetching listing:', error)
            }
        }
        fetchListing();
    });
  return (
    <div>Listing</div>
  )
}

export default Listing