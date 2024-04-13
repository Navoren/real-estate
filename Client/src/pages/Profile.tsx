import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
function Profile() {
  const fileInput = useRef(null);
  const {currentUser} = useSelector((state: any) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  console.log(filePer);
  console.log(file);
  
  const [formData, setFromData] = useState({});
  

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file: any) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uplaodTask = uploadBytesResumable(storageRef, file);
    uplaodTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePer(Math.round(progress));
      (error: any) => {
        console.log(error);
        setFileUploadError(true);
        () => {
          getDownloadURL(uplaodTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setFromData({...formData, avatar: downloadURL});
          }
    )}
      };
    }
  )};
  return (
    <div className='rounded-xl sm:w-min mx-auto my-20 items-center sm:shadow-md '>
      <form action="" className='flex flex-col gap-4 p-8 rounded-xl mx-auto my-20 px-24 items-center'>
        <input type="file" ref={fileInput} hidden accept='image/*'/>
        <img
          onClick={() => fileInput.current?.click()}
          onChange={(e) => setFile(e.target.files[0])}
          src={currentUser?.avatar || 'https://www.pngitem.com/pimgs/m/146-1462217_profile-icon-png-image-free-download-searchpng-employee.png'}
          alt="avatar"
        className='rounded-full w-38 h-36 border-2 border-black shadow-xl cursor-pointer'/>
      <h1 className="text-xl font-semibold ">Hello, <span className='text-slate-500'>{currentUser.username}</span></h1>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
        <input type="text" className="grow" placeholder="Username" id='username' value={currentUser.username} disabled/>
      </label>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
        <input type="email" className="grow " placeholder="Email" id='email' value={currentUser.email} disabled/>
      </label>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
        <input type="password" className="grow" placeholder="Password" id='password' disabled />
        </label>
        <div className="alt-buttons grid grid-rows-2 grid-flow-col gap-1">
        <button className="btn btn-primary"> Update</button>
        <button className="btn btn-outline btn-neutral"> Sign Out</button>
          <button className="btn btn-outline btn-secondary"> Create Listing</button>
          <button className="btn btn-outline btn-error"> Delete Account</button>
        </div>
      </form>
      
    </div>
  )
}

export default Profile