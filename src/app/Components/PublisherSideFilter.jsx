import React from 'react'
import { Form, Dropdown, Button } from 'react-bootstrap';

const PublisherSideFilter = ({parsedUrl, dcPublisher, filterChange}) => {
    return (
        <div>
            {parsedUrl?.dc_publishers_string?.length > 0 ? (
                parsedUrl.dc_publishers_string.map((selectedName, index) => {
                    const matched = dcPublisher.find(pub => pub.name === selectedName);
                    return (
                        <div className="d-flex justify-content-between" key={index}>
                            <Form.Check
                                type="checkbox"
                                className="one_line_ellipses thats_filter"
                                style={{ width: "90%" }}
                                data-filtertype="dc_publishers_string"
                                data-label={selectedName || "Unknown"}
                                onChange={filterChange}
                                checked
                            />
                            <span className="text-secondary">{matched?.name || 0}</span>
                        </div>
                    );
                })
            ) : (
                dcPublisher.slice(0, 5).map((item, index) => {
                    return (
                        <div className="d-flex justify-content-between" key={index}>
                            <Form.Check
                                type="checkbox"
                                className="one_line_ellipses thats_filter"
                                style={{ width: "90%" }}
                                data-filtertype="dc_publishers_string"
                                data-label={item?.name || ""}
                                onChange={filterChange}
                                checked={false}
                            />
                            <span className="text-secondary">{item?.name || 0}</span>
                        </div>
                    );
                })
            )}
        </div>
    )
}

export default PublisherSideFilter