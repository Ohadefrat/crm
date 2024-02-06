import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function handler(
    req: {
        method: string;
        body: { email: any; password: any; role: any; fullName: any };
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
        const { email, password, fullName, role } = req.body;

        try {
            // Check if the email already exists in the database
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (existingUser) {
                // Email is already taken, return an error message
                res.status(400).json({
                    error: "Email already in use",
                    message: "Email address is already registered",
                });
            } else {
                // Hash the password using bcrypt
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await prisma.user.create({
                    data: {
                        email: email,
                        password: hashedPassword, // Store the hashed password in the database
                        role: role,
                        fullName: fullName,
                        updatedAt: new Date(),
                    },
                });
                console.log("User created:", user);

                res.status(201).json({
                    message: "User created successfully",
                    data: user,
                });
            }
        } catch (error: any) {
            console.error("Error creating user:", error);

            // New logs to debug
            console.log("Error code:", error.code);
            console.log("Error meta:", error.meta);
            console.log("Error clientVersion:", error.clientVersion);
            console.log("Error backtrace:", error.backtrace);

            res.status(500).json({ error: "Could not create User", message: error });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
