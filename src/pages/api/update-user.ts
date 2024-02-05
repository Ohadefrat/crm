import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: {
        method: string;
        body: {
            id: string;
            email: string;
            password: string;
            role: string;
            fullName: string;
            avatarUrl: string
        };
    },
    res: {
        status: (arg0: number) => {
            (): any;
            new(): any;
            json: { (arg0: { message?: unknown; data?: any; error?: string }): void; new(): any };
        };
    }
) {
    if (req.method === "PUT") {
        const prisma = new PrismaClient();
        const { id, email, password, role, fullName, avatarUrl } = req.body;
        console.log(req.body);

        try {
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    email,
                    password,
                    role,
                    fullName,
                    avatarUrl,
                    updatedAt: new Date(),
                },
            });

            console.log("User updated:", updatedUser);

            res.status(200).json({
                message: "User updated successfully",
                data: updatedUser,
            });
        } catch (error: any) {
            console.error("Error updating user:", error);

            res.status(500).json({ error: "Could not update User", message: error });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
