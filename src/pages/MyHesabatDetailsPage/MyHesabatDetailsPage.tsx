import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import MyHesabatDetails from "../../components/myHesabatDetails/MyHesabatDetails";

export default function MyHesabatDetailsPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Hesabatım" />
            <div className="space-y-6">
                <ComponentCard title="Hesabatım">
                    <MyHesabatDetails />
                </ComponentCard>
            </div>
        </div>
    );
}
