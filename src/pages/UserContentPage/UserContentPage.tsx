import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import UserContent from "../../components/userContent/UserContent";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function UserContentPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="İstifadəçi detalları" />
            <div className="space-y-6">
                <ComponentCard title="İstifadəçi detalları">
                    <UserContent />
                </ComponentCard>
            </div>
        </div>
    );
}
