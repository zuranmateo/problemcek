import { auth } from '@/auth';
import { ANALYSIS_BY_ANALYSIS_SLUG_QUERY } from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';
import { redirect } from 'next/navigation';
import  markdownit  from "markdown-it";
import { ThumbsDown, ThumbsUp } from 'lucide-react';

const md = markdownit();

export default async function page({params}: {params: Promise<{slug: string}>}){
    const slug = (await params).slug;
    const session = await auth();

    const post = await writeClient.fetch(ANALYSIS_BY_ANALYSIS_SLUG_QUERY, {slug})

    if(session?.user?._id != post?.user?._id){
      //console.log(post)
        redirect("/");
    }

    const parsedContent = md.render(post?.aianalysis || '');
    const parsedUserContent = md.render(post?.userinput || '');

  return (
    <div className='flex flex-col items-center'>
        <div className='border-2 max-w-300 min-w-200 my-10'>
          <div className='text-white bg-primary text-4xl px-5 py-3'>
            {post?.title}
          </div>
          <div className=' flex justify-center bg-white w-10 h-10 shadow-2xl rounded-2xl flex-col items-center'>
                        {post.isgood ? (
                            <ThumbsUp className=' text-green-500' />
                        ) : (
                            <ThumbsDown className='text-red-500'/>
                        )}
                    </div>
          <div className='p-4 rounded-xl h-fit break-all'>
            {parsedContent ? (
              <article
                dangerouslySetInnerHTML={{__html : parsedContent}}
              />
            ) : (
              <p>no details provided</p>
            )}
          </div>
          <hr />
          <div className='p-4 rounded-xl h-fit break-all'>
            <div className='text-2xl'>
              vaš vnos
            </div>
            {parsedUserContent ? (
              <article
                dangerouslySetInnerHTML={{__html : parsedUserContent}}
              />
            ) : (
              <p>no details provided</p>
            )}
          </div>
        </div>
    </div>
  )
}