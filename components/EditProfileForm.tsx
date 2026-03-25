'use client'

import { Input } from "@/components/ui/input";
import { useState, useActionState } from 'react';
import { profileSchema } from "@/lib/validation";
import { z } from 'zod';
import { toast } from "sonner" ;
import { useRouter } from "next/navigation";
import { EditUserType } from "@/app/(root)/(profile)/editProfile/[id]/page";
import { Send } from "lucide-react";
import { UpdateProfile } from "@/lib/actions";
import { signOut } from "next-auth/react";

export default function EditProfileForm({user}: {user: EditUserType}){

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [file, setFile] = useState(user.image);

    function handleFile(file: File) {
        const url = URL.createObjectURL(file); // takoj dobiš preview
    setFile(url);
  }

    //console.log(user)
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFormSubmit = async (prevState: any, formData: FormData) => {
            try{
                let formValues;
                if(file == user.image){
                    formValues = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    }
                }
                else{
                    formValues = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    file: formData.get("file") as File
                    }
                }
    
                await profileSchema.parseAsync(formValues);
    
                //console.log("\n \n \n \n \n",name, email, file, "\n \n \n \n \n");
                
                const result = await UpdateProfile(prevState, formData, user._id);
                
                if(result.status == 'SUCCESS'){
                    toast.success("Your profile was updated succesfully, please log in again")
                }
                 await signOut();

                await new Promise(resolve => setTimeout(resolve, 2000));

                router.push(`/comments`);
            }
            catch (error){
                if(error instanceof z.ZodError){
                    const fieldErrors = error.flatten().fieldErrors;
                    
                    setErrors(fieldErrors as unknown as Record<string, string>);
                    
                    console.log("\n \n \n \n \n",error , "\n \n \n \n \n");

                    toast.error("Please check your inputs and try again");
    
                    return {...prevState, error: 'Updating failed', status:'ERROR'};
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
    <form action={formAction} className="p-4 bg-primary shadow-2xl rounded">
        <h3 className="text-textprimary text-5xl mb-4 text-center font-cardinal text-white">
            Edit profile
        </h3>
        <div className='comment-form-part'>
            <label htmlFor="name" className='edit-form-label'>name</label>
            <Input 
                id='name'
                name='name'
                className='edit-form-input'
                placeholder='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {errors.title && <p className='comment-form-error'>{errors.title}</p>}
        </div>
        <div className='comment-form-part'>
            <label htmlFor="email" className='edit-form-label'>email</label>
            <Input 
                id='email'
                name='email'
                className='edit-form-input'
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {errors.title && <p className='comment-form-error'>{errors.title}</p>}
        </div>
        <div className='mt-2'>
            <label htmlFor="file" className='edit-form-label'>image</label>
            <div className="relative w-fit mx-4 mt-3">
                <div className="w-[100px] h-[100px] rounded-full" style={{backgroundImage: `url('${file}')`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                <input 
                    type='file'
                    id='file'
                    accept=".png,.jpg,.jpeg"
                    name='file'
                    className='w-[100px] h-[100px] items-center px-3 py-2 text-sm border-3 absolute inset-0 text-transparent border-textprimary hover:bg-black/50 rounded-full'
                    placeholder='file'
                    onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    }}
                />
            </div>
            {errors.title && <p className='comment-form-error'>{errors.title}</p>}
        </div>
        <button type='submit' className='edit-form-btn' disabled={isPending}>
            {isPending ? 'Submitting...' : 'Update profile'} <Send className='size-6 ml-2 mt-1' />
        </button>
    </form>
  )
}