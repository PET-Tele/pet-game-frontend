import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import Game from "../../db/models/Game";
import GameProgress from "../../db/models/GameProgress";

// CRUD Operations for Games

export async function createGame(request: FastifyRequest, reply: FastifyReply) {
  const createGameSchema = z.object({
    name: z.string(),
    picture: z.string().optional(),
    description: z.string().optional(),
  });

  try {
    const { name, picture, description } = createGameSchema.parse(request.body);
    const game = new Game({ name, picture, description });
    await game.save();
    reply.status(201).send(game);
  } catch (e) {
    reply.status(400).send({ message: "Invalid game data" });
  }
}

export async function getGameById(request: FastifyRequest<{ Params: { gameId: string } }>, reply: FastifyReply) {
  const getGameParams = z.object({
    gameId: z.string(),
  });

  try {
    const { gameId } = getGameParams.parse(request.params);
    const game = await Game.findById(gameId);
    if (!game) {
      return reply.status(404).send({ message: "Game not found" });
    }
    reply.status(200).send(game);
  } catch (e) {
    reply.status(400).send({ message: "Invalid game ID" });
  }
}

export async function getAllGames(request: FastifyRequest, reply: FastifyReply) {
  try {
    const games = await Game.find();
    reply.status(200).send(games);
  } catch (e) {
    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function updateGame(request: FastifyRequest<{ Params: { gameId: string } }>, reply: FastifyReply) {
  const updateGameSchema = z.object({
    name: z.string().optional(),
    picture: z.string().optional(),
    description: z.string().optional(),
  });

  const getGameParams = z.object({
    gameId: z.string(),
  });

  try {
    const { gameId } = getGameParams.parse(request.params);
    const updateData = updateGameSchema.parse(request.body);
    const game = await Game.findByIdAndUpdate(gameId, updateData, { new: true });
    if (!game) {
      return reply.status(404).send({ message: "Game not found" });
    }
    reply.status(200).send(game);
  } catch (e) {
    reply.status(400).send({ message: "Invalid game data" });
  }
}

export async function deleteGame(request: FastifyRequest<{ Params: { gameId: string } }>, reply: FastifyReply) {
  const getGameParams = z.object({
    gameId: z.string(),
  });

  try {
    const { gameId } = getGameParams.parse(request.params);
    const game = await Game.findByIdAndDelete(gameId);
    if (!game) {
      return reply.status(404).send({ message: "Game not found" });
    }
    reply.status(200).send({ message: "Game deleted" });
  } catch (e) {
    reply.status(400).send({ message: "Invalid game ID" });
  }
}

export async function getVideos(request: FastifyRequest, reply: FastifyReply) 
{
  try {
    const games = await Game.find();

    let videosList: {gameId: string, gameName: string, videos: string[]}[] = [];

    games.forEach((game) => {videosList.push({gameId: game._id, gameName: game.name, videos: game.videosList})});

    reply.status(200).send(videosList);
  } catch (e) {
    reply.status(400).send({ message: "Invalid game ID" });
  }
}

export async function getVideosByGameId(request: FastifyRequest<{Params: {gameId: string}}>, reply: FastifyReply) 
{
  const getGameParams = z.object({
    gameId: z.string(),
  });

  try {
    const { gameId } = getGameParams.parse(request.params);
    const game = await Game.findById(gameId);
    if (!game) {
      return reply.status(404).send({ message: "Game not found" });
    }
  
    if (game.videosList)
      reply.status(200).send({videos: game.videosList});
    else
      reply.status(200).send({videos: [], message: "No videos found for this game"});
  } catch (e) {
    reply.status(400).send({ message: "Invalid game ID" });
  }
}

// CRUD Operations for GameProgress Relationship

export async function createGameProgress(request: FastifyRequest, reply: FastifyReply) {
  const createGameProgresschema = z.object({
    gameId: z.string(),
    userId: z.string(),
    userMistakes: z.number(),
    userScore: z.number().optional(),
  });

  try {
    const { gameId, userId, userScore, userMistakes } = createGameProgresschema.parse(request.body);
    const gameProgress = new GameProgress({ gameId, userId, userScore, userMistakes });
    await gameProgress.save();
    reply.status(201).send(gameProgress);
  } catch (e) {
    reply.status(400).send({ message: "Invalid game player data" });
  }
}

export async function getGameProgressByGameId(request: FastifyRequest<{ Params: { gameId: string } }>, reply: FastifyReply) {
  const getGameParams = z.object({
    gameId: z.string(),
  });

  try {
    const { gameId } = getGameParams.parse(request.params);
    const gameProgress = await GameProgress.find({ gameId }).populate('userId');
    reply.status(200).send(gameProgress);
  } catch (e) {
    reply.status(400).send({ message: "Invalid game ID" });
  }
}

export async function getGameProgressByUserId(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
  const getUserParams = z.object({
    userId: z.string(),
  });

  try {
    const { userId } = getUserParams.parse(request.params);
    const gameProgress = await GameProgress.find({ userId }).populate('gameId');
    reply.status(200).send(gameProgress);
  } catch (e) {
    reply.status(400).send({ message: "Invalid user ID" });
  }
}

