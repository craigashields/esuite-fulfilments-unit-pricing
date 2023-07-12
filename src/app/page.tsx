"use client";

import React, { useState } from "react";
import SearchForm from "./components/Search";
import FulfilmentTable from "./components/FulfilmentsTable";
import Alert from "./components/Alert";

export default function Home() {
  const [searchData, setSearchData] = useState<any>(null);
  const [updateSearch, setUpdateSearch] = useState(false);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleAlert = (openAlert: boolean) => {
    if (openAlert) {
      setAlertIsOpen(true);
    } else {
      setAlertIsOpen(false);
      setErrorMessage("");
    }
  };

  // const updateSearchResults = (updateResults: boolean) => {
  //   setUpdateSearch(updateResults);
  // };

  const handleSearchData = (data: any) => {
    setSearchData(data);
  };

  const showError = (data: any) => {
    setErrorMessage("Sorry, an error has occurred!");
    toggleAlert(true);
  };

  const tableHeaders = {
    paymentReference: "Payment Reference",
    paymentDate: "Payment Date",
    paymentLineDescription: "Line Description",
    fulfilmentReference: "Fulfilment Reference",
    fulfilmentDate: "Fulfilment Date",
    unitPrice: "Unit Price",
    fulfilmentStatus: "Fulfilment Status",
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <SearchForm
        onSearchData={handleSearchData}
        updateSearch={updateSearch}
        onError={showError}
      />
      <FulfilmentTable
        key={1}
        cols={tableHeaders}
        data={searchData}
        onError={showError}
      />
      <Alert
        toggleAlert={toggleAlert}
        isOpen={alertIsOpen}
        errorMessage={errorMessage}
      ></Alert>
    </main>
  );
}
