import Campaign from "@/model/Campaign";
import connectDB from "@/middleware/mongoose";

const createCampaign = async (req, res) => {
    if (req.method === 'POST' && req.headers.authorization) {
        const base64Credentials = req.headers.authorization?.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        if (credentials === process.env.USER_ID + ":" + process.env.PASSWORD) {
            try {
                const { title, description, budget, category, platform, deadline, requirements, brandEmail, brandName } = req.body;

                if (!title || !description || !budget || !brandEmail || !brandName) {
                    return res.status(400).json({ success: false, error: 'Please fill all required fields' });
                }

                const campaign = await Campaign.create({
                    title,
                    description,
                    budget,
                    category: category || "",
                    platform: platform || "instagram",
                    deadline: deadline || "",
                    requirements: requirements || "",
                    brandEmail,
                    brandName,
                    status: "open",
                    applicants: []
                });

                return res.status(200).json({ success: true, message: 'Campaign created successfully', campaign });
            } catch (error) {
                console.error("Create campaign error:", error);
                return res.status(500).json({ success: false, error: "Server error" });
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}

export default connectDB(createCampaign);
