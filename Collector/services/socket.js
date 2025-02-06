import { Platform } from "react-native";
import { io } from "socket.io-client";
export const socket = io.connect("http://192.168.43.180:3005/");
