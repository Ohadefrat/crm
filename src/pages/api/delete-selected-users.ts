// Import necessary modules and dependencies
import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: {
        method: string;
        body: { ids: string[] }; // Expect an array of user IDs to delete
    },
    res: {
        status: (arg0: number) => {
            (): any;
            new(): any;
            json: {
                (arg0: { message?: unknown; data?: any; error?: string }): void;
                new(): any;
            };
        };
    }
) {
    if (req.method === "DELETE") {
        const prisma = new PrismaClient();
        const { ids } = req.body;

        try {
            // Delete multiple users by their IDs
            await prisma.user.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });

            return res.status(200).json({
                message: "Selected users deleted successfully",
            });
        } catch (error: any) {
            console.error("Error deleting selected users:", error);

            return res.status(500).json({
                error: "Could not delete selected users",
                message: error.message || "Could not delete selected users",
            });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
