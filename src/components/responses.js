import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export const Responses = () => {
    const { result } = useSelector(state => state);
    const containerRef = useRef(null);

    useEffect(() => {
        try {
            if (result.length) {
                containerRef.current.firstChild.scrollIntoViewIfNeeded({
                    behavior: "smooth"
                });
                containerRef.current.firstChild.classList.add("active");
                setTimeout(() => {
                    containerRef.current.firstChild.classList.remove("active");
                }, 5000);
            }
        } catch { }
    }, [result]);

    function renderList() {
        if (!result.length) {
            return <p className="fw-light text-danger">No responses found!</p>
        }

        return result.map(({ prompt, response }, index) => (
            <div className="card" key={`response_${index}`}>
                <div className="card-body">
                    <b className="text-primary">Prompt:</b>
                    <div className="prompt">{prompt}</div>
                </div>
                <div className="card-body">
                    <b className="text-success">Response:</b>
                    <div className="response">{response}</div>
                </div>
            </div>
        ))
    }

    if (!result.length) {
        return "";
    }

    return (
        <div className="container">
            <p className="fw-bold">Responses</p>
            <div className="responses" ref={containerRef}>
                {renderList()}
            </div>
        </div>
    )
}