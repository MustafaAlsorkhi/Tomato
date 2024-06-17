import React, { useState } from 'react';
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import axios from 'axios';
import Swal from 'sweetalert2';


const LoginPopup = ({setShowLogin}) => {
    const [currState,setCurrState]=useState('Login')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);}

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currState === 'Login') {
                const response = await axios.post('http://localhost:4444/login', { email, password });
                console.log(response);
                setShowLogin(false)
                const tokenn=response.data.data.token;
                localStorage.setItem('token', tokenn);

            } else {
                const response = await axios.post('http://localhost:4444/signup', { name, email, password });
                console.log(response.data);  
                {setCurrState('Login')} 
                setEmail('')
                setPassword('')
                Swal.fire({
                    title:"Success",
                    text:response.data.message,
                    icon:"success"
                  }); 
           }
        } catch (error) {
           
                Swal.fire({
                    title:"Failed to login",
                    text:error.response.data.message,
                    icon:"error"
                  });
            
          
        } 
    }; 
    return ( 
        <div className='login-popup'>
             <form className="login-popup-container" >
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState==='Login'?<></>:<input type="text" placeholder='Your name' required onChange={(e) => setName(e.target.value)} />
 }
<input type="email" placeholder='Your email' value={email} required onChange={(e) => setEmail(e.target.value)} />
<input type={showPassword ? 'text' : 'password'} placeholder='Password' value={password} required onChange={(e) => setPassword(e.target.value)} />


                </div>
                <div className="divButt">

                <button onClick={togglePasswordVisibility}>
{showPassword ? 'Hide Password' : 'Show Password'}
</button>
                <button onClick={handleSubmit}>{currState==='Sign Up'?'Create account':'Login'}</button>
                </div>
                
                <div className="login-popup-condition">
                    <input type="checkbox" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                { currState==='Login'
                ?<p>Create a new account? <span onClick={()=>setCurrState('Sign Up')}>Click here</span></p>
                :<p>Already have an account? <span onClick={()=>setCurrState('Login')}>Login here</span></p>
                   }

             </form>

        </div>
     );
}
 
export default LoginPopup;

