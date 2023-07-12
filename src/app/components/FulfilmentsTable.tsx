"use client";

import React, { useState, useEffect } from "react";
import FulfilmentRow from "./FulfilmentRow";
import Modal from "./Modal";

interface TableProps {
  cols: {
    paymentReference: string;
    paymentDate: string;
    paymentLineDescription: string;
    fulfilmentReference: string;
    fulfilmentDate: string;
    unitPrice: string;
    fulfilmentStatus: string;
    action?: string;
  };
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
  }[];
  onError: (data: any) => void;
}

const FulfilmentTable: React.FC<TableProps> = ({ cols, data, onError }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentFulfilment, setCurrentFulfilment] = useState({});

  const toggleModal = (openModal: boolean, updateResults?: boolean) => {
    if (openModal) {
      setModalIsOpen(true);
    } else {
      setModalIsOpen(false);
    }
  };

  const updateCurrentFulfilment = (data: any) => {
    setCurrentFulfilment(data);
  };

  const headers: string[] = Object.values(cols);
  headers.push("Action");
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-16">
      <table
        key="1"
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((row) => (
              <FulfilmentRow
                key={row.fulfilmentReference}
                toggleModal={toggleModal}
                updateCurrentFulfilment={updateCurrentFulfilment}
                data={row}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal
        toggleModal={toggleModal}
        isOpen={modalIsOpen}
        data={currentFulfilment}
        onError={onError}
      ></Modal>
    </div>
  );
};

export default FulfilmentTable;
