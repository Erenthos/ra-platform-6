import type { Server as HTTPServer } from "http";
import type { Socket } from "net";
import type { Server as IOServer } from "socket.io";

declare module "next" {
  import { NextApiResponse } from "next";

  export interface NextApiResponseServerIO extends NextApiResponse {
    socket: Socket & {
      server: HTTPServer & {
        io?: IOServer;
      };
    };
  }
}
