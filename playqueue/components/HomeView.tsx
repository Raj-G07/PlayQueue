import { useState } from "react";
import { Appbar } from "./Appbar";
import { Button } from "./ui/button";

export default function HomeView(){
    const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
    return(
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
         <Appbar/>
          <div className="h-36 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-900 bg-clip-text text-9xl font-bold text-transparent">
          Spaces
        </div>
         <Button
          onClick={() => {
            setIsCreateSpaceOpen(true);
          }}
          className="mt-10 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Create a new Space
        </Button>
        </div>
    )
}