// pages/api/updateEvent.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function handler(req, res) {
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

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end(); // Method not allowed
  }
}
