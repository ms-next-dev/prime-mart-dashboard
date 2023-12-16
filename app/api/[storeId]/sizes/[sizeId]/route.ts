import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.sizeId) {
            return new NextResponse("Size id is required", {
                status: 400,
            });
        }

        const size = await prismaDb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_GET_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; sizeId: string } }
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

        if (!params.sizeId) {
            return new NextResponse("Size id is required", {
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

        const size = await prismaDb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_PATCH_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; sizeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.sizeId) {
            return new NextResponse("Size id is required", {
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

        const size = await prismaDb.size.deleteMany({
            where: {
                id: params.sizeId,
            },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_DELETE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
