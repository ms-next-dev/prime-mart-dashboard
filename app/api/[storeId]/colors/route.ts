import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { colorId: string; storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
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

        const colors = await prismaDb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log("[COLORS_POST_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const colors = await prismaDb.color.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log("[COLORS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
