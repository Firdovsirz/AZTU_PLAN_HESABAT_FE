import PageMeta from "../../components/common/PageMeta";
import Faculties from "../../components/faculties/Faculties";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function FacultyPage() {
    return (
        <div>
            <PageMeta
                title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Fakültələr" />
            <div className="space-y-6">
                <ComponentCard title="Fakültələr">
                    <Faculties />
                </ComponentCard>
            </div>
        </div>
    );
}
