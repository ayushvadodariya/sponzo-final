import User from "@/model/User";
import Brand from "@/model/Brand";
import Creator from "@/model/Creator";
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

                // Check if Creator/Brand with this email or username already exists
                if (role === 'creator') {
                    let existingCreator = await Creator.findOne({ $or: [{ email: email }, { username: username }] });
                    if (existingCreator) {
                        return res.status(400).json({ success: false, error: 'Creator with this email or username already exists' });
                    }
                } else if (role === 'brand') {
                    let existingBrand = await Brand.findOne({ email: email });
                    if (existingBrand) {
                        return res.status(400).json({ success: false, error: 'Brand with this email already exists' });
                    }
                }

                // Create user in User collection (for authentication)
                let u = new User({ name, email, username, password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(), role });
                await u.save();

                // Also create Brand or Creator record (for profile data)
                if (role === 'brand') {
                    await Brand.create({
                        name: name,
                        email: email,
                        role: "brand",
                        profileImage: "",
                        category: [],
                        location: "",
                        description: ""
                    });
                } else if (role === 'creator') {
                    await Creator.create({
                        name: name,
                        email: email,
                        username: username,
                        role: "creator",
                        phone: "",
                        profileImage: "",
                        city: "",
                        state: "",
                        category: "",
                        platforms: [
                            { platform: "instagram", followers: "", profile: "" },
                            { platform: "youtube", followers: "", profile: "" },
                            { platform: "facebook", followers: "", profile: "" }
                        ],
                        bannerImage: "",
                        description: "",
                        packages: []
                    });
                }

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
