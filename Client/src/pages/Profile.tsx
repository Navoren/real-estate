/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { UpdateUserFailure, UpdateUserStart, UpdateUserSuccess, DeleteUserStart, DeleteUserSuccess, DeleteUserFailure , SignOutStart, SignOutFailure, SignOutSuccess} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
function Profile() {
  const fileInput = useRef<any>(null);
  const {currentUser, loading, error} = useSelector((state: any) => state.user);
  const [file, setFile] = useState<any>(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState<any>([]);
  
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: any) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setFilePer(Math.round(progress));
      },
      (error: any) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      dispatch(UpdateUserStart());
      const res = await fetch(`http://localhost:4000/api/v1/users/update/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(UpdateUserFailure(data.message));
        return;
      }
      dispatch(UpdateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error: any) {
      dispatch(UpdateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(DeleteUserStart());
      const res = await fetch(`http://localhost:4000/api/v1/users/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === true) {
        dispatch(DeleteUserSuccess());
      }
      else {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
    } catch (error: any) {
      dispatch(DeleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(SignOutStart());
      const res = await fetch('http://localhost:4000/api/v1/auth/signout');
      const data = await res.json();
      if (data.success === true) {
        dispatch(SignOutSuccess());
      }
      else {
        dispatch(SignOutFailure(data.message));
        return;
      }
    } catch (error: any) {
      dispatch(SignOutFailure(error.message));
    }
  };
  const handleClick = () => {
    fileInput.current?.click();
  };

  const handleShowListings = async () => { 
    try {
      setShowListingError(false);
      const res = await fetch(`http://localhost:4000/api/v1/listing/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false) {
        setShowListingError(data.message);
        return;
      }
      setUserListing(data);
    } catch (error: any) {
      setShowListingError(error.message);
    }
  };

  const handleDeleteListing = async (listingId: any) => { 
    try {
      const res = await fetch(`http://localhost:4000/api/v1/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListing((prev: any) => prev.filter((listing: any) => listing._id !== listingId));
    } catch (error: any) {
      console.log(error.message);
      
    }
  };
  
  return (
    <div className='rounded-xl sm:w-min mx-auto my-20 px-5 sm:flex flex-cols justify-between gap-8'>
      <form action="" onSubmit={handleSubmit}  className='flex flex-col gap-4 p-8 rounded-xl sm:shadow-md mx-auto  px-24 items-center '>
        <input type="file" ref={fileInput} hidden accept='image/*'/>
        <img
          onClick={handleClick}
          onChange={(e:any) => setFile(e.target.files[0])}
          src={currentUser?.avatar || 'https://imgs.search.brave.com/vNq2jFE3XACsBNx6XivyUP5r0PYaPjic3GaSsrkaloE/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE3LzM0LzY3/LzM2MF9GXzIxNzM0/Njc4Ml83WHBDVHQ4/YkxOSnF2VkFhRFpK/d3Zaam0wZXBRbWo2/ai5qcGc'}
          alt="avatar"
          className='rounded-full w-38 h-36 border-2 border-black shadow-xl cursor-pointer' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePer}%`}</span>
          ) : filePer === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
      <h1 className="text-xl font-semibold ">Hello, <span className='text-slate-500'>{currentUser.username}</span></h1>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
        <input type="text" className="grow" placeholder="Username" id='username' defaultValue={currentUser.username} onChange={handleChange} />
      </label>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
        <input type="email" className="grow " placeholder="Email" id='email' defaultValue={currentUser.email} onChange={handleChange} />
      </label>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
        <input type="password" className="grow" placeholder="Password" id='password' onChange={handleChange}  />
        </label>
        <div className="alt-buttons grid grid-rows-3 grid-flow-col gap-1 sm:w-full">
        <button disabled={loading} className="btn btn-primary sm:w-full"> {loading ? 'Loading...' : 'Update'}</button>
        <button onClick={handleSignOut} className="btn btn-outline btn-neutral"> Sign Out</button>      
          <button onClick={handleDelete} className="btn btn-link text-red-500 text-xs no-underline"> Delete Account</button>
          <button className="btn btn-outline btn-secondary"> <Link to={"/create-listing"}>Create Listing</Link> </button>
          <button onClick={handleShowListings} className="btn btn-outline btn-wide"> Show Listings</button>
        </div>
        <div className="message-box">
          <p className="text-red-700">{error ? error : ''}</p>
          <p className="text-red-700">{showListingError ? showListingError : ''}</p>
          {updateSuccess && <p className="text-green-700">User updated successfully!</p>}
        </div>
      </form>
      <div className='w-screen h-full p-3'>
        <h1 className='text-2xl font-semibold'>Your Listings</h1>
        <p className='text-slate-400 shrink-0'> Here are the list of Properties you listed</p>
        {userListing && userListing.length > 0 ? (
  userListing.map((listing: any) => (
    <div key={listing._id}>
      <Link to={`/listing/${listing._id}`}>
      <div className='flex gap-4'>
        <img src={listing.imageUrls[0]} alt={listing.title} className='w-32 h-32 object-cover rounded-lg' />
        <div>
          <h1 className='text-xl font-semibold'>{listing.title}</h1>
          <p className='text-slate-400'>{listing.description}</p>
            <button onClick={() => handleDeleteListing(listing._id)} className='btn btn-link text-red-500'>Delete</button>
            <Link to={`/update-listing/${listing._id}`}><button className='btn btn-link text-green-500'>Edit</button></Link>        
        </div>
        </div>
      </Link>
    </div>
  ))
) : (
  <div>
    <p className='text-slate-300 mt-3'>No Listings till now or click on Show Listings if you have any</p>
  </div>
)}

      </div>
    </div>
  )
}

export default Profile

