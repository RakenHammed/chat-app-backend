import jwt = require("jwt-simple");
import socketIo from "socket.io";
import User from "../models/User";
import { getJwtSecret } from "../services/JwtService";

let isClientListeningToRoom: boolean;

function setIsClientListeningToRoom(value: boolean) {
  isClientListeningToRoom = value;
}

function getIsClientListeningToRoom() {
  return isClientListeningToRoom;
}

export const connectToConversationSocket = (io: SocketIO.Server) => {
  const conversationSocket = io.of("/conversation");
  conversationSocket.on("connection", async (socket: any) => {
    const token = socket.handshake.query.token;
    const clientsConnected = conversationSocket.connected;
    setIsClientListeningToRoom(false);
    closeConnectionIfClientIsNotListeningToRoom(clientsConnected, socket).then();
    socket.on("conversationRoomNumber", async (conversationId: string) => {
      try {
        setIsClientListeningToRoom(true);
        const user = await getUserIfHeExistsElseThrowError(token);
        // await checkIfUserIsAllowedToAccessConversationElseThrowError(conversationId, user);
        socket.join(conversationId);
        socket.on("update-messages-list", () => {
          conversationSocket.in(conversationId).emit("new-message");
        });
        socket.on("update-message-status", (messageId: string) => {
          conversationSocket.in(conversationId).emit("seen", messageId);
        });
        conversationSocket.on("disconnect", () => {
          if (clientsConnected[socket.id]) {
            clientsConnected[socket.id].disconnect(true);
          }
        });
      } catch (error) {
        if (clientsConnected[socket.id]) {
          clientsConnected[socket.id].disconnect(true);
        }
      }
    });
  });
};

const getUserIfHeExistsElseThrowError = async (token: any) => {
  try {
    const decoded = jwt.decode(token, getJwtSecret());
    const user = User.findOne({ _id: decoded.id });
    if (user) {
      return decoded;
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new Error("not authorized");
  }
};
const closeConnectionIfClientIsNotListeningToRoom = (
  clientsConnected: {
    [id: string]: socketIo.Socket;
  },
  socket: any,
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!getIsClientListeningToRoom()) {
        if (clientsConnected[socket.id]) {
          clientsConnected[socket.id].disconnect(true);
        }
      }
      resolve();
    }, 10000);
  });
};
