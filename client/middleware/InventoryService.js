let backAPIUrl;
if (process.env.BACK_API_URL)
    backAPIUrl = process.env.BACK_API_URL + "/inv";
else
    backAPIUrl = import.meta.env.VITE_BACK_API_URL + "/inv";

export async function postNewInventory(itemData) {
    try {
        const response = await fetch(`${backAPIUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            throw new Error(`Failed to post inventory item: ${response.statusText}`);
        }

        return await response.json(); // Parse and return the JSON response
    } catch (error) {
        console.error("Error posting inventory item:", error);
        throw error; // Re-throw the error for further handling
    }
}

export async function getInventoryItemsByUserId(userId) {
    try {
        const response = await fetch(`${backAPIUrl}/user/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch inventory: ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Fetched inventory data:", data); // Debugging
        return data;
    } catch (error) {
        console.error("Error fetching inventory of user:", error);
        throw error;
    }
}

export function getInventoryItemById(itemId) {
    return fetch(`${backAPIUrl}/${itemId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
    });
}

export async function updateInventory(inventoryId, updateData) {
    try {
        const response = await fetch(`${backAPIUrl}/${inventoryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update inventory: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating inventory:", error);
        throw error;
    }
}