"use client"
import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar(){
    const session = useSession();
    return <div className="flex justify-between">
         <div>
           PlayQueue
         </div>
         <div>
            {
                session.data?.user ? (<button onClick={()=>signOut()}>LogOut</button>): (  <button onClick={()=>signIn()}>Sing In</button>)
            }
         </div>
    </div>
}
