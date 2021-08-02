# Imagem base
FROM node:lts-alpine

# Define diretório padrão
WORKDIR /app
# Copia package.json do host para a raiz do container
COPY package.json .

# Instala dependências no host
RUN npm install
# Copia arquivos do diretório raiz do host para a raiz do container
COPY . .
# Inicializa app
CMD ["npm", "start"]

# 1. Buildar imagem: $ docker build -t dextra-marvel .
# 2. Rodar container: $ docker run -p 3000:3000 dextra-marvel