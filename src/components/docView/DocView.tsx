import { useLocation } from "react-router-dom";

export default function DocView() {
    const location = useLocation();
    const docPath = location.pathname.replace(/^\/doc\//, "");
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const pdfUrl = new URL(docPath, baseUrl).toString();

    return (
        <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
            <iframe
                src={pdfUrl}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    overflow: "hidden",
                }}
                title="PDF Viewer"
            />
        </div>
    );
}