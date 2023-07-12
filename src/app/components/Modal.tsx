"use client";

import React, { FormEvent, useState } from "react";

interface ModalProps {
  toggleModal: (openModal: any, updateResults?: any) => void;
  isOpen: boolean;
  data: {
    accountReference?: string;
    paymentReference?: string;
    paymentLine?: string;
    fulfilmentReference?: string;
    unitPrice?: number;
    fulfilmentStatus?: string;
  };
  onError: (data: any) => void;
}

const Modal: React.FC<ModalProps> = ({
  toggleModal,
  isOpen,
  data,
  onError,
}) => {
  const [isRefunding, setisRefunding] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("reason") as string;
    try {
      setisRefunding(true);
      const refundBody = {
        paymentReference: data.paymentReference,
        paymentLine: data.paymentLine,
        reason: query,
        unitPrice: data.unitPrice,
        fulfilmentReference: data.fulfilmentReference,
      };
      const refundApiResponse = await fetch(
        `/api/v1/account/${data.accountReference}/payments/refund`,
        {
          method: "POST",
          body: JSON.stringify(refundBody),
        }
      );

      if (!refundApiResponse.ok) {
        throw new Error("An error occurred while refunding line item.");
      }
      const fulfilmentBody = {
        fulfilmentReference: data.fulfilmentReference,
        reason: query,
      };

      const fulfilmentApiResponse = await fetch(
        `/api/v1/account/${data.accountReference}/fulfilments/update`,
        {
          method: "PATCH",
          body: JSON.stringify(fulfilmentBody),
        }
      );

      if (!fulfilmentApiResponse.ok) {
        throw new Error("An error occurred while updating fulfilment record.");
      }

      toggleModal(false, true);
    } catch (error) {
      onError(error);
    } finally {
      setisRefunding(false);
    }
  };

  const ariaHidden = isOpen ? false : true;
  return (
    <div
      id="editFulfilmentModal"
      aria-hidden={ariaHidden}
      aria-modal="true"
      role="dialog"
      className={`fixed top-0 left-0 right-0 z-50 items-center ${
        isOpen ? "" : "hidden"
      } justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="relative w-full max-w-2xl max-h-full left-1/4">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-200 rounded-lg shadow dark:bg-gray-700"
        >
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Fulfilment
            </h3>
            <button
              type="button"
              onClick={() => toggleModal(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="editUserModal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select an Reason
                </label>
                <select
                  name="reason"
                  defaultValue={"DEFAULT"}
                  id="reason"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="DEFAULT" disabled>
                    Choose a Reason
                  </option>
                  <option value="MissedDelivery">Missed Delivery</option>
                  <option value="CustomerComplaint">Customer Complaint</option>
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>
                <label
                  id="status"
                  className="shadow-sm bg-gray-200 border border-white text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Status"
                >
                  {" "}
                  {data.fulfilmentStatus}
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isRefunding ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 008-8h-4a4 4 0 11-8 0H4a8 8 0 008 8zm8-9.291A7.962 7.962 0 0020 12h-4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"
                  />
                </svg>
              ) : (
                "Refund"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Modal;
