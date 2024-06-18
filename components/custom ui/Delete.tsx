"use client"

import { useState } from "react";
import { Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface DeleteProps {
    item: string;
    id: string;
}

const Delete: React.FC<DeleteProps> = ({item, id})=>{
    const [loading, setLoading] = useState(false);

    const onDelete = async ()=> {
        try{
            setLoading(true)
            const itemType = item === 'product' ? 'products':'collections'
            const res = await fetch(`/api/${itemType}/${id}`, {
                method: 'DELETE',
            })
            if(res.ok){
                setLoading(false)
                window.location.href = (`/${itemType}`)
                toast.success(`${item} deleted`)
            }
        } catch (err){
            console.log(err)
            toast.error('Something went wrong! Please try again')
        }
    }

    return (
        <AlertDialog>
        <AlertDialogTrigger>
          <Button className="bg-red-1 text-white">
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white text-grey-1">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-1">Voce tem absoluta certeza?</AlertDialogTitle>
            <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente seu {item}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

}

export default Delete;