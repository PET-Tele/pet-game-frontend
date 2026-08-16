let backAPIUrl;
if (process.env.BACK_API_URL)
    backAPIUrl = process.env.BACK_API_URL + "/games";
else
    backAPIUrl = import.meta.env.VITE_BACK_API_URL + "/games";

/**
 * @desc    Fetches all games from the backend
 * @returns {Promise<Array>} List of games or an empty array if the request fails
 */
export const getAllGames = async () => {
    try {
        const res = await fetch(`${backAPIUrl}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return res.ok ? res.json() : [];
    } catch (error) {
        return [];
    }
};

/**
 * @desc    Fetches a single game by its ID
 * @param   {string} gameId - The ID of the game to fetch
 * @returns {Promise<Object>} The game object or null if the request fails
 */
export const getGameById = async (gameId) => {
    try {
        const res = await fetch(`${backAPIUrl}/${gameId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return res.ok ? res.json() : null;
    } catch (error) {
        return null;
    }
};

/**
 * @desc    Creates a new game
 * @param   {Object} gameData - The game data to create (name, picture, description)
 * @returns {Promise<Object>} The created game object or null if the request fails
 */
export const createGame = async (gameData) => {
    try {
        const res = await fetch(`${backAPIUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData),
        });
        return res.ok ? res.json() : null;
    } catch (error) {
        return null;
    }
};

/**
 * @desc    Updates an existing game
 * @param   {string} gameId - The ID of the game to update
 * @param   {Object} updateData - The updated game data (name, picture, description)
 * @returns {Promise<Object>} The updated game object or null if the request fails
 */
export const updateGame = async (gameId, updateData) => {
    try {
        const res = await fetch(`${backAPIUrl}/${gameId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        return res.ok ? res.json() : null;
    } catch (error) {
        return null;
    }
};

/**
 * @desc    Deletes a game by its ID
 * @param   {string} gameId - The ID of the game to delete
 * @returns {Promise<boolean>} True if the game was deleted successfully, false otherwise
 */
export const deleteGame = async (gameId) => {
    try {
        const res = await fetch(`${backAPIUrl}/${gameId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return res.ok;
    } catch (error) {
        return false;
    }
};

/**
 * @desc    Gets vidgame by its ID
 * @param   {string} gameId - The ID of the game to delete
 * @returns {Promise<boolean>} True if the game was deleted successfully, false otherwise
 */
export const getVideosByGameId = async (gameId) => {
    try {
        const res = await fetch(`${backAPIUrl}/videos/${gameId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return res.ok ? res.json() : null;
    } catch (error) {
        return false;
    }
};

export const getAllVideos = async () => {
    try {
        const res = await fetch(`${backAPIUrl}/videos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return res.ok ? res.json() : [];
    } catch (e) {
        return false;
    }
}



/**
 * @desc    Creates a relationship between a game and a player (user)
 * @param   {Object} gameProgressData - The data to create the relationship (gameId, userId, userScore)
 * @returns {Promise<Object>} The created GameProgress object or null if the request fails
 */
export const createGameProgress = async (gameProgressData) => {
    try {
        const res = await fetch(`${backAPIUrl}/gameprogresses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameProgressData),
        });
        return res.ok ? res.json() : null;
    } catch (error) {
        return null;
    }
};

/**
 * @desc    Fetches all GameProgress relationships for a specific game
 * @param   {string} gameId - The ID of the game
 * @returns {Promise<Array>} List of GameProgress relationships or an empty array if the request fails
 */
export const getGameProgresssByGameId = async (gameId) => {
    try {
        const res = await fetch(`${backAPIUrl}/gameprogresses/game/${gameId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return res.ok ? res.json() : [];
    } catch (error) {
        return [];
    }
};

/**
 * @desc    Fetches all GameProgress relationships for a specific player (user)
 * @param   {string} userId - The ID of the player (user)
 * @returns {Promise<Array>} List of GameProgress relationships or an empty array if the request fails
 */
export const getGameProgressesByUserId = async (userId) => {
    try {
        const res = await fetch(`${backAPIUrl}/gameprogresses/user/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return res.ok ? res.json() : [];
    } catch (error) {
        return [];
    }
};