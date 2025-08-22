import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import { useEffect, useState, useMemo } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import { getFaculties, Faculty } from "../../services/faculty/facultyService";
import { getCafedrasByFaculty, Cafedra } from "../../services/cafedra/cafedraService";

type AllUsersFilterProps = {
    onChange: (filters: {
        name?: string;
        surname?: string;
        fatherName?: string;
        finKod?: string;
        faculty_code?: string;
        cafedra_code?: string;
    }) => void;
};


export default function AllUsersFilter({ onChange }: AllUsersFilterProps) {
    const [name, setName] = useState("");
    const [finKod, setFinKod] = useState("");
    const [surname, setSurname] = useState("");
    const [filter, setFilter] = useState(false);
    const [, setLoading] = useState(false);

    const [fatherName, setFatherName] = useState("");
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const token = useSelector((state: RootState) => state.auth.token);

    const toggleFilter = async () => {
        setFilter(prev => !prev);
    }

    useEffect(() => {
        getFaculties(token)
            .then(setFaculties)
            .finally(() => {
                setLoading(false);
            })
    }, [])

    const facultyOptions = useMemo(() => {
        const options = faculties.map((faculty) => ({
            value: String(faculty.faculty_code),
            label: `${faculty.faculty_name} (${faculty.faculty_code})`
        }));
        return options;
    }, [faculties]);

    const handleFacultyChange = (value: string) => {
        setSelectedFaculty(value);
    };

    const [cafedras, setCafedras] = useState<Cafedra[]>([]);
    const [selectedCafedra, setSelectedCafedra] = useState("");

    useEffect(() => {
        getCafedrasByFaculty(selectedFaculty, token ? token : '')
            .then((res) => {
                if (res === "NOT FOUND") {
                    setCafedras([]);
                } else {
                    setCafedras(res.cafedras);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedFaculty]);

    const cafedraOptions = useMemo(() => {
    const options = cafedras.map((cafedra) => ({
            value: String(cafedra.cafedra_code),
            label: `${cafedra.cafedra_name} (${cafedra.cafedra_code})`
        }));
        return options;
    }, [cafedras]);

    const handleCafedraChange = (value: string) => {
        setSelectedCafedra(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onChange({
            name,
            surname,
            fatherName,
            finKod,
            faculty_code: selectedFaculty,
            cafedra_code: selectedCafedra
        });
    };

    return (
        <>
            <div>
                <div
                    style={{
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        color: "rgba(0, 0, 0, 0.4)",
                        marginBottom: 10,
                        cursor: "pointer"
                    }}
                    onClick={toggleFilter}>
                    <FilterListIcon />
                </div>
                {filter ? (
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
                            <div>
                                <Label>Ad</Label>
                                <Input type="text" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Ad" />
                            </div>

                            <div>
                                <Label>Soyad</Label>
                                <Input type="text" value={surname} onChange={(e) => { setSurname(e.target.value) }} placeholder="Soyad" />
                            </div>

                            <div>
                                <Label>Ata adı</Label>
                                <Input type="text" value={fatherName} onChange={(e) => { setFatherName(e.target.value) }} placeholder="Ata adı" />
                            </div>

                            <div>
                                <Label>Fin kod</Label>
                                <Input type="text" value={finKod} onChange={(e) => { setFinKod(e.target.value) }} placeholder="Fin Kod" />
                            </div>

                            <div>
                                <Label>Fakültə</Label>
                                <Select
                                    options={facultyOptions}
                                    placeholder={"Fakültə seçin"}
                                    onChange={handleFacultyChange}
                                    className="dark:bg-dark-900"
                                />
                            </div>
                            <div>
                                <Label>Kafedra</Label>
                                <Select
                                    options={cafedraOptions}
                                    placeholder={"Kafedra seçin"}
                                    onChange={handleCafedraChange}
                                    className="dark:bg-dark-900"
                                />
                            </div>
                        </div>
                        <div className="mt-[10px]">
                            <Button>
                                Filter
                            </Button>
                        </div>
                    </form>
                ) : null}
            </div>
        </>
    )
}
