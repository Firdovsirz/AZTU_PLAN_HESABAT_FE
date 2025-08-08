import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import OtpVerification from "../../components/auth/OtpVerification";

export default function OtpVerificationPage() {
    return (
        <>
            <PageMeta
                title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <AuthLayout>
                <OtpVerification />
            </AuthLayout>
        </>
    );
}