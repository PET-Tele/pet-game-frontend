 # :space_invader: PET Gaming
Uma plataforma de jogos educativos odontológicos para crianças usando JavaScript, React.js, Node.js e Fastify.

## Estrutura do projeto

O projeto está estruturado em dois apps aninhados, com o root contendo a parte do servidor na pasta backend, contendo o Node, Fastify etc, e o diretório client contendo a parte do frontend, do cliente, contendo React, Vite e outros, utilizando uma estrutura similar à MVC.

## Endereço de hospedagem do repositório
O projeto está hospedado em dois endereços diferentes, sendo o frontend no serviço [Vercel](https://pet-gaming.vercel.app/) e o backend no serviço [Render](https://pet-gaming.onrender.com). Para verificar informações de build e deploy, é necessário acessar as páginas das ferramentas com as credenciais. 
Para acesso aos dados salvos da aplicação, usa-se o [MongoDB](https://www.mongodb.com/pt-br/), também acessados por credenciais.

## Como instalar o repositório?

Dê um `git clone` no repositório, usando o link HTTPS, para alguma pasta de sua preferência em sua máquina.

``` git clone https://github.com/morgixin/pet-gaming.git```

Para sincronizar seu repositório local com o repositório remoto, algo muito recomendado de se fazer periodicamente, use o comando.

```git pull origin nome_da_branch```

>  Nesse projeto em específico, pretende-se utilizar de inicio somente a branch `dev`, então o nome da branch seria "dev".

## Como rodar a página?

Utiliza-se ReactJS, Fastify, NodeJS no projeto, então é necessário instalar os tais para que o programa seja compilado devidamente. Para isso, abra um terminal e digite os seguintes comandos:

#### Se sua máquina for Windows:

1. Vá para a <a src="https://nodejs.org/en/download">página de instalação do NodeJS</a> e baixe a versão mais recente LTS (Long Term Support), execute o instalador de pacote e finalize a instalação devidamente.

2. Para verificar se a instalação foi feita com sucesso, abra um terminal e digite `node` para verificar o Node, `npm --version` ou `npm -v` para o NPM. Alguns recomendam reiniciar a máquina após a instalação para que garanta a escrita correta do PATH do Windows.

    > Se o terminal retornar um número de versão, sua instalação foi concluída com sucesso! Caso contrário, tente verificar qual erro ocorreu.

3. Instale as dependências do projeto abrindo um terminal no local onde está instalado o repositório e digitando:

    `npm install`

    > Verifique se foi gerada uma pasta chamada ./node_modules/ no repositório.

    Depois vá pra pasta ./client/ e rode o mesmo comando `npm install` para instalar as dependências do frontend.

    > Verifique se há duas pastas ./node_modules/. Se as dependências tiverem sido instaladas corretamente, o próximo passo deve funcionar normalmente. Caso contrário, digite `npm install dependência`, substituindo "dependência" pelo que tiver faltando na pasta devida.

4. Digite `npm run dev` nesse mesmo terminal da instalação e abra o link enviado pelo Node, nele estará rodando o projeto clonado para rodar o backend. Caso deseje rodar apenas o frontend da plataforma, digite `cd client` e `npm run dev`.


#### Se sua máquina for Linux:

1. Atualize seu sistema Linux com `sudo apt-get update` e `sudo apt-get upgrade` e instale o Node com o comando:

    `sudo apt install nodejs` 

2. Verifique a instalação com `node -v`.

3. Instale o NPM com:

    `sudo apt install npm`

    E verifique a instalação por `npm -v`.

4. Instale as dependências do projeto abrindo um terminal no local onde está instalado o repositório e digitando:

    `npm install`

    > Verifique se foi gerada uma pasta chamada ./node_modules/ no repositório.

    Depois vá pra pasta ./client/ e rode o mesmo comando `node_modules` para instalar as dependências do frontend.

5. Digite `npm run dev` nesse mesmo terminal da instalação e abra o link enviado pelo Node, nele estará rodando o projeto clonado para rodar o backend. Caso deseje rodar apenas o frontend da plataforma, digite `cd client` e `npm run dev`.

<br>

É isto. Happy coding!

## Manutenção do repositório e boas práticas

A cada mudança implementada, realize um `commit` para atualizar o repositório com as mudanças implementadas. Como boa prática, é recomendado realizar essa ação a cada pequena feature implementada, para saber o que foi feito em cada commit e facilitar análises. Para isso: 

```
git add nome_arquivos_alterados

git commit -m "descrição do commit"

git push origin nome_da_branch
```

