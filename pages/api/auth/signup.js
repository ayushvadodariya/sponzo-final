import User from "@/model/User";
import connectDB from "@/middleware/mongoose";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    if (req.method === 'POST' && req.headers.authorization) {
        const base64Credentials = req.headers.authorization?.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        if (credentials === process.env.USER_ID + ":" + process.env.PASSWORD) {
            const { name, email, password, role, username } = req.body;
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({ success: false, error: 'User already exists' });
            }

            if (!name || !email || !password || !role || !username) {
                return res.status(400).json({ success: false, error: 'Please fill all the fields' });
            }

            if (password.length < 8) {
                return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long' });
            }

            try {
                let useName = await User.findOne({ username: username });
                if (useName) {
                    return res.status(400).json({ success: false, error: 'Username already exists' });
                }

                let u = new User({ name, email, username, password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(), role });
                await u.save();
                let token = jwt.sign({ name: name, email: email, role: role, username: username }, process.env.JWT_SECRET, { expiresIn: '28d' });
                return res.status(200).json({
                    success: true,
                    message: 'Account Created successfully Now you can login',
                    token: token,
                    role: role,
                    email: email,
                    name: name,
                    username: username
                });
            } catch (error) {
                console.error("Signup error:", error);
                return res.status(500).json({ success: false, error: "Server error during signup" });
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed or missing authorization" });
    }
}

export default connectDB(signup);
