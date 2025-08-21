import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Skeleton from "@mui/material/Skeleton";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Faculty } from "../../services/faculty/facultyService";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getFaculties } from "../../services/faculty/facultyService";

export default function Faculties() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    getFaculties(token)
      .then((res) => {
        setFaculties(res)
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap -mx-2">
        {[...Array(4)].map((_, index) => (
          <div className="w-full sm:w-1/2 px-2 mb-4" key={index}>
            <div className="p-4 rounded-lg bg-gray-200 border-2 border-gray-300">
              <Skeleton variant="text" width="60%" height={30} sx={{ borderRadius: 1 }} />
            </div>
          </div>
        ))}
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
      {role === 1 ? (
        <div className="flex flex-wrap -mx-2">
          {faculties.map((faculty) => {
            return (
              <div className="w-full sm:w-1/2 px-2 mb-4" key={faculty.id}>
                <Link
                  to={`/faculties/${faculty.faculty_code}`}
                  className="group flex items-center justify-between p-4 rounded-lg bg-blue-600 border-2 border-blue-600 cursor-pointer transition-colors duration-300 hover:bg-transparent hover:border-blue-600"
                >
                  <div className="flex items-center flex-wrap">
                    <p className="text-white group-hover:text-blue-600 mr-2 text-lg sm:text-xl break-words">
                      {faculty.faculty_name}
                    </p>
                    <p className="text-white group-hover:text-blue-600">
                      ({faculty.faculty_code})
                    </p>
                  </div>
                  <ArrowOutwardIcon className="text-white group-hover:text-blue-600" />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 mt-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
          <ErrorOutlineIcon className="text-red-500 dark:text-red-400 mb-2" style={{ fontSize: 40 }} />
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            Bu səhifəyə baxmaq üçün icazəniz yoxdur
          </p>
        </div>
      )}
    </>
  );
}
