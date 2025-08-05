import PageMeta from "../../components/common/PageMeta";
import MyCafedras from "../../components/myCafedras/MyCafedras";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function MyCafedrasPage() {
    return (
        <div>
            <PageMeta
                title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Kafedralarım" />
            <div className="space-y-6">
                <ComponentCard title="Kafedralarım">
                    <MyCafedras />
                </ComponentCard>
            </div>
        </div>
    );
}
