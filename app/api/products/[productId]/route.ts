import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export const GET = async (
    req: NextRequest,
    {params}: {params: {productId:string}}
) => {
    try {
        await connectToDB();

        const product = await Product.findById(params.productId).populate({
            path: "collections",
            model: Collection,
          });

        if(!product){
            return new NextResponse(
                JSON.stringify({message: 'Produto não encontrado'}),
                {status:404}
            )
        }
        return NextResponse.json(product, {status:200})

    } catch (err) {
        console.log("[productId_GET]", err);
        return new NextResponse('Internal error', {status:500})
    }
}

export const POST = async (req: NextRequest, {params}: {params: {productId: string}}) => {
    try {
        const {userId} = auth()

        if(!userId){
            return new NextResponse('Unauthorized', {status:401})
        }
        await connectToDB()
        const product = await Product.findById(params.productId)
        if(!product){
            return new NextResponse(JSON.stringify({message: 'Produto não encontrado'}), {status:404})
        }
        const {title, 
            description, 
            media, 
            category, 
            collections, 
            tags, 
            sizes, 
            colors, 
            price, 
            expense} = await req.json()

        if (!title || !description || !media || !category || !price || !expense){
            return new NextResponse('Não há data para criar um novo Produto', {status:400})
        }
        const addedCollections = collections.filter((collectionId: string) => !product.collections.includes(collectionId))
        //incluir uma nova data, mas não incluir a data anterior
        const removedCollections = collections.filter((collectionId: string) => !product.collections.includes(collectionId))
        //incluir a anterior, mas não incluir a nova data

        
        //update collections
        await Promise.all([
            //atualizar added collections com o produto
            ...addedCollections.map((collectionId:string) => 
            Collection.findByIdAndUpdate(collectionId, {
                $push: {product: product._id},
            })),
            //remover o collections 
            ...removedCollections.map((collectionId: string) => 
            Collection.findByIdAndUpdate(collectionId, {
                $push: {products: product._id},
            }))
        ]);

        const updatedProduct = await Product.findByIdAndUpdate(
            product._id,
            {
              title,
              description,
              media,
              category,
              collections,
              tags,
              sizes,
              colors,
              price,
              expense,
            },
            { new: true }).populate({ path: "collections", model: Collection })

            await updatedProduct.save()

            return NextResponse.json(updatedProduct, {status:200})
    } catch (err) {
        console.log("[productId_POST]", err)
        return new NextResponse('Internal error', {status:500})
    }
}

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
  ) => {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      await connectToDB();
  
      const product = await Product.findById(params.productId);
  
      if (!product) {
        return new NextResponse(
          JSON.stringify({ message: "Product not found" }),
          { status: 404 }
        );
      }
  
      await Product.findByIdAndDelete(product._id);
  
      // Update collections
      await Promise.all(
        product.collections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(collectionId, {
            $pull: { products: product._id },
          })
        )
      );
  
      return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
        status: 200,
      });
    } catch (err) {
      console.log("[productId_DELETE]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  
export const dynamic = "force-dynamic";