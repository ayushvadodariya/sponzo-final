const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String, required: true },
    category: { type: String, default: "" },
    platform: { type: String, default: "instagram" },
    deadline: { type: String, default: "" },
    requirements: { type: String, default: "" },
    
    // Brand who created the campaign
    brandEmail: { type: String, required: true },
    brandName: { type: String, required: true },
    
    // Campaign status: open, closed, completed
    status: { type: String, default: "open" },
    
    // Creators who applied
    applicants: [{
        email: String,
        name: String,
        username: String,
        profileImage: String,
        status: { type: String, default: "pending" }, // pending, accepted, rejected
        appliedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

mongoose.models = {};

export default mongoose.model('Campaign', CampaignSchema);
