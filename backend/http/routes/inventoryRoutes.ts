import fastify, { FastifyInstance } from 'fastify';
import * as inventoryController from '../controller/inventoryController';

/**
 * @route   GET/POST/PUT/DELETE api/inv
 * @desc    CRUD operations for user nventory
 * @access  Private (authenticated routes)
 */

export async function inventoryRoutes(fastify: FastifyInstance, options: any) {
  // Game CRUD Routes
  fastify.get("/:inventoryId", /* { preHandler: [fastify.authenticate] } ,*/ inventoryController.getInventoryById); // Get a inventory by ID
  fastify.post("/", /* { preHandler: [fastify.authenticate] } ,*/ inventoryController.createInventory); // Create a inventory
  fastify.put("/:inventoryId", /* { preHandler: [fastify.authenticate] } ,*/ inventoryController.updateInventory); // Update a inventory
  fastify.delete("/:inventoryId", /* { preHandler: [fastify.authenticate] } ,*/ inventoryController.deleteInventory); // Delete a inventory
  fastify.get("/user/:userId", /* { preHandler: [fastify.authenticate] } ,*/ inventoryController.getInventoryByUserId); // Get all videos for a inventory
}