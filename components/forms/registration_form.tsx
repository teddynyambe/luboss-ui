import AuthLayout from "@/components/layouts/auth/Layout";
import { useSession } from "next-auth/react";
import { HtmlContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";
import Link from "next/link";
import React, { useState } from "react";
import { ReactNode } from "react";
import { Member, SubmitError } from "@/components/interface/interfaces";
import { API_URI } from "../constants";

const RegistrationForm = ({ selectedUser, onClose }) => {
  console.log(selectedUser);
  const [user, setUser] = useState(selectedUser);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [submitError, setSubmitError] = useState<SubmitError>({ errorMessage: "", isError: false });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formSubmitted, setFormSubmitted] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  //   import { useState } from "react";

  // Define a state variable for storing the initial form data

  const [formData, setFormData] = useState<Member>({
    user: {
      username: selectedUser?.user.username ?? "",
      is_active: selectedUser?.user.is_active ?? false,
      password: selectedUser?.user ? "no_change" : "", // Assuming logic to not change password unless specified
    },
    first_name: selectedUser?.first_name ?? "",
    last_name: selectedUser?.last_name ?? "",
    nrc: selectedUser?.nrc ?? "",
    member_mobile: selectedUser?.member_mobile ?? "",
    address_1: selectedUser?.address_1 ?? "",
    address_2: selectedUser?.address_2 ?? "",
    town: selectedUser?.town ?? "",
    province: selectedUser?.province ?? "",
    country: selectedUser?.country ?? "",
    bank_name: selectedUser?.bank_name ?? "",
    branch_name: selectedUser?.branch_name ?? "",
    branch_code: selectedUser?.branch_code ?? "",
    account_number: selectedUser?.account_number ?? "",
    branch_address: selectedUser?.branch_address ?? "",
    next_of_kin_fullname: selectedUser?.next_of_kin_fullname ?? "",
    next_of_kin_nrc: selectedUser?.next_of_kin_nrc ?? "",
    next_of_kin_mobile: selectedUser?.next_of_kin_mobile ?? "",
  });

  const [initialFormData, setInitialFormData] = useState<Member>(formData);

  // Further use of formData follows...

  const { data: session } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    const [parent, child] = name.split(".");

    if (name === "is_active") {
      "active" === value
        ? setFormData({
            ...formData,
            user: {
              ...formData.user,
              [name]: true,
            },
          })
        : setFormData({
            ...formData,
            user: {
              ...formData.user,
              [name]: false,
            },
          });
    } else if (name === "username" || name === "password") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user: {
          ...prevFormData.user,
          [name]: value,
        },
      }));
    } else {
      //console.log("The name and value is: ", name, value); // No need to convert "active"/"disabled" to boolean here since formData handles strings
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleClose = () => {
    console.log("Clossing window");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formMethod = user ? "PUT" : "POST";
    const token = user ? "Token " + session?.user?.token : "";

    // Determine the URL based on whether we're adding a new member or updating an existing one
    const url = user ? API_URI + "/api/member/" + user.member_id : API_URI + "/api/member";

    let payload = formData;

    // If updating, filter formData to only include fields that have changed compared to initialFormData
    if (user) {
      payload = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== initialFormData[key]) {
          // Check conditions and delete accordingly
          delete formData[key]?.username;
          delete formData[key]?.password;

          acc[key] = formData[key];
        }
        return acc;
      }, {});
    }

    try {
      console.log(JSON.stringify(payload));

      const response = await fetch(url, {
        method: formMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const textResponse = await response.text();
        throw new Error(`Failed to submit form - ${textResponse}`);
      }

      // Handle success
      setFormSubmitted(true);
      onClose();
      // Reset form or redirect user
    } catch (error) {
      setSubmitError({
        errorMessage: `Error submitting form. Error message:  ${error}.`,
        isError: true,
      });
    }
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const form_method = user ? "PUT" : "POST";
  //     const token = user ? "Token " + session?.user?.token : "";

  //     console.log(JSON.stringify(formData));

  //     const url = user ? "http://127.0.0.1:8000/api/member/update" : "http://127.0.0.1:8000/api/member";
  //     try {
  //       console.log(JSON.stringify(formData));

  //       const response = await fetch(url, {
  //         method: form_method,
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: token,
  //         },
  //         body: JSON.stringify(formData),
  //       });

  //       if (!response.ok) {
  //         const textResponse = await response.text();
  //         throw new Error(`Failed to submit form - ${textResponse}`);
  //       }

  //       // Handle success
  //       setFormSubmitted(true);
  //       onClose();
  //       // Reset form or redirect user
  //     } catch (error) {
  //       setSubmitError({
  //         errorMessage: `Error submitting form. Error message:  ${error}.`,
  //         isError: true,
  //       });
  //     }
  //   };

  if (formSubmitted) {
    return !user ? (
      <div style={{ height: "80vh" }} className="h-screen p-10 text-center">
        Member registration successful. You will receive a message to your email when the group admin activates your account to login. Return to
        <Link className="font-bold" href="/login">
          Login
        </Link>
        .
      </div>
    ) : (
      <div style={{ height: "80vh" }} className="h-screen p-10 text-center">
        Member Updated successful.
      </div>
    );
  }

  if (submitError.isError) {
    return (
      <div style={{ height: "80vh" }} className="h-screen p-10 text-center">
        {submitError.errorMessage}
      </div>
    );
  }

  if (submitError)
    return (
      <AuthLayout>
        <div>
          <h2 className="m-5 font-bold text-center">{user ? "Update Member Details" : "Register New Member"}</h2>
          <form className="space-y-1 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="bg-slate-200 mt-5">
              <div className="flex justify-end text-blue-500 font-bold">Login details</div>
            </div>
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.user.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {user ? (
              <div>
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="is_active"
                  id="is_active"
                  value={formData.user.is_active ? "active" : "disabled"}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-blue-950 border rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.user.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-blue-950 border rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    required
                    className="w-full px-3 py-2 text-blue-950 border rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
            <div className="bg-slate-200 mt-5">
              <div className="flex justify-end text-blue-500 font-bold">Personal details</div>
            </div>
            <div>
              <label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                name="first_name"
                id="first_name"
                required
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="nrc" className="text-sm font-medium text-gray-700">
                NRC
              </label>
              <input
                type="text"
                name="nrc"
                id="nrc"
                value={formData.nrc}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="member_mobile" className="text-sm font-medium text-gray-700">
                Member Mobile
              </label>
              <input
                type="text"
                name="member_mobile"
                id="member_mobile"
                value={formData.member_mobile}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="Address 1" className="text-sm font-medium text-gray-700">
                Address 1
              </label>
              <input
                type="text"
                name="address_1"
                id="address_1"
                value={formData.address_1}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="Address 2" className="text-sm font-medium text-gray-700">
                Address 2
              </label>
              <input
                type="text"
                name="address_2"
                id="address_2"
                value={formData.address_2}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="town" className="text-sm font-medium text-gray-700">
                Town
              </label>
              <input
                type="text"
                name="town"
                id="town"
                value={formData.town}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="Province" className="text-sm font-medium text-gray-700">
                Province
              </label>
              <input
                type="text"
                name="province"
                id="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="Country" className="text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="bg-slate-200 mt-5">
              <div className="flex justify-end text-blue-500 font-bold">Bank Details</div>
            </div>

            <div>
              <label htmlFor="account_number" className="text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                name="account_number"
                id="account_number"
                value={formData.account_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="bank_name" className="text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                id="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="branch_name" className="text-sm font-medium text-gray-700">
                Branch Name
              </label>
              <input
                type="text"
                name="branch_name"
                id="branch_name"
                value={formData.branch_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="branch_code" className="text-sm font-medium text-gray-700">
                Branch Code
              </label>
              <input
                type="text"
                name="branch_code"
                id="branch_code"
                value={formData.branch_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="branch_address" className="text-sm font-medium text-gray-700">
                Branch Address
              </label>
              <input
                type="text"
                name="branch_address"
                id="branch_address"
                value={formData.branch_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-slate-200 mt-5">
              <div className="flex justify-end text-blue-500 font-bold">Next of Kin</div>
            </div>
            <div>
              <label htmlFor="next_of_kin_fullname" className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                name="next_of_kin_fullname"
                id="next_of_kin_fullname"
                value={formData.next_of_kin_fullname}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="next_of_kin_nrc" className="text-sm font-medium text-gray-700">
                NRC
              </label>
              <input
                type="text"
                name="next_of_kin_nrc"
                id="next_of_kin_nrc"
                value={formData.next_of_kin_nrc}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="next_of_kin_mobile" className="text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="text"
                name="next_of_kin_mobile"
                id="next_of_kin_mobile"
                value={formData.next_of_kin_mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-blue-950 rounded-md shadow-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-3 py-2 mt-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {user ? "Update" : "Register"}
              </button>
              <button type="button" className="text-blue-600 font-bold p-4" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>

          {!user && (
            <p className="text-sm text-center m-5 text-gray-100">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-blue-500 hover:underline">Login</span>
              </Link>
            </p>
          )}
        </div>
      </AuthLayout>
    );
};

export default RegistrationForm;
