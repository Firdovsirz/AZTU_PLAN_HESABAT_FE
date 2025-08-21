import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import OtpVerification from "../../components/auth/OtpVerification";

export default function OtpVerificationPage() {
    return (
        <>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <AuthLayout>
                <OtpVerification />
            </AuthLayout>
        </>
    );
}