// Import necessary modules and dependencies
import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: {
        method: string;
        body: { id: string }; // Expect an object with the user ID to delete
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
        const { id } = req.body;

        try {
            // Check if the user with the given ID exists
            const existingUser = await prisma.user.findUnique({
                where: {
                    id,
                },
            });

            if (!existingUser) {
                return res.status(404).json({
                    error: "User not found",
                    message: "User not found",
                });
            }

            // Delete the user by ID
            await prisma.user.delete({
                where: {
                    id,
                },
            });

            return res.status(200).json({
                message: "User deleted successfully",
            });
        } catch (error: any) {
            console.error("Error deleting user:", error);

            return res.status(500).json({
                error: "Could not delete user",
                message: error.message || "Could not delete user",
            });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
