import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Script from "next/script";
import useUserStore from "@/store/useUserStore";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BrandCampaigns = () => {
  const router = useRouter();
  const { user, isLoggedIn, hasHydrated } = useUserStore();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    platform: "",
    deadline: "",
    requirements: "",
  });

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaign/getall?brandEmail=${user.email}`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!hasHydrated) return;
    
    if (!isLoggedIn || !user || user.role !== "brand") {
      router.push("/login");
      return;
    }
    fetchCampaigns();
  }, [hasHydrated, isLoggedIn, user, router, fetchCampaigns]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/campaign/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify({
          ...formData,
          brandEmail: user.email,
          brandName: user.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setFormData({
          title: "",
          description: "",
          budget: "",
          category: "",
          platform: "",
          deadline: "",
          requirements: "",
        });
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicantAction = async (campaignId, applicantEmail, status, campaignBudget) => {
    // If accepting, initiate payment first
    if (status === "accepted") {
      setProcessingPayment(applicantEmail);
      try {
        // Create Razorpay order
        const orderRes = await fetch("/api/payment/createorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({
            campaignId,
            creatorEmail: applicantEmail,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderData.success) {
          alert(orderData.error || "Failed to create payment order");
          setProcessingPayment(null);
          return;
        }

        // Open Razorpay checkout
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: "INR",
          name: "Sponzo",
          description: `50% Payment for: ${orderData.campaignTitle}`,
          order_id: orderData.order.id,
          handler: async function (response) {
            // Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${btoa("junaid:2002")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                campaignId,
                creatorEmail: applicantEmail,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment successful! Creator has been accepted.");
              fetchCampaigns();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
            setProcessingPayment(null);
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#4F46E5",
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(null);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error processing payment:", error);
        alert("Failed to process payment");
        setProcessingPayment(null);
      }
    } else {
      // For rejection, just update status directly
      try {
        const res = await fetch("/api/campaign/updateapplicant", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({
            campaignId,
            creatorEmail: applicantEmail,
            status,
          }),
        });

        const data = await res.json();
        if (data.success) {
          fetchCampaigns();
        } else {
          alert(data.error || "Failed to update applicant");
        }
      } catch (error) {
        console.error("Error updating applicant:", error);
      }
    }
  };

  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <MaxWidthWrapper>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Campaigns</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Create Campaign"}
          </Button>
        </div>

        {/* Create Campaign Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Campaign title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Budget (₹) *</label>
                  <Input
                    required
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    required
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Tech">Tech</option>
                    <option value="Food">Food</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Travel">Travel</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Platform *</label>
                  <select
                    required
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  >
                    <option value="">Select platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline *</label>
                  <Input
                    required
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your campaign..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Requirements</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Minimum followers, content type, etc."
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Campaign"}
              </Button>
            </form>
          </div>
        )}

        {/* Campaigns List */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No campaigns yet. Create your first campaign!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{campaign.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{campaign.description}</p>
                  </div>
                  <Badge variant={campaign.status === "open" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <span>💰 ₹{campaign.budget}</span>
                  <span>📁 {campaign.category}</span>
                  <span>📱 {campaign.platform}</span>
                  <span>📅 {new Date(campaign.deadline).toLocaleDateString()}</span>
                </div>

                {/* Applicants Section */}
                {campaign.applicants && campaign.applicants.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">
                      Applicants ({campaign.applicants.length})
                    </h4>
                    <div className="space-y-3">
                      {campaign.applicants.map((applicant, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={applicant.profileImage || "/placeholder.svg"}
                              alt={applicant.name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{applicant.name}</p>
                              <p className="text-sm text-gray-500">@{applicant.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {applicant.status === "pending" ? (
                              <>
                                <Button
                                  size="sm"
                                  disabled={processingPayment === applicant.email}
                                  onClick={() =>
                                    handleApplicantAction(campaign._id, applicant.email, "accepted", campaign.budget)
                                  }
                                >
                                  {processingPayment === applicant.email 
                                    ? "Processing..." 
                                    : `Accept & Pay ₹${Math.round(campaign.budget * 0.5)}`}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={processingPayment === applicant.email}
                                  onClick={() =>
                                    handleApplicantAction(campaign._id, applicant.email, "rejected", campaign.budget)
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Badge
                                variant={applicant.status === "accepted" ? "default" : "destructive"}
                              >
                                {applicant.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default BrandCampaigns;
