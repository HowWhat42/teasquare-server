import { Request, Response } from "express";
import { prisma } from "../../config";

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
        const trades = await prisma.trades.findMany({ where: { credentialId: Number(accountId) } })
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getTrade = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const trade = await prisma.trades.findUnique({ where: { id: Number(id) } });
        if (!trade) {
            res.status(404).json({ message: "Trade not found" });
        }
        res.status(200).json(trade);
    } catch (error) {
        res.status(500).json(error);
    }
}