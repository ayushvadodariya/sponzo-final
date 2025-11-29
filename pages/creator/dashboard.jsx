import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import { toast } from "react-toastify";
import { IoLocationSharp } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const CreatorDashboard = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collaborations, setCollaborations] = useState([]);

  useEffect(() => {
    // Check if user is logged in and is a creator
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'creator') {
      router.push('/');
      toast.error("This page is only accessible to creators");
      return;
    }

    // Fetch creator data
    const fetchCreatorData = async () => {
      try {
        const response = await fetch("/api/creator/getcreator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();
        if (data.success && data.creator) {
          setCreatorData(data.creator);
        } else {
          // If profile not complete, redirect to profile setup
          router.push('/creator/profilesetup-updated');
          toast.info("Please complete your profile setup first");
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
        toast.error("Failed to load your profile data");
      } finally {
        setLoading(false);
      }
    };

    // Fetch collaborations (mock data for now)
    const fetchCollaborations = () => {
      // This would be a real API call in production
      setCollaborations([
        {
          id: 1,
          brandName: "Fashion Brand",
          status: "in-progress",
          platform: "instagram",
          price: "₹5,000",
          date: "2023-05-15"
        },
        {
          id: 2,
          brandName: "Tech Gadgets",
          status: "completed",
          platform: "youtube",
          price: "₹15,000",
          date: "2023-04-22"
        },
        {
          id: 3,
          brandName: "Organic Foods",
          status: "pending",
          platform: "instagram",
          price: "₹3,500",
          date: "2023-05-18"
        }
      ]);
    };

    fetchCreatorData();
    fetchCollaborations();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Creator Profile Header */}
      {creatorData && (
        <div className="w-full relative">
          {/* Banner Image */}
          <div className="w-full h-64 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            {creatorData.bannerImage ? (
              <Image
                src={creatorData.bannerImage}
                layout="fill"
                objectFit="cover"
                alt="Banner"
                className="opacity-80"
              />
            ) : null}

            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
              <div className="flex items-end">
                <div className="mr-6">
                  <Image
                    src={creatorData.profileImage || "/placeholder.svg"}
                    width={120}
                    height={120}
                    alt="Profile"
                    className="rounded-full border-4 border-white object-cover w-28 h-28"
                  />
                </div>

                <div className="text-white">
                  <h1 className="text-3xl font-bold">{creatorData.name}</h1>
                  <p className="text-gray-200">@{creatorData.username}</p>
                  <div className="flex items-center mt-1 text-sm">
                    <IoLocationSharp className="mr-1" />
                    {creatorData.city}, {creatorData.state}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push('/creator/profilesetup-updated')}
                className="bg-white text-indigo-700 hover:bg-gray-100"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dashboard Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Collaborations</p>
                  <p className="text-2xl font-bold">{collaborations.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold">
                    {collaborations.filter(c => c.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold">
                    {collaborations.filter(c => c.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Collaborations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Collaborations</h2>
                <Button variant="outline" className="text-sm">View All</Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {collaborations.map((collab) => (
                      <tr key={collab.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {collab.brandName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collab.platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collab.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(collab.status)}`}>
                            {collab.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(collab.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}

                    {collaborations.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No collaborations yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Creator Packages */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Packages</h2>
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => router.push('/creator/profilesetup-updated')}
                >
                  Edit
                </Button>
              </div>

              {creatorData && creatorData.packages && creatorData.packages.length > 0 ? (
                <div className="space-y-4">
                  {creatorData.packages.map((pkg, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{pkg.title}</h3>
                        <span className="text-indigo-600 font-medium">₹{pkg.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Platform: {pkg.platform}</p>
                      <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">No packages added yet</p>
                  <Button
                    onClick={() => router.push('/creator/profilesetup-updated')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add Your First Package
                  </Button>
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Content Categories</h2>
              <div className="flex flex-wrap gap-2">
                {creatorData && creatorData.categories && creatorData.categories.length > 0 ? (
                  creatorData.categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                      {category}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No categories selected</p>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Social Media Platforms</h2>

              {creatorData && creatorData.platforms && creatorData.platforms.length > 0 ? (
                <div className="space-y-3">
                  {creatorData.platforms.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          {platform.platform === 'instagram' && (
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                            </svg>
                          )}
                          {platform.platform === 'youtube' && (
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                              <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                            </svg>
                          )}
                          {platform.platform === 'facebook' && (
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{platform.platform}</p>
                          <p className="text-xs text-gray-500">Followers: {platform.followers}</p>
                        </div>
                      </div>
                      <a
                        href={platform.profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 text-sm hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No social media platforms added</p>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I get paid?</AccordionTrigger>
                <AccordionContent>
                  Payments are made directly through our website. We use Dots to pay
                  you out. Once you complete an order, you will be able to choose
                  from over 5 methods including PayPal, CashApp or Venmo to receive
                  your money.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is my payment guaranteed?</AccordionTrigger>
                <AccordionContent>
                  Yes, we collect the payment from the buyer and hold it until the
                  order is complete. This ensures that both sides are protected
                  during every transaction.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I decline orders?</AccordionTrigger>
                <AccordionContent>
                  Yes, you are able to accept or decline an order. This gives you
                  the freedom to only work with brands that align with you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What platforms does Sponzo support?
                </AccordionTrigger>
                <AccordionContent>
                  Currently you can list your services for Instagram, TikTok,
                  YouTube, and Facebook.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
