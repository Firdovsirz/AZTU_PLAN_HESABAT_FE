import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AllUsers from "../../components/allUsers/AllUsers";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AllUsersFilter from "../../components/allUsersFilter/AllUsersFilter";

type Filters = {
    name?: string;
    surname?: string;
    fatherName?: string;
    finKod?: string;
    faculty?: string;
    cafedra?: string;
};

export default function AllUsersPage() {
    const [filters, setFilters] = useState<Filters>({});
    return (
        <div>
            <PageMeta
                title="Plan Hesabat AzTU"
                description="Azərbaycan Texniki Universiteti Plan Hesabat İnformasiya sistemi"
            />
            <PageBreadcrumb pageTitle="Bütün istifadəçilər" />
            <div className="space-y-6">
                <AllUsersFilter onChange={setFilters}/>
                <ComponentCard title="Bütün istifadəçilər">
                    <AllUsers filters={filters} />
                </ComponentCard>
            </div>
        </div>
    );
}
