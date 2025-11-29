import Campaign from "@/model/Campaign";
import connectDB from "@/middleware/mongoose";

const updateApplicant = async (req, res) => {
    if ((req.method === 'POST' || req.method === 'PUT') && req.headers.authorization) {
        const base64Credentials = req.headers.authorization?.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        if (credentials === process.env.USER_ID + ":" + process.env.PASSWORD) {
            try {
                const { campaignId, creatorEmail, status } = req.body;

                if (!campaignId || !creatorEmail || !status) {
                    return res.status(400).json({ success: false, error: 'Missing required fields' });
                }

                const campaign = await Campaign.findById(campaignId);

                if (!campaign) {
                    return res.status(404).json({ success: false, error: 'Campaign not found' });
                }

                // Find and update the applicant's status
                const applicant = campaign.applicants.find(a => a.email === creatorEmail);
                if (!applicant) {
                    return res.status(404).json({ success: false, error: 'Applicant not found' });
                }

                applicant.status = status; // accepted, rejected
                await campaign.save();

                return res.status(200).json({ success: true, message: `Applicant ${status}` });
            } catch (error) {
                console.error("Update applicant error:", error);
                return res.status(500).json({ success: false, error: "Server error" });
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}

export default connectDB(updateApplicant);
