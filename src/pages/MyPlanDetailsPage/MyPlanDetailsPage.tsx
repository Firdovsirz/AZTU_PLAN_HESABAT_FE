import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import MyPlanDetails from "../../components/myPlanDetails/MyPlanDetails";

export default function MyPlanDetailsPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Plan Detalları" />
            <div className="space-y-6">
                <ComponentCard title="Plan Detalları">
                    <MyPlanDetails />
                </ComponentCard>
            </div>
        </div>
    );
}
