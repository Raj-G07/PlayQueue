import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    const user = session.user;
    const data = await req.json();
  try {
    // Clear the play queue by deleting all entries
    await prisma.stream.updateMany({
        where: { userId: user.id,
        played: false , // Assuming you want to clear only unplayed streams
        spaceId: data.spaceId  // Assuming spaceId is passed in the request body
         },
        data: {played:true,
            playedTs: new Date()
         } 
    });
    
    // Return a success response
    return new Response(JSON.stringify({ message: "Play queue cleared successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error clearing play queue:", error);
    return new Response(JSON.stringify({ error: "Failed to clear play queue" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}