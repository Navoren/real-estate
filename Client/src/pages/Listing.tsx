/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';
  
function Listing() {
const params = useParams();
const [listing, setListing] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const [copied, setCopied] = useState(false);
const [contact, setContact] = useState(false);
const { currentUser } = useSelector((state:any) => state.user);
useEffect(() => {
    const fetchListing = async () => {
        try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/api/v1/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
            setError(true);
            setLoading(false);
            return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
        } catch (error) {
        setError(true);
        setLoading(false);
        }
    };
    fetchListing();
    }, [params.listingId]);
return (
    <main>
        {loading ? (
    <p className='text-center text-teal-600 font-semibold'>Loading...</p>
    ) : error ? (
    <p className='text-center text-red-600 font-semibold'>Error fetching listing</p>
            ) : listing ? (
                    <div className='place-self-cente'>
                        <Swiper className='z-10' navigation>
                            {listing.imageUrls.map((url: any) => (
                                <SwiperSlide key={url}>
                                    <div
                                        className='h-[550px]'
                                        style={{ background: `url(${url}) center no-repeat`, backgroundColor: 'beige', backgroundSize: 'cover' }}>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className=''>
                        <div className='p-3'>
                            <h1 className='text-3xl font-bold m-1'>{listing.name} - {listing.regularPrice} ($/month)</h1>
                            <p className='text-xl font-light text-gray-500 flex mt-2'>
                                <FaMapMarkerAlt className='text-green-700 m-1' />
                                    {listing.address}</p>
                                <div className='absolute top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                                    <FaShare
                                        className='text-slate-500'
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            setCopied(true);
                                            setTimeout(() => {
                                                setCopied(false);
                                            }, 2000);
                                        }}
                                    />
                                </div>
                        </div>
                        <div className='flex gap-4 p-3'>
                            <p className='badge badge-error font-semibold '>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='badge badge-primary font-semibold '>
                                    ${+listing.regularPrice - +listing.discountPrice} OFF
                                </p>
                            )}
                        </div>
                        <div>
                        </div>
                        <div className='p-4'>
                            <h1 className='text-3xl font-semibold'>Description</h1>
                            <p className='font-light'>{listing.description}</p>
                        </div>
                        <div className='px-4'>
                            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaBed className='text-lg' />
                                    {listing.bedrooms > 1
                                        ? `${listing.bedrooms} beds `
                                        : `${listing.bedrooms} bed `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaBath className='text-lg' />
                                    {listing.bathrooms > 1
                                        ? `${listing.bathrooms} baths `
                                        : `${listing.bathrooms} bath `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaParking className='text-lg' />
                                    {listing.parking ? 'Parking spot' : 'No Parking'}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaChair className='text-lg' />
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                                </ul>
                                <div className='my-5'>
                                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                                        <button
                                            onClick={() => setContact(true)}
                                            className="btn btn-neutral w-full">Contact LandLord 📞</button>
                                    )}
                                    {contact && <Contact listing={listing} />}
                                    
                                </div>
                        </div>
                        </div>
                    </div>
                ) : (
            <p>No listing data found</p>
        )}
    </main>
)
}

export default Listing


