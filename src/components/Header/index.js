import './styles.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAuth, signOut } from "firebase/auth";
import userDefault from '../../assets/userDefault.png';
function Header(){
    const [user, loading, error] = useAuthState(auth);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            navigate('/dashboard');
        }
    },[user,loading]);
    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            toast.success('Logged out successfully!', { autoClose: 5000 });
            navigate('/');
          }).catch((error) => {
            // An error happened
            toast.error(error.message);
          });
    };

    return(
        <div className='navbar'>
        <p id='logo'>Financely.</p>
        {location.pathname === '/dashboard' && user && (
          <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
            <img src={user.photoURL ? user.photoURL : userDefault} style={{borderRadius:'50%', height:'40px', width:'40px'}}/>
            <p id='logOut' style={{ cursor: 'pointer',paddingRight:'1rem' ,color:'white'}} onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    )
}

export default Header;