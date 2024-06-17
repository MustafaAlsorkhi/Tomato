// import React, { useContext } from 'react';
// import './Cart.css'
// import { StoreContext } from '../../context/StoreContext';
// import { useNavigate } from 'react-router-dom';


// const Cart = () => {
//     const {cartItems,food_list,removeFromCart,getTotalCartAmount}=useContext(StoreContext)
//     const navigate=useNavigate();    
//     return ( 

//         <div className='cart'>
//             <div className="cart-items">
//                 <div className="cart-items-title">
//                     <p>Items</p>
//                     <p>Title</p>
//                     <p>Price</p>
//                     <p>Quantity</p>
//                     <p>Total</p>
//                     <p>Remove</p>
//                 </div>
//                 <br />
//                 <hr />
//                 {food_list.map((items,index)=>{
//                     if(cartItems[items._id]>0){
//                         return(
//                          <div className="dw">
//                             <div className="cart-items-title cart-items-item">
//                                 <img src={items.image}/>
//                                     <p>{items.name}</p>
//                                     <p>${items.price}</p>
//                                     <p>{cartItems[items._id]}</p>
//                                     <p>${items.price*cartItems[items._id]}</p>
//                                     <p onClick={()=>removeFromCart(items._id)} className='cross'>x</p>
                              
//                             </div>
                            
//                             <hr />
//                             </div>
                            

//                         )
//                     }
//                 })}
                
//             </div>
//             <div className='cart-bottom'>
//                 <div className="cart-total">
//                     <h2>Cart Totals</h2>
//                       <div>
//                          <div className="cart-total-details">
//                             <p>Subtotal</p>
//                             <p>${getTotalCartAmount()}</p>
//                          </div>
//                          <hr />
//                          <div className="cart-total-details">
//                             <p>Delivery Fee</p>
//                             <p>${getTotalCartAmount()===0 ? 0 : 2}</p>
//                          </div>
//                          <hr />
//                          <div className="cart-total-details">
//                             <b>Total</b>
//                             <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
//                          </div>
//                       </div>
//                       <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>

//                 </div>
//                     <div className="cart-promocode">
//                         <div>
//                             <p>If you have a promo code, Enter it here</p>
//                                 <div className="cart-promocode-input">
//                                     <input type="text" placeholder='promo code' />
//                                     <button>Submit</button>
//                                 </div>
//                         </div>
//                     </div>
//             </div>
//         </div>

//      );
// }
 
// export default Cart;

import React, { useState, useEffect } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode' 

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [subtotal, setSubtotal] = useState(0);

    const token= localStorage.getItem('token')
    // Fetch cart items from backend when component mounts
    useEffect(() => {

        fetchCartItems();
    }, [cartItems]);
    const fetchCartItems = async () => {
        if(token){ 
            // addToCart(id)
            const decodedToken = jwtDecode(token); // Decode the token
                    const customer_id = decodedToken.customer_id; 
        try {
            // Replace 'customer_id' with the actual customer ID

            const response = await axios.get(`http://localhost:4444/getOrdersCart/${customer_id}`);
            if (response.data.success) {
                setCartItems(response.data.orders);
                //    console.log(cartItems)
                //    console.log("efef",response.data.orders)

                calculateTotal(response.data.orders);

            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }}
    };

    const calculateTotal = (items) => {
        let subtotalValue = 0;
        items.forEach((item) => {
            subtotalValue += parseInt(item.total);
        });
        setSubtotal(subtotalValue);
    };

        const removeFromCart = async (item_id) => {

            console.log(item_id)
            try {
                const response = await axios.put(`http://localhost:4444/removeFromCart/${item_id}`);
                if (response.data.success) {
                    // Update cart items and total amount after removing item
                    setCartItems(response.data.cartItems);
                    // setTotalCartAmount(response.data.totalAmount);

                }
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        };
        
        const addFromCart = async (item_id) => {
            try {
                const response = await axios.put(`http://localhost:4444/addFromCart/${item_id}`);
                if (response.data.success) {
                    setCartItems(response.data.cartItems);
                }
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        };
        const handleProceedToCheckout = () => {
            navigate(`/order`, { state: { subtotal } });
        };
       
    return (
        <div className='cart'>
            <div className='cart-items'>
                <div className='cart-items-title'>
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Add</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {cartItems && cartItems.map((item, index) => (
                    <div className='dw' key={item.item_id}>
                        <div className='cart-items-title cart-items-item'>
                            <img src={item.img_item} alt='item' />
                            <p>{item.name}</p>
                            <p>${parseInt(item.price)}</p>
                            <p className='quantity'>{item.quantity}</p>
                            <p>${parseInt(item.total)}</p>
                            <p onClick={()=>addFromCart(item.item_id)} className='plus'>+</p>
                            <p onClick={() => removeFromCart(item.item_id)} className='cross'>
                                x
                            </p>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
            <div className='cart-bottom'>
                <div className='cart-total'>
                    <h2>Cart Totals</h2>
                    <div>
                        <div className='cart-total-details'>
                            <p>Subtotal</p>
                            <p>${subtotal}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <p>Delivery Fee</p>
                            <p>${subtotal === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <b>Total</b>
                            <b>${subtotal === 0 ? 0 : subtotal + 2}</b>
                        </div>
                    </div>
                    <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
                </div>
                <div className='cart-promocode'>
                    <div>
                        <p>If you have a promo code, Enter it here</p>
                        <div className='cart-promocode-input'>
                            <input type='text' placeholder='promo code' />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default Cart;
