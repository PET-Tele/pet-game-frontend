import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import Inventory from "../../db/models/Inventory";

export async function createInventory(request: FastifyRequest, reply: FastifyReply) {
    const createInventorySchema = z.object({
        items: z.array(z.string()).optional(), // Change to an array of strings
        user_id: z.string(),
        coins: z.number(),
    });

    try {
        const { items, user_id, coins } = createInventorySchema.parse(request.body);
        const inventory = new Inventory({ items, user_id, coins });
        await inventory.save();
        reply.status(201).send(inventory);
    } catch (e) {
        reply.status(400).send({ message: "Invalid inventory data" });
    }
}

export async function getInventoryById(request: FastifyRequest<{ Params: { inventoryId: string } }>, reply: FastifyReply) {
    const getInventoryParams = z.object({
        inventoryId: z.string(),
      });
    
    try {
        const { inventoryId } = getInventoryParams.parse(request.params);
         const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
            reply.status(404).send({ message: "Inventory not found" });
            return;
        }
        reply.send(inventory);
    } catch (e) {
        reply.status(500).send({ message: "Internal server error" });
    }
}

export async function getInventoryByUserId(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    const getInventoryParams = z.object({
        userId: z.string(),
    });

    try {
        const { userId } = getInventoryParams.parse(request.params);

        // Fetch inventory and populate the items field
        const inventory = await Inventory.findOne({ user_id: userId }).populate('items');
        if (!inventory) {
            return reply.status(404).send({ message: "Not Found" });
        }

        reply.send(inventory);
    } catch (e) {
        reply.status(500).send({ message: "Internal server error" });
    }
}

export async function updateInventory(request: FastifyRequest<{ Params: { inventoryId: string } }>, reply: FastifyReply) {
    const updateInventorySchema = z.object({
        items: z.array(z.string()).optional(), // Expect an array of strings (ObjectId strings)
        coins: z.number().optional(),
    });

    const getInventoryParams = z.object({
        inventoryId: z.string(),
    });

    try {
        const { inventoryId } = getInventoryParams.parse(request.params);
        const updateData = updateInventorySchema.parse(request.body);

        // Update the inventory directly
        const inventory = await Inventory.findByIdAndUpdate(
            inventoryId,
            {
                $set: updateData, // Mongoose will handle ObjectId conversion for the `items` field
            },
            { new: true } // Return the updated document
        );

        if (!inventory) {
            return reply.status(404).send({ message: "Inventory not found" });
        }

        reply.status(200).send(inventory);
    } catch (e) {
        console.error("Error updating inventory:", e);
        reply.status(400).send({ message: "Invalid inventory data" });
    }
}

export async function deleteInventory(request: FastifyRequest<{ Params: { inventoryId: string } }>, reply: FastifyReply) {
    const getInventoryParams = z.object({
        inventoryId: z.string(),
    });
    
    try {
        const { inventoryId } = getInventoryParams.parse(request.params);
        const inventory = await Inventory.findByIdAndDelete(inventoryId);

        if (!inventory) {
          return reply.status(404).send({ message: "Inventory not found" });
        }

        reply.status(200).send({ message: "Inventory deleted" });
    } catch (e) {
        reply.status(400).send({ message: "Invalid inventory ID" });
    }
}