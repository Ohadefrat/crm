import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: {
        method: string;
        body: { email: any; password: any; role: any; fullName: any }; // Include fullName in the request body
    }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: unknown; data?: any; error?: string; }): void; new(): any; }; }; },
) {
    if (req.method === "POST") {
        const prisma = new PrismaClient();
        const { email, password, fullName, role } = req.body;
        console.log(req.body);

        try {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    password: password,
                    role: role,
                    fullName: fullName,
                    updatedAt: new Date()
                },
            });
            console.log('User created:', user);

            res
                .status(201)
                .json({
                    message: "User created successfully",
                    data: user,
                });
        } catch (error: any) { // Specify 'error' as 'any'
            console.error('Error creating user:', error);

            // New logs to debug
            console.log('Error code:', error.code);
            console.log('Error meta:', error.meta);
            console.log('Error clientVersion:', error.clientVersion);
            console.log('Error backtrace:', error.backtrace);

            res
                .status(500)
                .json({ error: "Could not create User", message: error });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
