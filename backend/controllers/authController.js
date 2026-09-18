const {
    registerUser,
    loginUser,
} = require("../services/authServices");

exports.signup = async (req, res) => {

    try {

        const user = await registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: user,
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};

exports.login = async (req, res) => {

    try {

        const result = await loginUser(
            req.body.email,
            req.body.password
        );

        res.json({
            success: true,
            message: "Login Successful",
            token: result.token,
            user: result.user,
        });

    } catch (err) {

        res.status(401).json({
            success: false,
            message: err.message,
        });

    }

};