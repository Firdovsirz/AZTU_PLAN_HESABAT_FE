import Dekans from "../../components/dekans/Dekans";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function DekansPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Dekanlar" />
            <div className="space-y-6">
                <ComponentCard title="Dekanlar">
                    <Dekans />
                </ComponentCard>
            </div>
        </div>
    );
}
