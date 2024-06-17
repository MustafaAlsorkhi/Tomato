const db = require("../models/db");

const addItems = async (req, res) => {
    try {
        // Extract item data from the request body
        const { name, description, price, img } = req.body;

        // Insert the item data into the database
        const newItem = await db.query('INSERT INTO items (name_item, description, price, img_item) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, price, img]);

        // Send a success response with the newly added item
        res.status(201).json({
            success: true,
            message: 'Item added successfully',
            item: newItem
        });
    } catch (error) {
        // Send an error response if something goes wrong
        console.error('Error adding item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item'
        });
    }
};


const getItems = async (req, res) => {
    try {
        // Fetch items from the database
        const items = await db.query('SELECT * FROM items');

        // Send the items as a response
        res.status(200).json({
            success: true,
            message: 'Items retrieved successfully',
            items
        });
    } catch (error) {
        // Send an error response if something goes wrong
        console.error('Error fetching items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch items'
        });
    }
};
// const getItems = async (req, res) => {
//     try {
//         // Fetch items along with their quantities from the cart table
//         const itemsWithquantity = await db.query('SELECT items.*, cart.quantity FROM items LEFT JOIN cart ON items.item_id = cart.item_id');

//         // Send the items with quantities as a response
//         res.status(200).json({
//             success: true,
//             message: 'Items with quantities retrieved successfully',
//             items: itemsWithquantity
//         });
//     } catch (error) {
//         // Send an error response if something goes wrong
//         console.error('Error fetching items with quantities:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch items with quantities'
//         });
//     }
// };

const Search = async (req, res) => { 
    try {
        const { q } = req.params; // Get the search query from request parameters

        // Fetch items from the database
        const items = await db.query('SELECT * FROM items');

        // Filter items based on search query (case-insensitive)
        const filteredItems = items.rows.filter(item =>
            item.name_item.toLowerCase().includes(q.toLowerCase())
        );

        // Send back the filtered items as a response
        res.json({ items: filteredItems });
    } catch (error) {
        // Send an error response if something goes wrong
        console.error('Error searching items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search items'
        });
    }
};




module.exports = {
    addItems,
    getItems,
    Search
};