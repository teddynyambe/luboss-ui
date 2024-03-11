import React, { useState } from "react";
import { HtmlContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";
import DateTimeDisplay from "../DateTime";
import { Member, SubmitError } from "@/components/interface/interfaces";
import Link from "next/link";
import { useSession } from "next-auth/react";
import User from "next-auth";
import { API_URI } from "../constants";

const DeclarationForm = ({ onClose, onSubmit, itemData }) => {
  function closeWindowHandler() {
    onClose();
  }
  const { data: session } = useSession();
  const [formValues, setFormValues] = useState({
    declaration_id: itemData?.declaration_id ?? "",
    saving_amount: itemData?.saving_amount ?? "",
    social_fund_amount: itemData?.social_fund_amount ?? "",
    admin_fee_amount: itemData?.admin_fee_amount ?? "",
    interest_amount: itemData?.interest_amount ?? "",
    loan_repayment_amount: itemData?.loan_repayment_amount ?? "",
    member: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<SubmitError>({ errorMessage: "", isError: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionValues = {
      ...formValues,
      member: session?.user?.member?.member_id,
    };
    try {
      let url, api_method;
      if (submissionValues.declaration_id) {
        url = API_URI + "/api/declarations/update";
        api_method = "PATCH";
      } else {
        url = API_URI + "/api/declaration";
        api_method = "POST";
      }
      const response = await fetch(url, {
        method: api_method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + session?.user?.token,
        },
        body: JSON.stringify(submissionValues),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to submit form");
      }

      // Handle success
      setFormSubmitted(true);
      onSubmit();
      onClose();
      // Reset form or redirect user
    } catch (error) {
      setSubmitError({
        errorMessage: `Error submitting form. Error message:  ${error}.`,
        isError: true,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  return (
    <>
      <h2 className="m-5 font-bold text-center">
        Declaration for <DateTimeDisplay formatOptions={{ year: "numeric", month: "long" }}></DateTimeDisplay>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-1 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="text-red-600">{submitError.isError ? submitError.errorMessage : ""}</div>
        <div className="mb-6">
          <label htmlFor="saving_amount" className="block mb-2 text-sm font-medium text-gray-900">
            Saving Amount
          </label>

          <input
            type="number"
            id="saving_amount"
            name="saving_amount"
            value={formValues.saving_amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="0.00"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="social_fund_amount" className="block mb-2 text-sm font-medium text-gray-900">
            Social Fund Amount
          </label>
          <input
            type="number"
            id="social_fund_amount"
            name="social_fund_amount"
            value={formValues.social_fund_amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="0.00"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="admin_fee_amount" className="block mb-2 text-sm font-medium text-gray-900">
            Admin Fee Amount
          </label>
          <input
            type="number"
            id="admin_fee_amount"
            name="admin_fee_amount"
            value={formValues.admin_fee_amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="0.00"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="interest_amount" className="block mb-2 text-sm font-medium text-gray-900">
            Interest Amount
          </label>
          <input
            type="number"
            id="interest_amount"
            name="interest_amount"
            value={formValues.interest_amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="0.00"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="loan_repayment_amount" className="block mb-2 text-sm font-medium text-gray-900">
            Loan Repayment Amount
          </label>
          <input
            type="number"
            id="loan_repayment_amount"
            name="loan_repayment_amount"
            value={formValues.loan_repayment_amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="0.00"
            required
          />
        </div>
        <div className="pt-5">
          <button type="submit" className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center me-5">
            Save
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeWindowHandler();
            }}
            className="text-blue-600 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Cancel
          </a>
          <div className="flex float-end pt-3">
            <span className="text-blue-700 font-bold">Total Declaration Amount:&nbsp;</span>
            {"  "}
            <span className="text-green-700">
              {new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(
                (isNaN(parseFloat(formValues.admin_fee_amount)) ? 0 : parseFloat(formValues.admin_fee_amount)) +
                  (isNaN(parseFloat(formValues.interest_amount)) ? 0 : parseFloat(formValues.interest_amount)) +
                  (isNaN(parseFloat(formValues.loan_repayment_amount)) ? 0 : parseFloat(formValues.loan_repayment_amount)) +
                  (isNaN(parseFloat(formValues.saving_amount)) ? 0 : parseFloat(formValues.saving_amount)) +
                  (isNaN(parseFloat(formValues.social_fund_amount)) ? 0 : parseFloat(formValues.social_fund_amount))
              )}
            </span>
          </div>
        </div>
      </form>
    </>
  );
};

export default DeclarationForm;
