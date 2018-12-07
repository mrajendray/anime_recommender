# Anime Recommender
Question answering system based on Question Pattern and Web Semantic

# Installation

##### Environment
1. Install NodeJS
2. Install Yarn package manager
    > npm install -g yarn
3. Download and install Apache Jena Fuseki (sparql server and triplestore)
4. Create new dataset
5. Clone this project
6. Upload base data into Apache Jena Fuseki (genres.xml)

##### Data preparation
1. Install anilist parser
    > yarn install
2. Change SPARQL upload Endpoint
3. Start parsing
    > node index

##### Server
1. Install server
    > yarn install
2. Change SPAQRL query Endpoint
3. Start server
    > node index

##### Client
1. Install client
    > yarn install
2. Start client
    > yarn start