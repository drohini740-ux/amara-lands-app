import api from "./api";

export const getMessages = () =>
  api.get("/live-chat");

export const sendMessage = (data) =>
  api.post("/live-chat", data);