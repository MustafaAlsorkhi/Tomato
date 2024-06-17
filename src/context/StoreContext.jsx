import { createContext, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider =(props)=>{


        const [cartItems,setCartItems]= useState({})
        
        const addToCart= (itemId)=>{
          if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))                 //اذا مش موجود بالسلة اصلا
          } else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))            // اذا موجود قم بزيادة الكمية بمقدار 1
          }
        }

        const removeFromCart= (itemId)=>{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))          // ا قم بنقصان الكمية بمقدار 1

        }
        const getTotalCartAmount=()=>{
            let totalAmount=0
            for(const item in cartItems){
             
                let itemInfo=food_list.find((product)=>product._id===item)
                //للبجث عن العنصر في قائمة الاسعار
                if(itemInfo){
                  totalAmount+=itemInfo.price*cartItems[item]
                //بعد ما لقيت العنصر باخذ السعر تبعه وبضربه بكميته 

                }
            }
            return totalAmount
          }

const contextValue={
food_list,
cartItems,
setCartItems,
addToCart,
removeFromCart,
getTotalCartAmount
}
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider