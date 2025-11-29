import Campaign from "@/model/Campaign";
import connectDB from "@/middleware/mongoose";

const getCampaigns = async (req, res) => {
    try {
        const { brandEmail, status } = req.query;

        let query = {};
        
        // If brandEmail is provided, get only that brand's campaigns
        if (brandEmail) {
            query.brandEmail = brandEmail;
        }
        
        // If status is provided, filter by status
        if (status) {
            query.status = status;
        }

        const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, campaigns });
    } catch (error) {
        console.error("Get campaigns error:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

export default connectDB(getCampaigns);
