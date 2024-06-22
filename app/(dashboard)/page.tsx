import { getTotalSales, getTotalCustomers, getSalesPerMonth } from '@/lib/actions/actions';
import {UserButton} from '@clerk/nextjs';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import SalesChart from "@/components/custom ui/SalesChart";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers()

  const graphData = await getSalesPerMonth()

  return (
    <div className='px-8 py-10'>
      <p className='text-heading2-bold'>Dashboard</p>
      <Separator className='bg-grey-1 my-5' />

      <div className='grid grid-cols-2 md:grid-cols-3 gap-10'>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center'>
            <CardTitle>Total Rendimento</CardTitle>
            <CircleDollarSign className='max-sm:hidden' />
          </CardHeader>
          <CardContent>
            <p className='text-body-bold'>$ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row justify-between items-center'>
            <CardTitle>Total Pedidos</CardTitle>
            <ShoppingBag className='max-sm:hidden' />
          </CardHeader>
          <CardContent>
            <p className='text-body-bold'>{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row justify-between items-center'>
            <CardTitle>Total Clientes</CardTitle>
            <UserRound className='max-sm:hidden' />
          </CardHeader>
          <CardContent>
            <p className='text-body-bold'>{totalCustomers}</p>
          </CardContent>
        </Card>

        
      </div>
      <Card className='mt-10'>
          <CardHeader >
            <CardTitle>Grafico Vendas ($)</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={graphData} />
          </CardContent>
        </Card>
    </div>
  );
}
