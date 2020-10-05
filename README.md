## Catálogo Marvel Comics

- Aplicativo que exibe um catálago de quadrinhos e lista personagens da Marvel Comics.
- Projeto utiliza a API da Marvel para realizar as requisições.
- Criado a partir do [Create React App](https://github.com/facebook/create-react-app).

### Estrutura de pastas

```shell
├── /node_modules/              # Bibliotecas de terceiros e utilitários
├── /public/                    # Arquivos estáticos, como favicon.ico etc.
│   ├── favicon.ico             # Ícone do aplicativo a ser exibido nos favoritos e na aba do navegador
│   ├── index.html              # Estrutura de html principal do aplicativo
│   ├── robots.txt              # Instruções para rastreadores de mecanismos de pesquisa
├── /src/                       # Concentra arquivos/componentes utilizados para desenvolvimento
│   ├── /components/            # Componentes de IU compartilhados ou utilizados em layout (Exs.: Footer ou Header)
│   ├── /images/                # Imagens disponíveis para uso em todo o app
│   ├── /pages/                 # Componentes responsáveis pela montagem das páginas de listagem e individuais
│   ├── api.ts                  # Concentra chamadas a Api
│   ├── App.tsx                 # Componente que exibe layout principal e que define mapeamentos das rotas
│   ├── constants.ts            # Centraliza constantes que podem ser usadas por todo o aplicativo
│   ├── index.scss              # Arquivo de estilo da index gerado pelo Create React App
│   ├── index.tsx               # Renderiza App em div com id 'root' e configura ToastProvider
│   └── ...                     # Demais arquivos gerados pelo Create React App
├── .gitignore                  # Define diretórios/arquivos que não serão considerados pelo git
├── .prettierrc                 # Arquivo de configuração do formatador prettier
├── app.yaml                    # Arquivo utilizado para subir aplicação na nuvem
├── package.json                # A lista de dependências do projeto e scripts NPM
├── README.md                   # Documentação do projeto
└── tsconfig.json               # Arquivo de configuração do typescript
```

### Iniciando

1. Clone o repositório e instale as dependências (`yarn` ou `npm install`)

```shell
$ git clone git@github.com:samueldaschagas/dextra-marvel.git
$ cd dextra-marvel
$ yarn                    # Instala as dependências listadas no package.json
```
2. Crie um arquivo `.env.local` na raiz do projeto (`/src`), com o seguinte conteúdo:
```shell
REACT_APP_BASE_URL=https://gateway.marvel.com/v1/public/
REACT_APP_PUBLIC_KEY=${Sua public key aqui}
REACT_APP_PRIVATE_KEY=${Sua private key aqui}
```
As chaves necessárias (pública e privada) para ter acesso a API da Marvel são disponibilizadas por meio de registro na plataforma da Marvel. Link: https://developer.marvel.com

3. No diretório do projeto, você pode executar `yarn start` ou `npm start` para iniciar projeto. O comando executa o aplicativo no modo de desenvolvimento.
Abra http://localhost:3000 para visualizar no navegador.

A página será recarregada se você fizer edições.
Você também verá quaisquer erros de lint no console.


### Compilando aplicativo para produção

Executa o comando `yarn build`. O aplicativo é então compilado para produção na pasta `build`.<br />

Ele agrupa corretamente o React no modo de produção e otimiza a construção para o melhor desempenho.

A compilação é reduzida e os nomes dos arquivos incluem os hashes.<br />
Seu aplicativo está pronto para ser implantado!

Consulte a seção sobre [implantação Create React App](https://facebook.github.io/create-react-app/docs/deployment) para obter mais informações.
