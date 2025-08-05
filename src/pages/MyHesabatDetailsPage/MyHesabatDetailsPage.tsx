import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import MyHesabatDetails from "../../components/myHesabatDetails/MyHesabatDetails";

export default function MyHesabatDetailsPage() {
    return (
        <div>
            <PageMeta
                title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Hesabatım" />
            <div className="space-y-6">
                <ComponentCard title="Hesabatım">
                    <MyHesabatDetails />
                </ComponentCard>
            </div>
        </div>
    );
}
