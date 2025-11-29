import crypto from "crypto";
import connectDB from "@/middleware/mongoose";
import Campaign from "@/model/Campaign";

const verifyPayment = async (req, res) => {
    if (req.method === 'POST' && req.headers.authorization) {
        const base64Credentials = req.headers.authorization?.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        if (credentials === process.env.USER_ID + ":" + process.env.PASSWORD) {
            try {
                const { 
                    razorpay_order_id, 
                    razorpay_payment_id, 
                    razorpay_signature,
                    campaignId,
                    creatorEmail 
                } = req.body;

                // Verify signature
                const body = razorpay_order_id + "|" + razorpay_payment_id;
                const expectedSignature = crypto
                    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                    .update(body.toString())
                    .digest("hex");

                const isAuthentic = expectedSignature === razorpay_signature;

                if (!isAuthentic) {
                    return res.status(400).json({ success: false, error: 'Payment verification failed' });
                }

                // Update applicant status to accepted
                const campaign = await Campaign.findById(campaignId);
                if (!campaign) {
                    return res.status(404).json({ success: false, error: 'Campaign not found' });
                }

                const applicant = campaign.applicants.find(a => a.email === creatorEmail);
                if (!applicant) {
                    return res.status(404).json({ success: false, error: 'Applicant not found' });
                }

                applicant.status = "accepted";
                applicant.paymentId = razorpay_payment_id;
                applicant.orderId = razorpay_order_id;
                applicant.acceptedAt = new Date();

                await campaign.save();

                return res.status(200).json({ 
                    success: true, 
                    message: 'Payment verified and creator accepted successfully' 
                });
            } catch (error) {
                console.error("Verify payment error:", error);
                return res.status(500).json({ success: false, error: "Server error" });
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}

export default connectDB(verifyPayment);
