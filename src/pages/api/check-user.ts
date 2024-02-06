import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function handler(
    req: {
        method: string;
        body: { email: any; password: any };
    },
    res: {
        status: (arg0: number) => {
            (): any;
            new(): any;
            json: { (arg0: { message?: unknown; data?: any; error?: string }): void; new(): any };
        };
    }
) {
    if (req.method === "POST") {
        const prisma = new PrismaClient();
        const { email, password } = req.body;

        try {
            // Find the user by email
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (user) {
                // Compare the provided password with the hashed password stored in the database using bcrypt
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    // Passwords match, so the user is authenticated.
                    res.status(200).json({
                        message: "Authentication successful",
                        data: user,
                    });
                } else {
                    // Passwords do not match.
                    res.status(401).json({
                        error: "Authentication failed",
                        message: "Invalid email or password",
                    });
                }
            } else {
                // User not found.
                res.status(401).json({
                    error: "Authentication failed",
                    message: "User not found",
                });
            }
        } catch (error: any) {
            console.error("Error getting user:", error);

            res.status(500).json({
                error: "Could not authenticate user",
                message: error,
            });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
