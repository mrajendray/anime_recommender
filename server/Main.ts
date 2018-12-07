import * as express from "express";
import Question from "./Question";
import SparqlQuery from "./SparqlQuery";
import QuestionParser from "./utils/QuestionParser";

const sparqlEndpoint = 'http://localhost:3030/anime-65489/sparql';

export default class Main {
    public main() {
        // init sparql client
        const sparqlQuery = new SparqlQuery(sparqlEndpoint);

        // init question parser based on pattern
        const questionParser = new QuestionParser();
        Question.init(questionParser);

        // init server
        const app = express();
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });


        app.get("/whatsnext", (req, res) => {
            const next = questionParser.whatsNext(req.query.q);
            res.json({
                next: (next === undefined || next === []) ? [] : next,
            });
        });
        app.get("/whatsnext/data", async (req, res) => {
            res.json(await sparqlQuery.getType(req.query.t, req.query.q));
        });
        app.get("/query", async (req, res) => {
            try {
                const query = questionParser.parse(req.query.q);
                const result = await sparqlQuery.queryExcute(query.sparql);
                res.json({
                    reason: query.reason,
                    result
                })
            } catch (e) {
                res.json({
                    reason: [],
                    result: []
                })
            }
        });

        // start server
        app.listen(8080);
        console.log("OK");
    }
}