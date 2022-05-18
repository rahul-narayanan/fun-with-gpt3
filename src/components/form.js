import { useCallback, useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { fetchResponseForPrompt } from "../api";
import { LoadingButton } from "./loading-button";
import { InputPresets } from "./utils";

export const Form = () => {
    const [isInputValid, setIsInputValid] = useState(true);
    const [error, setError] = useState(false);

    const { result } = useSelector(state => state);
    const dispatch = useDispatch();

    const inputRef = useRef(null);
    const selectRef = useRef(null);

    const validateInput = useCallback((showErrIfEmpty = false) => {
        const input = inputRef.current.value.trim();
        if (!input && !showErrIfEmpty) return;

        const isValid = !!input;
        setIsInputValid(isValid);
        return isValid;
    }, []);

    const handlePresetSelect = useCallback((event) => {
        const selectedId = Number(event.target.value);
        //const rider = InputPresets;
        const preset = InputPresets.find(preset => preset.id === selectedId);
        if (preset) {
            inputRef.current.value = preset.content;
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        if (validateInput(true)) {
            const prompt = inputRef.current.value.trim();

            try {
                const response = await fetchResponseForPrompt(prompt);
                inputRef.current.value = "";
                setTimeout(() => {
                    inputRef.current.focus();
                    selectRef.current.value = 0;
                }, 100);
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
        <div className={`container ${result.length ? "" : "inputContainer"}`}>
            <form className="row g-3">
                <div>
                    <div style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
                        <label
                            htmlFor="inputArea"
                            className="form-label fw-bold"
                            style={{ flex: "1 1 0" }}
                        >
                            Enter prompt
                        </label>
                        <select
                            ref={selectRef}
                            className="form-select"
                            aria-label="Preset select"
                            onChange={handlePresetSelect}
                            style={{ flex: "1 1 0" }}
                        >
                            <option value="0">Select Preset</option>
                            {InputPresets.map(preset => (<option key={`preset_${preset.id}`} value={preset.id}>{preset.name}</option>))}
                        </select>
                    </div>
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