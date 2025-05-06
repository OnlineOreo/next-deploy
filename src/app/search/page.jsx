'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterType, setFilterType] = useState("datacite_titles");
  const [searchText, setSearchText] = useState(filterType === "resource_types_string" ? "book" : "");

  useEffect(() => {
    const fullQuery = searchParams.get("q") || "";
    const baseMatch = fullQuery.match(/^([a-zA-Z0-9_]+):\(([^)]+)\)/);

    if (baseMatch) {
      const type = baseMatch[1];
      setFilterType(type);
      const text = baseMatch[2];
      setSearchText(text);
    }
  }, [searchParams]);

  useEffect(()=>{
    if (filterType === "resource_types_string") {
      setSearchText("book"); 
    }
  },[filterType])

  const handleSubmit = (event) => {
    event.preventDefault();

    let catalogCore = "print-collection";
    if (filterType === "resource_types_string") {
      switch (searchText) {
        case "book":
          catalogCore = "print-collection";
          break;
        case "e-book":
        case "e-journals":
          catalogCore = "e-resources";
          break;
        case "Video":
        case "audio":
          catalogCore = "multimedia";
          break;
        default:
          catalogCore = "print-collection";
      }
    }
    const query = `${filterType}%3A(${encodeURIComponent(searchText === "" ? "*:*" : searchText)})`;

    router.push(`/search/${catalogCore}?q=${query}`);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form id="search_form" className="flex border" onSubmit={handleSubmit}>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="datacite_titles">Title</option>
          <option value="datacite_creators">Author</option>
          <option value="dc_publishers">Publisher</option>
          <option value="resource_types_string">Resource Types</option>
          <option value="college_category">Subject</option>
        </select>

        {filterType === "resource_types_string" ? (
          <select value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: "60%" }}>
            <option value="book">Print Collection</option>
            <option value="e-book">e-book</option>
            <option value="e-journals">e-journals</option>
            <option value="Video">Video</option>
            <option value="audio">Audio</option>
          </select>
        ) : (
          <input
            type="text"
            value={searchText}
            placeholder="Search with/without any keyword"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "60%" }}
          />
        )}

        <button type="submit">
          <img
            alt="Search"
            src="https://wp.alithemes.com/html/evara/evara-frontend/assets/imgs/theme/icons/search.png"
          />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
