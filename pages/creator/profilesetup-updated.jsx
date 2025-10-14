import { UploadButton } from "@/utils/uploadthing";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import { toast } from "react-toastify";

export default function CreatorProfileSetup() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    username: "",
    role: "creator",
    profileImage: "",
    bannerImage: "",
    bio: "",
    phone: "",
    city: "",
    state: "",
    category: "",
    description: "",
    socialLinks: {
      instagram: "",
      youtube: "",
      tiktok: "",
      facebook: "",
      linkedin: "",
      twitter: ""
    },
    platforms: [],
    packages: []
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = [
    "Fashion", "Beauty", "Lifestyle", "Travel", "Food", "Fitness",
    "Technology", "Gaming", "Education", "Finance", "Entertainment",
    "DIY", "Parenting", "Health", "Business", "Art & Design"
  ];

  // Add a new package form
  const [newPackage, setNewPackage] = useState({
    platform: "instagram",
    price: "",
    title: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      // Handle nested objects like socialLinks.instagram
      const [parent, child] = name.split('.');
      setUserInfo({
        ...userInfo,
        [parent]: {
          ...userInfo[parent],
          [child]: value
        }
      });
    } else {
      setUserInfo({
        ...userInfo,
        [name]: value
      });
    }
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleProfileImageUpload = async (fileUrl) => {
    setUserInfo({
      ...userInfo,
      profileImage: fileUrl
    });

    if (user && user.email) {
      try {
        const response = await fetch("/api/creator/profileImageupdate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({
            email: user.email,
            profileImage: fileUrl,
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Profile image updated successfully");
        }
      } catch (error) {
        console.error("Error updating profile image:", error);
        toast.error("Failed to update profile image");
      }
    }
  };

  const handleBannerImageUpload = async (fileUrl) => {
    setUserInfo({
      ...userInfo,
      bannerImage: fileUrl
    });

    if (user && user.email) {
      try {
        const response = await fetch("/api/creator/bannerimage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({
            email: user.email,
            bannerImage: fileUrl,
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Banner image updated successfully");
        }
      } catch (error) {
        console.error("Error updating banner image:", error);
        toast.error("Failed to update banner image");
      }
    }
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();

    if (user && user.email) {
      try {
        const response = await fetch("/api/creator/profileupdate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({
            email: user.email,
            name: userInfo.name,
            phone: userInfo.phone,
            city: userInfo.city,
            state: userInfo.state,
            username: userInfo.username,
            profileImage: userInfo.profileImage,
            bannerImage: userInfo.bannerImage
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Personal information updated successfully");

          // Update the user data in Zustand store
          const updatedUser = {
            ...user,
            name: userInfo.name,
            phone: userInfo.phone,
            city: userInfo.city,
            state: userInfo.state,
            profileImage: userInfo.profileImage,
            bannerImage: userInfo.bannerImage
          };
          setUser(updatedUser);

          // Update localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          toast.error(data.error || "Failed to update personal information");
        }
      } catch (error) {
        console.error("Error updating personal information:", error);
        toast.error("An error occurred while updating personal information");
      }
    }
  };

  const handleContentInfoSubmit = async (e) => {
    e.preventDefault();

    if (user && user.email) {
      try {
        const response = await fetch("/api/creator/addcontentinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({
            email: user.email,
            category: userInfo.category,
            description: userInfo.description,
            platforms: userInfo.platforms,
            categories: selectedCategories,
            bio: userInfo.bio
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Content information updated successfully");

          // Update the user data in Zustand store
          const updatedUser = {
            ...user,
            category: userInfo.category,
            description: userInfo.description,
            platforms: userInfo.platforms,
            categories: selectedCategories,
            bio: userInfo.bio
          };
          setUser(updatedUser);

          // Update localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          toast.error(data.error || "Failed to update content information");
        }
      } catch (error) {
        console.error("Error updating content information:", error);
        toast.error("An error occurred while updating content information");
      }
    }
  };

  const handlePackagesSubmit = async (e) => {
    e.preventDefault();

    if (user && user.email) {
      try {
        const response = await fetch("/api/creator/addpackage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa("junaid:2002")}`,
          },
          body: JSON.stringify({
            email: user.email,
            packages: userInfo.packages
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Packages updated successfully");

          // Update the user data in Zustand store
          const updatedUser = {
            ...user,
            packages: userInfo.packages
          };
          setUser(updatedUser);

          // Update localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          toast.error(data.error || "Failed to update packages");
        }
      } catch (error) {
        console.error("Error updating packages:", error);
        toast.error("An error occurred while updating packages");
      }
    }
  };

  const handleAddPackage = () => {
    if (newPackage.title && newPackage.price && newPackage.description) {
      setUserInfo({
        ...userInfo,
        packages: [...(userInfo.packages || []), newPackage]
      });

      // Reset the new package form
      setNewPackage({
        platform: "instagram",
        price: "",
        title: "",
        description: ""
      });

      toast.success("Package added");
    } else {
      toast.error("Please fill in all package fields");
    }
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...userInfo.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };

    setUserInfo({
      ...userInfo,
      packages: updatedPackages
    });
  };

  const handlePlatformChange = (index, field, value) => {
    const updatedPlatforms = [...userInfo.platforms];
    updatedPlatforms[index] = {
      ...updatedPlatforms[index],
      [field]: value
    };

    setUserInfo({
      ...userInfo,
      platforms: updatedPlatforms
    });
  };

  const handleNewPackageChange = (e) => {
    const { name, value } = e.target;
    setNewPackage({
      ...newPackage,
      [name]: value
    });
  };

  useEffect(() => {
    // Load user data from Zustand store
    if (user) {
      setUserInfo({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        role: user.role || "creator",
        profileImage: user.profileImage || "",
        bannerImage: user.bannerImage || "",
        bio: user.bio || "",
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        category: user.category || "",
        description: user.description || "",
        platforms: user.platforms || [],
        packages: user.packages || [],
        socialLinks: user.socialLinks || {
          instagram: "",
          youtube: "",
          tiktok: "",
          facebook: "",
          linkedin: "",
          twitter: ""
        }
      });

      if (user.categories && Array.isArray(user.categories)) {
        setSelectedCategories(user.categories);
      }
    }

    // Also try to get creator profile from API if it exists
    if (user && user.email) {
      fetch("/api/creator/getcreator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.creator) {
            // Merge the API data with user data
            setUserInfo(prevState => ({
              ...prevState,
              ...data.creator
            }));

            // Update selected categories
            if (data.creator.categories && Array.isArray(data.creator.categories)) {
              setSelectedCategories(data.creator.categories);
            }
          }
        })
        .catch(err => {
          console.error("Failed to fetch creator profile:", err);
        });
    }
  }, [user, setUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 p-6 md:p-10">
        {/* Personal Information Section */}
        <div className="bg-white px-4 py-5 rounded-lg shadow sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete your basic profile information to help brands understand who you are.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {/* Banner Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden relative">
                  {userInfo.bannerImage ? (
                    <Image
                      src={userInfo.bannerImage}
                      layout="fill"
                      objectFit="cover"
                      alt="Banner Image"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No banner image uploaded</p>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      handleBannerImageUpload(res[0].fileUrl);
                    }}
                    onUploadError={(error) => {
                      toast.error(`Upload error: ${error.message}`);
                    }}
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="mb-6 flex flex-col items-center">
                <div className="mb-4">
                  <Image
                    src={userInfo.profileImage || "https://via.placeholder.com/150?text=Profile"}
                    width={120}
                    height={120}
                    alt="Profile"
                    className="rounded-full object-cover w-28 h-28 border-2 border-gray-200"
                  />
                </div>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    handleProfileImageUpload(res[0].fileUrl);
                  }}
                  onUploadError={(error) => {
                    toast.error(`Upload error: ${error.message}`);
                  }}
                />
              </div>

              <form onSubmit={handlePersonalInfoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      value={userInfo.username}
                      disabled
                      className="mt-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={userInfo.name}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={userInfo.email}
                      disabled
                      className="mt-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      type="text"
                      name="phone"
                      id="phone"
                      value={userInfo.phone}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      id="city"
                      value={userInfo.city}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      name="state"
                      id="state"
                      value={userInfo.state}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select state</option>
                      <option value="AN">Andaman and Nicobar Islands</option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="AR">Arunachal Pradesh</option>
                      <option value="AS">Assam</option>
                      <option value="BR">Bihar</option>
                      <option value="CH">Chandigarh</option>
                      <option value="CG">Chhattisgarh</option>
                      <option value="DN">Dadra and Nagar Haveli</option>
                      <option value="DD">Daman and Diu</option>
                      <option value="DL">Delhi</option>
                      <option value="GA">Goa</option>
                      <option value="GJ">Gujarat</option>
                      <option value="HR">Haryana</option>
                      <option value="HP">Himachal Pradesh</option>
                      <option value="JK">Jammu and Kashmir</option>
                      <option value="JH">Jharkhand</option>
                      <option value="KA">Karnataka</option>
                      <option value="KL">Kerala</option>
                      <option value="LA">Ladakh</option>
                      <option value="LD">Lakshadweep</option>
                      <option value="MP">Madhya Pradesh</option>
                      <option value="MH">Maharashtra</option>
                      <option value="MN">Manipur</option>
                      <option value="ML">Meghalaya</option>
                      <option value="MZ">Mizoram</option>
                      <option value="NL">Nagaland</option>
                      <option value="OR">Odisha</option>
                      <option value="PY">Puducherry</option>
                      <option value="PB">Punjab</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="SK">Sikkim</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="TS">Telangana</option>
                      <option value="TR">Tripura</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="UK">Uttarakhand</option>
                      <option value="WB">West Bengal</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-start mt-6">
                  <Button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                  >
                    Save Personal Info
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Content Information Section */}
        <div className="bg-white px-4 py-5 rounded-lg shadow sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Content Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tell brands about your content style, categories, and social media presence.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleContentInfoSubmit}>
                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Primary Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={userInfo.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="fashion">Fashion</option>
                    <option value="fitness">Fitness</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="travel">Travel</option>
                    <option value="food">Food</option>
                    <option value="beauty">Beauty</option>
                    <option value="tech">Technology</option>
                    <option value="comedy">Comedy</option>
                    <option value="gaming">Gaming</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={userInfo.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Tell brands about yourself and your content..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Content Categories (Select multiple)
                  </label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Platforms
                  </label>

                  {userInfo.platforms && userInfo.platforms.map((platform, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform
                          </label>
                          <input
                            type="text"
                            value={platform.platform}
                            disabled
                            className="mt-1 block w-full border-gray-300 bg-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile URL
                          </label>
                          <input
                            type="text"
                            value={platform.profile}
                            onChange={(e) => handlePlatformChange(index, 'profile', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Followers
                          </label>
                          <select
                            value={platform.followers}
                            onChange={(e) => handlePlatformChange(index, 'followers', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="">Select followers range</option>
                            <option value="0-1k">0-1k</option>
                            <option value="1-5k">1-5k</option>
                            <option value="5-10k">5-10k</option>
                            <option value="10-50k">10-50k</option>
                            <option value="50-100k">50-100k</option>
                            <option value="100k+">100k+</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-start mt-6">
                  <Button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                  >
                    Save Content Info
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <div className="bg-white px-4 py-5 rounded-lg shadow sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Collaboration Packages
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Define packages that brands can purchase for collaborations with you.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handlePackagesSubmit}>
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">Your Packages</h4>

                  {userInfo.packages && userInfo.packages.map((pkg, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Package Title
                          </label>
                          <input
                            type="text"
                            value={pkg.title}
                            onChange={(e) => handlePackageChange(index, 'title', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform
                          </label>
                          <select
                            value={pkg.platform}
                            onChange={(e) => handlePackageChange(index, 'platform', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="text"
                            value={pkg.price}
                            onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={pkg.description}
                          onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Describe what's included in this package..."
                        />
                      </div>
                    </div>
                  ))}

                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Add New Package</h4>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Package Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={newPackage.title}
                            onChange={handleNewPackageChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., Basic Instagram Post"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform
                          </label>
                          <select
                            name="platform"
                            value={newPackage.platform}
                            onChange={handleNewPackageChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="text"
                            name="price"
                            value={newPackage.price}
                            onChange={handleNewPackageChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., 5000"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows={3}
                          value={newPackage.description}
                          onChange={handleNewPackageChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Describe what's included in this package..."
                        />
                      </div>

                      <div>
                        <Button
                          type="button"
                          onClick={handleAddPackage}
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md"
                        >
                          Add Package
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start mt-6">
                  <Button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                  >
                    Save All Packages
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Complete Setup Button */}
        <div className="flex justify-center my-8">
          <Button
            onClick={() => router.push("/creator")}
            className="inline-flex justify-center px-8 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
          >
            Complete Setup & Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
