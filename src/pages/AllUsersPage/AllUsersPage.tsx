import PageMeta from "../../components/common/PageMeta";
import AllUsers from "../../components/allUsers/AllUsers";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function AllUsersPage() {
    return (
        <div>
            <PageMeta
                title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Bütün istifadəçilər" />
            <div className="space-y-6">
                <ComponentCard title="Bütün istifadəçilər">
                    <AllUsers />
                </ComponentCard>
            </div>
        </div>
    );
}
