import React, { useContext, useState } from 'react';
import { MainContext } from '../contexts/Provider';
import { LiaPasteSolid } from "react-icons/lia";

const HomePage = () => {
    const data = localStorage.getItem("url_value") || "";
    const [docUrl, setDocUrl] = useState(data);
    const [error, setError] = useState("");
    const { setUrlContext } = useContext(MainContext)

    const handleChange = (e) => {
        setDocUrl(e.target.value);
        setError(""); 
    };

    const handleSubmit = () => {
        const docxRegex = /^https?:\/\/.+\.(docx)$/i;

        if (!docxRegex.test(docUrl)) {
            setError("Please enter a valid .docx URL");
            return;
        }
        setUrlContext([docUrl])
        localStorage.setItem("url_value", JSON.stringify([docUrl]));
        window.location.reload();
    };

    const handlePaste = async () => {
        const text = await navigator.clipboard.readText(); 
        setDocUrl(text);
        setError("");
    };

    return (
        <div className="App">
            <div className="view-docx">
                <div className="form-container">
                    <h2 className="box-head">Insert the DOCX file link</h2>
                    {/* <p className='text-xs text-neutral-400'>Type or paste the URL of your DOCX file</p> */}
                    <div className="input-container">
                        <input
                            type="text"
                            value={docUrl}
                            onChange={handleChange}
                            placeholder="Type or paste here"
                            className="form-input"
                        />
                        <button className="paste-button" onClick={handlePaste}>
                            <LiaPasteSolid />
                        </button>
                    </div>
                    {error && <p className="error-text">{error}</p>} {/* Error message */}
                    <button onClick={handleSubmit} className="form-button">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
