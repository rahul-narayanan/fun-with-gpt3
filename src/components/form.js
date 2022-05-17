import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { fetchResponseForPrompt } from "../api";
import { LoadingButton } from "./loading-button";

export const Form = () => {
    const [isInputValid, setIsInputValid] = useState(true);

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
        }
    }, []);

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
        </div >
    )
}