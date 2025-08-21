import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '../../redux/store';
import { Link, useParams } from 'react-router';
import { getDekan, Dekan } from '../../services/user/user';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import { Cafedra } from '../../services/cafedra/cafedraService';
import { getFacName } from '../../services/faculty/facultyService';
import { getCafedrasByFaculty } from '../../services/cafedra/cafedraService';


export default function FacultyDetails() {
    const { faculty_code } = useParams();
    const [facName, setFacName] = useState("");
    const [loading, setLoading] = useState(false);
    const [cafedraCount, setCafedraCount] = useState(0);
    const [dekan, setDekan] = useState<Dekan | null>(null);
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const [dekanNotFound, setDekanNotFound] = useState<boolean>(true);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        setLoading(true);
        if (faculty_code) {
            getCafedrasByFaculty(faculty_code,  token ? token : '')
                .then((res) => {
                    if (res !== "NOT FOUND") {
                        setCafedras(res.cafedras);
                        setCafedraCount(res.cafedra_count);
                    }
                })
            getFacName(faculty_code,  token ? token : '')
                .then(setFacName);

            getDekan(faculty_code,  token ? token : '')
                .then((res) => {
                    if (res === "NOT FOUND") {
                        setDekanNotFound(true);
                    } else if (res === "ERROR") {
                        console.error("An error occurred");
                    } else {
                        setDekan(res);
                        setDekanNotFound(false);
                    }
                }).finally(() => {
                    setLoading(false);
                })
        }
    }, [faculty_code]);

    console.log(dekan);

    if (loading) {
        return (
            <div className="w-full h-full py-10">
                {/* Faculty Name Skeleton */}
                <Skeleton
                    variant="rounded"
                    height={32}
                    width={320}
                    className="mb-2"
                    sx={{ borderRadius: 2, marginBottom: 1 }}
                />
                {/* Kafedra Count Skeleton */}
                <Skeleton
                    variant="rounded"
                    height={20}
                    width={180}
                    className="mb-4"
                    sx={{ borderRadius: 2, marginBottom: 2 }}
                />
                {/* Dekan Info Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 mb-6">
                    <Skeleton
                        variant="rounded"
                        height={28}
                        width={260}
                        sx={{ borderRadius: 2 }}
                    />
                </div>
                {/* Cafedra Cards Skeleton Grid */}
                <ul className="mt-5 flex flex-wrap -mx-2">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="w-full sm:w-1/2 px-2 mb-4">
                            <Skeleton
                                variant="rounded"
                                height={56}
                                className="w-full"
                                sx={{ borderRadius: 2 }}
                            />
                        </div>
                    ))}
                </ul>
            </div>
        );
    }
    return (
        <div>
            <h2 className="mb-2 font-semibold text-gray-800 text-xs dark:text-white/90 sm:text-xl">Fakültə adı: {facName}&nbsp;({faculty_code})</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Kafedra sayı: {cafedraCount}</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2">
                <h2 className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Dekan:</h2>
                {!dekanNotFound ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2">
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            {dekan?.name} {dekan?.surname} {dekan?.father_name} ({dekan?.fin_kod})
                        </p>
                        {dekan?.is_execution ? (
                            <p className="text-center bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block">
                                İcraçı şəxsdir
                            </p>
                        ) : (
                            <p className="text-center bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                                İcraçı şəxs deyil
                            </p>
                        )}
                        <Link to={`/user/${dekan?.fin_kod}`}>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-[5px] bg-yellow-200 text-yellow-400 dark:bg-yellow-400 cursor-pointer">
                                <VisibilityIcon className="text-yellow-500 dark:text-yellow-700" />
                            </div>
                        </Link>
                    </div>
                ) : (
                    <p className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                        Mövcud deyil
                    </p>
                )}
            </div>

            <ul className="mt-5 flex flex-wrap -mx-2">
              {cafedras.map((cafedra, index) => (
                <div key={index} className="w-full sm:w-1/2 px-2 mb-4">
                  <Link
                    to={`/cafedra/${cafedra.cafedra_code}`}
                    className="group block p-4 rounded-lg bg-blue-600 border-2 border-blue-600 cursor-pointer transition-colors duration-300 hover:bg-transparent hover:border-blue-600"
                  >
                    <p className="text-white group-hover:text-blue-600">
                      {cafedra.cafedra_name} &nbsp; ({cafedra.cafedra_code})
                    </p>
                  </Link>
                </div>
              ))}
            </ul>
        </div>
    )
}
