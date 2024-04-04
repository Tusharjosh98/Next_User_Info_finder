"use client";
import { useState } from "react";
import { UserInfo } from "@/components/UserInfo";
import { Loader } from "@/components/loader";

export const FindUser = () => {
  const [formData, setFormData] = useState({ username: "" });
  const [fieldError, setFieldError] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    age: "",
    gender: "",
    nationailty: "",
  });

  // Handling form fields change
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // To handle form submission
  const onFormSubmit = (event) => {
    event.preventDefault();
    setisLoading(false);
    setNoDataFound(false);
    setShowUserDetails(false);
    if (formData.username && formData.username === "") {
      setFieldError(true);
    } else {
      fetchUserData();
    }
  };

  const fetchUserData = async () => {
    setShowUserDetails(false);
    setisLoading(true);
    const retrivedUserData = {
      age: "",
      gender: "",
      nationailty: "",
    };
    const getAge = await fetch(
      `https://api.agify.io/?name=${formData.username}`
    )
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        // Handle the JSON data
        retrivedUserData["age"] = data?.age;
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
      });
    const getGender = await fetch(
      `https://api.genderize.io/?name=${formData.username}`
    )
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        // Handle the JSON data
        retrivedUserData["gender"] = data?.gender;
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
      });

    const getNatonality = await fetch(
      `https://api.nationalize.io/?name=${formData.username}`
    )
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        // Handle the JSON data
        const countries = data?.country || [];
        if (countries.length > 0) {
          const highestProCount =
            countries.reduce((curr, prev) =>
              curr.probability > prev.probability ? curr : prev
            ) || {};
          console.warn(highestProCount);
          retrivedUserData["nationailty"] = highestProCount?.country_id;
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
      });
    setisLoading(false);
    if (
      retrivedUserData.age === "" &&
      retrivedUserData.gender === "" &&
      retrivedUserData.nationailty == ""
    ) {
      setNoDataFound(true);
    } else {
      setShowUserDetails(true);
      setUserDetails(retrivedUserData);
    }
  };
  return (
    <div className="w-96 mx-auto bg-white rounded-lg h-96 p-6 flex flex-col">
      <div className="flex text-3xl text-center justify-center font-bold">
        User Information
      </div>
      <form className="mt-8 space-y-6" onSubmit={onFormSubmit}>
        <div className="flex">
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleFormChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Enter User's Name"
          />
          {fieldError && (
            <label className="block text-red-600">
              Username cannot be empty
            </label>
          )}
        </div>
        <div className="flex">
          <button
            type="submit"
            className="w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-teal-600"
          >
            Find
          </button>
        </div>
      </form>
      {isLoading && (
        <Loader />
      )}
      {showUserDetails && !noDataFound && (
        <div className="flex mt-8 flex-col">
          <div className="text-lg font-semibold">
            User Details for {formData.username} is:
          </div>
          <UserInfo
            user_info_label={"Age"}
            user_info_value={userDetails["age"]}
          ></UserInfo>
          <UserInfo
            user_info_label={"Gender"}
            user_info_value={userDetails["gender"]}
          ></UserInfo>
          <UserInfo
            user_info_label={"Nationailty"}
            user_info_value={userDetails["nationailty"]}
          ></UserInfo>
        </div>
      )}
      {noDataFound && (
        <div className="flex mt-8 flex-col  justify-center items-center">
          <div className="text-lg font-semibold">No Data Found</div>
        </div>
      )}
    </div>
  );
};
