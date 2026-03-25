'use server'

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import  slugify  from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createComment = async (state: any, form: FormData, description: string) => {
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error: 'Not singed in',
        status: 'Error',

    });

    const { title } = Object.fromEntries(
        Array.from(form).filter(([key]) => key != 'description')
    )

    const slug = slugify(title as string, {lower: true, strict: true})

    try{
        const comment = {
            title,
            description,
            slug:{
                _type: slug,
                current: slug,
            },
            author: {
                _type: 'reference',
                _ref: session?.user?._id,
            }
        }

        const result = await writeClient.create({_type: 'comment', ...comment})
        //console.log(comment);

        return parseServerActionResponse({
            ...result,
            error: '',
            status: 'SUCCESS'
        })
    }
    catch(error){
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: 'ERROR'
        });
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UpdateProfile= async (state: any, form: FormData, _id: string) =>{
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error: 'Not singed in',
        status: 'Error',

    });

    const name = form.get("name") as string;
    const email = form.get("email") as string;
    let file = form.get("file") as File | null;

    if(file && file.size <= 0){
        file = null;
    }

    //console.log("\n \n \n \n \n",name, email, file, "\n \n \n \n \n");

    try{
        let result;
        if(file){
            const buffer = Buffer.from(await file.arrayBuffer());

            const uploadedAsset = await writeClient.assets.upload('image', buffer, {
                filename: file.name,
            });

                result = await writeClient.patch(_id).set({
                name,
                email,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: uploadedAsset._id,
                    },
                },
            }).commit();
        }
        else{
            result = await writeClient.patch(_id).set({
            name,
            email,
            }).commit();
        }
         
        //console.log(comment);

        return parseServerActionResponse({
            ...result,
            error: '',
            status: 'SUCCESS'
        })
    }
    catch(error){
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: 'ERROR'
        });
    }

}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UpdateComment = async (state: any, form: FormData, _id: string, desc: string) =>{
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error: 'Not singed in',
        status: 'Error',

    });

     const title = form.get("title") as string;

    //console.log("\n \n \n \n \n",name, email, file, "\n \n \n \n \n");

    try{

        const result = await writeClient.patch(_id).set({
        title: title,
        description: desc,
        }).commit();
        //console.log(comment);

        return parseServerActionResponse({
            ...result,
            error: '',
            status: 'SUCCESS'
        })
    }
    catch(error){
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: 'ERROR'
        });
    }

}


export const DeleteComment = async (_id: string) =>{
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error: 'Not singed in',
        status: 'Error',

    });

    //console.log("\n \n \n \n \n",name, email, file, "\n \n \n \n \n");

    try{

        const result = await writeClient.delete(_id);
        //console.log(comment);

        return parseServerActionResponse({
            ...result,
            error: '',
            status: 'SUCCESS'
        })
    }
    catch(error){
        console.log(error);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: 'ERROR'
        });
    }

}
