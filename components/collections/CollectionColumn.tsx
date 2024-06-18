"use client"

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";


export const columns: ColumnDef<CollectionType>[] = [
    {
        accessorKey: 'title',
        header: 'Titulo',
        cell: ({ row }) => (
            <Link
            href={`/collections/${row.original._id}`}
            className='hover:text-red-1'
            >
            {row.original.title}
            </Link>
        ),
    },
    {
        accessorKey: 'products',
        header: 'Produtos',
        cell: ({ row }) => <p>{row.original.products}</p>
    },
    {
        id: 'actions',
        cell: ({row }) => <Delete item='collection' id={row.original._id} />
    }
]

