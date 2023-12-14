import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { billboardId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", {
                status: 400,
            });
        }

        const billboard = await prismaDb.billboard.findUnique({
            where: {
                id: params.billboardId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_GET_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", {
                status: 400,
            });
        }

        const storeByUserId = await prismaDb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const billboard = await prismaDb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_PATCH_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", {
                status: 400,
            });
        }

        const storeByUserId = await prismaDb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const billboard = await prismaDb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_DELETE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
