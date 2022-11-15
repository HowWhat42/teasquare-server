// import { io } from 'socket.io-client';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PORT, WS_URL } from '../config';
import accountsRouter from './routes/accounts.routes';
import tradersRouter from './routes/traders.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, AUTHORIZATION'
    );
    next();
});

app.get('/ping', (_req: Request, res: Response) => {
    res.send('pong');
});

app.use('/api/accounts', accountsRouter);
app.use('/api/traders', tradersRouter);

app.listen(PORT);
console.log(`Server started on port ${PORT}`);

// const socket = io(WS_URL);

// socket.on('connect', () => {
//     console.log('connected to websocket server');
// });
