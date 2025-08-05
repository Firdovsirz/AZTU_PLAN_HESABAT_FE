import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import CircularProgress from "@mui/material/CircularProgress";
import { Cafedra } from '../../services/cafedra/cafedraService';
import { getFacName } from '../../services/faculty/facultyService';
import { getCafedrasByFaculty } from '../../services/cafedra/cafedraService';


export default function FacultyDetails() {
    const { faculty_code } = useParams();
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const [loading, setLoading] = useState(true);
    const [facName, setFacName] = useState("");
    const [cafedraCount, setCafedraCount] = useState(0);

    useEffect(() => {
        if (faculty_code) {
            getCafedrasByFaculty(faculty_code)
                .then((res) => {
                    if (res !== "NOT FOUND") {
                        setCafedras(res.cafedras);
                        setCafedraCount(res.cafedra_count);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
            getFacName(faculty_code)
                .then(setFacName);
        }
    }, [faculty_code]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };
    return (
        <div>
            <h2 className="mb-2 font-semibold text-gray-800 text-xs dark:text-white/90 sm:text-xl">Fakültə adı: {facName}&nbsp;({faculty_code})</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Kafedra sayı: {cafedraCount}</p>

            <ul className='mt-[20px] flex-wrap flex justify-between items-center'>
                {cafedras.map((cafedra, index) => {
                    return (
                        <Link to={`/cafedra/${cafedra.cafedra_code}`}
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
                            }}>
                            <li key={index}>
                                <p className='text-white'>
                                    {cafedra.cafedra_name} &nbsp; ({cafedra.cafedra_code})
                                </p>
                            </li>
                        </Link>
                    )
                })}
            </ul>
        </div>
    )
}
