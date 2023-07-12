"use client";

import React, { useState } from "react";

interface AlertProps {
  toggleAlert: (data: any) => void;
  isOpen: boolean;
  errorMessage?: string;
}

const Alert: React.FC<AlertProps> = ({ toggleAlert, isOpen, errorMessage }) => {
  const ariaHidden = isOpen ? false : true;
  return (
    <div
      id="alertModal"
      aria-hidden={ariaHidden}
      aria-modal="true"
      role="dialog"
      className={`fixed top-0 left-0 right-0 z-50 items-center ${
        isOpen ? "" : "hidden"
      } justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="relative w-full max-w-2xl max-h-full left-1/4">
        <div className="relative bg-red-600 rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-white dark:text-white">
              Alert
            </h3>
            <button
              type="button"
              onClick={() => toggleAlert(false)}
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
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div>
            <div className="p-4 mb-4 text-sm text-white " role="alert">
              <span className="font-medium">Oh No!</span> {errorMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Alert;
