"use client";

import React, { FormEvent, useEffect, useState } from "react";

interface SearchFormProps {
  onSearchData: (data: any) => void;
  updateSearch: boolean;
  onError: (data: any) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearchData,
  updateSearch,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchUpdate, setSearchUpdate] = useState(false);
  const [accountReference, setAccountReference] = useState("");

  if (updateSearch) {
    setSearchUpdate(true);
  }

  useEffect(() => {
    const fetchAccountData = async (accountReference: string) => {
      try {
        setIsLoading(true); // Set isLoading to true during the search process

        // get Account Information
        const response = await fetch(`/api/v1/account/${accountReference}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`eSuite Error: ${data.errorMessage}`);
        }

        // get Order Information
        const paymentsApiResponse = await fetch(
          `/api/v1/account/${accountReference}/payments`
        );
        const paymentsDataRaw = await paymentsApiResponse.json();

        const paymentsData = paymentsDataRaw.filter(
          (payment: { status: string }) => {
            return (
              payment.status === "Completed" ||
              payment.status === "Partial Refunded"
            );
          }
        );

        // get Fulfilment Information
        const fulfilmentApiResponse = await fetch(
          `/api/v1/account/${accountReference}/fulfilments`
        );
        const fulfilmentData = await fulfilmentApiResponse.json();

        if (!paymentsData || !fulfilmentData) {
          onSearchData(data);
          return;
        }

        const mergedArray = paymentsData.map(
          (obj1: {
            paymentReference: any;
            pricing: any;
            status: any;
            paymentDate: any;
            priceBreakdown: any;
          }) => {
            const {
              paymentReference,
              pricing,
              status,
              paymentDate,
              priceBreakdown,
            } = obj1;

            const priceBreakdownMap = priceBreakdown.map(
              (item: { itemDescription: any; itemGrossAmount: any }) => {
                const workingFulfilments =
                  fulfilmentData.filter(
                    (fulfilment: { fulfilmentItems: { description: any }[] }) =>
                      fulfilment.fulfilmentItems[0].description ===
                      item.itemDescription
                  ) || [];
                const fulfilmentCount = workingFulfilments.length;
                const grossAmount = item.itemGrossAmount;
                const unitPrice = (grossAmount / fulfilmentCount).toFixed(2);
                const fulfilments = workingFulfilments.map(
                  (fulfilment: any) => {
                    return {
                      ...fulfilment,
                      unitPrice,
                    };
                  }
                );
                return { ...item, fulfilments };
              }
            );

            return {
              paymentReference,
              paymentDate,
              status,
              pricing,
              priceBreakdown: priceBreakdownMap,
            };
          }
        );

        interface ConvertedItem {
          accountReference: string;
          paymentReference: string;
          paymentDate: string;
          paymentLine: string;
          paymentLineDescription: string;
          paymentStatus: string;
          fulfilmentReference: string;
          fulfilmentDate: string;
          unitPrice: string;
          fulfilmentStatus: string;
        }

        const convertedArray: ConvertedItem[] = mergedArray.flatMap(
          (item: {
            paymentReference: any;
            paymentDate: any;
            priceBreakdown: any[];
          }) => {
            const paymentReference = item.paymentReference;
            const paymentDate = item.paymentDate;

            return item.priceBreakdown.flatMap((priceBreakdownItem) => {
              const fulfilmentReference = priceBreakdownItem.fulfilments.map(
                (fulfilment: { fulfilmentReference: any }) =>
                  fulfilment.fulfilmentReference
              );
              const fulfilmentDate = priceBreakdownItem.fulfilments.map(
                (fulfilment: { fulfilmentDate: any }) =>
                  fulfilment.fulfilmentDate
              );
              const unitPrice = priceBreakdownItem.fulfilments.map(
                (fulfilment: { unitPrice: any }) => fulfilment.unitPrice
              );

              const status = priceBreakdownItem.fulfilments.map(
                (fulfilment: { status: any }) => fulfilment.status
              );

              const customFulfilmentStatus = priceBreakdownItem.fulfilments.map(
                (fulfilment: {
                  customFulfilmentParameters: {
                    customFulfilmentStatus: any;
                  };
                }) =>
                  fulfilment.customFulfilmentParameters.customFulfilmentStatus
              );

              return fulfilmentReference.map(
                (ref: any, index: string | number) => ({
                  accountReference,
                  paymentReference,
                  paymentDate,
                  paymentLine: priceBreakdownItem.itemReference,
                  paymentLineDescription: priceBreakdownItem.itemDescription,
                  status: priceBreakdownItem.itemStatus,
                  fulfilmentReference: ref,
                  fulfilmentDate: fulfilmentDate[index],
                  unitPrice: unitPrice[index],
                  fulfilmentStatus: customFulfilmentStatus[index]
                    ? customFulfilmentStatus[index]
                    : status[index],
                })
              );
            });
          }
        );

        onSearchData(convertedArray);
      } catch (error) {
        onError(error);
      } finally {
        setIsLoading(false);
        setSearchUpdate(false);
      }
    };

    if (searchUpdate) {
      fetchAccountData(accountReference).catch((e) => {
        onError(e);
      });
    }
  }, [searchUpdate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("search") as string;
    setAccountReference(query);
    setSearchUpdate(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-6/12">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          name="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search Account Reference"
          required
        />
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isLoading ? (
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
            "Search"
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
