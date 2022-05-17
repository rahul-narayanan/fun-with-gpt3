import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { fetchResponseForPrompt } from "../api";
import { LoadingButton } from "./loading-button";

export const Form = () => {
    const [isInputValid, setIsInputValid] = useState(true);
    const [error, setError] = useState(false);

    const dispatch = useDispatch();

    const inputRef = useRef(null);

    const validateInput = useCallback((showErrIfEmpty = false) => {
        const input = inputRef.current.value.trim();
        if (!input && !showErrIfEmpty) return;

        const isValid = !!input;
        setIsInputValid(isValid);
        return isValid;
    }, []);

    const handleSubmit = useCallback(async () => {
        if (validateInput(true)) {
            const prompt = inputRef.current.value.trim();

            try {
                const response = await fetchResponseForPrompt(prompt);
                inputRef.current.value = "";
                setTimeout(() => { inputRef.current.focus(); }, 100);
                dispatch({
                    type: "UPDATE_RESULT",
                    payload: {
                        prompt,
                        response: response.choices[0].text || "-"
                    }
                });
            } catch (err) {
                setError(err);
            }
        }
    }, []);

    function renderError() {
        if (error) {
            return (
                <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                    {/* <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto">Bootstrap</strong>
                            <small>11 mins ago</small>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div className="toast-body ">
                            Hello, world! This is a toast message.
                        </div>
                    </div> */}
                    <div className="toast align-items-center text-white bg-danger border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                                {error}
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            )
        }

        return "";
    }

    useEffect(() => {
        inputRef && inputRef.current.focus();
    }, []);

    return (
        <div className="container">
            <form className="row g-3">
                <div>
                    <label htmlFor="inputArea" className="form-label fw-bold">Enter prompt</label>
                    <textarea
                        ref={inputRef}
                        className={`form-control ${isInputValid ? "" : "is-invalid"}`}
                        id="inputArea"
                        placeholder="Write a tagline for a ice cream shop."
                        rows="15"
                        required
                        onBlur={() => validateInput()}
                    />
                    <div className="invalid-feedback">
                        Please enter the prompt to submit
                    </div>
                </div>
                <div className="mb-3 text-end">
                    <LoadingButton onClick={handleSubmit}>
                        Submit
                    </LoadingButton>
                    <button type="reset" className="btn btn-secondary">Clear</button>
                </div>
            </form >
            {renderError()}
        </div >
    )
}