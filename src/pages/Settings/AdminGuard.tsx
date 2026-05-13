import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const role = useSelector((state: RootState) => state.auth.role);
    if (role !== 1) {
        return (
            <div className="flex flex-col items-center justify-center p-6 mt-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                <ErrorOutlineIcon className="text-red-500 dark:text-red-400 mb-2" style={{ fontSize: 40 }} />
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Bu səhifəyə baxmaq üçün icazəniz yoxdur
                </p>
            </div>
        );
    }
    return <>{children}</>;
}
