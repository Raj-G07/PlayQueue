import { NextRequest, NextResponse } from "next/server";
import {CreateStreamSchema} from "@/lib/schema/stream.schema";
import db  from "@/lib/db";
import { YT_REGEX } from "@/lib/utils";
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
export async function POST(req:NextRequest){
    const session = await getServerSession(authOptions);
    if(!session?.user){ 
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    const user = session.user;
    if(!user.id){
        return NextResponse.json(
            { error: "User ID not found" },
            { status: 400 }
 
        );
    }
    try{
    const data = CreateStreamSchema.parse(await req.json());

        if(!data.url.trim()){
        return NextResponse.json({
        error: "URL cannot be empty"    
     }, { status: 400 });
     }
     const isYt = data.url.match(YT_REGEX);
     const videoId = data.url ? data.url.match(YT_REGEX)?.[1] : null;
     if(!isYt || !videoId){
        return NextResponse.json({
            error: "Invalid YouTube URL"
        }, { status: 400 });
     }
     const res = await youtubesearchapi.GetVideoDetails(videoId);
        if(!res){
            return NextResponse.json({
                error: "Failed to fetch video details"
            }, { status: 400 });
        }
        const stream = await db.stream.create({ data: {
            creatorId: data.creatorId,
            url: data.url,
            extractedId: videoId,
            type: "Youtube",
            spaceId: data.spaceId
        }});
        return NextResponse.json({
            message: "Stream created successfully",
            ...stream,
            upvotes: 0,
            hasUpvoted: false,
        }, { status: 201 });
    }catch(e){
        return NextResponse.json({  message: "Internal Server Error" }, { status: 500 });
    }
}