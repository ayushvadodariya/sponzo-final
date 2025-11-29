import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-2 text-gray-600">
            Choose how you want to use Sponzo
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {/* Brand Signup Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                I&apos;m a Brand
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Find influencers to promote your products and grow your business
              </p>
              <Link href="/brand/signup">
                <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700">
                  Sign up as Brand
                </Button>
              </Link>
            </div>
          </div>

          {/* Creator Signup Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                I&apos;m a Creator
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Connect with brands and monetize your influence
              </p>
              <Link href="/creator/signup">
                <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
                  Sign up as Creator
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
