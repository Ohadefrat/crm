import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: { method: string },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: {
          message?: any;
          data?: {
            id: string;
            email: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
          }[];
          error?: string;
        }): any;
        new (): any;
      };
    };
  }
) {
  if (req.method === "GET") {
    const prisma = new PrismaClient();

    try {
      // Fetch all users
      const users = await prisma.user.findMany();

      return res.status(200).json({
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error: any) {
      // Specify 'error' as 'any'
      console.error("Error fetching users:", error);

      // New logs to debug
      console.log("Error code:", error.code);
      console.log("Error meta:", error.meta);
      console.log("Error clientVersion:", error.clientVersion);
      console.log("Error backtrace:", error.backtrace);

      return res
        .status(500)
        .json({ error: "Could not fetch users", message: error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
