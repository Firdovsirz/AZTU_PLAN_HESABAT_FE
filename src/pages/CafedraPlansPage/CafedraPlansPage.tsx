import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CafedraPlansCards from "../../components/cafedraPlans/CafedraPlansCards";

export default function CafedraPlansPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Bölmələr üzrə planlar və hesabatlar" />
            <div className="space-y-6">
                <ComponentCard title="Bölmələr üzrə planlar və hesabatlar">
                    <CafedraPlansCards />
                </ComponentCard>
            </div>
        </div>
    );
}
