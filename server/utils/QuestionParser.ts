import * as _ from "lodash";

interface IQuestionObjectQuery {
    questionId: number
    deep: number
    type?: string
    next?: number
    query?: (params: any) => { sparql: string, reason: string[] }
}
interface IQuestionObject {
    objectId: number
    name: string
    query: IQuestionObjectQuery[]
    root: boolean
}

interface IParameter {
    deep: number
    possibleQuery: Array<{
        questionId: number
        objectName: string
        type: string
        next: number
    }>
    params: string[]
}

export default class QuestionParser {
    private questionId: number;
    private objectId: number;
    private readonly objects: IQuestionObject[];

    constructor() {
        this.questionId = 0;
        this.objectId = 0;
        this.objects = [];

        this.getObject("/finish/");
    }

    public start(): QuestionParserObject {
        this.questionId = this.questionId + 1;

        return new QuestionParserObject(this, this.questionId);
    }

    public whatsNext(question?: string): Array<{name: string, type?: string[]}>|undefined {
        if (question !== undefined && question !== "") {
            const questionObject = question.split(" ");

            let possibleNext: IQuestionObjectQuery[] = [];
            const parsedParameter:IParameter[] = [];

            let deep = -1;
            for (let idx = 0; idx < questionObject.length; idx++) {
                const name = questionObject[idx];

                const object = _.find(this.objects, {name});
                if (object === undefined) {
                    let lastParsed = _.find(parsedParameter, { deep });
                    if (lastParsed === undefined) {
                        const newDeep = deep + 1;
                        lastParsed = {
                            deep: newDeep,
                            possibleQuery: [],
                            params: [],
                        };
                        parsedParameter.push(lastParsed);

                        // find next object from last object
                        const nextObject = this.objects.filter(o => (
                            _.findIndex(possibleNext, {next: o.objectId}) !== -1
                        )).filter(o => {
                            return o.query.filter(q => (
                                _.findIndex(possibleNext, {questionId: q.questionId}) !== -1 &&
                                q.deep === newDeep
                            )).length !== -1;
                        });

                        // parse possible object from next object
                        let newPossibleNext: IQuestionObjectQuery[] = [];
                        nextObject.forEach(no => {
                            newPossibleNext = [].concat(newPossibleNext, no.query.filter(o => {
                                const inc = (_.findIndex(possibleNext, {questionId: o.questionId}) !== -1 &&
                                    o.deep === newDeep &&
                                    o.type !== '/string/'
                                );
                                if (inc) {
                                    lastParsed.possibleQuery.push({
                                        questionId: o.questionId,
                                        objectName: no.name,
                                        type: o.type,
                                        next: o.next,
                                    })
                                }
                                return inc;
                            }));
                        });

                        possibleNext = newPossibleNext;
                        deep = newDeep;
                    }
                    lastParsed.params.push(name);
                } else {
                    deep = deep + 1;
                    if (possibleNext.length === 0) {
                        possibleNext = object.query;
                    } else {
                        possibleNext = object.query.filter(o => (
                            _.findIndex(possibleNext, {questionId: o.questionId}) !== -1 &&
                            o.deep === deep
                        ));
                    }
                }
            }

            if (possibleNext.length !== 0) {
                return this.objects.filter(o => (
                    _.findIndex(possibleNext, {next: o.objectId}) !== -1
                )).map(o => ({
                    name: o.name,
                    type: _.uniq(o.query.filter(q =>
                        (_.findIndex(possibleNext, {questionId: q.questionId}) !== -1 && q.deep === deep+1)
                    ).map(q => q.type)),
                }))
            } else {
                return undefined;
            }
        } else {
            return this.objects.filter(o => o.root).map(o => ({ name: o.name, type: _.uniq(o.query.map(q => q.type)), }))
        }
    }
    public parse(question: string): any {
        if (question !== undefined && question !== "") {
            const questionObject = question.split(" ");

            let possibleNext: IQuestionObjectQuery[] = [];
            const parsedParameter:IParameter[] = [];

            let deep = -1;
            for (let idx = 0; idx < questionObject.length; idx++) {
                const name = questionObject[idx];

                const object = _.find(this.objects, {name});
                if (object === undefined) {
                    let lastParsed = _.find(parsedParameter, { deep });
                    if (lastParsed === undefined) {
                        const newDeep = deep + 1;
                        lastParsed = {
                            deep: newDeep,
                            possibleQuery: [],
                            params: [],
                        };
                        parsedParameter.push(lastParsed);

                        // find next object from last object
                        const nextObject = this.objects.filter(o => (
                            _.findIndex(possibleNext, {next: o.objectId}) !== -1
                        )).filter(o => {
                            return o.query.filter(q => (
                                _.findIndex(possibleNext, {questionId: q.questionId}) !== -1 &&
                                q.deep === newDeep
                            )).length !== -1;
                        });

                        // parse possible object from next object
                        let newPossibleNext: IQuestionObjectQuery[] = [];
                        nextObject.forEach(no => {
                            newPossibleNext = [].concat(newPossibleNext, no.query.filter(o => {
                                const inc = (_.findIndex(possibleNext, {questionId: o.questionId}) !== -1 &&
                                    o.deep === newDeep &&
                                    o.type !== '/string/'
                                );
                                if (inc) {
                                    lastParsed.possibleQuery.push({
                                        questionId: o.questionId,
                                        objectName: no.name,
                                        type: o.type,
                                        next: o.next,
                                    })
                                }
                                return inc;
                            }));
                        });

                        possibleNext = newPossibleNext;
                        deep = newDeep;
                    }
                    lastParsed.params.push(name);
                } else {
                    deep = deep + 1;
                    if (possibleNext.length === 0) {
                        possibleNext = object.query;
                    } else {
                        possibleNext = object.query.filter(o => (
                            _.findIndex(possibleNext, {questionId: o.questionId}) !== -1 &&
                            o.deep === deep
                        ));
                    }
                }
            }

            if (possibleNext.length !== 0) {
                for (let idx = 0; idx < possibleNext.length; idx++) {
                    const pn = possibleNext[idx];
                    const parsed = this.objects.filter(o => o.objectId === pn.next);
                    if (parsed.length === 1) {
                        if (parsed[0].name === "/finish/") {
                            const param: any = {};
                            parsedParameter.forEach(pp => {
                                const name: string = pp.possibleQuery.filter(pq => pq.questionId === pn.questionId)[0].objectName;
                                param[name] = pp.params;
                            });
                            return pn.query(param);
                        }
                    }
                }
                return undefined;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    };

    public getObject(name: string): IQuestionObject {
        let object = _.find(this.objects, { name });
        if (object === undefined) {
            this.objectId = this.objectId + 1;
            object = {
                objectId: this.objectId,
                name,
                query: [],
                root: false,
            };
            this.objects.push(object);
        }
        return object;
    }
    public getAllObject(): IQuestionObject[] {
        return this.objects;
    }
}
class QuestionParserObject {
    private readonly main: QuestionParser;
    private readonly questionID: number;
    private root: IQuestionObject;
    private queryOfCurrent: IQuestionObjectQuery;
    private deep: number;

    private question: string[];

    constructor(main: QuestionParser, questionID: number) {
        this.main = main;
        this.questionID = questionID;
        this.root = undefined;
        this.deep = -1;

        this.question = [];
    }

    public object(name: string, type?: string): QuestionParserObject {
        if (type) {
            this.question.push("?"+name);
        } else {
            this.question.push(name);
        }

        this.deep = this.deep + 1;

        const object = this.main.getObject(name);
        const queryOfCurrent = {
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
    }

    public build(query: (params: any) => { sparql: string, reason: string[] }): void {
        this.queryOfCurrent.next = this.main.getObject("/finish/").objectId;
        this.queryOfCurrent.query = query;

        console.log("question:", this.question.join(" "));
    }
}