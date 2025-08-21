import PageMeta from "../../components/common/PageMeta";
import Faculties from "../../components/faculties/Faculties";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function FacultyPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Fakültələr" />
            <div className="space-y-6">
                <ComponentCard title="Fakültələr">
                    <Faculties />
                </ComponentCard>
            </div>
        </div>
    );
}
