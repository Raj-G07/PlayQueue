import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
   const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });   
    }
    const user = session.user;


 

  try {
    // Delete the stream from the database
 const { searchParams } = new URL(req.url);
  const streamId = searchParams.get("streamId");
  const spaceId = searchParams.get("spaceId");

  if (!streamId || !spaceId) {
    return NextResponse.json(
      { error: "Missing streamId or spaceId" },
      { status: 400 }
    );
  }
    await prisma.stream.deleteMany({
      where: {
        id: streamId,
        spaceId: spaceId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Stream removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error removing stream:", error);
    return NextResponse.json({ error: "Failed to remove stream" }, { status: 500 });
  }
}