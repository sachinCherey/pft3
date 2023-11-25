import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db,provider } from "../../firebase";


function Signin({ toggleComponent },{signInWithGoogle}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()

  function signInWithEmail(e) {
    e.preventDefault();
    setLoading(true);

    if (email !== '' && password !== '') {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          toast.success('Signed in successfully!', { autoClose: 5000 });
          setEmail('');
          setPassword('');
          navigate('/dashboard');
          setLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === 'auth/invalid-email') {
            toast.error('Invalid email address.');
          } else if (errorCode === 'auth/user-disabled') {
            toast.error('User account has been disabled.');
          } else if (errorCode === 'auth/user-not-found') {
            toast.error('User account not found.');
          } else if (errorCode === 'auth/wrong-password') {
            toast.error('Incorrect password.');
          } else {
            toast.error(errorMessage);
          }

          setLoading(false);
        });
    } else {
      toast.error('Email and password are required.', { autoClose: 5000 });
      setLoading(false);
    }
  }

  async function createDoc(user){
    setLoading(true);
    if(!user){
        return;
    }

    const userRef = doc(db, 'users', user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
        try{
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            createdAt: new Date(),
            photoURL: user.photoURL? user.photoURL: '',
            // other user data
        });
        toast.success('Doc created!');
        setLoading(false);
    }catch(e){
        toast.error(e.message);
        setLoading(false);
    }
    }
    else{
        setLoading(false);
    }
    
}


  function signInWithGoogle() {
    setLoading(true);
   try{
    signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        createDoc(user);
        toast.success('Authenticated successfully!', { autoClose: 5000 });
        navigate('/dashboard');
        setLoading(false);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
       })
   }catch(e){
    toast.error(e.message);
    setLoading(false);
   }
           
}

  



  return (
    <div className="signin">
      <h3>Sign In to Your Account</h3>
      <form onSubmit={signInWithEmail}>
        <div className="item">
          <p style={{ color: "black" }}>Email</p>
          <input
            type="email"
            placeholder="JohnDoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="item">
          <p style={{ color: "black" }}>Password</p>
          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" id='email' disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>
        <p>Or</p>
        
      </form>
      <button id="gmail" disabled={loading} onClick={signInWithGoogle}>{loading ? 'Loading...' : 'Sign In with Google'}</button>
       <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Don't have an account? Click on &nbsp; <strong style={{cursor: "pointer"}} onClick={() => navigate('/')}>Sign Up</strong></p>
    </div>
  );
}

export default Signin;