import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CafedraDetails from "../../components/cafedraDetails/CafedraDetails";

export default function CafedraDetailsPage() {
    return (
        <div>
            <PageMeta
                title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Kafedra detalları" />
            <div className="space-y-6">
                <ComponentCard title="Kafedra detalları">
                    <CafedraDetails />
                </ComponentCard>
            </div>
        </div>
    );
}
