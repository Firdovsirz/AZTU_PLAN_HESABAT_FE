import PageMeta from "../../components/common/PageMeta";
import AllPlans from "../../components/allPlans/AllPlans";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function AllPlansPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Bütün planlar" />
            <div className="space-y-6">
                <ComponentCard title="Bütün planlar">
                    <AllPlans />
                </ComponentCard>
            </div>
        </div>
    );
}
