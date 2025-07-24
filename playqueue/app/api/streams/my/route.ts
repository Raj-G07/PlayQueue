import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest) {
    const session = await getServerSession(authOptions)
    if(!session?.user){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
  try {
    const streams = await prisma.stream.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: {
          where: { userId: user.id },
      },
    }
    });

    return NextResponse.json({streams: streams.map(({_count,...rest}) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveUpvoted: rest.upvotes.length > 0})),});
  } catch (error) {
    console.error('Error fetching streams:', error);
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 });
  }
}