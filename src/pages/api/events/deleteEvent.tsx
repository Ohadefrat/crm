// pages/api/deleteEvent.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { eventId } = req.query;

    try {
      // Use Prisma to delete the event by its ID
      await prisma.event.delete({
        where: { id: parseInt(eventId) },
      });

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end(); // Method not allowed
  }
}
