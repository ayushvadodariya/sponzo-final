import { UploadButton } from "@/utils/uploadthing";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import { toast } from "react-toastify";

export default function Example() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    username: "",
    role: "brand",
    profileImage: "",
    apartment: "",
    officeAddress: "",
    city: "",
    state: "",
    pinCode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user) {
      fetch("/api/brand/profileupdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify({
          ...userInfo,
          email: user.email
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success("Profile Updated Successfully");

            // Update the user data in Zustand store with updated profile info
            const updatedUser = {
              ...user,
              ...userInfo
            };
            setUser(updatedUser);

            // Update localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // Redirect to brand dashboard
            setTimeout(() => {
              router.push("/brand");
            }, 1000);
          } else {
            toast.error(data.error || "Failed to update profile");
          }
        })
        .catch(err => {
          toast.error("An error occurred. Please try again.");
          console.error(err);
        });
    }
  };

  useEffect(() => {
    // Load user data from Zustand store
    if (user) {
      setUserInfo({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        role: user.role || "brand",
        profileImage: user.profileImage || "",
        apartment: user.apartment || "",
        officeAddress: user.officeAddress || "",
        city: user.city || "",
        state: user.state || "",
        pinCode: user.pinCode || ""
      });
    }

    // Also try to get brand profile from API if it exists
    if (user && user.email) {
      fetch("/api/brand/getbrand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.brand) {
            // Merge the API data with user data
            setUserInfo(prevState => ({
              ...prevState,
              ...data.brand
            }));
          }
        })
        .catch(err => {
          console.error("Failed to fetch brand profile:", err);
        });
    }
  }, [user, setUser]);

  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-10">
        <div className="px-4 py-5 sm:rounded-lg sm:p-6 bg-white shadow">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Brand Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete your brand profile to help influencers understand your business better.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                    <div className="mb-4">
                      <Image
                        src={userInfo.profileImage || "https://via.placeholder.com/200x200?text=Brand+Logo"}
                        width={120}
                        height={120}
                        alt="Brand Logo"
                        className="rounded-full object-cover w-28 h-28 border-2 border-gray-200"
                      />
                    </div>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setUserInfo({
                          ...userInfo,
                          profileImage: res[0].fileUrl,
                        });
                      }}
                      onUploadError={(error) => {
                        toast.error(`Upload error: ${error.message}`);
                      }}
                    />
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Brand Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={userInfo.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        disabled
                        className="mt-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        value={userInfo.username}
                        onChange={handleChange}
                        disabled
                        className="mt-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-6">
                  <div className="col-span-6">
                    <label
                      htmlFor="apartment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apartment, suite, etc.
                    </label>
                    <Input
                      type="text"
                      name="apartment"
                      id="apartment"
                      value={userInfo.apartment}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="officeAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Office Address
                    </label>
                    <Input
                      type="text"
                      name="officeAddress"
                      id="officeAddress"
                      value={userInfo.officeAddress}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
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

                  <div className="col-span-6 md:col-span-2">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <div className="mt-1">
                      <select
                        name="state"
                        id="state"
                        value={userInfo.state}
                        onChange={handleChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a state</option>
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

                  <div className="col-span-6 md:col-span-2">
                    <label
                      htmlFor="pinCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      PIN Code
                    </label>
                    <Input
                      type="text"
                      name="pinCode"
                      id="pinCode"
                      value={userInfo.pinCode}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-start mt-8">
                  <Button
                    type="submit"
                    className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                  >
                    Save Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
