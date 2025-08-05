import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Faculty } from "../../services/faculty/facultyService";
import { getFaculties } from "../../services/faculty/facultyService";

export default function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFaculties()
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
      <div className="flex justify-center items-center w-full h-full py-10">
        <CircularProgress />
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
    <div className="flex justify-between items-center width-full flex-wrap">
      {faculties.map((faculty, index) => {
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
              to={`/faculties/${faculty.faculty_code}`}
              className="flex justify-between w-full"
            >
              <div className="flex items-center">
                <p className="text-white mr-2 text-xl">
                  {faculty.faculty_name}
                </p>
                <p className="text-white">({faculty.faculty_code})</p>
              </div>
              <ArrowOutwardIcon className="text-white" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
