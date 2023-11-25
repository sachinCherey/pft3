import { useState } from "react";
import { createUserWithEmailAndPassword, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db,provider } from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";


function Signup({ toggleComponent}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    function signUpWithEmail(e) {
        e.preventDefault();
        setLoading(true);

        if (name !== '' && email !== '' && password !== '' && confirmPassword !== '') {
            if (password === confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        toast.success('Account created successfully!', { autoClose: 5000 });

                        // Store additional user data in Firestore
                        setDoc(doc(db, 'users', user.uid), {
                            name: name,
                            email: email,
                            uid: user.uid,
                            password: password,
                            createdAt: new Date(),
                            photoURL: user.photoURL? user.photoURL: '',
                            // other user data
                        });

                        // Clear input fields
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        navigate('/dashboard');

                        setLoading(false);
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;

                        if (errorCode === 'auth/email-already-in-use') {
                            toast.error('The email address is already in use by another account.');
                        } else if (errorCode === 'auth/invalid-email') {
                            toast.error('Invalid email address.');
                        } else {
                            toast.error(errorMessage);
                        }

                        setLoading(false);
                    });
            } else {
                toast.error('Passwords do not match!', { autoClose: 5000 });
                setLoading(false);
            }
        } else {
            toast.error('All fields are mandatory!', { autoClose: 5000 });
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
        <div className="signUp">
            <h3>Sign Up On &nbsp; <span style={{ color: "blue" }}> Financely.</span></h3>
            <form onSubmit={signUpWithEmail}>
                <div className="item">
                    <p style={{ color: "black" }}>Full Name</p>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

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

                <div className="item">
                    <p style={{ color: "black" }}>Confirm Password</p>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" id='email' disabled={loading}>{loading?"Loading...":"Signup With Email"}</button>
                <p>Or</p>

            </form>
            <button  id="gmail" disabled={loading} onClick={signInWithGoogle}>{loading?"Loading...":"Signup With Google"}</button>
            <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Already have an account? Click on &nbsp; <strong style={{ cursor: "pointer" }}onClick={() => navigate('/signin')}>Sign in</strong></p>
        </div>
    );
}

export default Signup;