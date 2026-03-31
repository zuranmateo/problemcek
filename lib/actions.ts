'use server'

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import  slugify  from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CreateAnalysis = async (state: any, form: FormData, description: string) => {
    const session = await auth();

    if(!session) return parseServerActionResponse({
        error: 'Not singed in',
        status: 'Error',

    });

    const { title } = Object.fromEntries(
        Array.from(form).filter(([key]) => key != 'description')
    )

    const slug = slugify(title as string, {lower: true, strict: true})

    const AIanalysis = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an AI that evaluates business ideas.

Rules:
- Your response MUST be in markdown text (not JSON, not code, not textarea style).
- Keep the answer short and structured.
- Respond in the same language as the description is written. Expect to write a lot in Slovenian.

Verdict rule:
- You must include EXACTLY one of these phrases:
  "ideja je dobra"
  OR
  "ideja je slaba"
- Do NOT repeat or rephrase this phrase anywhere else.

Evaluation:
- Internally analyze:
  market demand, uniqueness, feasibility, monetization, scalability
- Do NOT output scores or numbers.

Hard fail (must be "ideja je slaba"):
- no clear customer
- no monetization
- no real problem
- oversaturated with no differentiation
- technically unrealistic

Context:
- The project is connected to a Sanity database
- Output will be rendered as markdown (not inside a textarea)

Structure your response like:

ideja je dobra/slaba

**Povzetek:**
...

**Prednosti:**
- ...

**Slabosti:**
- ...

**Predlogi izboljšav:**
- ...

analise this business idea:
title: ${title} 
description:
${description}`
    })

    const text = await AIanalysis.text || "";
    const isgood = text.toLowerCase().includes("ideja je dobra");
    try{
        const order = {
            title,
            userinput: description,
            isgood,
            slug:{
                _type: slug,
                current: slug,
            },
            aianalysis: text,
            user: {
                _type: 'reference',
                _ref: session?.user?._id,
            }
        }

        const result = await writeClient.create({_type: 'analysis', ...order})
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

export const DeleteOrder = async (_id: string) =>{
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
