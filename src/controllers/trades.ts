import { Request, Response } from "express";
import { prisma } from "../../config";
import { socket } from "../utils/websocket";

export const getTrades = async (_req: Request, res: Response) => {
    try {
        const trades = await prisma.trades.findMany();
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getTradesById = async (req: Request, res: Response) => {
    try {
        const { accountId } = req.params
        const trades = await prisma.trades.findMany({ where: { credentialId: +accountId } })
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getTrade = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const trade = await prisma.trades.findUnique({ where: { id: +id } });
        if (!trade) {
            res.status(404).json({ message: "Trade not found" });
        }
        res.status(200).json(trade);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getOpenTrades = async (req: Request, res: Response) => {
    try {
        const trades = await prisma.trades.findMany({ where: { open: true }, include: { traders: true } });
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const newTrade = async (req: Request, res: Response) => {
    try {
        const { pair, side, leverage, isolated, bankrollPercentage, limitPrice, tp, sl } = req.body;
        socket.emit('manualOpenTrade', { pair, side, leverage, isolated, bankrollPercentage, limitPrice, tp, sl });
        res.status(201).json('New trade sent to bot');
    } catch (error) {
        res.status(500).json(error);
    }
}

export const closeTradeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        socket.emit('manualCloseTrade', { id });
        res.status(200).json('Close trade sent to bot');
    } catch (error) {
        res.status(500).json(error);
    }
}

export const closeTrade = async (req: Request, res: Response) => {
    try {
        const { pair, traderId } = req.body;
        socket.emit('closeTrade', { pair, traderId });
        res.status(200).json('Close trade sent to bot');
    } catch (error) {
        res.status(500).json(error);
    }
}