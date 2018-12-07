"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var QuestionParser = /** @class */ (function () {
    function QuestionParser() {
        this.questionId = 0;
        this.objectId = 0;
        this.objects = [];
        this.getObject("/finish/");
    }
    QuestionParser.prototype.start = function () {
        this.questionId = this.questionId + 1;
        return new QuestionParserObject(this, this.questionId);
    };
    QuestionParser.prototype.whatsNext = function (question) {
        if (question !== undefined && question !== "") {
            var questionObject = question.split(" ");
            var possibleNext_1 = [];
            var parsedParameter = [];
            var deep_1 = -1;
            var _loop_1 = function (idx) {
                var name = questionObject[idx];
                var object = _.find(this_1.objects, { name: name });
                if (object === undefined) {
                    var lastParsed_1 = _.find(parsedParameter, { deep: deep_1 });
                    if (lastParsed_1 === undefined) {
                        var newDeep_1 = deep_1 + 1;
                        lastParsed_1 = {
                            deep: newDeep_1,
                            possibleQuery: [],
                            params: [],
                        };
                        parsedParameter.push(lastParsed_1);
                        // find next object from last object
                        var nextObject = this_1.objects.filter(function (o) { return (_.findIndex(possibleNext_1, { next: o.objectId }) !== -1); }).filter(function (o) {
                            return o.query.filter(function (q) { return (_.findIndex(possibleNext_1, { questionId: q.questionId }) !== -1 &&
                                q.deep === newDeep_1); }).length !== -1;
                        });
                        // parse possible object from next object
                        var newPossibleNext_1 = [];
                        nextObject.forEach(function (no) {
                            newPossibleNext_1 = [].concat(newPossibleNext_1, no.query.filter(function (o) {
                                var inc = (_.findIndex(possibleNext_1, { questionId: o.questionId }) !== -1 &&
                                    o.deep === newDeep_1 &&
                                    o.type !== '/string/');
                                if (inc) {
                                    lastParsed_1.possibleQuery.push({
                                        questionId: o.questionId,
                                        objectName: no.name,
                                        type: o.type,
                                        next: o.next,
                                    });
                                }
                                return inc;
                            }));
                        });
                        possibleNext_1 = newPossibleNext_1;
                        deep_1 = newDeep_1;
                    }
                    lastParsed_1.params.push(name);
                }
                else {
                    deep_1 = deep_1 + 1;
                    if (possibleNext_1.length === 0) {
                        possibleNext_1 = object.query;
                    }
                    else {
                        possibleNext_1 = object.query.filter(function (o) { return (_.findIndex(possibleNext_1, { questionId: o.questionId }) !== -1 &&
                            o.deep === deep_1); });
                    }
                }
            };
            var this_1 = this;
            for (var idx = 0; idx < questionObject.length; idx++) {
                _loop_1(idx);
            }
            if (possibleNext_1.length !== 0) {
                return this.objects.filter(function (o) { return (_.findIndex(possibleNext_1, { next: o.objectId }) !== -1); }).map(function (o) { return ({
                    name: o.name,
                    type: _.uniq(o.query.filter(function (q) {
                        return (_.findIndex(possibleNext_1, { questionId: q.questionId }) !== -1 && q.deep === deep_1 + 1);
                    }).map(function (q) { return q.type; })),
                }); });
            }
            else {
                return undefined;
            }
        }
        else {
            return this.objects.filter(function (o) { return o.root; }).map(function (o) { return ({ name: o.name, type: _.uniq(o.query.map(function (q) { return q.type; })), }); });
        }
    };
    QuestionParser.prototype.parse = function (question) {
        if (question !== undefined && question !== "") {
            var questionObject = question.split(" ");
            var possibleNext_2 = [];
            var parsedParameter = [];
            var deep_2 = -1;
            var _loop_2 = function (idx) {
                var name = questionObject[idx];
                var object = _.find(this_2.objects, { name: name });
                if (object === undefined) {
                    var lastParsed_2 = _.find(parsedParameter, { deep: deep_2 });
                    if (lastParsed_2 === undefined) {
                        var newDeep_2 = deep_2 + 1;
                        lastParsed_2 = {
                            deep: newDeep_2,
                            possibleQuery: [],
                            params: [],
                        };
                        parsedParameter.push(lastParsed_2);
                        // find next object from last object
                        var nextObject = this_2.objects.filter(function (o) { return (_.findIndex(possibleNext_2, { next: o.objectId }) !== -1); }).filter(function (o) {
                            return o.query.filter(function (q) { return (_.findIndex(possibleNext_2, { questionId: q.questionId }) !== -1 &&
                                q.deep === newDeep_2); }).length !== -1;
                        });
                        // parse possible object from next object
                        var newPossibleNext_2 = [];
                        nextObject.forEach(function (no) {
                            newPossibleNext_2 = [].concat(newPossibleNext_2, no.query.filter(function (o) {
                                var inc = (_.findIndex(possibleNext_2, { questionId: o.questionId }) !== -1 &&
                                    o.deep === newDeep_2 &&
                                    o.type !== '/string/');
                                if (inc) {
                                    lastParsed_2.possibleQuery.push({
                                        questionId: o.questionId,
                                        objectName: no.name,
                                        type: o.type,
                                        next: o.next,
                                    });
                                }
                                return inc;
                            }));
                        });
                        possibleNext_2 = newPossibleNext_2;
                        deep_2 = newDeep_2;
                    }
                    lastParsed_2.params.push(name);
                }
                else {
                    deep_2 = deep_2 + 1;
                    if (possibleNext_2.length === 0) {
                        possibleNext_2 = object.query;
                    }
                    else {
                        possibleNext_2 = object.query.filter(function (o) { return (_.findIndex(possibleNext_2, { questionId: o.questionId }) !== -1 &&
                            o.deep === deep_2); });
                    }
                }
            };
            var this_2 = this;
            for (var idx = 0; idx < questionObject.length; idx++) {
                _loop_2(idx);
            }
            if (possibleNext_2.length !== 0) {
                var _loop_3 = function (idx) {
                    var pn = possibleNext_2[idx];
                    var parsed = this_3.objects.filter(function (o) { return o.objectId === pn.next; });
                    if (parsed.length === 1) {
                        if (parsed[0].name === "/finish/") {
                            var param_1 = {};
                            parsedParameter.forEach(function (pp) {
                                var name = pp.possibleQuery.filter(function (pq) { return pq.questionId === pn.questionId; })[0].objectName;
                                param_1[name] = pp.params;
                            });
                            return { value: pn.query(param_1) };
                        }
                    }
                };
                var this_3 = this;
                for (var idx = 0; idx < possibleNext_2.length; idx++) {
                    var state_1 = _loop_3(idx);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                return undefined;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    };
    ;
    QuestionParser.prototype.getObject = function (name) {
        var object = _.find(this.objects, { name: name });
        if (object === undefined) {
            this.objectId = this.objectId + 1;
            object = {
                objectId: this.objectId,
                name: name,
                query: [],
                root: false,
            };
            this.objects.push(object);
        }
        return object;
    };
    QuestionParser.prototype.getAllObject = function () {
        return this.objects;
    };
    return QuestionParser;
}());
exports.default = QuestionParser;
var QuestionParserObject = /** @class */ (function () {
    function QuestionParserObject(main, questionID) {
        this.main = main;
        this.questionID = questionID;
        this.root = undefined;
        this.deep = -1;
        this.question = [];
    }
    QuestionParserObject.prototype.object = function (name, type) {
        if (type) {
            this.question.push("?" + name);
        }
        else {
            this.question.push(name);
        }
        this.deep = this.deep + 1;
        var object = this.main.getObject(name);
        var queryOfCurrent = {
            questionId: this.questionID,
            deep: this.deep,
            type: (type === undefined) ? "/string/" : type,
            next: undefined,
        };
        object.query.push(queryOfCurrent);
        if (this.root === undefined) {
            object.root = true;
            this.root = object;
            this.queryOfCurrent = queryOfCurrent;
            return this;
        }
        this.queryOfCurrent.next = object.objectId;
        this.queryOfCurrent = queryOfCurrent;
        return this;
    };
    QuestionParserObject.prototype.build = function (query) {
        this.queryOfCurrent.next = this.main.getObject("/finish/").objectId;
        this.queryOfCurrent.query = query;
        console.log("question:", this.question.join(" "));
    };
    return QuestionParserObject;
}());
//# sourceMappingURL=QuestionParser.js.map