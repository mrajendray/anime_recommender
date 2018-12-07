"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('sparql-client-2'), SparqlClient = _a.SparqlClient, SPARQL = _a.SPARQL;
var SparqlQuery = /** @class */ (function () {
    function SparqlQuery(endpoint) {
        var _this = this;
        this.queryExcute = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client
                            .query(query)
                            .execute()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.results.bindings];
                }
            });
        }); };
        this.getType = function (type, query) { return __awaiter(_this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = (query) ? query : "";
                        ret = [];
                        if (!(type === "aon:genre")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getGenre(query)];
                    case 1:
                        ret = _a.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        if (!(type === "aon:anime")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getAnime(query)];
                    case 3:
                        ret = _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(type === "aon:character")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getCharacter(query)];
                    case 5:
                        ret = _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(type === "aon:spokenBy")) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getSeiyu(query)];
                    case 7:
                        ret = _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, ret];
                }
            });
        }); };
        this.getGenre = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryExcute(SPARQL(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                SELECT ?g\n                WHERE {\n                    ?a rdf:type aon:genre .\n                    ?a aon:name ?g .\n                    filter contains(lcase(str(?g)), ", ")\n                }\n                LIMIT 8\n                "], ["\n                SELECT ?g\n                WHERE {\n                    ?a rdf:type aon:genre .\n                    ?a aon:name ?g .\n                    filter contains(lcase(str(?g)), ", ")\n                }\n                LIMIT 8\n                "])), query))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.map(function (g) { return g.g.value; })];
                }
            });
        }); };
        this.getAnime = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryExcute(SPARQL(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                SELECT ?t\n                WHERE {\n                    ?a rdf:type aon:Anime .\n                    ?a aon:title ?t .\n                    filter contains(lcase(str(?t)), ", ")\n                }\n                LIMIT 8\n                "], ["\n                SELECT ?t\n                WHERE {\n                    ?a rdf:type aon:Anime .\n                    ?a aon:title ?t .\n                    filter contains(lcase(str(?t)), ", ")\n                }\n                LIMIT 8\n                "])), query))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.map(function (t) { return t.t.value; })];
                }
            });
        }); };
        this.getCharacter = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryExcute(SPARQL(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n                SELECT ?n\n                WHERE {\n                    ?a aon:character ?c .\n                    ?c aon:name ?n .\n                    filter contains(lcase(str(?n)), ", ")\n                }\n                GROUP BY ?n\n                LIMIT 8\n                "], ["\n                SELECT ?n\n                WHERE {\n                    ?a aon:character ?c .\n                    ?c aon:name ?n .\n                    filter contains(lcase(str(?n)), ", ")\n                }\n                GROUP BY ?n\n                LIMIT 8\n                "])), query))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.map(function (n) { return n.n.value; })];
                }
            });
        }); };
        this.getSeiyu = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryExcute(SPARQL(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n                SELECT ?n\n                WHERE {\n                    ?s rdf:type aon:Person .\n                    ?s aon:name ?n\n                    filter contains(lcase(str(?n)), ", ")\n                }\n                GROUP BY ?n\n                LIMIT 8\n                "], ["\n                SELECT ?n\n                WHERE {\n                    ?s rdf:type aon:Person .\n                    ?s aon:name ?n\n                    filter contains(lcase(str(?n)), ", ")\n                }\n                GROUP BY ?n\n                LIMIT 8\n                "])), query))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.map(function (n) { return n.n.value; })];
                }
            });
        }); };
        this.client = new SparqlClient(endpoint)
            .register({
            rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            aon: "https://aon.aon/ontology.owl#",
            xsd: "http://www.w3.org/2001/XMLSchema#",
        });
    }
    return SparqlQuery;
}());
exports.default = SparqlQuery;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SparqlQuery.js.map