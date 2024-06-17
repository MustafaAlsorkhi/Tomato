import React, {useState,useEffect } from 'react';
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem';
import axios from 'axios';

const FoodDisplay = ({category}) => {
  
    // const {food_list}=useContext(StoreContext)
    const [foodList, setFoodList] = useState([]);
    const [searchText, setSearchText] = useState('');

    // console.log("foodList",foodList);
    useEffect(() => {
      fetchItems();
  }, [searchText]);

  const fetchItems = async () => {
    try {
        const response = await axios.get('http://localhost:4444/getItems');
        setFoodList(response.data.items.rows);
        // console.log(response);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
};




const handleSearch = async () => {
  try{
    const response = await axios.get(`http://localhost:4444/Search/${searchText}`);
    
    setFoodList(response.data.items); 

    }
    catch(error){
      
    }}

const handleInputChange = (e) => {
  setSearchText(e.target.value);
};
    return ( 

        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <input type='text'
                        placeholder='Search...'
                        value={searchText}
                        onChange={handleInputChange}
                        
                         />
                         <button onClick={handleSearch}>Search</button>
              <div className="food-display-list">
                {foodList && foodList.map((item,index)=>{
                  if(category==='All' || category===item.category){
                    return <FoodItem key={index} name={item.name_item} description={item.description} image={item.img_item} price={item.price} item_id={item.item_id} />
                  } 
                       
                })}
              </div>
            
        </div>
     );
}
 
export default FoodDisplay;