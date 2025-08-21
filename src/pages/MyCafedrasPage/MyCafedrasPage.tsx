import PageMeta from "../../components/common/PageMeta";
import MyCafedras from "../../components/myCafedras/MyCafedras";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function MyCafedrasPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Kafedralarım" />
            <div className="space-y-6">
                <ComponentCard title="Kafedralarım">
                    <MyCafedras />
                </ComponentCard>
            </div>
        </div>
    );
}
