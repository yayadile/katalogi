'use server'

import { prisma } from "@/lib/prisma";

export async function trackPageView(websiteId: string) {
    try {
        await prisma.website.update({
            where: { id: websiteId },
            data: { pageViews: { increment: 1 } },
        });
    } catch (error) {
        console.error("Error tracking page view:", error);
    }
}