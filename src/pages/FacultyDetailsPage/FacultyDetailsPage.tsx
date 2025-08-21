import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FacultyDetails from "../../components/FacultyDetails/FacultyDetails";

export default function FacultyDetailsPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Fakültə detalları" />
            <div className="space-y-6">
                <ComponentCard title="Fakültə detalları">
                    <FacultyDetails />
                </ComponentCard>
            </div>
        </div>
    );
}
