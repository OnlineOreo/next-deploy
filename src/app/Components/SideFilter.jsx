"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SideFilter = (props) => {
    const Router = useRouter();
    const searchParams = useSearchParams();
    const [parsedUrl, setParsedUrl] = useState([])

    function parseSolrQuery(query) {
        const filters = {};
        const parts = query.split(" AND ");

        parts.forEach(part => {
            const [field, valuePart] = part.split(":");
            if (!field || !valuePart) return;

            // Remove parentheses and quotes
            const valuesString = valuePart.trim().replace(/^\(|\)$/g, "");

            const values = valuesString
                .split(" OR ")
                .map(v => v.trim().replace(/^"|"$/g, ""));

            filters[field] = values;
        });

        return filters;
    }
    useEffect(() => {
        const urlParams = searchParams.get("q");
        const decoded = decodeURIComponent(urlParams);
        const parsed = parseSolrQuery(decoded);
        setParsedUrl(parsed)
    }, [searchParams])

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
        Router.push(`/search/print-collection?q=${filterUrl}`);
    };
    return (
        <div>
            <h2 className="font-bold">Publisher</h2>
            {props?.dc_publishers_string?.slice(0, 5).map((item, index) => (
                <div key={index}>
                    <input
                        className="thats_filter"
                        type="checkbox"
                        name={item.name}
                        id={`checkbox-${index}`}
                        data-filtertype="dc_publishers_string"
                        data-label={item?.name || ""}
                        onChange={filterChange}
                        checked={parsedUrl?.dc_publishers_string?.includes(item.name) || false}
                    />
                    <label htmlFor={`checkbox-${index}`}>{item.name}  ({item.count})</label>
                </div>
            ))}
            <h2 className="font-bold">Author</h2>
            {props?.datacite_creators_string?.slice(0, 5).map((item, index) => (
                <div key={index}>
                    <input
                        className="thats_filter"
                        type="checkbox"
                        name={item.name}
                        id={`checkbox-${index}`}
                        data-filtertype="datacite_creators_string"
                        data-label={item?.name || ""}
                        onChange={filterChange}
                        checked={parsedUrl?.datacite_creators_string?.includes(item.name) || false}
                    />
                    <label htmlFor={`checkbox-${index}`}>{item.name} ({item.count})</label>
                </div>
            ))}
        </div>
    )
}

export default SideFilter