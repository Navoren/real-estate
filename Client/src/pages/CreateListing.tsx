    /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
    import { useState } from "react"
    import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
    const { currentUser } = useSelector((state: any) => state.user);
    const navigate = useNavigate();
        const [formData, setFormData] = useState({
            imageUrls: [],
            name: '',
            description: '',
            address: '',
            type: 'rent',
            bedrooms: 1,
            bathrooms: 1,
            regularPrice: 50,
            discountPrice: 0,
            offer: false,
            parking: false,
            furnished: false,
            userRef: '',
        });
        const [images, setImages] = useState<any>([]);
        const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState('');

        const handleImageSubmit = () => {
            if (images.length > 0 && images.length + formData.imageUrls.length < 7) {
                setUploading(true);
                setImageUploadError(false);
                const promises = [];
                for (let i = 0; i < images.length; i++) {
                    promises.push(storeImage(images[i]));
                } 
                Promise.all<any>(promises).then((urls: any) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(false);
                    setUploading(false);
                })
                    .catch((error) => {
                        setImageUploadError(error.message);
                        setImageUploadErrorMsg('An error occured while uploading images');
                        setUploading(false);
                    });
            }else {
                setImageUploadErrorMsg('You can only upload 6 images per listing');
                setUploading(false);
            }
        };
        
        const storeImage = async (image: any) => { 
            return new Promise((resolve, reject) => { 
                const storage = getStorage(app);
                const fileName = new Date().getTime() + image.name;
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on(
                    'state_changed',
                    (snapshot) => { 
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    });
            });
        };

        const handleChange = (e: any) => {
            if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
            }
        
            if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
            ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
            }
        
            if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
            ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
            }
        };

        const handleRemoveImage = (index:number) => {
            setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
            });
        };

    const handleSubmit = async (e: any) => { 
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice) setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch('http://localhost:4000/api/v1/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: currentUser._id,
                
                }),
            });
            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
                setLoading(false)
            }
            navigate(`/listing/${data._id}`); // Something !!
            
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };
    return (
        <main>
            <div className='rounded-xl sm:w-screen mx-auto my-20 items-center'>
        <form onSubmit={handleSubmit} action=""  className='sm:flex  px-8 rounded-xl mx-auto '>
                    <div className='flex flex-col gap-4 p-8 rounded-xl mx-auto sm:w-1/2'>
                    <h1 className='text-3xl font-semibold p-3 md:max-w-2xl'>Create Listing</h1>
        <label className="input input-primary flex items-center gap-2 w-full">
            <input type="text" className="grow" placeholder="Name" id='name' required value={formData.name} onChange={handleChange} />
        </label>
        <textarea className="textarea textarea-bordered flex items-center gap-2 w-full" placeholder="Description" required id='description' onChange={handleChange}/>
        <label className="input input-bordered flex items-center gap-2 w-full">
            <input type="text" className="grow" placeholder="Address" id='address' onChange={handleChange} value={formData.address}/>
        </label>
    <div className='checkboxes grid  gap-4 grid-cols-2'>
        <div className="form-control">
        <label className="label cursor-pointer">
        <span className="label-text font-semibold">Sell</span>
        <input type="checkbox" id="sale" className="checkbox checkbox-primary" checked={formData.type==='sale'} onChange={handleChange} />
        </label>
                        </div>
                        <div className="form-control">
        <label className="label cursor-pointer">
        <span className="label-text font-semibold">Rent</span>
        <input type="checkbox" id="rent" className="checkbox checkbox-primary " checked={formData.type==='rent'} onChange={handleChange} />
        </label>
                        </div>
                        <div className="form-control">
        <label className="label cursor-pointer">
        <span className="label-text font-semibold">Parking spot</span>
        <input type="checkbox" id="parking" className="checkbox checkbox-primary" checked={formData.parking} onChange={handleChange} />
        </label>
                        </div>
                        <div className="form-control">
        <label className="label cursor-pointer">
        <span className="label-text font-semibold">Furnished</span>
        <input type="checkbox" id="furnished"  className="checkbox checkbox-primary" checked={formData.furnished} onChange={handleChange} />
        </label>
                        </div>
                        <div className="form-control">
        <label className="label cursor-pointer">
        <span className="label-text font-semibold">Offer</span>
        <input type="checkbox" id="offer" className="checkbox checkbox-primary" checked={formData.offer} onChange={handleChange} />
        </label>
        </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 p-8 rounded-xl mx-auto '>
                        <div className='flex flex-cols grid grid-cols-2'>
                        <label className="form-control w-full max-w-xs p-3">
                            <div className="label">
                            <span className="label-text font-semibold" >Beds</span>
                        </div>
                        <input type="number" id="bedrooms" className="input input-bordered w-full max-w-xs" min='1' max='5' required onChange={handleChange} value={formData.bedrooms} />
                            </label>
                        <label className="form-control w-full max-w-xs p-3">
                            <div className="label">
                            <span className="label-text font-semibold">Baths</span>
                        </div>
                        <input type="number" id="bathrooms" className="input input-bordered w-full max-w-xs" min='1' max='5' required onChange={handleChange} value={formData.bathrooms}/>
                            </label>
                            <label className="form-control w-full max-w-xs p-3">
                            <div className="label">
                            <span className="label-text font-semibold shrink">Regular Price {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                    )}</span>
                        </div>
                        <input type="number" className="input input-bordered w-full max-w-xs" min='50' required onChange={handleChange}/>
                            </label>
                    { formData.offer && ( <label className="form-control w-full max-w-xs p-3">
                            <div className="label">
                            <span className="label-text font-semibold shrink">Discounted Price {formData.type === 'rent' && (
                        <span className='text-xs'>($ / month)</span>
                    )}</span>
                        </div>
                        <input type="number" className="input input-bordered w-full max-w-xs" min='50' required onChange={handleChange}/>
                        </label>)}
                        </div >
                        <p className='font-semibold text-teal-500 text-start'>Note: The first Image will be the cover (max 6)</p>
                        <div className='flex flex-rows mx-3'>
                        <input
                                className='cursor-pointer border border-2 rounded-lg p-2 max-w-xs mx-2'
                                onChange={(e) => setImages(e.target.files)}
                        type='file'
                        id='images'
                        accept='image/*'
                        multiple
                        />
                        <button
                        type='button'
                        className='btn'
                        disabled={uploading}
                        onClick={handleImageSubmit}
                        >
                        {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                        <div
                        className="flex flex-cols grid grid-cols-3 gap-2">
                        {formData.imageUrls.length > 0 &&
                            formData.imageUrls.map((url, index) => (
                                
                    <div
                    key={url}
                    className='flex p-1 grid grid-cols-2 gap-2 border items-center card w-full bg-base-100 shadow-xl'
                >
                    <img
                    src={url}
                    alt='listing image'
                    className='w-20 h-20 object-contain rounded-lg static'
                    />
                    <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='btn btn-square btn-sm absolute top-1 right-1'
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                                </div>
                            ))}
                            </div>
                        <button
                            disabled={loading || uploading}
                            className="btn btn-active btn-primary text-white"
                        >{loading ? 'Creating...' : 'Create Listing'}</button>
                        <p className='text-red-700 text-sm font-bold text-center'>
                            {imageUploadErrorMsg && error || imageUploadError}
                        </p>
                        
                </div>
        </form>
        
        </div>
        </main>
    )
    }

    export default CreateListing