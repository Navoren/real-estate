function CreateListing() {
return (
    <main>
        <div className='rounded-xl sm:w-min mx-auto my-20 items-center sm:shadow-md'>
    <form action=""  className='sm:flex gap-4 px-8 rounded-xl mx-auto '>
                <div className='flex flex-col gap-4 p-8 rounded-xl mx-auto'>
                <h1 className='text-3xl font-semibold p-3 md:max-w-2xl'>Create Listing</h1>
    <label className="input input-bordered flex items-center gap-2 w-full">
        <input type="text" className="grow" placeholder="Name" id='name' defaultValue="" />
    </label>
    <textarea className="textarea textarea-primary flex items-center gap-2 w-full" placeholder="Description" id='desc'></textarea>
    <label className="input input-bordered flex items-center gap-2 w-full">
        <input type="text" className="grow" placeholder="Address" id='address'/>
    </label>
<div className='checkboxes grid  gap-4 grid-cols-2'>
    <div className="form-control">
    <label className="label cursor-pointer">
    <span className="label-text font-semibold">Sell</span> 
    <input type="checkbox"  className="checkbox checkbox-primary" />
    </label>
                    </div>
                    <div className="form-control">
    <label className="label cursor-pointer">
    <span className="label-text font-semibold">Rent</span> 
    <input type="checkbox"  className="checkbox checkbox-primary" />
    </label>
                    </div>
                    <div className="form-control">
    <label className="label cursor-pointer">
    <span className="label-text font-semibold">Parking spot</span> 
    <input type="checkbox"  className="checkbox checkbox-primary" />
    </label>
                    </div>
                    <div className="form-control">
    <label className="label cursor-pointer">
    <span className="label-text font-semibold">Furnished</span> 
    <input type="checkbox"  className="checkbox checkbox-primary" />
    </label>
                    </div>
                    <div className="form-control">
    <label className="label cursor-pointer">
    <span className="label-text font-semibold">Offer</span> 
    <input type="checkbox"  className="checkbox checkbox-primary" />
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
                    <input type="number" className="input input-bordered w-full max-w-xs" min='1' max='5' required />
                        </label>
                    <label className="form-control w-full max-w-xs p-3">
                        <div className="label">
                        <span className="label-text font-semibold">Baths</span>
                    </div>
                    <input type="number" className="input input-bordered w-full max-w-xs" min='1' max='5' required/>
                        </label>
                        <label className="form-control w-full max-w-xs p-3">
                        <div className="label">
                        <span className="label-text font-semibold shrink">Regular Price ($/month)</span>
                    </div>
                    <input type="number" className="input input-bordered w-full max-w-xs" min='1' max='5' required/>
                        </label>
                        <label className="form-control w-full max-w-xs p-3">
                        <div className="label">
                        <span className="label-text font-semibold shrink">Discounted Price ($/month)</span>
                    </div>
                    <input type="number" className="input input-bordered w-full max-w-xs" min='1' max='5' required/>
                    </label>
                    </div >
                    <p className='font-semibold text-teal-500 text-start'>Note: The first Image will be the cover (max 6)</p>
                    <div className='flex flex-rows mx-3'>
                    <input
                    className='cursor-pointer border border-2 rounded-lg p-2 max-w-xs mx-2'
                    type='file'
                    id='images'
                    accept='image/*'
                    multiple
                    />
                    <button
                    type='button'
                    className='btn'
                    >
                    Upload
                    </button>
                    </div>
                    <button className="btn btn-active btn-primary text-white">Create Listing</button>
            </div>
    </form>
    
    </div>
    </main>
)
}

export default CreateListing