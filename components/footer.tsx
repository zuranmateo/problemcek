import Image from "next/image"

export default function Footer(){
  return (
    <div className='footer'>
        <Image src="/logo-noBG.png" alt='logo' width={75} height={75} />
        <div className='text-sm px-5 mt-1 md:text-xl'>
            © 2025 Mateo Žuran. All rights reserved. For Valor is an indie strategy game, and all content—including design, art, models, and audio—is original work by the creator. All trademarks belong to their respective owners.
        </div>
        <div className='text-xl mt-1  md:min-w-[350px]'>
            <div>contact support:</div>
            <div>zuranmateo@gmail.com</div>
        </div>
    </div>
  )
}
