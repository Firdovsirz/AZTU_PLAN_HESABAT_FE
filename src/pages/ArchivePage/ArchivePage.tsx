import Archive from "../../components/archive/Archive";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function ArchivePage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Arxiv" />
            <div className="space-y-6">
                <ComponentCard title="Arxiv">
                    <Archive />
                </ComponentCard>
            </div>
        </div>
    );
}
