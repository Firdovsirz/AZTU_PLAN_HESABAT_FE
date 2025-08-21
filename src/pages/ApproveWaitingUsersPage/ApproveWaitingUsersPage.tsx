import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ApproveWaitingUsers from "../../components/approveWaitingUsers/ApproveWaitingUsers";

export default function ApproveWaitingUsersPage() {
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Təsdiq gözləyən istifadəçilər" />
            <div className="space-y-6">
                <ComponentCard title="Təsdiq gözləyən istifadəçilər">
                    <ApproveWaitingUsers />
                </ComponentCard>
            </div>
        </div>
    );
}
