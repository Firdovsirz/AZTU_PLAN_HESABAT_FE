import PageMeta from "../../components/common/PageMeta";
import EditPlan from "../../components/editPlan/EditPlan";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function EditPlanPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Plan Redaktə edin" />
            <div className="space-y-6">
                <ComponentCard title="Plan Redaktə edin">
                    <EditPlan />
                </ComponentCard>
            </div>
        </div>
    );
}
