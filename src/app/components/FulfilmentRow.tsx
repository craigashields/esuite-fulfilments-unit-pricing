"use client";

import React, { useEffect, useState } from "react";

interface RowProps {
  toggleModal: (openModal: any, updateResults?: any) => void;
  updateCurrentFulfilment: (data: any) => void;
  data: {
    accountReference: string;
    paymentReference: string;
    paymentDate: string;
    paymentLine: string;
    paymentLineDescription: string;
    status: string;
    fulfilmentReference: string;
    fulfilmentDate: string;
    unitPrice: number;
    fulfilmentStatus: string;
  };
}

const FulfilmentRow: React.FC<RowProps> = ({
  toggleModal,
  updateCurrentFulfilment,
  data,
}) => {
  const paymentDate = new Date(data.paymentDate);
  const fulfilmentDate = new Date(data.fulfilmentDate);

  const selectedFulfilment = (e: any) => {
    const row = e.target.parentElement.parentElement;
    const paymentLine = row
      .querySelectorAll("[data-paymentline]")[0]
      .getAttribute("data-paymentline");
    const unitPrice = row
      .querySelectorAll("[data-unitprice]")[0]
      .getAttribute("data-unitprice");
    const paymentReference = row
      .querySelectorAll("[data-paymentreference]")[0]
      .getAttribute("data-paymentreference");
    const accountReference = row
      .querySelectorAll("[data-accountreference]")[0]
      .getAttribute("data-accountreference");
    const fulfilmentReference = row
      .querySelectorAll("[data-fulfilmentreference]")[0]
      .getAttribute("data-fulfilmentreference");
    const fulfilmentStatus = row
      .querySelectorAll("[data-status]")[0]
      .getAttribute("data-status");
    const data = {
      accountReference: accountReference,
      paymentReference: paymentReference,
      paymentLine: paymentLine,
      fulfilmentReference: fulfilmentReference,
      unitPrice: unitPrice,
      fulfilmentStatus: fulfilmentStatus,
    };
    toggleModal(true);
    updateCurrentFulfilment(data);
  };

  return (
    <tr
      id={data.fulfilmentReference}
      key={data.fulfilmentReference}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      <th
        data-accountreference={data.accountReference}
        data-paymentreference={data.paymentReference}
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {data.paymentReference}
      </th>
      <td className="px-6 py-4">
        {new Intl.DateTimeFormat("en-GB").format(paymentDate)}
      </td>
      {/* <td className="px-6 py-4">{data.paymentLine}</td> */}
      <td className="px-6 py-4">{data.paymentLineDescription}</td>

      {/* <td className="px-6 py-4">{data.status}</td> */}
      <td
        className="px-6 py-4"
        data-fulfilmentreference={data.fulfilmentReference}
        data-paymentline={data.paymentLine}
      >
        {data.fulfilmentReference}
      </td>
      <td className="px-6 py-4">
        {new Intl.DateTimeFormat("en-GB").format(fulfilmentDate)}
      </td>
      <td data-unitprice={data.unitPrice} className="px-6 py-4">
        {data.unitPrice}
      </td>
      <td
        data-status={data.fulfilmentStatus}
        className={`px-6 py-4 ${
          data.fulfilmentStatus === "Refunded" ? "text-red-600" : ""
        }`}
      >
        {data.fulfilmentStatus}
      </td>

      <td className="px-6 py-4" data-rowaction>
        <a
          href="#"
          onClick={selectedFulfilment}
          className={`font-medium dark:text-blue-500 hover:underline ${
            data.fulfilmentStatus === "Refunded"
              ? "pointer-events-none text-gray-500"
              : "text-red-600"
          }`}
        >
          Refund
        </a>
      </td>
    </tr>
  );
};

export default FulfilmentRow;
