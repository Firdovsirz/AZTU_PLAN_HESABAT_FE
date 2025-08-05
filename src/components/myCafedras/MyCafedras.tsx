import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getCafedrasByFaculty, Cafedra } from "../../services/cafedra/cafedraService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function MyCafedras() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const facultyCode = useSelector((state: RootState) => state.auth.faculty_code);
    
    useEffect(() => {
        if (facultyCode) {
            getCafedrasByFaculty(facultyCode)
            .then((res) => {
                if (res === "NOT FOUND") {
                    setNotFound(true);
                } else {
                    setCafedras(res.cafedras);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
            });
        }
    }, []);

    const cafedraCount = cafedras.length;

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };

    if (notFound) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <p>Not found.</p>
            </div>
        );
    };

    if (error.length != 0) {
        return (
            <div>
                {error}
            </div>
        )
    }
    return (
        <>
            <h1 className="mb-2 font-semibold text-gray-600 text-title-s dark:text-white/90 sm:text-title-l">Kafedra sayı: {cafedraCount}</h1>
            <div className="flex justify-between items-center width-full flex-wrap">
                {cafedras.map((cafedra, index) => {
                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                            style={{
                                width: "48%",
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: "rgb(67, 88, 251)",
                                marginBlock: 10,
                                cursor: "pointer",
                                transition: "background 0.3s",
                                border: "2px solid rgb(67, 88, 251)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                Array.from(e.currentTarget.getElementsByTagName("p")).forEach(
                                    (p) => {
                                        p.style.color = "rgba(67, 88, 251, 1)";
                                    }
                                );
                                const icon = e.currentTarget.querySelector("svg");
                                if (icon) icon.style.color = "rgba(67, 88, 251, 1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "rgb(67, 88, 251)";
                                Array.from(e.currentTarget.getElementsByTagName("p")).forEach(
                                    (p) => {
                                        p.style.color = "#fff";
                                    }
                                );
                                const icon = e.currentTarget.querySelector("svg");
                                if (icon) icon.style.color = "#fff";
                            }}
                        >
                            <Link
                                to={`/cafedra/${cafedra.cafedra_code}`}
                                className="flex justify-between w-full"
                            >
                                <div className="flex items-center">
                                    <p className="text-white mr-2 text-xl">
                                        {cafedra.cafedra_name}
                                    </p>
                                    <p className="text-white">({cafedra.cafedra_code})</p>
                                </div>
                                <ArrowOutwardIcon className="text-white" />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
