import fastify, { FastifyInstance } from 'fastify';
import * as itemController from '../controller/itemController';

/**
 * @route   GET/POST/PUT/DELETE api/items
 * @desc    CRUD operations for items
 * @access  Private (authenticated routes)
 */

export async function itemRoutes(fastify: FastifyInstance, options: any) {
  // Game CRUD Routes
  fastify.get("/", /* { preHandler: [fastify.authenticate] } ,*/ itemController.getAllItems); // Get all items
  fastify.get("/:itemId", /* { preHandler: [fastify.authenticate] } ,*/ itemController.getItemById); // Get a item by ID
  fastify.post("/", /* { preHandler: [fastify.authenticate] } ,*/ itemController.createItem); // Create a item
  fastify.put("/:itemId", /* { preHandler: [fastify.authenticate] } ,*/ itemController.updateItem); // Update a item
  fastify.delete("/:itemId", /* { preHandler: [fastify.authenticate] } ,*/ itemController.deleteItem); // Delete a item
}