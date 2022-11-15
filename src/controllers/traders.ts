import { Request, Response } from "express";
import { prisma } from "../../config";

export const getTraders = async (_req: Request, res: Response) => {
    try {
        const traders = await prisma.traders.findMany()
        res.status(200).json(traders)
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getTrader = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const trader = await prisma.traders.findUnique({ where: { id: Number(id) } })
        if (!trader) {
            res.status(404).json({ message: "Trader not found" })
        }
        res.status(200).json(trader)
    } catch (error) {
        res.status(500).json(error);
    }
}

export const createTrader = async (req: Request, res: Response) => {
    const { name, url } = req.body;
    try {
        if (!name || !url) {
            res.status(400).json({ message: "Invalid request" })
        }
        const newTrader = {
            name,
            url,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const trader = await prisma.traders.create({ data: newTrader });
        res.status(201).json(trader);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const editTrader = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const trader = await prisma.traders.findUnique({ where: { id: Number(id) } });
        if (!trader) {
            res.status(404).json({ message: "Trader not found" })
        }
        const updatedTrader = await prisma.traders.update({
            where: { id: Number(id) },
            data: req.body
        })
        res.status(200).json(updatedTrader);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export const deleteTrader = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        await prisma.traders.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json(error);
    }
}