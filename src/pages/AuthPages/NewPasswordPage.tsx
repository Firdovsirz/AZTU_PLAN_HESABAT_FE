import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import NewPassword from "../../components/auth/NewPassword";

export default function NewPasswordPage() {
    return (
        <>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <AuthLayout>
                <NewPassword />
            </AuthLayout>
        </>
    );
}