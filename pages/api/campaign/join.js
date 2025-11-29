import Campaign from "@/model/Campaign";
import connectDB from "@/middleware/mongoose";

const joinCampaign = async (req, res) => {
    if (req.method === 'POST' && req.headers.authorization) {
        const base64Credentials = req.headers.authorization?.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        if (credentials === process.env.USER_ID + ":" + process.env.PASSWORD) {
            try {
                const { campaignId, creatorEmail, creatorName, creatorUsername, creatorProfileImage } = req.body;

                if (!campaignId || !creatorEmail || !creatorName) {
                    return res.status(400).json({ success: false, error: 'Missing required fields' });
                }

                const campaign = await Campaign.findById(campaignId);

                if (!campaign) {
                    return res.status(404).json({ success: false, error: 'Campaign not found' });
                }

                if (campaign.status !== "open") {
                    return res.status(400).json({ success: false, error: 'Campaign is no longer accepting applications' });
                }

                // Check if creator already applied
                const alreadyApplied = campaign.applicants.find(a => a.email === creatorEmail);
                if (alreadyApplied) {
                    return res.status(400).json({ success: false, error: 'You have already applied to this campaign' });
                }

                // Add creator to applicants
                campaign.applicants.push({
                    email: creatorEmail,
                    name: creatorName,
                    username: creatorUsername || "",
                    profileImage: creatorProfileImage || "",
                    status: "pending",
                    appliedAt: new Date()
                });

                await campaign.save();

                return res.status(200).json({ success: true, message: 'Successfully applied to campaign' });
            } catch (error) {
                console.error("Join campaign error:", error);
                return res.status(500).json({ success: false, error: "Server error" });
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}

export default connectDB(joinCampaign);
