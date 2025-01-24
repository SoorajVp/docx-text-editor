import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [user, setUser] = useState(null); // Store user's authentication response
  const [profile, setProfile] = useState(null); // Store user's profile data
  const navigate = useNavigate()

  // Google Login Hook
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("onSuccess => ", codeResponse)
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  // Fetch user profile after successful login
  useEffect(() => {
    if (user?.access_token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          },
        )
        .then((res) => {
          console.log("useEffect => ", res)
          setProfile(res.data)
          navigate("/")
        })
        .catch((err) => console.error("Error fetching user profile:", err));
    }
  }, [user]);

  // Log out function: logs the user out and clears profile
  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full items-center">
        <div className="mx-auto max-w-2xl">
          {/* Announcement Section */}
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our new document management system.{" "}
              <a href="#" className="font-semibold text-orange-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Main Section */}
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900">
              Manage, Edit, and Share Your Documents
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
              Create, upload, and edit your documents with ease. Access your
              work anytime, anywhere, with secure Google authentication.
            </p>

            <div className="mx-auto mb-2 mt-8">
              {!profile ? (
                <button
                  onClick={() => login()}
                  className="mx-auto flex items-center gap-2 border border-orange-500 px-6 py-2 font-semibold text-orange-700 transition-all duration-300 ease-in-out hover:rounded-full hover:bg-gray-100"
                >
                  <span>
                    <FcGoogle size={25} />
                  </span>
                  Sign in with Google
                </button>
              ) : (
                // Show User Information and Logout Button if Logged In
                <div className="text-center">
                  <p className="mb-4 text-lg font-medium text-gray-700">
                    Welcome, {profile.name}!
                  </p>
                  <button
                    onClick={() => logOut()}
                    className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <a href="#" className="mt-4 text-sm font-semibold text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Optional Debugging Info */}
          {profile && (
            <div className="mt-10 rounded-lg bg-gray-100 p-4">
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                Debug Info:
              </h2>
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {profile.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {profile.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
