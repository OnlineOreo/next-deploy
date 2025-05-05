"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";

export default function EResourcesComponent({
    initialResults,
    initialResultsCount,
    initialSideFilterResults,
}) {
    const Router = useRouter();
    const searchParams = useSearchParams();

    const [results, setResults] = useState([]);
    const [resultsCount, setResultsCount] = useState(0);
    const [sideFilterResults, setSideFilterResults] = useState({});

    useEffect(() => {
        setResults(initialResults || []);
        setResultsCount(initialResultsCount || 0);
        setSideFilterResults(initialSideFilterResults || {});
    }, [initialResults, initialResultsCount, initialSideFilterResults]);

    const filterChange = () => {
        const filterMap = {};

        const checkboxes = document.querySelectorAll('input.thats_filter[type="checkbox"]:checked');

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
                const joinedValues = values
                    .map((v) => `"${v.replace(/"/g, '\\"')}"`)
                    .join(" OR ");
                return `${encodeURIComponent(type)}:${encodeURIComponent(`(${joinedValues})`)}`;
            })
            .join(" AND ");

        const encodedBaseQuery = encodeURIComponent(baseQuery);
        const filterUrl = filterConditions
            ? `${encodedBaseQuery} AND ${encodeURIComponent(filterConditions)}`
            : encodedBaseQuery;

        Router.push(`/search/e-resources?q=${filterUrl}`, undefined, { shallow: true });
    };

    return (
        <div className='p-10 flex justify-between'>
            <div className='w-1/4 border p-4'>
                {sideFilterResults?.dc_publishers_string?.slice(0, 10).map((item, index) => (
                    <div key={index}>
                        <input
                            className='thats_filter'
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
            <div className='border min-w-3/4 p-4'>
                <h5 className='font-bold'>total results : {resultsCount}</h5>
                <ul>
                    {results.length > 0 ? (
                        results.map((item) => (
                            <li key={item.id}>{item.datacite_titles} || {item.dc_publishers}</li>
                        ))
                    ) : (
                        <li>Loading...</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
