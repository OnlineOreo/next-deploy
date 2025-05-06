'use client';

import { Suspense } from "react";
import SearchBar from "../Components/SearchBar";

const Page = () => {

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Suspense>
        <SearchBar />
      </Suspense>
    </div>
  );
};

export default Page;
