import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
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

        const category = await prismaDb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log("[CATEGORIES_POST_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const categories = await prismaDb.category.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log("[CATEGORIES_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
