"use client"
import React from 'react'

const Results = ({results, resultsCount}) => {
    return (
        <div>
            <h5 className="font-bold">Total results: {resultsCount}</h5>
            <ul>
                {results.length > 0 ? (
                    results.map((item) => (
                        <li key={item.id}>{item.datacite_titles} || {item.dc_publishers} || {item.datacite_creators}</li>
                    ))
                ) : (
                    <li>Loading...</li>
                )}
            </ul>
        </div>
    )
}

export default Results