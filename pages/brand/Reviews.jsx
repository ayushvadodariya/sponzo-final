import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

const reviewsData = [
  {
    id: 1,
    text: "Working with influencers through this platform helped us reach our target audience more effectively. The analytics provided gave us clear insights into the campaign performance.",
    author: "Sarah Johnson",
    position: "Marketing Director, TechStyle Co.",
    date: "Dec 15, 2024",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/23.jpg"
  },
  {
    id: 2,
    text: "The quality of influencers on this platform is outstanding. We found creators who truly understood our brand values and created authentic content that resonated with their audience.",
    author: "Michael Chen",
    position: "Brand Manager, EcoLife Products",
    date: "Nov 28, 2024",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/54.jpg"
  },
  {
    id: 3,
    text: "From campaign setup to final reporting, the process was seamless. We were able to collaborate with multiple influencers simultaneously and saw a significant boost in our conversion rates.",
    author: "Priya Sharma",
    position: "CEO, Fitness Collective",
    date: "Jan 7, 2025",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/45.jpg"
  },
];

const Reviews = () => {
  return (
    <div className="py-16">
      <h2 className="text-4xl font-bold text-center mb-12">What Our Brands Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviewsData.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-gray-700 mb-6">"{review.text}"</p>
            <div className="flex items-center">
              <div className="relative h-12 w-12 mr-4">
                <Image
                  src={review.image}
                  alt={review.author}
                  layout="fill"
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{review.author}</h3>
                <p className="text-sm text-gray-600">{review.position}</p>
                <span className="block text-xs text-gray-500 mt-1">{review.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
