const db = require("../models/db");

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM customers WHERE email = $1', [email]);
  return result.rows[0];
};


const createUser = async ( name,email,password ) => {  
  const result = await db.query(
    'INSERT INTO customers( name,email,password ) VALUES($1, $2, $3) RETURNING *',
    [ name,email,password ]
  );
  return result.rows[0];
};

const checkEmail = async (email) => {
    
    const result = await db.query('SELECT * FROM customers WHERE email = $1 ', [
      email,
    ]);
    return result.rows[0];
  };

module.exports = {
    findByEmail,
    createUser,
  checkEmail
  };