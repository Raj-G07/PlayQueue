import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { VoteSchema } from "@/lib/schema/vote.schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const session = await getServerSession(authOptions);
   if(!session?.user){
        return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
        );
   }
   const user = session.user;
  try {
    const data = VoteSchema.parse(await req.json());

    if (!data.streamId) {
      return NextResponse.json(
        { error: "Stream ID is required" },
        { status: 400 }
      );
    }

    const upvote = await prisma.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    return NextResponse.json(
      { message: "Upvoted successfully", upvote },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}