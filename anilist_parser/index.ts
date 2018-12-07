import axios from "axios";
import * as AnilistToken from "./utils/AnilistToken";
import TaskQueue from "./utils/TaskQueue";
import * as builder from "xmlbuilder";
import {XMLElementOrXMLNode} from "xmlbuilder";
import * as fs from "fs";
import * as FormData from "form-data";
import * as path from "path";

const sparqlUploadEndpoint = 'http://localhost:3030/anime-65489/upload';
AnilistToken.init("yudamo-ofece", "wp4z5BeNGDiBgotBR9");

const main = async () => {
    let token = await AnilistToken.getToken();

    // some utils
    const name = (first?: string, last?: string) => {
        if (first && last) {
            return first+" "+last;
        }
        if (first) {
            return first;
        }
        if (last) {
            return last;
        }
    };
    const xmlBuilder = (animeData) => {
        let xmlBuild: XMLElementOrXMLNode = builder.create("rdf:RDF")
        // root attribute
            .attribute("xml:base", "http://www.w3.org/2002/07/owl")
            .attribute("xmlns:rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
            .attribute("xmlns:si", "https://www.w3schools.com/rdf/")
            .attribute("xmlns:aon", "https://aon.aon/ontology.owl#")
            .attribute("xmlns:rdfs", "http://www.w3.org/2000/01/rdf-schema#")
            .attribute("xmlns:owl", "http://www.w3.org/2002/07/owl#")
            .attribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema#");

        // Anime Description
        xmlBuild =
            xmlBuild.com("Anime Description")
                .ele("rdf:Description", {"rdf:about": `https://anilist.co/anime/${animeData.id}`});
        // > type
        xmlBuild = xmlBuild.ele("rdf:type", {"rdf:resource": "https://aon.aon/ontology.owl#Anime"}).up();
        // > bannerImg
        xmlBuild = xmlBuild.ele("aon:bannerImg", `https://s3.anilist.co/media/anime/cover/large/${path.basename(animeData.image_url_lge)}`).up();
        // > character
        animeData.characters.forEach((character: any) => {
            xmlBuild = xmlBuild.ele("aon:character", { "rdf:resource": `https://anilist.co/character/${character.id}` }).up();
        });
        // > description
        xmlBuild = xmlBuild.ele("aon:description", animeData.description).up();
        // > genre
        animeData.genres.forEach((genre: string) => {
            if (!genre) return;
            xmlBuild = xmlBuild.ele("aon:genre", { "rdf:resource": `https://anilist.co/search/anime?includedGenres=${genre.replace(/ /g, "%20")}` }).up();
        });
        // > numberOfEpisodes
        xmlBuild = xmlBuild.ele("aon:numberOfEpisodes", animeData.total_episodes).up();
        // > popularity
        xmlBuild = xmlBuild.ele("aon:popularity", animeData.popularity).up();
        // > season
        xmlBuild = xmlBuild.ele("aon:season", animeData.season.toString().slice(2, 3)).up();
        // > seasonYear
        xmlBuild = xmlBuild.ele("aon:seasonYear", animeData.season.toString().slice(0, 2)).up();
        // > title
        xmlBuild = xmlBuild.ele("aon:title", animeData.title_romaji).up();
        // End of Anime Description
        xmlBuild = xmlBuild.up().com("End of Anime Description");

        // Character Description
        xmlBuild = xmlBuild.com("Character Description");
        animeData.characters.forEach((character: any) => {
            xmlBuild = xmlBuild
                .ele("rdf:Description", {"rdf:about": `https://anilist.co/character/${character.id}`})
                .ele("aon:name", name(character.name_first, character.name_last)).up()
                .ele("aon:bannerImg", `https://s3.anilist.co/character/large/${path.basename(character.image_url_lge)}`).up();

            if (character.actor.length !== 0) {
                const actor = character.actor[0];
                xmlBuild = xmlBuild.ele("aon:spokenBy", {"rdf:resource": `https://anilist.co/staff/${actor.id}`}).up();
            }
            xmlBuild = xmlBuild.up();
        });
        // End of Character Description
        xmlBuild = xmlBuild.com("End of Character Description");

        // Seiyu Description
        xmlBuild = xmlBuild.com("Seiyu Description");
        animeData.characters.forEach((character: any) => {
            if (character.actor.length !== 0) {
                const actor = character.actor[0];
                xmlBuild = xmlBuild
                    .ele("rdf:Description", {"rdf:about": `https://anilist.co/staff/${actor.id}`})
                    .ele("rdf:type", {"rdf:resource": "https://aon.aon/ontology.owl#Person"}).up()
                    .ele("aon:name", name(actor.name_first, actor.name_last)).up()
                    .ele("aon:bannerImg", `https://s3.anilist.co/staff/large/${path.basename(actor.image_url_lge)}`).up()
                    .up();
            }
        });
        // End of Seiyu Description
        xmlBuild = xmlBuild.com("End of Seiyu Description");

        return xmlBuild.end({ pretty: true})
            .replace(/&#xD;/g, " ")
            .replace(/&#xA;/g, " ");
    };

    // prepare task queue list
    let downloadTaskList = TaskQueue.makeTaskList("queue", false, 4);

    // define year and season of anime  to be downloaded
    const year = [ 2015, 2016, 2017, 2018 ];
    const seas = [ 'winter', 'spring', 'summer', 'fall' ];

    // browse anime
    let animeListId: number[] = [];
    for (let idx1 = 0; idx1 < year.length; idx1++) {
        const y = year[idx1];
        for (let idx2 = 0; idx2 < seas.length; idx2++) {
            const s = seas[idx2];

            const anilistToken = await AnilistToken.getToken();
            console.log("browsing::startin~", y, s);
            const rawAnimeList = await axios.get(`${AnilistToken.apiURL}browse/anime/`, {
                params: {
                    year: y,
                    season: s,
                    full_page: true,
                    access_token: anilistToken,
                }
            });
            let animeList = rawAnimeList.data;
            animeListId = [].concat(
                animeListId,
                animeList.filter((a: any) => a.adult === false).map((a: any) => a.id)
            );
            console.log("browsing::complet~", y, s);
        }
    }

    // get anime data and parse to xml
    let data: any[] = [];
    for (let idx = 0; idx < animeListId.length; idx++) {
        const anilistToken = await AnilistToken.getToken();
        const animeId = animeListId[idx];
        data.push(TaskQueue.doTask(downloadTaskList, async ( taskResolver: ( res?: any ) => boolean, taskRejector: ( res?: any ) => boolean ): Promise<boolean> => {
            console.log("downloa~::startin~", animeId, `${idx+1}/${animeListId.length}`);
            try {
                const rawAnimeData = await axios.get(`${AnilistToken.apiURL}anime/${animeId}/characters`, {
                    params: {
                        access_token: anilistToken,
                    }
                });

                const xmlData = xmlBuilder(rawAnimeData.data);
                fs.writeFile(`anime/${rawAnimeData.data.id}.xml`, xmlData, function(err) {
                    if(err) {
                        throw Error();
                    }
                });

                console.log("downloa~::complet~", animeId, `${idx+1}/${animeListId.length}`);
                return taskResolver();
            } catch (e) {
                console.log("downloa~::error~~~", animeId, `${idx+1}/${animeListId.length}`);
                console.error(e);
                return taskResolver();
            }
        }))
    }
    await Promise.all(data);

    // load xml into apache fuseki
    for (let idx = 0; idx < animeListId.length; idx++) {
        const animeId = animeListId[idx];
        try {
            await TaskQueue.doTask(downloadTaskList, async (taskResolver: (res?: any) => boolean, taskRejector: (res?: any) => boolean): Promise<boolean> => {
                console.log("~~upload::startin~", animeId, `${idx + 1}/${animeListId.length}`);
                const server = axios.create({
                    baseURL: 'http://127.0.0.1:3030',
                    headers: {'X-Custom-Header': 'foobar'}
                });

                try {
                    var fs = require('fs');
                    if (!fs.existsSync(`anime/${animeId}.xml`)) {
                        return taskRejector("File not found!");
                    }
                    const form = new FormData();
                    form.append('files', fs.createReadStream(`anime/${animeId}.xml`));

                    await server.post(sparqlUploadEndpoint, form, {headers: form.getHeaders()});
                    console.log("~~upload::complet~", animeId, `${idx + 1}/${animeListId.length}`);
                    return taskResolver();
                } catch (e) {
                    console.log("~~upload::~~~error", animeId, `${idx + 1}/${animeListId.length}`);
                    console.error(e);
                    return taskRejector("Upload error!");
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
};
main();