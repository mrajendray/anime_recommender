"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var SPARQL = require('sparql-client-2').SPARQL;
var Question = /** @class */ (function () {
    function Question() {
    }
    Question.init = function (questionParser) {
        // how many episodes does ?anime have
        questionParser.start()
            .object("how")
            .object("many")
            .object("episodes")
            .object("does")
            .object("anime", "aon:anime")
            .object("have")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                        SELECT ?total__episodes ?title ?image ?link\n                        WHERE { \n                            ?link aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:numberOfEpisodes ?total__episodes .\n                        }\n                        "], ["\n                        SELECT ?total__episodes ?title ?image ?link\n                        WHERE { \n                            ?link aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:numberOfEpisodes ?total__episodes .\n                        }\n                        "])), params.anime[0].replace(/~/g, " ")),
                reason: ["total__episodes"]
            };
        });
        // how many character does ?anime have
        questionParser.start()
            .object("how")
            .object("many")
            .object("character")
            .object("does")
            .object("anime", "aon:anime")
            .object("have")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                        SELECT (count(distinct ?characterResource) as ?total__character) ?title ?image ?link\n                        WHERE {\n                            ?link aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:character ?characterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        GROUP BY ?title ?image ?link\n                        "], ["\n                        SELECT (count(distinct ?characterResource) as ?total__character) ?title ?image ?link\n                        WHERE {\n                            ?link aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:character ?characterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        GROUP BY ?title ?image ?link\n                        "])), params.anime[0].replace(/~/g, " ")),
                reason: ["total__character"]
            };
        });
        // what anime with genre ?genre
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("genre")
            .object("setOfGenre", "aon:genre")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_3 || (templateObject_3 = __makeTemplateObject(["                        \n                        SELECT ?genre ?title ?image ?link\n                        WHERE {\n                            ?queryGenreResource aon:name ", " .\n                            \n                            ?link rdf:type aon:Anime ;\n                                aon:genre ?queryGenreResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?newGenreResource .\n                                \n                            ?newGenreResource aon:name ?genre .\n                        }\n                        LIMIT 50\n                        "], ["                        \n                        SELECT ?genre ?title ?image ?link\n                        WHERE {\n                            ?queryGenreResource aon:name ", " .\n                            \n                            ?link rdf:type aon:Anime ;\n                                aon:genre ?queryGenreResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?newGenreResource .\n                                \n                            ?newGenreResource aon:name ?genre .\n                        }\n                        LIMIT 50\n                        "])), params.setOfGenre[0].replace(/~/g, " ")),
                reason: ["genre"]
            };
        });
        // what anime with seiyu ?seiyu
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("seiyu")
            .object("setOfSeiyu", "aon:spokenBy")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_4 || (templateObject_4 = __makeTemplateObject(["                        \n                        SELECT ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?querySeiyuResource aon:name ", " ;\n                                aon:name ?seiyu .\n                                \n                            ?characterResource aon:spokenBy ?querySeiyuResource ;\n                                aon:name ?character .\n                          \n                            ?link rdf:type aon:Anime ;\n                                aon:character ?characterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        LIMIT 50\n                        "], ["                        \n                        SELECT ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?querySeiyuResource aon:name ", " ;\n                                aon:name ?seiyu .\n                                \n                            ?characterResource aon:spokenBy ?querySeiyuResource ;\n                                aon:name ?character .\n                          \n                            ?link rdf:type aon:Anime ;\n                                aon:character ?characterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        LIMIT 50\n                        "])), params.setOfSeiyu[0].replace(/~/g, " ")),
                reason: ["seiyu", "character"]
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
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n                        SELECT ?genre ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?queryGenreSource aon:name ", " ;\n                                rdf:type aon:genre ; \n                                aon:name ?genre .\n                                \n                            ?querySeiyuSource aon:name ", " ;\n                                aon:name ?seiyu .\n                            \n                            ?characterSource aon:spokenBy ?querySeiyuSource ;\n                                aon:name ?character .\n                                \n                            ?link rdf:type aon:Anime ; \n                                aon:genre ?queryGenreSource ;\n                                aon:character ?characterSource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        "], ["\n                        SELECT ?genre ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?queryGenreSource aon:name ", " ;\n                                rdf:type aon:genre ; \n                                aon:name ?genre .\n                                \n                            ?querySeiyuSource aon:name ", " ;\n                                aon:name ?seiyu .\n                            \n                            ?characterSource aon:spokenBy ?querySeiyuSource ;\n                                aon:name ?character .\n                                \n                            ?link rdf:type aon:Anime ; \n                                aon:genre ?queryGenreSource ;\n                                aon:character ?characterSource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        "])), params.setOfGenre[0].replace(/~/g, " "), params.setOfSeiyu[0].replace(/~/g, " ")),
                reason: ["genre", "seiyu", "character"],
            };
        });
        // what anime with genre like ?anime
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("genre")
            .object("like")
            .object("anime", "aon:anime")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n                        SELECT ?genre ?title ?image ?link\n                        WHERE {\n                            ?queryAnimeSource aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:genre ?genreList .\n                                \n                            ?genreList aon:name ?genre .\n                          \n                            ?link rdf:type aon:Anime ;\n                                aon:genre ?genreList ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        "], ["\n                        SELECT ?genre ?title ?image ?link\n                        WHERE {\n                            ?queryAnimeSource aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:genre ?genreList .\n                                \n                            ?genreList aon:name ?genre .\n                          \n                            ?link rdf:type aon:Anime ;\n                                aon:genre ?genreList ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        "])), params.anime[0].replace(/~/g, " ")),
                reason: ["genre"]
            };
        });
        // what anime with seiyu like ?anime
        questionParser.start()
            .object("what")
            .object("anime")
            .object("with")
            .object("seiyu")
            .object("like")
            .object("anime", "aon:anime")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n                        SELECT ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?queryAnimeSource aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:character ?characterResource .\n                                \n                            ?characterResource aon:spokenBy ?seiyuResource .\n                            ?seiyuResource aon:name ?seiyu .\n                            \n                            ?newCharacterResource aon:spokenBy ?seiyuResource ;\n                                aon:name ?character .\n                          \n                            ?link rdf:type aon:Anime ;\n                                aon:character ?newCharacterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        "], ["\n                        SELECT ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?queryAnimeSource aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:character ?characterResource .\n                                \n                            ?characterResource aon:spokenBy ?seiyuResource .\n                            ?seiyuResource aon:name ?seiyu .\n                            \n                            ?newCharacterResource aon:spokenBy ?seiyuResource ;\n                                aon:name ?character .\n                          \n                            ?link rdf:type aon:Anime ;\n                                aon:character ?newCharacterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        "])), params.anime[0].replace(/~/g, " ")),
                reason: ["seiyu", "character"]
            };
        });
        // what other anime is voiced by ?character voice actor
        questionParser.start()
            .object("what")
            .object("other")
            .object("anime")
            .object("is")
            .object("voiced")
            .object("by")
            .object("character", "aon:character")
            .object("voice")
            .object("actor")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n                        SELECT ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?queryCharacterResource aon:name ", " ;\n                                aon:spokenBy ?seiyuResource .\n                            \n                            ?seiyuResource aon:name ?seiyu .\n                            \n                            ?newCharacterResource aon:spokenBy ?seiyuResource ;\n                                aon:name ?character .\n                    \n                            ?link rdf:type aon:Anime ; \n                                aon:character ?newCharacterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        LIMIT 25\n                        "], ["\n                        SELECT ?seiyu ?character ?title ?image ?link\n                        WHERE {\n                            ?queryCharacterResource aon:name ", " ;\n                                aon:spokenBy ?seiyuResource .\n                            \n                            ?seiyuResource aon:name ?seiyu .\n                            \n                            ?newCharacterResource aon:spokenBy ?seiyuResource ;\n                                aon:name ?character .\n                    \n                            ?link rdf:type aon:Anime ; \n                                aon:character ?newCharacterResource ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image .\n                        }\n                        LIMIT 25\n                        "])), params.character[0].replace(/~/g, " ")),
                reason: ["seiyu", "character",]
            };
        });
        // what other characters are voiced by ?character voice actor
        questionParser.start()
            .object("what")
            .object("other")
            .object("characters")
            .object("are")
            .object("voiced")
            .object("by")
            .object("character", "aon:character")
            .object("voice")
            .object("actor")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n                        SELECT ?anime ?seiyu ?title ?image ?link\n                        WHERE {\n                            ?queryCharacterResource aon:name ", " ;\n                                aon:spokenBy ?seiyuResource .\n                            \n                            ?seiyuResource aon:name ?seiyu .                            \n                            \n                            ?link aon:spokenBy ?seiyuResource ;\n                                aon:name ?title ;\n                                aon:bannerImg ?image .\n                    \n                            ?animeResource rdf:type aon:Anime ; \n                                aon:character ?link ;\n                                aon:title ?anime .\n                        }\n                        LIMIT 25\n                        "], ["\n                        SELECT ?anime ?seiyu ?title ?image ?link\n                        WHERE {\n                            ?queryCharacterResource aon:name ", " ;\n                                aon:spokenBy ?seiyuResource .\n                            \n                            ?seiyuResource aon:name ?seiyu .                            \n                            \n                            ?link aon:spokenBy ?seiyuResource ;\n                                aon:name ?title ;\n                                aon:bannerImg ?image .\n                    \n                            ?animeResource rdf:type aon:Anime ; \n                                aon:character ?link ;\n                                aon:title ?anime .\n                        }\n                        LIMIT 25\n                        "])), params.character[0].replace(/~/g, " ")),
                reason: ["seiyu", "anime",]
            };
        });
        // who is ?character voice actor
        questionParser.start()
            .object("who")
            .object("is")
            .object("character", "aon:character")
            .object("voice")
            .object("actor")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n                        SELECT ?anime__title ?character ?title ?image ?link\n                        WHERE {\n                            ?queryCharacterResource aon:name ", " ;\n                                aon:name ?character ;\n                                aon:spokenBy ?link .\n                                \n                            ?link aon:name ?title ;\n                                aon:bannerImg ?image .\n                            \n                            ?animeResource aon:character ?queryCharacterResource ;\n                                aon:title ?anime__title\n                        }\n                        "], ["\n                        SELECT ?anime__title ?character ?title ?image ?link\n                        WHERE {\n                            ?queryCharacterResource aon:name ", " ;\n                                aon:name ?character ;\n                                aon:spokenBy ?link .\n                                \n                            ?link aon:name ?title ;\n                                aon:bannerImg ?image .\n                            \n                            ?animeResource aon:character ?queryCharacterResource ;\n                                aon:title ?anime__title\n                        }\n                        "])), params.character[0].replace(/~/g, " ")),
                reason: ["anime__title", "character",]
            };
        });
        // what kind of anime is ?anime
        questionParser.start()
            .object("what")
            .object("kind")
            .object("of")
            .object("anime")
            .object("is")
            .object("anime", "aon:anime")
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n                        SELECT ?description ?total__episodes ?genre ?title ?image ?link\n                        WHERE {\n                            ?link aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?genreList ;\n                                aon:description ?description ;\n                                aon:numberOfEpisodes ?total__episodes .\n                                \n                          ?genreList aon:name ?genre .\n                        }\n                        "], ["\n                        SELECT ?description ?total__episodes ?genre ?title ?image ?link\n                        WHERE {\n                            ?link aon:title ", " ;\n                                rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?genreList ;\n                                aon:description ?description ;\n                                aon:numberOfEpisodes ?total__episodes .\n                                \n                          ?genreList aon:name ?genre .\n                        }\n                        "])), params.anime[0].replace(/~/g, " ")),
                reason: ["description", "total__episodes", "genre"]
            };
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
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_12 || (templateObject_12 = __makeTemplateObject(["                        \n                        SELECT ?popularity ?genre ?title ?image ?link\n                        WHERE {\n                            {\n                                SELECT ?popularity ?title\n                                WHERE {\n                                    ?queryGenreResource aon:name ", " .\n                                    \n                                    ?animeSource rdf:type aon:Anime ;\n                                        aon:genre ?queryGenreResource ;\n                                        aon:title ?title ;\n                                        aon:bannerImg ?image ;\n                                        aon:popularity ?popularity ;\n                                }\n                                ORDER BY DESC(xsd:integer(?popularity))\n                                LIMIT 5\n                            }\n                            ?link rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?genreSource .\n                                \n                            ?genreSource aon:name ?genre\n                        }\n                        "], ["                        \n                        SELECT ?popularity ?genre ?title ?image ?link\n                        WHERE {\n                            {\n                                SELECT ?popularity ?title\n                                WHERE {\n                                    ?queryGenreResource aon:name ", " .\n                                    \n                                    ?animeSource rdf:type aon:Anime ;\n                                        aon:genre ?queryGenreResource ;\n                                        aon:title ?title ;\n                                        aon:bannerImg ?image ;\n                                        aon:popularity ?popularity ;\n                                }\n                                ORDER BY DESC(xsd:integer(?popularity))\n                                LIMIT 5\n                            }\n                            ?link rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?genreSource .\n                                \n                            ?genreSource aon:name ?genre\n                        }\n                        "])), params.setOfGenre[0].replace(/~/g, " ")),
                reason: ["popularity", "genre", "/nosorting/"]
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
            .build(function (params) {
            return {
                sparql: SPARQL(templateObject_13 || (templateObject_13 = __makeTemplateObject(["                        \n                        SELECT ?popularity ?genre ?title ?image ?link\n                        WHERE {\n                            {\n                                SELECT ?popularity ?title\n                                WHERE {\n                                    ?animeSource rdf:type aon:Anime ;\n                                        aon:title ?title ;\n                                        aon:popularity ?popularity ;\n                                }\n                                ORDER BY DESC(xsd:integer(?popularity))\n                                LIMIT 5\n                            }\n                            ?link rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?genreSource .\n                                \n                            ?genreSource aon:name ?genre\n                        }\n                        "], ["                        \n                        SELECT ?popularity ?genre ?title ?image ?link\n                        WHERE {\n                            {\n                                SELECT ?popularity ?title\n                                WHERE {\n                                    ?animeSource rdf:type aon:Anime ;\n                                        aon:title ?title ;\n                                        aon:popularity ?popularity ;\n                                }\n                                ORDER BY DESC(xsd:integer(?popularity))\n                                LIMIT 5\n                            }\n                            ?link rdf:type aon:Anime ;\n                                aon:title ?title ;\n                                aon:bannerImg ?image ;\n                                aon:genre ?genreSource .\n                                \n                            ?genreSource aon:name ?genre\n                        }\n                        "]))),
                reason: ["popularity", "genre", "/nosorting/"]
            };
        });
    };
    return Question;
}());
exports.default = Question;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
//# sourceMappingURL=Question.js.map