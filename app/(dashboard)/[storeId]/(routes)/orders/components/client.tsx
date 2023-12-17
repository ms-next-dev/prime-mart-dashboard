"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./column";

interface OrderClientProps {
    data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    return (
        <div>
            <Heading
                title={`Orders (${data.length})`}
                description="Manage orders for your store"
            />
            <Separator />
            <DataTable columns={columns} data={data} searchKey="products" />
        </div>
    );
};

export default OrderClient;
