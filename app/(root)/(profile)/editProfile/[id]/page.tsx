import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import EditProfileForm from '@/components/EditProfileForm';
import { writeClient } from '@/sanity/lib/write-client';
import { USER_BY_ID_QUERY } from '@/sanity/lib/queries';
import { User } from '@/sanity/types';


export type EditUserType = Omit<User, "name" | "email" | "image" | "imageUrl"> & {
    name?: string | undefined;
    email?: string | undefined;
    image?: string | undefined;
    imageUrl?: string | undefined;
}

export default async function page({ params }: { params: { id: string } }){

    const session = await auth();

    const { id } = await params;
    
    if(!session) redirect("/");
    if(session?.user?._id != id) redirect("/");
    
    const user = await writeClient.fetch(USER_BY_ID_QUERY, {id});

  return (
    <section className='main'>
        <EditProfileForm user={user as unknown as EditUserType} />
    </section>
  )
}