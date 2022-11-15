import { Request, Response } from "express";
import { prisma } from "../../config";
import { socket } from "../utils/websocket";

export const getAccounts = async (_req: Request, res: Response) => {
    try {
        const accounts = await prisma.credentials.findMany({
            select: {
                id: true,
                name: true,
                maxLeverage: true,
                active: true,
                bankrollPercentage: true,
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
        socket.emit('addAccount', { api: apiKey, secret: apiSecret });
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