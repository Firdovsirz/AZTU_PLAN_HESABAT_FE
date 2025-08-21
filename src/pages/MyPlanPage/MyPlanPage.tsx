import MyPlan from "../../components/myPlan/MyPlan";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function MyPlanPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
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
