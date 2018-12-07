const {SparqlClient, SPARQL} = require('sparql-client-2');
export default class SparqlQuery {
    private client: any;

    constructor(endpoint: string) {
        this.client = new SparqlClient(endpoint)
            .register({
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                aon: "https://aon.aon/ontology.owl#",
                xsd: "http://www.w3.org/2001/XMLSchema#",
            });
    }

    public queryExcute = async (query: string) => {
        const data = await this.client
            .query(query)
            .execute();
        return data.results.bindings;
    };
    public getType = async(type?: string, query?: string) => {
        query = (query) ? query : "";
        let ret = [];
        if (type === "aon:genre") {
            ret = await this.getGenre(query);
        } else if (type==="aon:anime") {
            ret = await this.getAnime(query);
        } else if (type==="aon:character") {
            ret = await this.getCharacter(query);
        } else if (type==="aon:spokenBy") {
            ret = await this.getSeiyu(query);
        }
        return ret;
    };

    private getGenre = async (query: string) => {
        const data = await this.queryExcute(
                SPARQL`
                SELECT ?g
                WHERE {
                    ?a rdf:type aon:genre .
                    ?a aon:name ?g .
                    filter contains(lcase(str(?g)), ${query})
                }
                LIMIT 8
                `
            );
        return data.map(g => g.g.value);
    };
    private getAnime = async (query: string) => {
        const data = await this.queryExcute(
                SPARQL`
                SELECT ?t
                WHERE {
                    ?a rdf:type aon:Anime .
                    ?a aon:title ?t .
                    filter contains(lcase(str(?t)), ${query})
                }
                LIMIT 8
                `
            );
        return data.map(t => t.t.value);
    };
    private getCharacter = async (query: string) => {
        const data = await this.queryExcute(
                SPARQL`
                SELECT ?n
                WHERE {
                    ?a aon:character ?c .
                    ?c aon:name ?n .
                    filter contains(lcase(str(?n)), ${query})
                }
                GROUP BY ?n
                LIMIT 8
                `
            );
        return data.map(n => n.n.value);
    };
    private getSeiyu = async (query: string) => {
        const data = await this.queryExcute(
                SPARQL`
                SELECT ?n
                WHERE {
                    ?s rdf:type aon:Person .
                    ?s aon:name ?n
                    filter contains(lcase(str(?n)), ${query})
                }
                GROUP BY ?n
                LIMIT 8
                `
            );
        return data.map(n => n.n.value)
    };
}