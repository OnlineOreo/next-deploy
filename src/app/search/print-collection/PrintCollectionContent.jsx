"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function PrintCollectionContent({
  initialResults,
  initialResultsCount,
  initialSideFilterResults,
}) {
  const Router = useRouter();
  const searchParams = useSearchParams();

  const [results, setResults] = useState(initialResults || []);
  const [resultsCount, setResultsCount] = useState(initialResultsCount || 0);
  const [sideFilterResults, setSideFilterResults] = useState(initialSideFilterResults || {});
  const [loading, setLoading] = useState(false);

  const combineFacetData = (facetData) => {
    const combined = [];
    for (let i = 0; i < facetData.length; i += 2) {
      combined.push({ name: facetData[i], count: parseInt(facetData[i + 1]) });
    }
    return combined;
  };

  const fetchSolrData = async (query) => {
    if (!query) return;
  
    setLoading(true);
  
    try {
      const solrUrl = `/api/solr?q=${query}`; // Directly call the Next.js API route
  
      const { data } = await axios.get(solrUrl);
  
      const { docs, numFound, facetCounts } = data;
  
      const facets = [
        "dc_publishers_string",
        "datacite_rights_string",
        "resource_types_string",
        "datacite_creators_string",
        "dc_date",
      ];
  
      // Combine facet data using your utility function
      const sideData = facets.reduce((acc, facet) => {
        acc[facet] = combineFacetData(facetCounts[facet] || []);
        return acc;
      }, {});
  
      setResults(docs);
      setResultsCount(numFound);
      setSideFilterResults(sideData);
    } catch (err) {
      console.error("Solr fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const filterChange = async () => {
    const checkboxes = document.querySelectorAll("input.thats_filter[type='checkbox']:checked");
    const filterMap = {};

    checkboxes.forEach((checkbox) => {
      const label = checkbox.dataset.label;
      const filterType = checkbox.dataset.filtertype;

      if (!filterMap[filterType]) {
        filterMap[filterType] = [];
      }
      filterMap[filterType].push(label);
    });

    const fullQuery = decodeURIComponent(searchParams.get("q") || "");
    const baseMatch = fullQuery.match(/^([a-zA-Z0-9_*]+:(\([^)]+\)|[^ ]+))/);
    const baseQuery = baseMatch ? baseMatch[1] : "";

    const filterConditions = Object.entries(filterMap)
      .map(([type, values]) => {
        const joinedValues = values.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(" OR ");
        return `${encodeURIComponent(type)}:${encodeURIComponent(`(${joinedValues})`)}`;
      })
      .join(" AND ");

    const encodedBaseQuery = encodeURIComponent(baseQuery);
    const filterUrl = filterConditions
      ? `${encodedBaseQuery} AND ${encodeURIComponent(filterConditions)}`
      : encodedBaseQuery;

    // Update the URL in browser
    Router.push(`/search/print-collection?q=${filterUrl}`, undefined, { shallow: true });

    // Fetch new filtered data
    await fetchSolrData(filterUrl);
  };

  return (
    <div className="p-10 flex justify-between">
      <div className="w-1/4 border p-4">
        {sideFilterResults?.dc_publishers_string?.slice(0, 10).map((item, index) => (
          <div key={index}>
            <input
              className="thats_filter"
              type="checkbox"
              name={item.name}
              id={`checkbox-${index}`}
              data-filtertype="dc_publishers_string"
              data-label={item?.name || ""}
              onChange={filterChange}
            />
            <label htmlFor={`checkbox-${index}`}>{item.name}</label>
          </div>
        ))}
      </div>

      <div className="border min-w-3/4 p-4">
        <h5 className="font-bold">Total results: {resultsCount}</h5>
        <ul>
          {loading ? (
            <li>Loading...</li>
          ) : results.length > 0 ? (
            results.map((item) => (
              <li key={item.id}>{item.datacite_titles} || {item.dc_publishers}</li>
            ))
          ) : (
            <li>No results found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
