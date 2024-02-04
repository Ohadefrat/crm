// pages/api/events/add.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: {
    method: string;
    body: { title: any; allDay: any; start: any; end: any; extendedProps: any };
  },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { message: string; event?: any }): void; new (): any };
    };
  }
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { title, allDay, start, end, extendedProps } = req.body;
    console.log("req.body", req.body);

    const newEvent = await prisma.event.create({
      data: {
        title,
        allDay,
        start,
        end,
        calendar: extendedProps?.calendar || null, // Ensure calendar is provided or set it to null
      },
    });

    res
      .status(201)
      .json({ message: "Event added successfully", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
