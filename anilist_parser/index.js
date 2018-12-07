"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var AnilistToken = require("./utils/AnilistToken");
var TaskQueue_1 = require("./utils/TaskQueue");
var builder = require("xmlbuilder");
var fs = require("fs");
var FormData = require("form-data");
var path = require("path");
var sparqlUploadEndpoint = 'http://localhost:3030/anime-65489/upload';
AnilistToken.init("yudamo-ofece", "wp4z5BeNGDiBgotBR9");
var main = function () { return __awaiter(_this, void 0, void 0, function () {
    var token, name, xmlBuilder, downloadTaskList, year, seas, animeListId, idx1, y, idx2, s, anilistToken, rawAnimeList, animeList, data, _loop_1, idx, _loop_2, idx;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, AnilistToken.getToken()];
            case 1:
                token = _a.sent();
                name = function (first, last) {
                    if (first && last) {
                        return first + " " + last;
                    }
                    if (first) {
                        return first;
                    }
                    if (last) {
                        return last;
                    }
                };
                xmlBuilder = function (animeData) {
                    var xmlBuild = builder.create("rdf:RDF")
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
                            .ele("rdf:Description", { "rdf:about": "https://anilist.co/anime/" + animeData.id });
                    // > type
                    xmlBuild = xmlBuild.ele("rdf:type", { "rdf:resource": "https://aon.aon/ontology.owl#Anime" }).up();
                    // > bannerImg
                    xmlBuild = xmlBuild.ele("aon:bannerImg", "https://s3.anilist.co/media/anime/cover/large/" + path.basename(animeData.image_url_lge)).up();
                    // > character
                    animeData.characters.forEach(function (character) {
                        xmlBuild = xmlBuild.ele("aon:character", { "rdf:resource": "https://anilist.co/character/" + character.id }).up();
                    });
                    // > description
                    xmlBuild = xmlBuild.ele("aon:description", animeData.description).up();
                    // > genre
                    animeData.genres.forEach(function (genre) {
                        if (!genre)
                            return;
                        xmlBuild = xmlBuild.ele("aon:genre", { "rdf:resource": "https://anilist.co/search/anime?includedGenres=" + genre.replace(/ /g, "%20") }).up();
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
                    animeData.characters.forEach(function (character) {
                        xmlBuild = xmlBuild
                            .ele("rdf:Description", { "rdf:about": "https://anilist.co/character/" + character.id })
                            .ele("aon:name", name(character.name_first, character.name_last)).up()
                            .ele("aon:bannerImg", "https://s3.anilist.co/character/large/" + path.basename(character.image_url_lge)).up();
                        if (character.actor.length !== 0) {
                            var actor = character.actor[0];
                            xmlBuild = xmlBuild.ele("aon:spokenBy", { "rdf:resource": "https://anilist.co/staff/" + actor.id }).up();
                        }
                        xmlBuild = xmlBuild.up();
                    });
                    // End of Character Description
                    xmlBuild = xmlBuild.com("End of Character Description");
                    // Seiyu Description
                    xmlBuild = xmlBuild.com("Seiyu Description");
                    animeData.characters.forEach(function (character) {
                        if (character.actor.length !== 0) {
                            var actor = character.actor[0];
                            xmlBuild = xmlBuild
                                .ele("rdf:Description", { "rdf:about": "https://anilist.co/staff/" + actor.id })
                                .ele("rdf:type", { "rdf:resource": "https://aon.aon/ontology.owl#Person" }).up()
                                .ele("aon:name", name(actor.name_first, actor.name_last)).up()
                                .ele("aon:bannerImg", "https://s3.anilist.co/staff/large/" + path.basename(actor.image_url_lge)).up()
                                .up();
                        }
                    });
                    // End of Seiyu Description
                    xmlBuild = xmlBuild.com("End of Seiyu Description");
                    return xmlBuild.end({ pretty: true })
                        .replace(/&#xD;/g, " ")
                        .replace(/&#xA;/g, " ");
                };
                downloadTaskList = TaskQueue_1.default.makeTaskList("queue", false, 4);
                year = [2015, 2016, 2017, 2018];
                seas = ['winter', 'spring', 'summer', 'fall'];
                animeListId = [];
                idx1 = 0;
                _a.label = 2;
            case 2:
                if (!(idx1 < year.length)) return [3 /*break*/, 8];
                y = year[idx1];
                idx2 = 0;
                _a.label = 3;
            case 3:
                if (!(idx2 < seas.length)) return [3 /*break*/, 7];
                s = seas[idx2];
                return [4 /*yield*/, AnilistToken.getToken()];
            case 4:
                anilistToken = _a.sent();
                console.log("browsing::startin~", y, s);
                return [4 /*yield*/, axios_1.default.get(AnilistToken.apiURL + "browse/anime/", {
                        params: {
                            year: y,
                            season: s,
                            full_page: true,
                            access_token: anilistToken,
                        }
                    })];
            case 5:
                rawAnimeList = _a.sent();
                animeList = rawAnimeList.data;
                animeListId = [].concat(animeListId, animeList.filter(function (a) { return a.adult === false; }).map(function (a) { return a.id; }));
                console.log("browsing::complet~", y, s);
                _a.label = 6;
            case 6:
                idx2++;
                return [3 /*break*/, 3];
            case 7:
                idx1++;
                return [3 /*break*/, 2];
            case 8:
                data = [];
                _loop_1 = function (idx) {
                    var anilistToken, animeId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, AnilistToken.getToken()];
                            case 1:
                                anilistToken = _a.sent();
                                animeId = animeListId[idx];
                                data.push(TaskQueue_1.default.doTask(downloadTaskList, function (taskResolver, taskRejector) { return __awaiter(_this, void 0, void 0, function () {
                                    var rawAnimeData, xmlData, e_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log("downloa~::startin~", animeId, idx + 1 + "/" + animeListId.length);
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, axios_1.default.get(AnilistToken.apiURL + "anime/" + animeId + "/characters", {
                                                        params: {
                                                            access_token: anilistToken,
                                                        }
                                                    })];
                                            case 2:
                                                rawAnimeData = _a.sent();
                                                xmlData = xmlBuilder(rawAnimeData.data);
                                                fs.writeFile("anime/" + rawAnimeData.data.id + ".xml", xmlData, function (err) {
                                                    if (err) {
                                                        throw Error();
                                                    }
                                                });
                                                console.log("downloa~::complet~", animeId, idx + 1 + "/" + animeListId.length);
                                                return [2 /*return*/, taskResolver()];
                                            case 3:
                                                e_1 = _a.sent();
                                                console.log("downloa~::error~~~", animeId, idx + 1 + "/" + animeListId.length);
                                                console.error(e_1);
                                                return [2 /*return*/, taskResolver()];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); }));
                                return [2 /*return*/];
                        }
                    });
                };
                idx = 0;
                _a.label = 9;
            case 9:
                if (!(idx < animeListId.length)) return [3 /*break*/, 12];
                return [5 /*yield**/, _loop_1(idx)];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                idx++;
                return [3 /*break*/, 9];
            case 12: return [4 /*yield*/, Promise.all(data)];
            case 13:
                _a.sent();
                _loop_2 = function (idx) {
                    var animeId, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                animeId = animeListId[idx];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, TaskQueue_1.default.doTask(downloadTaskList, function (taskResolver, taskRejector) { return __awaiter(_this, void 0, void 0, function () {
                                        var server, fs, form, e_3;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.log("~~upload::startin~", animeId, idx + 1 + "/" + animeListId.length);
                                                    server = axios_1.default.create({
                                                        baseURL: 'http://127.0.0.1:3030',
                                                        headers: { 'X-Custom-Header': 'foobar' }
                                                    });
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    fs = require('fs');
                                                    if (!fs.existsSync("anime/" + animeId + ".xml")) {
                                                        return [2 /*return*/, taskRejector("File not found!")];
                                                    }
                                                    form = new FormData();
                                                    form.append('files', fs.createReadStream("anime/" + animeId + ".xml"));
                                                    return [4 /*yield*/, server.post(sparqlUploadEndpoint, form, { headers: form.getHeaders() })];
                                                case 2:
                                                    _a.sent();
                                                    console.log("~~upload::complet~", animeId, idx + 1 + "/" + animeListId.length);
                                                    return [2 /*return*/, taskResolver()];
                                                case 3:
                                                    e_3 = _a.sent();
                                                    console.log("~~upload::~~~error", animeId, idx + 1 + "/" + animeListId.length);
                                                    console.error(e_3);
                                                    return [2 /*return*/, taskRejector("Upload error!")];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_2 = _a.sent();
                                console.error(e_2);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                idx = 0;
                _a.label = 14;
            case 14:
                if (!(idx < animeListId.length)) return [3 /*break*/, 17];
                return [5 /*yield**/, _loop_2(idx)];
            case 15:
                _a.sent();
                _a.label = 16;
            case 16:
                idx++;
                return [3 /*break*/, 14];
            case 17: return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=index.js.map