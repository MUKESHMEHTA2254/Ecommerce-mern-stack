import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

const stripe = require("stripe")("sk_test_51NsKGHSJtbP3MYPunqB6fZALbWGWf3YQoOWbVKLMbC4cRh6Z1ntBR8Ctq1ega6xkX2sU0YCrak2vJKQ0BcXl3Lqz00vlojPKFq");

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const isAuthUser = await AuthUser(req);
        if (isAuthUser) {
            const res = await req.json();

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: res,
                mode: "payment",
                success_url: "http://127.0.0.1:3000/checkout" + "?status=success",
                cancel_url: "http://127.0.0.1:3000/checkout" + "?status=cancel",
            });

            return NextResponse.json({
                success: true,
                id: session.id,
            });
        } else {
            return NextResponse.json({
                success: true,
                message: "You are not authenticated",
            });
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Something went wrong ! Please try again",
        });
    }
}