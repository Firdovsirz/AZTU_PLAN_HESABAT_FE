import AdminGuard from "../Settings/AdminGuard";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import StructureExport from "../../components/export/StructureExport";

export default function ExportPage() {
    return (
        <AdminGuard>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="İxrac" />
            <div className="space-y-6">
                <ComponentCard
                    title="Plan və hesabatların ixracı"
                    desc="Fakültə, kafedra və ya struktur bölmə üzrə plan və hesabatları PDF və ya Excel formatında yükləyin."
                >
                    <StructureExport />
                </ComponentCard>
            </div>
        </AdminGuard>
    );
}
