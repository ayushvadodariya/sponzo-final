import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CreatorCampaigns = () => {
  const router = useRouter();
  const { user, isLoggedIn, hasHydrated } = useUserStore();
  const [campaigns, setCampaigns] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("browse");
  const [applying, setApplying] = useState(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      // Fetch all open campaigns
      const res = await fetch("/api/campaign/getall?status=open");
      const data = await res.json();
      if (data.success) {
        // Separate campaigns into available and applied
        const applied = [];
        const available = [];

        data.campaigns.forEach((campaign) => {
          const hasApplied = campaign.applicants?.some(
            (app) => app.email === user.email
          );
          if (hasApplied) {
            applied.push(campaign);
          } else {
            available.push(campaign);
          }
        });

        setCampaigns(available);
        setMyCampaigns(applied);
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
    
    if (!isLoggedIn || !user || user.role !== "creator") {
      router.push("/login");
      return;
    }
    fetchCampaigns();
  }, [hasHydrated, isLoggedIn, user, router, fetchCampaigns]);

  const handleApply = async (campaignId) => {
    setApplying(campaignId);
    try {
      const res = await fetch("/api/campaign/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify({
          campaignId,
          creatorEmail: user.email,
          creatorName: user.name,
          creatorUsername: user.username,
          creatorProfileImage: user.profileImage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to apply");
      }
    } catch (error) {
      console.error("Error applying to campaign:", error);
      alert("Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  const getMyApplicationStatus = (campaign) => {
    const myApp = campaign.applicants?.find((app) => app.email === user.email);
    return myApp?.status || "pending";
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
      <MaxWidthWrapper>
        <h1 className="text-3xl font-bold mb-8">Campaigns</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "browse"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab("browse")}
          >
            Browse Campaigns ({campaigns.length})
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "applied"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab("applied")}
          >
            My Applications ({myCampaigns.length})
          </button>
        </div>

        {/* Browse Campaigns */}
        {activeTab === "browse" && (
          <>
            {campaigns.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No campaigns available right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      <Badge>{campaign.category}</Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {campaign.description}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                      <span>💰 ₹{campaign.budget}</span>
                      <span>📱 {campaign.platform}</span>
                      <span>📅 {new Date(campaign.deadline).toLocaleDateString()}</span>
                    </div>

                    {campaign.requirements && (
                      <p className="text-sm text-gray-500 mb-4">
                        <span className="font-medium">Requirements:</span>{" "}
                        {campaign.requirements}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-gray-500">
                        By {campaign.brandName}
                      </span>
                      <Button
                        onClick={() => handleApply(campaign._id)}
                        disabled={applying === campaign._id}
                      >
                        {applying === campaign._id ? "Applying..." : "Apply Now"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* My Applications */}
        {activeTab === "applied" && (
          <>
            {myCampaigns.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">
                  You have not applied to any campaigns yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myCampaigns.map((campaign) => {
                  const status = getMyApplicationStatus(campaign);
                  return (
                    <div
                      key={campaign._id}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {campaign.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {campaign.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-3">
                            <span>💰 ₹{campaign.budget}</span>
                            <span>📱 {campaign.platform}</span>
                            <span>By {campaign.brandName}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            status === "accepted"
                              ? "default"
                              : status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default CreatorCampaigns;
