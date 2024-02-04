// pages/api/updateEvent.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function handler(
  req: {
    method: string;
    query: { eventId: any };
    body: { title: any; start: any; end: any; allDay: any; calendar: any };
  },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { data?: any; error?: string }): void; new (): any };
      end: { (): void; new (): any };
    };
  }
) {
  if (req.method === "PUT") {
    const { eventId } = req.query;
    const { title, start, end, allDay, calendar } = req.body;

    try {
      // Use Prisma to update the event by its ID
      const updatedEvent = await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: {
          title,
          start,
          end,
          allDay,
          calendar,
        },
      });

      res.status(200).json({ data: updatedEvent });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end(); // Method not allowed
  }
}
