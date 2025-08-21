import PageMeta from "../../components/common/PageMeta";
import MyHesabat from "../../components/myHesabat/MyHesabat";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function MyHesabatPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Hesabatım" />
            <div className="space-y-6">
                <ComponentCard title="Hesabatım">
                    <MyHesabat />
                </ComponentCard>
            </div>
        </div>
    );
}
