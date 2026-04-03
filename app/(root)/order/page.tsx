import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import OrderForm from '@/components/OrderForm';

export default async function page(){
  const session = await auth();
  
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <div className='box-container2'>
        ORDER ANALYSIS
      </div>
      <div className='main2'>
        <div className='flex flex-col md:flex-row'>
          <div>
            <OrderForm />
          </div>
          <div className="bg-secondary rounded-2xl text-white p-4 md:max-w-50 m-3">
            Natančno opišite svojo težavo, saj vse vpliva na končni rezultat. Bodite objektivni.
            Prepričajte se, da vaše besedilo ne vsebuje slovničnih napak. Morebitna napaka v razumevanju besedila ni naša krivda.
          </div>
        </div>
      </div>
    </>
  )
}