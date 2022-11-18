import express, { Request, Response, NextFunction } from 'express';
import { readFileSync } from "fs";
import { createServer } from "http";
import cors from 'cors';
import helmet from 'helmet';
import { PORT } from '../config';
import accountsRouter from './routes/accounts.routes';
import tradersRouter from './routes/traders.routes';
import tradesRouter from './routes/trades.routes';

const app = express();

const httpServer = createServer({
    // key: readFileSync("certs/private_key.key"),
    // cert: readFileSync("certs/ssl_certificate.cer"),
    // ca: [readFileSync("certs/ssl_certificate_INTERMEDIATE.cer")]
}, app);

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
app.use('/api/trades', tradesRouter);

httpServer.listen(PORT);
console.log(`Server started on port ${PORT}`);
