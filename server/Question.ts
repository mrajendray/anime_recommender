import QuestionParser from "./utils/QuestionParser";
const { SPARQL} = require('sparql-client-2');

export default class Question {
    public static init(questionParser: QuestionParser) {

        // how many episodes does ?anime have
        questionParser.start()
            .object("how")
            .object("many")
            .object("episodes")
            .object("does")
            .object("anime", "aon:anime")
            .object("have")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?total__episodes ?title ?image ?link
                        WHERE { 
                            ?link aon:title ${params.anime[0].replace(/~/g, " ")} ;
                                rdf:type aon:Anime ;
                                aon:title ?title ;
                                aon:bannerImg ?image ;
                                aon:numberOfEpisodes ?total__episodes .
                        }
                        `,
                    reason: [ "total__episodes" ]
                }
            });

        // how many character does ?anime have
        questionParser.start()
            .object("how")
            .object("many")
            .object("character")
            .object("does")
            .object("anime", "aon:anime")
            .object("have")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT (count(distinct ?characterResource) as ?total__character) ?title ?image ?link
                        WHERE {
                            ?link aon:title ${params.anime[0].replace(/~/g, " ")} ;
                                rdf:type aon:Anime ;
                                aon:character ?characterResource ;
                                aon:title ?title ;
                                aon:bannerImg ?image .
                        }
                        GROUP BY ?title ?image ?link
                        `,
                    reason: [ "total__character" ]
                }
            });

        // what anime with genre ?genre
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("genre")
            .object("setOfGenre", "aon:genre")
            .build((params: any) => {
                return {
                    sparql: SPARQL`                        
                        SELECT ?genre ?title ?image ?link
                        WHERE {
                            ?queryGenreResource aon:name ${params.setOfGenre[0].replace(/~/g, " ")} .
                            
                            ?link rdf:type aon:Anime ;
                                aon:genre ?queryGenreResource ;
                                aon:title ?title ;
                                aon:bannerImg ?image ;
                                aon:genre ?newGenreResource .
                                
                            ?newGenreResource aon:name ?genre .
                        }
                        LIMIT 50
                        `,
                    reason: [ "genre" ]
                };
            });

        // what anime with seiyu ?seiyu
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("seiyu")
            .object("setOfSeiyu", "aon:spokenBy")
            .build((params: any) => {
                return {
                    sparql: SPARQL`                        
                        SELECT ?seiyu ?character ?title ?image ?link
                        WHERE {
                            ?querySeiyuResource aon:name ${params.setOfSeiyu[0].replace(/~/g, " ")} ;
                                aon:name ?seiyu .
                                
                            ?characterResource aon:spokenBy ?querySeiyuResource ;
                                aon:name ?character .
                          
                            ?link rdf:type aon:Anime ;
                                aon:character ?characterResource ;
                                aon:title ?title ;
                                aon:bannerImg ?image .
                        }
                        LIMIT 50
                        `,
                    reason: [ "seiyu", "character" ]
                };
            });

        // what anime with genre ?genre and seiyu ?seiyu
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("genre")
            .object("setOfGenre", "aon:genre")
            .object("and")
            .object("seiyu")
            .object("setOfSeiyu", "aon:spokenBy")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?genre ?seiyu ?character ?title ?image ?link
                        WHERE {
                            ?queryGenreSource aon:name ${params.setOfGenre[0].replace(/~/g, " ")} ;
                                rdf:type aon:genre ; 
                                aon:name ?genre .
                                
                            ?querySeiyuSource aon:name ${params.setOfSeiyu[0].replace(/~/g, " ")} ;
                                aon:name ?seiyu .
                            
                            ?characterSource aon:spokenBy ?querySeiyuSource ;
                                aon:name ?character .
                                
                            ?link rdf:type aon:Anime ; 
                                aon:genre ?queryGenreSource ;
                                aon:character ?characterSource ;
                                aon:title ?title ;
                                aon:bannerImg ?image .
                        }
                        `,
                    reason: [ "genre", "seiyu", "character" ],
                }
            });

        // what anime with genre like ?anime
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("genre")
            .object("like")
            .object("anime", "aon:anime")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?genre ?title ?image ?link
                        WHERE {
                            ?queryAnimeSource aon:title ${params.anime[0].replace(/~/g, " ")} ;
                                rdf:type aon:Anime ;
                                aon:genre ?genreList .
                                
                            ?genreList aon:name ?genre .
                          
                            ?link rdf:type aon:Anime ;
                                aon:genre ?genreList ;
                                aon:title ?title ;
                                aon:bannerImg ?image .
                        }
                        `,
                    reason: [ "genre" ]
                }
            });

        // what anime with seiyu like ?anime
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("seiyu")
            .object("like")
            .object("anime", "aon:anime")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?seiyu ?character ?title ?image ?link
                        WHERE {
                            ?queryAnimeSource aon:title ${params.anime[0].replace(/~/g, " ")} ;
                                rdf:type aon:Anime ;
                                aon:character ?characterResource .
                                
                            ?characterResource aon:spokenBy ?seiyuResource .
                            ?seiyuResource aon:name ?seiyu .
                            
                            ?newCharacterResource aon:spokenBy ?seiyuResource ;
                                aon:name ?character .
                          
                            ?link rdf:type aon:Anime ;
                                aon:character ?newCharacterResource ;
                                aon:title ?title ;
                                aon:bannerImg ?image .
                        }
                        `,
                    reason: [ "seiyu", "character" ]
                }
            });

        // what other anime is voiced by ?character voice actor
        questionParser.start()
            .object("what")
            .object("other")
            .object("anime")
            .object("is")
            .object("voiced")
            .object("by")
            .object("character", "aon:character" )
            .object("voice")
            .object("actor")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?seiyu ?character ?title ?image ?link
                        WHERE {
                            ?queryCharacterResource aon:name ${params.character[0].replace(/~/g, " ")} ;
                                aon:spokenBy ?seiyuResource .
                            
                            ?seiyuResource aon:name ?seiyu .
                            
                            ?newCharacterResource aon:spokenBy ?seiyuResource ;
                                aon:name ?character .
                    
                            ?link rdf:type aon:Anime ; 
                                aon:character ?newCharacterResource ;
                                aon:title ?title ;
                                aon:bannerImg ?image .
                        }
                        LIMIT 25
                        `,
                    reason: [ "seiyu", "character", ]
                }
            });

        // what other characters are voiced by ?character voice actor
        questionParser.start()
            .object("what")
            .object("other")
            .object("characters")
            .object("are")
            .object("voiced")
            .object("by")
            .object("character", "aon:character" )
            .object("voice")
            .object("actor")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?anime ?seiyu ?title ?image ?link
                        WHERE {
                            ?queryCharacterResource aon:name ${params.character[0].replace(/~/g, " ")} ;
                                aon:spokenBy ?seiyuResource .
                            
                            ?seiyuResource aon:name ?seiyu .                            
                            
                            ?link aon:spokenBy ?seiyuResource ;
                                aon:name ?title ;
                                aon:bannerImg ?image .
                    
                            ?animeResource rdf:type aon:Anime ; 
                                aon:character ?link ;
                                aon:title ?anime .
                        }
                        LIMIT 25
                        `,
                    reason: [ "seiyu", "anime", ]
                }
            });

        // who is ?character voice actor
        questionParser.start()
            .object("who")
            .object("is")
            .object("character", "aon:character")
            .object("voice")
            .object("actor")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?anime__title ?character ?title ?image ?link
                        WHERE {
                            ?queryCharacterResource aon:name ${params.character[0].replace(/~/g, " ")} ;
                                aon:name ?character ;
                                aon:spokenBy ?link .
                                
                            ?link aon:name ?title ;
                                aon:bannerImg ?image .
                            
                            ?animeResource aon:character ?queryCharacterResource ;
                                aon:title ?anime__title
                        }
                        `,
                    reason: [ "anime__title", "character", ]
                }
            });

        // what kind of anime is ?anime
        questionParser.start()
            .object("what")
            .object("kind")
            .object("of")
            .object("anime")
            .object("is")
            .object("anime", "aon:anime")
            .build((params: any) => {
                return {
                    sparql: SPARQL`
                        SELECT ?description ?total__episodes ?genre ?title ?image ?link
                        WHERE {
                            ?link aon:title ${params.anime[0].replace(/~/g, " ")} ;
                                rdf:type aon:Anime ;
                                aon:title ?title ;
                                aon:bannerImg ?image ;
                                aon:genre ?genreList ;
                                aon:description ?description ;
                                aon:numberOfEpisodes ?total__episodes .
                                
                          ?genreList aon:name ?genre .
                        }
                        `,
                    reason: [ "description", "total__episodes", "genre" ]
                }
            });

        // what is best ?genre anime right now
        questionParser.start()
            .object("what")
            .object("is")
            .object("best")
            .object("setOfGenre", "aon:genre")
            .object("anime")
            .object("right")
            .object("now")
            .build((params: any) => {
                return {
                    sparql: SPARQL`                        
                        SELECT ?popularity ?genre ?title ?image ?link
                        WHERE {
                            {
                                SELECT ?popularity ?title
                                WHERE {
                                    ?queryGenreResource aon:name ${params.setOfGenre[0].replace(/~/g, " ")} .
                                    
                                    ?animeSource rdf:type aon:Anime ;
                                        aon:genre ?queryGenreResource ;
                                        aon:title ?title ;
                                        aon:bannerImg ?image ;
                                        aon:popularity ?popularity ;
                                }
                                ORDER BY DESC(xsd:integer(?popularity))
                                LIMIT 5
                            }
                            ?link rdf:type aon:Anime ;
                                aon:title ?title ;
                                aon:bannerImg ?image ;
                                aon:genre ?genreSource .
                                
                            ?genreSource aon:name ?genre
                        }
                        `,
                    reason: [ "popularity", "genre", "/nosorting/"]
                };
            });

        // what is best ?genre anime right now
        questionParser.start()
            .object("what")
            .object("is")
            .object("most")
            .object("popular")
            .object("anime")
            .object("right")
            .object("now")
            .build((params: any) => {
                return {
                    sparql: SPARQL`                        
                        SELECT ?popularity ?genre ?title ?image ?link
                        WHERE {
                            {
                                SELECT ?popularity ?title
                                WHERE {
                                    ?animeSource rdf:type aon:Anime ;
                                        aon:title ?title ;
                                        aon:popularity ?popularity ;
                                }
                                ORDER BY DESC(xsd:integer(?popularity))
                                LIMIT 5
                            }
                            ?link rdf:type aon:Anime ;
                                aon:title ?title ;
                                aon:bannerImg ?image ;
                                aon:genre ?genreSource .
                                
                            ?genreSource aon:name ?genre
                        }
                        `,
                    reason: [ "popularity", "genre", "/nosorting/" ]
                };
            });
    }
}