
import { DataTable } from '@/components/custom ui/DataTable'
import React from 'react'

const OrderDetails = async ({params}: {params: {orderId: string}}) => {
    const res = await fetch(`http://localhost:3000/api/orders/${params.orderId}`)
    const {orderDetails, customer} = await res.json()

    const { street, city, state, postalCode, country } = orderDetails.shippingAddress

  return (
    <div className='flex flex-col p-18 gap-5'>
        <p className='text-base-hold'>
            Pedido ID: <span>{orderDetails._id}</span>
        </p>
        <p className='text-base-hold'>
            nome Cliente: <span className='text-base-medium'>{customer.name}</span>
        </p>
        <p className='text-base-bold'>
            Endereço do cliente: <span className='text-base-medium'>{street}, {city}, {state}, {postalCode}, {country}</span>
        </p>
        <p className='text-base-bold'>
            Total: <span className='text-base-medium'>${orderDetails.totalAmount}</span>
        </p>
        <p className='text-base-bold'>
            Shipping rate ID: <span className='text-base-medium'>{orderDetails.shippingRate}</span>
        </p>
        <DataTable columns={columns} data={orderDetails.products} searchKey='product' />
    </div>
  )
}

export default OrderDetails