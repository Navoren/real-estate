/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { SignInStart, SignInFailure, SignInSuccess } from '../redux/user/userSlice.ts';
import { RootState } from '../redux/store.ts';
import OAuth from '../components/OAuth.tsx';

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e: { target: { id: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      dispatch(SignInStart());
      const res = await fetch('http://localhost:4000/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignInFailure(data.message));
        return;
      }
      dispatch(SignInSuccess(data));
      console.log(data);
      navigate('/');
    } catch (error: any) {
      dispatch(SignInFailure(error.message));
    }
    
  }
  return (
    <div className='rounded-xl sm:w-min mx-auto my-20 items-center sm:shadow-md'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-8 rounded-xl mx-auto my-20 px-24 items-center'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-16 h-32 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
      <h1 className="text-xl font-semibold ">Welcome Back !</h1>
      <h6 className='text-xs text-gray-300 text-center'>Enter your email and password to log into your account</h6>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
        <input type="text" className="grow " placeholder="Email" id='email' onChange={handleChange}/>
      </label>
      <label className="input input-bordered flex items-center gap-2 sm:w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
        <input type="password" className="grow" placeholder='Password' id='password' onChange={handleChange}/>
        </label>
        <button disabled={loading} className="btn btn-wide btn-primary">{loading ? 'Loading' : 'Login'}</button>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <hr className='border-[0.2px] w-[15rem] ' />
        <OAuth />
        <h6 className='text-sm text-gray-400 text-center'>New Here? <Link className='text-blue-300' to={'/sign-up'} >Sign Up</Link> </h6>
      </form>
      
    </div>
  )
}

export default SignIn