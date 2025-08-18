import fastify, { FastifyInstance } from 'fastify';
import * as gameController from '../controller/gameController';

/**
 * @route   GET/POST/PUT/DELETE api/games
 * @desc    CRUD operations for games
 * @access  Private (authenticated routes)
 */

export async function gameRoutes(fastify: FastifyInstance, options: any) {
  // Game CRUD Routes
  fastify.get("/", /* { preHandler: [fastify.authenticate] } ,*/ gameController.getAllGames); // Get all games
  fastify.get("/:gameId", /* { preHandler: [fastify.authenticate] } ,*/ gameController.getGameById); // Get a game by ID
  fastify.post("/", /* { preHandler: [fastify.authenticate] } ,*/ gameController.createGame); // Create a game
  fastify.put("/:gameId", /* { preHandler: [fastify.authenticate] } ,*/ gameController.updateGame); // Update a game
  fastify.delete("/:gameId", /* { preHandler: [fastify.authenticate] } ,*/ gameController.deleteGame); // Delete a game
  fastify.get("/videos", /* { preHandler: [fastify.authenticate] } ,*/ gameController.getVideos); // Get all videos for a game
  fastify.get("/videos/:gameId", /* { preHandler: [fastify.authenticate] } ,*/ gameController.getVideosByGameId); // Get all videos for a game
  
  // GameProgress Relationship Routes
  fastify.post("/gameprogresses", /* { preHandler: [fastify.authenticate] } ,*/ gameController.createGameProgress); // Create a GamePlayer relationship
  fastify.get("/gameprogresses/game/:gameId", /* { preHandler: [fastify.authenticate] } ,*/ gameController.getGameProgressByGameId); // Get GamePlayers by Game ID
  fastify.get("/gameprogresses/user/:userId", /* { preHandler: [fastify.authenticate] } ,*/ gameController.getGameProgressByUserId); // Get GamePlayers by User ID
}