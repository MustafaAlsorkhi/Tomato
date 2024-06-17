const db = require("../models/db");
  
const addOrder = async (req, res) => { 
    try {
        const { customer_id, quantity, price, name, total , item_id ,img_item} = req.body;
        // Check if the item already exists in the cart

        const existingOrder = await db.query('SELECT * FROM cart WHERE customer_id = $1 AND item_id = $2', [customer_id, item_id]);

        if (existingOrder.rows.length > 0) {
            // console.log(existingOrder.rows)
            // If the item exists, update the quantity and total
            const existingQuantity = parseInt(existingOrder.rows[0].quantity); // Parse existing quantity to integer
            const updatedQuantity = existingQuantity + 1;
            const updatedOrder = await db.query('UPDATE cart SET quantity = $1, total = $2 WHERE customer_id = $3 AND item_id = $4 RETURNING *', [updatedQuantity, total, customer_id, item_id]);
            return res.status(200).json({
                success: true,
                message: 'Order updated successfully',
                order: updatedOrder.rows[0]
            });  
        } else {
            // If the item doesn't exist, insert a new row
            const newOrder = await db.query('INSERT INTO cart (customer_id, quantity, price, name, total, item_id,img_item) VALUES ($1, $2, $3, $4, $5 , $6 , $7) RETURNING *', [customer_id, quantity, price, name, total, item_id , img_item]);
            return res.status(201).json({
                success: true,
                message: 'Order added successfully',
                order: newOrder.rows[0]
            });
        } 
    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add or update order'
        });
    }
};

//___________________________________________________________________________________________________________

const SubOrder = async (req, res) => {
    try {
        const { customer_id, quantity, price, name, total , item_id} = req.body;

        // Check if the item already exists in the cart
        const existingOrder = await db.query('SELECT * FROM cart WHERE customer_id = $1 AND item_id = $2', [customer_id, item_id]);

        if (existingOrder.rows.length > 0) {
            // If the item exists, update the quantity and total
            const updatedOrder = await db.query('UPDATE cart SET quantity = $1, total = $2 WHERE customer_id = $3 AND item_id = $4 RETURNING *', [quantity, total, customer_id, item_id]);
            return res.status(200).json({
                success: true,
                message: 'Order updated successfully',
                order: updatedOrder.rows[0]
            });
        }
    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add or update order'
        });
    }
};

//___________________________________________________________________________________________________________

const getOrder = async (req, res) => { 
    try {
        // Retrieve orders from the database
        const orderId = req.params.orderId;

        const order = await db.query('SELECT * FROM cart WHERE cart_id = $1', [orderId]);

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            orders: order.rows
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

const editOrder = async (req, res) => {
    try {
        const { cart_id } = req.params;
        const { quantity, total } = req.body;

        // Update the order in the database
        const updatedOrder = await db.query(
            'UPDATE cart SET quantity = $1, total = $2 WHERE cart_id = $3 RETURNING *',
            [quantity, total, cart_id]
        );

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            order: updatedOrder.rows[0] // Assuming only one order is updated
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};

const addAdd = async (req, res) => {
    try {
        const { cart_id } = req.params;
        const { quantity, price, total } = req.body;



        // Update the order in the database
        const updatedOrder = await db.query(
            'UPDATE cart SET quantity = $1, price = $2, total = $3 WHERE cart_id = $4 RETURNING *',
            [quantity, price, total, cart_id]
        );

        res.status(200).json({
            success: true,
            message: 'Quantity and total updated successfully',
            order: updatedOrder.rows[0] // Assuming only one order is updated
        });
    } catch (error) {
        console.error('Error updating quantity and total:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quantity and total'
        });
    }
};

const getOrdersCart = async (req, res) => {
    try {
        // Retrieve the customer_id from the request parameters
        const { customer_id } = req.params;

        // Query to fetch orders from the cart table for the specified customer_id
        const orders = await db.query('SELECT * FROM cart WHERE customer_id = $1', [customer_id]);

        // Return the fetched orders in the response
        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders: orders.rows
        });
    } catch (error) {
        console.error('Error fetching orders from cart:', error);
        // Handle any errors that occur during the database operation
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders from cart'
        });
    }
};



const removeFromCart = async (req, res) => {
    try {
        const { item_id } = req.params;

        // Check if the item exists in the cart
        const checkOrder = await db.query(
            'SELECT * FROM cart WHERE item_id = $1',
            [item_id]
        );



        // Get the current quantity of the item in the cart
        const currentQuantity = checkOrder.rows[0].quantity;

        if (currentQuantity === 1) {
            // If the quantity is 1, remove the item from the cart
            await db.query(
                'DELETE FROM cart WHERE item_id = $1',
                [item_id]
            );

            return res.status(200).json({
                success: true,
                message: 'Item removed from the cart'
            });
        } else {
            // Decrease the quantity by 1
            const updatedQuantity = currentQuantity - 1;

            // Update the quantity and total in the cart
            const updatedOrder = await db.query(
                'UPDATE cart SET quantity = $1::integer, total = price * $1 WHERE item_id = $2 RETURNING *',
                [updatedQuantity, item_id]
            );

            return res.status(200).json({
                success: true,
                message: 'Quantity updated successfully',
                order: updatedOrder.rows[0] // Assuming only one order is updated
            });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};



const addFromCart = async (req, res) => {
    try {
        const { item_id } = req.params;

        // Check if the item exists in the cart
        const checkOrder = await db.query(
            'SELECT * FROM cart WHERE item_id = $1',
            [item_id]
        );


        // Get the current quantity of the item in the cart
        const currentQuantity = checkOrder.rows[0].quantity;

        // Increase the quantity by 1
        const updatedQuantity = currentQuantity + 1;

        // Update the quantity and total in the cart
        const updatedOrder = await db.query(
            'UPDATE cart SET quantity = $1::integer, total = price * $1 WHERE item_id = $2 RETURNING *',
            [updatedQuantity, item_id]
        );

        return res.status(200).json({
            success: true,
            message: 'Quantity updated successfully',
            order: updatedOrder.rows[0] // Assuming only one order is updated
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};



module.exports = {
    addOrder,
    getOrder,
    editOrder,
    addAdd,
    SubOrder,
    getOrdersCart,
    removeFromCart,
    addFromCart,
    
};