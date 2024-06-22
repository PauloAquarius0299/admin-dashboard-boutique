import Customer from '@/lib/models/Customer';
import Order from '@/lib/models/Order';
import {connectToDB} from '@/lib/mongoDB';

import { NextResponse, NextRequest } from 'next/server';
import { format} from 'date-fns';

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB()

        const orders = await Order.find().sort({ createdAt: 'desc'})

        const orderDetails = await Promise.all(orders.map(async (order) => {
            const customer = await Customer.findOne({clerkId: order.customerClerkId})
            return {
                id: order._id,
                customer: customer.name,
                products: order.product.length,
                totalAmount: order.totalAmount,
                createAt: format(order.createdAt, 'MM do, yyyy')
            }
        }))

        return NextResponse.json(orderDetails, {status: 200})
    } catch (err) {
        console.log("[orders_GET]", err)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}