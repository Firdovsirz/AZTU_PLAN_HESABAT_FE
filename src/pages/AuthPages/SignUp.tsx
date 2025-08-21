import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Plan Hesabat AzTU"
        description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
