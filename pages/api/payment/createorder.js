import Razorpay from "razorpay";
import connectDB from "@/middleware/mongoose";
import Campaign from "@/model/Campaign";

const createOrder = async (req, res) => {
    if (req.method === 'POST' && req.headers.authorization) {
        const base64Credentials = req.headers.authorization?.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        if (credentials === process.env.USER_ID + ":" + process.env.PASSWORD) {
            try {
                const { campaignId, creatorEmail } = req.body;

                if (!campaignId || !creatorEmail) {
                    return res.status(400).json({ success: false, error: 'Missing required fields' });
                }

                // Get the campaign to fetch budget
                const campaign = await Campaign.findById(campaignId);
                if (!campaign) {
                    return res.status(404).json({ success: false, error: 'Campaign not found' });
                }

                // Check if creator is in applicants
                const applicant = campaign.applicants.find(a => a.email === creatorEmail);
                if (!applicant) {
                    return res.status(404).json({ success: false, error: 'Applicant not found' });
                }

                // Calculate 50% of budget (convert to paise for Razorpay)
                const amount = Math.round((campaign.budget * 0.5) * 100);

                // Initialize Razorpay
                const razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                // Create order - receipt must be max 40 chars
                const shortId = campaignId.toString().slice(-8);
                const order = await razorpay.orders.create({
                    amount: amount,
                    currency: "INR",
                    receipt: `cp_${shortId}_${Date.now().toString().slice(-10)}`,
                    notes: {
                        campaignId: campaignId,
                        creatorEmail: creatorEmail,
                        campaignTitle: campaign.title,
                    }
                });

                return res.status(200).json({
                    success: true,
                    order: order,
                    key: process.env.RAZORPAY_KEY_ID,
                    amount: amount,
                    campaignTitle: campaign.title,
                });
            } catch (error) {
                console.error("Create order error:", error);
                return res.status(500).json({ success: false, error: "Server error" });
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}

export default connectDB(createOrder);
