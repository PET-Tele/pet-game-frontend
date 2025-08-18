import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import Item from "../../db/models/Item";

export async function createItem(request: FastifyRequest, reply: FastifyReply) {
    const createItemSchema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        price: z.number().positive("Price must be a positive number"),
        image: z.string().min(1, "Image is required"),
        category: z.string().min(1, "Category is required"),
        register_date: z.date().optional(),
    });

    try {
        const { category, description, image, name, price, register_date } = createItemSchema.parse(request.body);
        const item = new Item({ category, description, name, image, price, register_date });
        await item.save();

        reply.status(201).send(item);
    } catch (e) {
        if ((e as any).code === 11000) {
            // Handle duplicate key error
            reply.status(400).send({ message: "Já existe um item com este nome." });
        } else {
            reply.status(400).send({ message: "Invalid item data" });
        }
    }
}

export async function getAllItems(request: FastifyRequest, reply: FastifyReply) {
    try {
        const items = await Item.find();
        reply.send(items);
    } catch (e) {
        reply.status(500).send({ message: "Internal server error" });
    }
}

export async function getItemById(request: FastifyRequest<{ Params: { itemId: string } }>, reply: FastifyReply) {
    const getItemParams = z.object({
        itemId: z.string(),
    });

    try {
        const { itemId } = getItemParams.parse(request.params);
        const item = await Item.findById(itemId);
        if (!item) {
            reply.status(404).send({ message: "Item not found" });
            return;
        }
        reply.send(item);
    } catch (e) {
        reply.status(500).send({ message: "Internal server error" });
    }
}

export async function updateItem(request: FastifyRequest<{ Params: { itemId: string } }>, reply: FastifyReply) {
    const updateItemSchema = z.object({
        category: z.string(),
        description: z.string(),
        image: z.string(),
        name: z.string(),
        price: z.number(),
        register_date: z.date().optional(),
    });

    try {
        console.log("Received request body for updating item:", request.body);
        const updateData = updateItemSchema.parse(request.body);
        const item = await Item.findByIdAndUpdate(request.params.itemId, updateData, { new: true });

        if (!item) {
            return reply.status(404).send({ message: "Item not found" });
        }
        console.log("Updated item:", item);
        reply.status(200).send(item);
    } catch (e) {
        console.error("Error updating item:", e);
        reply.status(400).send({ message: "Invalid item data" });
    }
}

export async function deleteItem(request: FastifyRequest<{ Params: { itemId: string } }>, reply: FastifyReply) {
    const getItemParams = z.object({
        itemId: z.string(),
    });

    try {
        const { itemId } = getItemParams.parse(request.params);
        const item = await Item.findByIdAndDelete(itemId);

        if (!item) {
            return reply.status(404).send({ message: "Item not found" });
        }

        reply.status(200).send({ message: "Item deleted" });
    } catch (e) {
        reply.status(400).send({ message: "Invalid item ID" });
    }
}