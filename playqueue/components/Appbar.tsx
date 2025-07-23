"use client"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
export function Appbar({showThemeSwitch=true}: {showThemeSwitch?: boolean}) {
    const session = useSession();
    const router = useRouter();
    return <div className="flex justify-between px-5 py-4 md:px-10 xl:px-20">
         <div
          onClick={() => router.push("/home")}
          className={`flex flex-col justify-center text-lg font-bold hover:cursor-pointer ${showThemeSwitch ? "" : "text-white"}`}>
           PlayQueue
         </div>
         <div className="flex items-center space-x-4">
            {
                session.data?.user && (
                  <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signOut({
                    callbackUrl: "/"
                  })}>
                    Logout
                  </Button>
                )
            }
             {!session.data?.user && (
          <div className="space-x-3">
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => router.push("/auth")}
            >
              Signin
            </Button>
            <Link
              href={{
                pathname: "/auth",
                query: {
                  authType: "signUp",
                },
              }}
            >
              <Button
                variant={"ghost"}
                className="text-white hover:bg-white/10"
              >
                Signup
              </Button>
            </Link>
          </div>
        )}
           {showThemeSwitch && <ThemeSwitcher/>}
         </div>
    </div>
}
