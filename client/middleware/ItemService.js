let backAPIUrl;
if (process.env.BACK_API_URL)
    backAPIUrl = process.env.BACK_API_URL + "/items";
else
    backAPIUrl = import.meta.env.VITE_BACK_API_URL + "/items";
    
export async function postNewItem (itemData) {
    return fetch(`${backAPIUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(itemData),
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to create item: ${response.statusText}`);
        }
        return response.json(); // Parse and return the JSON data
    })
}

export async function getAllItems() {
    const response = await fetch(`${backAPIUrl}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    return response.json(); // Parse and return the JSON data
}

export function getItemById (userId) {
    return fetch(`${backAPIUrl}/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
    });
}

export function updateItem (itemId, updateData) {
    return fetch(`${backAPIUrl}/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(updateData),
    });
}

export function deleteItem (itemId) {
    return fetch(`${backAPIUrl}/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
    });
}