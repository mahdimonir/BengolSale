import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const validateApiKey = (req: Request) => {
    const apiKey = req.headers.get("x-admin-key");
    const validKey = process.env.ADMIN_API_KEY;
    return validKey && apiKey === validKey;
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateApiKey(req)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!validateApiKey(req)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error: any) {
        console.error("Order update failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
