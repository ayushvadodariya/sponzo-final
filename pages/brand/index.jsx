import React, { useEffect, useState } from "react";
import Image from "next/image";
import Reviews from "./Reviews";
import Link from "next/link";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import mongoose from "mongoose";
import Creator from "@/model/Creator";

const BrandHome = ({ creators }) => {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check if user is logged in and redirect to dashboard
    if (isLoggedIn && user && user.role === "brand") {
      // Check if user has completed profile setup
      if (!user.profileImage || !user.city || !user.state) {
        setIsNewUser(true);
      } else {
        // Redirect to dashboard if profile is complete
        router.push("/brand/dashboard");
      }
    }
  }, [isLoggedIn, user, router]);

  return (
    <div className="min-h-screen">
      <MaxWidthWrapper>
        <div className="head-center text-center p-8 mt-10">
          <h1 className="pb-4 text-5xl font-bold leading-tight">
            Get your products to a <br /> different level
          </h1>
          <p className="p-2 pt-0 text-xl pb-5 text-gray-600">
            Discover influential personalities, execute marketing campaigns, and
            generate distinctive <br /> content for your brand effortlessly.
          </p>

          {isNewUser && (
            <Link href="/brand/profilesetup">
              <button className="btn px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md">
                Complete Your Profile
              </button>
            </Link>
          )}
        </div>
      </MaxWidthWrapper>

      <div className="bg-gray-50 py-12">
        <MaxWidthWrapper>
          <h2 className="text-center p-4 text-4xl font-bold mb-8">
            Select your favorite Influencer
          </h2>

          <div className="instagram mb-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Instagram</h3>
              <Link href="/explore" className="text-indigo-600 hover:text-indigo-800">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {creators.filter(creator =>
                creator.platforms.some(p => p.platform === "instagram")
              ).slice(0, 3).map((creator) => (
                <Link href={`/creator/${creator.username}`} key={creator._id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={creator.profileImage || "/placeholder.svg"}
                        alt={creator.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-xl mb-1">{creator.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {creator.description?.substring(0, 100) || "Influencer specializing in " + creator.category}
                        {creator.description?.length > 100 ? "..." : ""}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">
                          {creator.packages && creator.packages[0] ? `₹${creator.packages[0].price}` : "Contact for pricing"}
                        </span>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {creator.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="youtube mb-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Youtube</h3>
              <Link href="/explore" className="text-indigo-600 hover:text-indigo-800">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {creators.filter(creator =>
                creator.platforms.some(p => p.platform === "youtube")
              ).slice(0, 3).map((creator) => (
                <Link href={`/creator/${creator.username}`} key={creator._id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={creator.profileImage || "/placeholder.svg"}
                        alt={creator.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-xl mb-1">{creator.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {creator.description?.substring(0, 100) || "Influencer specializing in " + creator.category}
                        {creator.description?.length > 100 ? "..." : ""}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">
                          {creator.packages && creator.packages[0] ? `₹${creator.packages[0].price}` : "Contact for pricing"}
                        </span>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {creator.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        <Reviews />
      </MaxWidthWrapper>
    </div>
  );
};

export default BrandHome;

export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  let creators = await Creator.find({}).limit(12);

  return {
    props: {
      creators: JSON.parse(JSON.stringify(creators)),
    },
  };
}
