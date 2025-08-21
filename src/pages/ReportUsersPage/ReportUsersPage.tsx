import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import ReportUsers from "../../components/ReportUsers/ReportUsers";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function ReportUsersPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="İcraya məsul şəxslər" />
            <div className="space-y-6">
                <ComponentCard title="İcraya məsul şəxslər">
                    <ReportUsers />
                </ComponentCard>
            </div>
        </div>
    );
}
