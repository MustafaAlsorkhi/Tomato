import React, { useState } from 'react';
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link } from 'react-router-dom';


const Navbar = ({setShowLogin,subtotal}) => {
    const [menu,setMenu]= useState('home')
    

    const token= localStorage.getItem('token')
  const handleIcon=()=>{

        localStorage.removeItem('token')
        // setShowLogin(true);
        setShowLogin('');
}

    return (
        <div className="navbar">
          <Link to='/'><img src={assets.logo} alt="" className='logo' /> </Link>     
        <ul className='navbar-menu'>

            <Link to='/' onClick={()=> setMenu('home')} className={menu==='home'?'active':''}>home</Link>
            <a href='#explore-menu' onClick={()=> setMenu('menu')} className={menu==='menu'?'active':''}>menu</a>
            <a href='#app-download' onClick={()=> setMenu('mobile-app')} className={menu==='mobile-app'?'active':''}>mobile-app</a>
            <a href='#footer' onClick={()=> setMenu('contact-us')} className={menu==='contact-us'?'active':''}>contact us</a>

           
        </ul>

<div className='navbar-right'>
   
                
    <div className='navbar-search-icon'>
       <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link> 
    <div className={subtotal?'dot':''}></div> 
    </div>
{   token?
 <div className="sdw">
<img onClick={()=>handleIcon()} className='icone_orange' src={assets.icone_orange}/> 

 </div>
:<button onClick={()=> setShowLogin(true)}>sign in</button> }
    </div>
    
        </div>

);

}
 
export default Navbar;