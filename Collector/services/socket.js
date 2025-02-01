import { Platform } from "react-native";
import { io } from "socket.io-client";
export const socket = io.connect("http://192.168.1.9:3001/");
