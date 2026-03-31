import { auth } from '@/auth'
import Link from 'next/link'

export default async function page(){
    const session = await auth();
  return (
    <div className='main'>
        <div className='flex flex-col items-center'>
            <div className='p-3 mb-5 text-xl'>
                analiza je bila uspešna. Vaša analiza se nahaja na vašemu profilu. Kliknite gumb, da pridete na profil.
            </div>
            <Link href={`../profile/${session?.user?._id}`} className='py-2 px-8 rounded-4xl bg-secondary text-white hover:bg-secondaryDarkened'>
                Profil
            </Link>
        </div>
    </div>
  )
}