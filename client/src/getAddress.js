// funcao assincrona que busca no link do ibge o json com o array de objetos que queremos
async function getStates() {
    let response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    const ufs = await response.json(); // salva em ufs o array de estados
    return ufs;
}

export async function addOptionsEstado() {
    let ufs = await getStates();
    // document.getElementById("estado").innerHTML = await formatAsHtmlEstado(ufs);
    // inclui como filho do select a string com todos os options
    return await formatAsHtmlEstado(ufs);
}

export async function addOptionsCidades(uf) {
    let response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    const cities = await response.json();
    // document.getElementById("cidade").innerHTML = await formatAsHtmlCidades(cities);
    return await formatAsHtmlCidades(cities);
}

async function formatAsHtmlEstado(data) {
    let result = '<option value=""></option>';
    for (let index = 0; index < (await data).length; index++) {
        result = result.concat(`<option value="${(await data)[index].sigla}">${(await data)[index].nome}</option>`); 
        // formata no estilo option do html para facilitar adição no select 
    }
    return result;
}

async function formatAsHtmlCidades(data) {
    let result = '<option value=""></option>';
    for (let index = 0; index < (await data).length; index++) {
        result = result.concat(`<option value="${(await data)[index].id}">${(await data)[index].nome}</option>`); 
        // formata no estilo option do html para facilitar adição no select 
    }
    return result;
}

// addOptionsEstado();