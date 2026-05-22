import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CafedraPlansDetails from "../../components/cafedraPlans/CafedraPlansDetails";

export default function CafedraPlansDetailsPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Bölmənin planları və hesabatları" />
            <div className="space-y-6">
                <ComponentCard title="Bölmənin planları və hesabatları">
                    <CafedraPlansDetails />
                </ComponentCard>
            </div>
        </div>
    );
}
