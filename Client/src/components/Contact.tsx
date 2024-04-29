/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ContactProps {
    listing: any;
  }
  
const Contact = ({ listing }: ContactProps) => {
    const [landlord, setLandlord] = useState<any>(null);
    const [message, setMessage] = useState('');
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/v1/user/get/${listing.userRef}`);
            const data = await res.json();
            if (data.success === false) {
                return;
            }
            setLandlord(data);
            } catch (error) {
                console.log(error);
            }
            
        };
        fetchLandlord();
    }
    , [listing.userRef]);
    return (
        <div>
            {landlord && (
                <>
                <div className='bg-base-200 p-4 rounded'>
                    <h2 className='text-2xl text-center font-semibold'>Contact Landlord</h2>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <p className='text-lg font-semibold'>Name: {landlord.name}</p>
                            <p className='text-lg font-semibold'>Email: {listing.email}</p>
                        </div>
                        <div>
                                <textarea name='message' id='message' className="textarea textarea-bordered" placeholder="Enter your message" value={message} onChange={onChange} ></textarea>
                                <Link
                                    to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                                    className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                                >
                                    Send Message
                                </Link>
                        </div>
                    </div>
                </div>
            </>
            )}
      </div>
    );
  }
  
  export default Contact;