// import axios from "axios"; // usar axios? vantagens?
// const backAPIUrl = "/api/v1"

let backAPIUrl;
if (process.env.BACK_API_URL)
    backAPIUrl = process.env.BACK_API_URL+"/users";
else
    backAPIUrl = import.meta.env.VITE_BACK_API_URL+"/users";

export const requestPasswordReset = async (email) => {
    const response = await fetch(`${backAPIUrl}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
};

export const resetPassword = async (token, password) => {
    const response = await fetch(`${backAPIUrl}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
};

/***
 * @desc    Faz uma requisição POST ao endereço /register, enviando os dados do usuário novo 
 */
export const postNewUser = async (userData) => {
    let response = ""; // TODO: fazer um jeito mais inteligente
    try {
        const res = await fetch(`${backAPIUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(userData),
        });

        response = res;
        // console.log((res.ok) ? "User created successfully" : "Failed to create user");
    } catch (error) {
        console.log('Error: ', error);
    }
    return response;
}


/***
 * @desc    Faz uma requisição POST ao endereço /login para autenticar usuario
 */
export const getUserByCredentials = async (userData) => {
    let response = "";
    try {
        const res = await fetch(`${backAPIUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(userData),
            credentials: "include"
        });
        response = res;
        // console.log((res.ok) ? `User found successfully: ${user}` : "Failed to find user");
    } catch (error) {
        console.log(`Error: ${error}`);
    }

    return response;
}


// TODO: IMPLEMENTAR BASEADO NO userController.ts
/***
 * @desc    Faz uma requisição GET ao endereço /users/, enviando o id do usuário desejado
 */
export const getUserById = async (userId) => {
    try {
        const res = await fetch(`${backAPIUrl}/users/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(userData),
        });

        // console.log((res.ok) ? `User retrieved successfully: ${user}` : "Failed to retrieve user");
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}


/***
 * @desc    Faz uma requisição GET ao endereço /users para obter a lista de usuários do backend
 */
export const getAllUsers = async () => {
    try {
        const res = await fetch(`${backAPIUrl}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', },
        });

        // console.log((res.ok) ? "`Users retrieved successfully" : "Failed to retrieve users");
        return res.json();
    } catch (error) {
        console.log('Error: ', error);
    }
}

/***
 * @desc    Faz uma requisição GET ao endereço /cookies para obter dados básicos do usuário logado
 */
export const fetchCookieData = async () => {
    try {
        const response = await fetch(`${backAPIUrl}/cookies`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', },
        });

        if (response.status === 401) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error("Erro ao buscar cookie:", error);
    }
};


export const logoutUser = async () => {
    try {
        const response = await fetch(`${backAPIUrl}/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // const data = await response.json();
        return response;
    } catch (error) {
        console.error("Erro ao deslogar:", error);
        throw error;
    }
}

export const removeUser = async (userId) => {
    try {
        const response = await fetch(`${backAPIUrl}/${userId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("Erro ao remover usuário:", error);
        throw error;
    }
}

export const getUserInventory = async (userId) => {
    try {
        const response = await fetch(`${backAPIUrl}/${userId}/inventory`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Erro ao buscar inventário:", error);
        throw error;
    }
}

export const requestPassword = async (token, password) => {
    //requisicao HTTP
    const response = await fetch(`${backAPIUrl}/reset-password`, {
        method: "POST",
        headers: {"Content-Type": "apllication/json",},
        body: JSON.stringify({
            token: token,
            password: password,
        }),
    })

    let data = null;
    try {
        data = await response.json(); //ler o body e converter para objeto JS
    } catch {} //apenas para nao quebrar a aplicacao

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
};