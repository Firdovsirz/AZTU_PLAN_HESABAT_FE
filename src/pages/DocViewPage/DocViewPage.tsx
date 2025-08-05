import DocView from "../../components/docView/DocView";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function DocViewPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat İnformasiya Sistemi"
                description="Plan Report Informastion System"
            />
            <PageBreadcrumb pageTitle="Sənəd" />
            <div className="space-y-6">
                <ComponentCard title="Sənəd">
                    <DocView />
                </ComponentCard>
            </div>
        </div>
    );
}
