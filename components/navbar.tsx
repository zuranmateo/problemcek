import Image from "next/image";

export default function Navbar(){
  return (
    <>
        <div className="navbar">
            <div>
                <Image src="/logo.png" alt="logo" width={50} height={25}/>
            </div>
        </div>
    </>
  );
}
