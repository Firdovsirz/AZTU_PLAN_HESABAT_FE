import NewPlan from "../../components/newPlan/NewPlan";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewPlanPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Yeni plan" />
            <div className="space-y-6">
                <ComponentCard title="Yeni plan">
                    <NewPlan />
                </ComponentCard>
            </div>
        </div>
    );
}
