"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUplaod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import Loader from "../custom ui/Loader";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";

const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    price: z.coerce.number().min(0.1),
    expense: z.coerce.number().min(0.1),
});

interface ProductFormProps {
    initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({initialData})=> {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<CollectionType[]>([]);

    const getCollections = async () => {
        try{
            const res = await fetch("/api/collections", {
                method: 'GET',
            });
            const data = await res.json();
            setCollections(data);
            setLoading(false);
        } catch (err){
            console.log("[collection_GET]", err);
            toast.error('Algo deu errado, tente novamente!')
        }
    };

    useEffect(()=> {
        getCollections();
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
        ? {
            ...initialData,
            collections: initialData.collections.map(
                (collection) => collection._id
            )
        }
        : {
            title: '',
            description:'',
            media: [],
            category: '',
            collections: [],
            tags: [],
            sizes: [],
            colors: [],
            price: 0.1,
            expense: 0.1,
        },
    });

    const handleKeyPress = (
        e: 
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if(e.key === 'Enter'){
            e.preventDefault();
        }
    };

    return (
        <div className='p-10'>
            <p className='text-heading2-bold'>Criar Produto</p>
            <Separator className="bg-grey-1 mt-4 mb-7" />
            <Form {...form}>
        <form  className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Titulo do produto"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrinção</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escreva detalhes sobre o produto..."
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <div className='md:grid md:grid-cols-3 gap-8'>
          <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Valor"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desconto ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Categoria"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coleções</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collections"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (collectionId) => collectionId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
             <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cores</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Colors"
                      value={field.value}
                      onChange={(color) =>
                        field.onChange([...field.value, color])
                      }
                      onRemove={(colorToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (color) => color !== colorToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanhos</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Sizes"
                      value={field.value}
                      onChange={(size) =>
                        field.onChange([...field.value, size])
                      }
                      onRemove={(sizeToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (size) => size !== sizeToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-10">
            <Button type="submit" className="bg-purple-600 text-white">
              Enviar
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-blue-1 text-white"
            >
              Discartar
            </Button>
            </div>
          </form>
          </Form>
        </div>
    )
}

export default ProductForm;