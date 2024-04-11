import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { SignInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('http://localhost:4000/api/v1/auth/oauth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
            });
            const data = await res.json();
            dispatch(SignInSuccess(data));
            navigate('/');
        } catch (error: unknown) {
            console.log('Error during Google OAuth:', error);
            
        }
    }

  return (
      <div>
          <button type='button' onClick={handleGoogleClick} className="btn btn-wide btn-error">Continue using Google</button>
    </div>
  )
}

export default OAuth