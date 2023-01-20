import { Request, Response } from "express";
import { prisma } from "../../config";
import { socket } from "../utils/websocket";
import ccxt from "ccxt";

export const getAccounts = async (_req: Request, res: Response) => {
    try {
        const accounts = await prisma.credentials.findMany({
            select: {
                id: true,
                name: true,
                active: true,
            }
        })
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const account = await prisma.credentials.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                active: true,
            }
        });
        if (!account) {
            res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const createAccount = async (req: Request, res: Response) => {
    const { name, apiKey, apiSecret } = req.body;
    try {
        if (!name || !apiKey || !apiSecret) {
            res.status(400).json({ message: "Invalid request" });
        }
        const newAccount = {
            name,
            api: apiKey,
            secret: apiSecret,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const account = await prisma.credentials.create({ data: newAccount });
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const editAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const account = await prisma.credentials.findUnique({ where: { id: Number(id) } });
        if (!account) {
            res.status(404).json({ message: "Trader not found" })
        }
        const updatedAccount = await prisma.credentials.update({
            where: { id: Number(id) },
            data: req.body
        })
        res.status(200).json(updatedAccount);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export const editAllAccounts = async (req: Request, res: Response) => {
    try {
        const updatedAccounts = await prisma.credentials.updateMany({
            data: req.body
        })
        res.status(200).json(updatedAccounts);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export const setActiveAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const account = await prisma.credentials.findUnique({ where: { id: Number(id) } });
        if (!account) {
            res.status(404).json({ message: "Account not found" })
        }
        const updatedAccount = await prisma.credentials.update({
            where: { id: Number(id) },
            data: { active }
        })
        if (active) {
            socket.emit('addAccount', { api: account?.api, secret: account?.secret });
        } else {
            socket.emit('deleteAccount', { api: account?.api });
        }
        res.status(200).json(updatedAccount);
    }
    catch (error) {
        res.status(500).json(error);
    }
}


export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const account = await prisma.credentials.findUnique({ where: { id: Number(id) } });
        if (!account) {
            res.status(404).json({ message: "Account not found" })
        }
        await prisma.credentials.delete({ where: { id: Number(id) } });
        socket.emit('deleteAccount', { api: account?.api });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export const getAccountBalance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const account = await prisma.credentials.findUnique({ where: { id: Number(id) } });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        const bybit = new ccxt.bybit({ apiKey: account.api, secret: account.secret });
        const balance = await bybit.privateGetV2PrivateWalletBalance({ coin: 'USDT' });
        const parsedBalance = {
            total: parseFloat(balance.result.USDT.wallet_balance),
            equity: parseFloat(balance.result.USDT.equity),
            unrealised: parseFloat(balance.result.USDT.unrealised_pnl),
            pnl: parseFloat(balance.result.USDT.cum_realised_pnl)
        }
        return res.status(200).json(parsedBalance);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getAccountPositions = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const account = await prisma.credentials.findUnique({ where: { id: +id } });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        const bybit = new ccxt.bybit({ apiKey: account.api, secret: account.secret });
        const rawPositions = await bybit.fetchPositions();
        const filteredPos = rawPositions.filter((position: any) => position.contracts > 0);
        const positions = filteredPos.map(async (pos: any) => {
            const trade = await prisma.trades.findFirst({ where: { pair: pos.info.symbol, open: true, credentialId: +id }, include: { traders: true } });
            return {
                id: trade?.id,
                symbol: pos.info.symbol,
                size: pos.info.size,
                leverage: pos.info.leverage,
                value: pos.info.position_value,
                side: pos.info.side,
                percentage: Math.round(pos.percentage * 100) / 100,
                marginMode: pos.marginMode === 'isolated' ? 'Isolé' : 'Croisé',
                trader: trade?.traders?.name
            }
        });
        const result = await Promise.all(positions)
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}