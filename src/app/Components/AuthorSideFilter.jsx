import React from 'react'
import { useState, useEffect } from 'react';
import { Form, Dropdown, Button } from 'react-bootstrap';

const AuthorSideFilter = ({creators, setShowADropdown, showADropdown, handleApply, parsedUrl, filterChange}) => {
    const [dcCreators, setDcCreators] = useState(creators || []);

    useEffect(() => {
        setDcCreators(creators || []);
    }, [creators]);

    const [searchTermA, setSearchTermA] = useState("");

    const filteredCreators = dcCreators.filter(item =>
        item?.name?.toLowerCase().includes(searchTermA.toLowerCase())
    );

    return (
        <Form.Group className="border-bottom p-3">
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ position: "relative" }}>
                <Form.Label className="fw-bold mb-0">Authors</Form.Label>
                <span className='fw-bold cursor_pointer_underline' onClick={() => setShowADropdown(pre => !pre)} >View All</span>

                <div className={`shadow card ${showADropdown === false ? "d-none" : ""}`}
                    style={{ position: "absolute", top: "150%", maxHeight: "50vh", width: "50vw", zIndex: "999", overflowY: "auto" }}
                >
                    <div className="p-2 border-bottom">
                        <Form.Control
                            type="text"
                            placeholder="Search Author..."
                            value={searchTermA}
                            onChange={(e) => setSearchTermA(e.target.value)}
                        />
                    </div>

                    <div
                        className="px-2 pt-4 d-flex flex-column flex-wrap align-items-start gap-1"
                        style={{ maxHeight: "100%", width: "100%", overflowX: "scroll" }}
                    >
                        {filteredCreators.filter(item => !parsedUrl?.datacite_creators_string?.includes(item?.name)).map((item, index) => (
                            <div
                                className="d-flex justify-content-between text-secondary ms-4 thats_filter"
                                style={{ width: "300px", fontSize: "11pt" }}
                                key={index}
                            >
                                <Form.Check
                                    type="checkbox"
                                    className="one_line_ellipses thats_filter"
                                    style={{ width: "90%" }}
                                    label={item?.name || "Unknown"}
                                    data-filtertype="datacite_creators_string"
                                    data-label={item?.name || ""}
                                />
                                <span>({item?.count || 0})</span>
                            </div>
                        ))}
                        {filteredCreators.length === 0 && (
                            <p className="text-muted">No Author found.</p>
                        )}
                    </div>

                    <div className="bottom p-3 d-flex justify-content-end border-top">
                        <Button variant="secondary" className="me-2" onClick={() => setShowADropdown(pre => !pre)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleApply}>
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
            {dcCreators.slice(0, 5).map((item, index) => {
                const id = `dc-creator-${index}`;
                return (
                    <div className="d-flex justify-content-between" key={id}>
                        <Form.Check
                            type="checkbox"
                            id={id}
                            className="thats_filter one_line_ellipses"
                            style={{ width: "90%" }}
                            label={
                                <label htmlFor={id} style={{ cursor: 'pointer', width: "100%" }}>
                                    {item?.name || "Unknown"}
                                </label>
                            }
                            data-filtertype="datacite_creators_string"
                            data-label={item?.name || ""}
                            onChange={filterChange}
                            checked={parsedUrl?.datacite_creators_string?.includes(item?.name) ?? false}
                        />
                        <span className="text-secondary">{item?.count || 0}</span>
                    </div>
                );
            })}

        </Form.Group>
    )
}

export default AuthorSideFilter