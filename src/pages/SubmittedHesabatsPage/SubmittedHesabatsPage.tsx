import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SubmittedHesabats from "../../components/submittedHesabats/SubmittedHesabats";

export default function SubmittedHesabatsPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Təhvil verilmiş hesbatlar" />
            <div className="space-y-6">
                <ComponentCard title="Təhvil verilmiş hesbatlar">
                    <SubmittedHesabats />
                </ComponentCard>
            </div>
        </div>
    );
}
