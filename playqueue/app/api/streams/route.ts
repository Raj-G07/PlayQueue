import { NextRequest, NextResponse } from "next/server";
import {CreateStreamSchema} from "@/lib/schema/stream.schema";
import prisma  from "@/lib/db";
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
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a:{width:number}, b:{width:number}) => a.width - b.width);
        
        const stream = await prisma.stream.create({ data: {
            creatorId: data.creatorId,
            url: data.url,
            extractedId: videoId,
            type: "Youtube",
            title: res.title,
            smallImg:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigImg:
          thumbnails[thumbnails.length - 1].url ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
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