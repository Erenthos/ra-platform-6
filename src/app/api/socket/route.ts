import initializeSocket from "@/lib/socket";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    initializeSocket(req, res);
  }
  res.end();
}
