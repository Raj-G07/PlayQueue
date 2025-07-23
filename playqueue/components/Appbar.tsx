"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function Appbar({showThemeSwitch=true, isSpectator=false}: {showThemeSwitch?: boolean, isSpectator?: boolean}) {
    const session = useSession();
    const router = useRouter();
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
