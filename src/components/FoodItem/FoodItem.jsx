import React, { useContext,useState,useEffect } from 'react';
import './FoodItem.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode' 
import Navbar from '../Navbar/Navbar';
const FoodItem = ({name,price,description,image,item_id}) => {

    const token= localStorage.getItem('token')
   
    const [cartItems, setCartItems] = useState({})
    // const [cartItems, setCartItems] = useState(() => {
    //     const storedCartItems = localStorage.getItem('cartItems');
    //     return storedCartItems ? JSON.parse(storedCartItems) : {};
    // });
    const add = async (item_id)=>{ 
     if(token){ 
        // addToCart(id)
        
        const decodedToken = jwtDecode(token); // Decode the token
                const customer_id = decodedToken.customer_id;

         try{
            const response = await axios.post('http://localhost:4444/addOrder', {
                customer_id ,
                name,
                price,
                item_id,
                img_item:image,
                quantity: cartItems[item_id] ? cartItems[item_id] + 1 : 1, // You can set the quantity as needed
                total: price * (cartItems[item_id] ? cartItems[item_id] + 1 : 1),
                
             });
             console.log(response.data.order.quantity);
                if (response.data.success) {
                    addToCart(item_id)
                }
                else{
                    Swal.fire({
                        title:"failed",
                        text:"please login first",
                        icon:"error"
                      });  
                 }
            }
            catch (err) {
                console.log(err);
            }

         }       
        
    }


    const addToCart= (item_id)=>{
      
        setCartItems((prev) => ({
            ...prev,
            [item_id]: prev[item_id] ? prev[item_id] + 1 : 1,
        }));
      }


    //   useEffect(() => {
    //     localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // }, [cartItems]);

      const removeFromCart= (item_id)=>{
        if (cartItems[item_id] > 0) {
            setCartItems((prev) => ({
                ...prev,
                [item_id]: prev[item_id] - 1,
            }));
        }
    }
  



    

   


///_________________________________________________________________________________________________________




const remove = async (item_id)=>{ 
    if(token){ 
       // addToCart(id)
       const decodedToken = jwtDecode(token); // Decode the token
               const customer_id = decodedToken.customer_id;
       const response = await axios.put('http://localhost:4444/SubOrder', {
       customer_id ,
       name,
       price,
       item_id,
       quantity: cartItems[item_id] ? cartItems[item_id] - 1 : 1, // You can set the quantity as needed
       total: price * (cartItems[item_id] ? cartItems[item_id] - 1 : 1),
    });
       if (response.data.success) {
           removeFromCart(item_id)
       }
    }else{
       Swal.fire({
           title:"failed",
           text:"please login first",
           icon:"error"
         }); 
    }
   }



   //________________________________________________________________________________________________    
    return ( 
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={image} alt="" />
                {!cartItems[item_id] ?                                              
                 <img className='add' onClick={()=>add(item_id)} src={assets.add_icon_white}  ></img>   
                  : <div className="food-item-counter">
                        <img onClick={()=>remove(item_id)} src={assets.remove_icon_red} alt="" /> 
                        <p>{cartItems[item_id]}</p>
                        <img onClick={()=>add(item_id)} src={assets.add_icon_green} alt="" />

                  </div>
            }
                <div className='food-item-info'>
                    <div className="food-item-rating">
                        <p>{name}</p>
                        <img src={assets.rating_starts} alt="" />
                    </div>
                 <p className='food-item-desc'>{description}</p>
                 <p className='food-item-price'>${price}</p>

                </div>
                
            </div> 
            
        </div>
     );
    }
 
export default FoodItem;



//بسطر 16 اذا لسه مش ضايف اشي رح تظهر علامة الزائد البيضا عشان اضيف اول مرة  

//بسطر 18 اذا ضايف من قبل معناتو رح تظهرله علامة زائد وناقص للصنف ,, وبس يصير صفر برجع لعلامة الزائد البيضا عشان يضيف اول مرة
