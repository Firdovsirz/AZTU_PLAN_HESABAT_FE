import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CafedraDetails from "../../components/cafedraDetails/CafedraDetails";

export default function CafedraDetailsPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Kafedra məlumatları" />
            <div className="space-y-6">
                <ComponentCard title="Kafedra məlumatları">
                    <CafedraDetails />
                </ComponentCard>
            </div>
        </div>
    );
}
