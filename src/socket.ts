import io from 'socket.io-client';
import config from './config/config';
const URL = config.API_URL;
const socket = io(URL, { transports: ['websocket'] });

export default socket;
