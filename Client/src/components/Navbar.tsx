/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navbar() {
  const { currentUser } = useSelector((state: any) => state.user);

  return (
    <div className="navbar bg-base-100 drop-shadow-sm z-40">
      <div className="navbar-start z-40">
        <div className="dropdown z-40">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle z-40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-20 p-2 shadow bg-base-100 rounded-box w-52">
            <li><NavLink to={'/'}>Home</NavLink></li>
            <li><NavLink to={'/about'}>About</NavLink></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to='/' className="font-semibold text-xl">Estate4U</Link>
      </div>
      <div className="navbar-end flex-none gap-2">
        <input type="text" placeholder="Search" className="input input-bordered w-12 md:w-auto" />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <div className="avatar-block">
          <NavLink to={'/profile'}>
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="avatar"
                className='w-10 h-10 rounded-full border-2 border-black cursor-pointer'
              />
            ) : (
              <button className='font-semibold hover:bg-slate-200 rounded-xl p-3 transition delay-75'>Sign In</button>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
