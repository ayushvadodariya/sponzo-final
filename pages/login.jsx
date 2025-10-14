import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/store/useUserStore";

export default function Example() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(userInfo)
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("junaid:2002")}`,
      },
      body: JSON.stringify(userInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        if (data.success) {
          // alert("Account Created")
          toast.success("Login Success", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          const userData = {
            email: data.email,
            name: data.name,
            username: data.username,
            role: data.role,
            token: data.token,
          };

          // Store in Zustand
          setUser(userData);

          // For backward compatibility
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData));
          }
          setTimeout(() => {
            if (data.role === "brand") {
              router.push("/brand");
            } else if (data.role === "creator") {
              router.push("/creator");
            } else {
              router.push("/");
            }
          }, 1000);
        } else {
          toast.error(data.error, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
  };

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* <Navbar /> */}
      <div className="h-max text-center py-20">
        <h1 className="text-3xl font-semibold mt-20">Login to your account</h1>
        <div className=" w-full ">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 w-80 my-10 mx-auto"
          >
            <Input
              onChange={handleChange}
              id="email"
              name="email"
              required
              type="email"
              value={userInfo.email}
              placeholder="Email address"
            />
            <Input
              onChange={handleChange}
              id="password"
              name="password"
              type="password"
              required
              minLength={1}
              value={userInfo.password}
              placeholder="Password"
            />
            <Link href="/forgot">
              <p className="text-blue-500 hover:underline">forgot password?</p>
            </Link>
            <Button type="submit">Login</Button>
          </form>
          <div>
            <p className="text-sm text-gray-500">
              Don&#39;t have an account?{" "}
              <Link href="/signup">
                <span className="text-blue-500 hover:underline">Sign up</span>
              </Link>
            </p>
          </div>
          t
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
