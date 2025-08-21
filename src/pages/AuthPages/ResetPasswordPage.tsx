import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import ResetPassword from "../../components/auth/ResetPassword";

export default function ResetPasswordPage() {
    return (
        <>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <AuthLayout>
                <ResetPassword />
            </AuthLayout>
        </>
    );
}