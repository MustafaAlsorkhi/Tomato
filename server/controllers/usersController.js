const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const UserModel = require('../models/userModel');


const signup = async (req, res) => {
    const {  name,email,password } = req.body;
  
    try {
      const existingUser = await UserModel.findByEmail(email);
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const schema = joi.object({
                name: joi.string().alphanum().min(3).max(20).required(),
              email: joi
                .string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required(),
              password: joi
                .string()
                .pattern(
                  new RegExp(
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&^#]{6,30}$" 
                  )
                )
            });
            const validate = schema.validate({
                name,
              email,
              password,
            });
            if (validate.error) {
              res.status(405).json({ error: validate.error.details });
            }
            else{
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.createUser( name,email,hashedPassword );
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
   }
   catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



  const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      
  
      const user = await UserModel.checkEmail(email);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
      }
     const storedHashedPassword = user.password;
      const passwordMatch = await bcrypt.compare(password, storedHashedPassword);
      if (!passwordMatch) {
        res.status(400).json({ message: "Email or password is invalid" });
        return;
    }
  
      // Include user information in the token payload
      const payload = {
        email: user.email,
        customer_id: user.customer_id,
      };
  
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
      // res.cookie("accessToken", token, { httpOnly: true });
  
      res.status(200).json({message: 'User signed in successfully',data: {name : user.first_name,email : user.email,token:token,customer_id:user.customer_id} });
      // console.log(token);
      // console.log(user.user_id);
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  module.exports = {
    signup,
    login
  };