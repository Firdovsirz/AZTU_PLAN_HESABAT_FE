import MyPlan from "../../components/myPlan/MyPlan";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function MyPlanPage() {
    return (
        <div>
            <PageMeta
                title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Planım" />
            <div className="space-y-6">
                <ComponentCard title="Planım">
                    <MyPlan />
                </ComponentCard>
            </div>
        </div>
    );
}
