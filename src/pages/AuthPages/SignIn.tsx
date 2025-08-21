import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Plan Hesabat AzTU"
        description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
