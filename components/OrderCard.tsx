import { Markdown, Slug, Analysis, User } from '@/sanity/types';
import { FormatDate } from '@/lib/utils'
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ThumbsDown, ThumbsUp } from 'lucide-react';


export type UserType = Omit<User, "name" | "email" | "image" | "imageUrl"> & {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    imageUrl?: string | null;
}

export type AnalysisCardType = Omit<Analysis, "title" | "slug" | "isgood" | "userinput" | "aianalysis" | "user"> & {
    title?: string | null;
    slug?: Slug | null;
    isgood?: boolean | null;
    userinput?: Markdown | null;
    aianalysis?: Markdown | null;
    user?: UserType | null;
};


export default async function OrderCard ({post}:{post: AnalysisCardType}){

    const session = await auth();

    
    if(!session){
        redirect("./");
    }
  return (
    <li className='bg-secondary text-white rounded-2xl m-2 shadow-2xl'>
        <div className='flex-between text-textprimary px-3 py-5 min-h-[50px] rounded-xl'>
            <Link href={`/profile/${post?.user?._id}`}>
                <div className='flex flex-row border-b-1'>
                    <div>
                        <Image src={`${post?.user?.image || post?.user?.imageUrl || "/defaultProfileImg.png"}`  }  alt='profile picture' height={50} width={50} className='rounded-full mx-3 h-10 w-10' />
                    </div>
                    <div className='flex flex-col'>
                        <div className='text-white'>
                            {post?.user?.name}
                        </div>
                        <div className='text-sm text-textgray'>
                            {post?.user?.email}
                        </div>
                    </div>
                </div>
            </Link>
            <Link href={`/analysis/${post?.slug?.current}`}>
                <div className="flex flex-col justify-between rounded-xl">
                <div className='mb-4 mt-2 rounded-xl w-full h-fit'>
                    <h1 className="text-2xl">
                    {post?.title}
                    </h1>
                </div>
                <div className='flex justify-between'>
                    <div>
                        <p className="text-textgray text-md p-3 rounded-xl">
                            {FormatDate(post?._createdAt)}
                        </p>
                    </div>
                    <div className=' flex justify-center bg-white w-10 h-10 shadow-2xl rounded-2xl flex-col items-center'>
                        {post.isgood ? (
                            <ThumbsUp className=' text-green-500' />
                        ) : (
                            <ThumbsDown className='text-red-500'/>
                        )}
                    </div>
                </div>
            </div>
            </Link>
        </div>
    </li>
  )
}