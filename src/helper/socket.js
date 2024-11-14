import { io } from "socket.io-client";

export const initSocket = async () => {
    const option = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 20000,
        transports: ['websocket', 'polling'],
        withCredentials: true,
    };
    return io(process.env.REACT_APP_SERVER_URL, option);
};
