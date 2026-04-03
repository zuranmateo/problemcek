'use client'
import { Input } from "@/components/ui/input";
import { useState, useActionState } from 'react';
import MDeditor from '@uiw/react-md-editor';
import { Send } from 'lucide-react';
import { formSchema } from "@/lib/validation";
import { z } from 'zod';
import { toast } from "sonner" 
import { useRouter } from "next/navigation";
import { CreateAnalysis } from "@/lib/actions";


export default function OrderForm(){

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [description, setDescription] = useState("");

    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try{
            const formValues = {
                title: formData.get("title") as string,
                description,
            }

            await formSchema.parseAsync(formValues);

            //console.log(formValues);

            const result = await CreateAnalysis(prevState, formData, description);
            
            if(result.status == 'SUCCESS'){
                toast.success("Your comment was created succesfully")
            }

            router.push(`/order/ordered`)
        }
        catch (error){
            if(error instanceof z.ZodError){
                const fieldErrors = error.flatten().fieldErrors;

                setErrors(fieldErrors as unknown as Record<string, string>);

                toast.error("Please check your inputs and try again");

                return {...prevState, error: 'validation failed', status:'ERROR'};
            }

            toast.error("Unexpected error");
            return {...prevState, error: 'unexpected error', status: 'ERROR'};
        } 
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit,
        {
        error : '',
        status: 'INITIAL',
        }
    );

  return (
    <form action={formAction} className='bg-primary p-5 my-4 rounded-2xl min-w-[400px] md:min-w-[500px]'>
        <div className='edit-form-part'>
            <label htmlFor="title" className='edit-form-label'>Title</label>
            <Input 
                id='title'
                name='title'
                className='edit-form-input'
                placeholder='naslov analize'
            />
            {errors.title && <p className='edit-form-error'>{errors.title}</p>}
        </div>

        <div className='comment-form-part'>
            <label htmlFor="description" className='edit-form-label'>Description</label>
            
            <MDeditor 
                value={description}
                onChange={(value) => setDescription(value || "")}
                className='mdeditor max-w-full wrap-break-word'
                preview='edit'
                id='description'
                height={300}
                style={{
                    borderRadius:20,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#ffffff",
                    color: "#0a0a0a",
                }}
                textareaProps={{
                    placeholder: "napiši in opiši poslovno idejo",
                    required: true,
                }}
                previewOptions={{
                    disallowedElements: ["style"],
                }}
            />

            {errors.description && <p className='edit-form-error'>{errors.description}</p>}
        </div>

        <button type='submit' className='edit-form-btn' disabled={isPending}>
            {isPending ? 'Submitting...' : 'Pošlji analizo'} <Send className='size-6 ml-2 mt-1' />
        </button>
    </form>
  )
}