import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authService from "../api/services/auth";
import { useDispatch } from "react-redux";
import { setUserDetails, setUserLoggout } from "../redux/slice/userSlice";

const LandingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if(token) {
      navigate("/")
    }
  } ,[])

  // Google Login Hook
  const login = useGoogleLogin({
    onSuccess: async(codeResponse) => {
      const { user, token } = await authService.GoogleLogin(codeResponse.access_token)
      dispatch(setUserDetails({ user, token }))
      navigate("/")
    },
    onError: (error) => console.log("Login Failed:", error),
  });



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
              <button
                onClick={() => login()}
                className="mx-auto flex items-center gap-2 border border-orange-500 px-6 py-2 font-semibold text-orange-700 transition-all duration-300 ease-in-out hover:rounded-full hover:bg-gray-100"
              >
                <span>
                  <FcGoogle size={25} />
                </span>
                Sign in with Google
              </button>
            </div>
            <a href="#" className="mt-4 text-sm font-semibold text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
