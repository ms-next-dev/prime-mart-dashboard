import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        if (!params.colorId) {
            return new NextResponse("Color id is required", {
                status: 400,
            });
        }

        const color = await prismaDb.color.findUnique({
            where: {
                id: params.colorId,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_GET_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("Color id is required", {
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

        const color = await prismaDb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_PATCH_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.colorId) {
            return new NextResponse("Color id is required", {
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

        const color = await prismaDb.color.deleteMany({
            where: {
                id: params.colorId,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_DELETE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
