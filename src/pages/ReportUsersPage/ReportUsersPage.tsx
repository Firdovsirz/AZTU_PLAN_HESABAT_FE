import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import ReportUsers from "../../components/ReportUsers/ReportUsers";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function ReportUsersPage() {
    return (
        <div>
            <PageMeta
                title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="İcraya məsul şəxslər" />
            <div className="space-y-6">
                <ComponentCard title="İcraya məsul şəxslər">
                    <ReportUsers />
                </ComponentCard>
            </div>
        </div>
    );
}
