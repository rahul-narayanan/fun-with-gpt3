import { useCallback, useState } from "react"

export const LoadingButton = ({ children, onClick }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        setLoading(true);
        await onClick();
        setLoading(false);
    }, []);

    return (
        <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <div className="spinner-border text-light" role="status" /> : ""}
            {children}
        </button>
    )
}