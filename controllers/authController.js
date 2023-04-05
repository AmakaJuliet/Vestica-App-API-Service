const userModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function createUser(req, res, next) {
    const { first_name, last_name, email, user_type, password } = req.body;
    try {
        //check if user exist already 
        const checkUserExist = await userModel.findOne({ email: email}).exec();

        if (checkUserExist) {
            // this means there is a user 
            return res.json({
                success: false,
                message: "user already exist. login instead"
            });
        }
        const hashedPassword = await bcrypt.hashSync(password, 10);

        const user = new userModel({
            first_name: first_name,
            last_name: last_name,
            email: email,
            user_type: user_type,
            password: hashedPassword
        });
        
        await user.save();

        return res.json({
           success: true,
           message: "user created successfully",
           status: 201
        });


    } catch (error) {
      return res.json({
        error: error,
        success: false,
        message: `An error occurred while creating a user: ${error.message}`
      })
    }
};

async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        //check if user exist already 
        const checkUserExist = await userModel.findOne({ email: email }).exec();

        if (!checkUserExist) { 
            // this means there is a user 
            return res.json({
                success: false,
                message: "user does not exist, create an account"
            });
        }

        const isCorrectPassword = await bcrypt.compareSync(password, checkUserExist.password);
        if (!isCorrectPassword) {
            return res.json({
                success: false,
                message: "Incorrect or invalid credentials"
            });
        }

        const tokenPayload = {
            email: checkUserExist.email,
            user_type: checkUserExist.user_type,
            id: checkUserExist.id
        };

        const access_token = await jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "15m"});

        return res.json({
            success: true,
            message: "user login successfully",
            status: 200,
            access_token: access_token
        });
    } catch (error) {
      return res.json({
        error: error,
        success: false,
        message: `An error occurred while creating a user: ${error.message}`
      })
    }
};

module.exports = {
    createUser,
    login
};