import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: { method: string; body: { email: any; password: any; }; },
    res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: unknown; data?: any; error?: string; }): void; new(): any; }; }; },
) {
    if (req.method === "POST") {
        const prisma = new PrismaClient();
        const { email } = req.body;
        console.log(req.body);

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });
            console.log('User:', user);

            res
                .status(200)
                .json({
                    message: "User true",
                    data: user,
                });
        } catch (error: any) { // Specify 'error' as 'any'
            console.error('Error getting user:', error);

            // New logs to debug
            console.log('Error code:', error.code);
            console.log('Error meta:', error.meta);
            console.log('Error clientVersion:', error.clientVersion);
            console.log('Error backtrace:', error.backtrace);

            res
                .status(500)
                .json({ error: "Could not get User", message: error });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
