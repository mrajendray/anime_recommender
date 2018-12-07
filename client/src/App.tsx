import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as colors from "@material-ui/core/colors";
import Divider from '@material-ui/core/Divider';
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import * as React from "react";
import Utils from "./Utils";
const Parser = require("html-react-parser");

import "./main.css";

const apiEndPoint = "http://localhost:8080/";

class Questioner extends React.Component {
    public state = {
        question: "",
        fQuestion: [],

        questionRef: undefined,
        showSuggestion: false,
        suggestion: [],
        canGetResult: false,

        resultedQuestion: "",
        fetchResult: false,
        resulted: false,
        result: [],
        resultReason: [],

        loadedImg: [],
        newImage: [],
    };

    public render() {
        const { question, fQuestion, suggestion, showSuggestion } = this.state;

        let questionValue = fQuestion.join(" ").replace(/\~/g, " ");
        questionValue = (fQuestion.length === 0) ? question : questionValue + " " + question;

        const filteredSuggestion = suggestion.filter((s: any) => {
            let valid = (s.name.indexOf(question) !== -1);
            if(s.data) {
                Object.keys(s.data).forEach((ss: string) => {
                    s.data[ss].forEach((dataKey: string) => {
                        valid = valid || (dataKey.toLowerCase().indexOf(question.toLowerCase()) !== -1);
                    });
                });
            }
            return valid && (s.name !== "/finish/");
        });

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                <ClickAwayListener onClickAway={this.handleQuestionClickAway}>
                    <TextField
                        id="outlined-question"
                        label="Question"
                        variant="outlined"
                        margin="normal"
                        style={{ width: "100%", }}
                        value={questionValue}
                        onChange={this.handleQuestionChange}
                        onFocus={this.handleQuestionFocus}
                        onKeyDown={this.handleQuestionKeyDown}
                        disabled={this.state.fetchResult}
                        error={
                            (question !== "" && suggestion.length === 0) ||
                            (question !== "" && suggestion.length !== 0 && filteredSuggestion.length === 0)
                        }
                    />
                    <Popper
                        open={showSuggestion && filteredSuggestion.length !== 0}
                        placement="bottom-start"
                        anchorEl={this.state.questionRef}
                    >
                        <Paper>
                            <MenuList>
                                {filteredSuggestion.map((s: any) => {
                                    return s.type.map((ss: string) => {
                                        const returnList: any[] = [];

                                        if (ss === "/string/" && s.name.indexOf(question) !== -1) {
                                            returnList.push(<MenuItem
                                                key={s.name}
                                                onClick={this.handleSuggestionItemClick(s.name)}
                                            >
                                                <ListItemText
                                                    primary={<>{s.name} <span style={{fontSize: "0.85rem", color: "rgba(0, 0, 0, 0.5)"}}>is { ss }</span></>}
                                                />
                                            </MenuItem>)
                                        }

                                        if (ss !== "/string/") {
                                            returnList.push(<MenuItem
                                                key={s.name}
                                                onClick={this.handleSuggestionItemClick(s.name)}
                                                disabled={true}
                                            >
                                                <ListItemText
                                                    primary={<>{s.name} <span style={{fontSize: "0.85rem", color: "rgba(0, 0, 0, 0.5)"}}>is { ss }</span></>}
                                                />
                                            </MenuItem>);
                                            if (s.data) {
                                                s.data[ss].forEach((d: string) => {
                                                    if (d.toLowerCase().indexOf(question.toLowerCase()) !== -1) {
                                                        returnList.push(
                                                            <MenuItem
                                                                key={s.name + d}
                                                                onClick={this.handleSuggestionItemClick(d)}
                                                            >
                                                                <ListItemText
                                                                    primary={<>{d.replace(/\~/g, " ")} <span style={{
                                                                        fontSize: "0.65rem",
                                                                        color: "rgba(0, 0, 0, 0.5)"
                                                                    }}>is {ss}</span></>}
                                                                />
                                                            </MenuItem>
                                                        )
                                                    }
                                                });
                                            }
                                        }

                                        return returnList;
                                    });
                                })}
                            </MenuList>
                        </Paper>
                    </Popper>
                </ClickAwayListener>
                <Button
                    variant="outlined"
                    disabled={!this.state.canGetResult}
                    onClick={this.handleGetResult}
                    style={{
                        opacity: (this.state.fetchResult) ? 0.4 : 1,
                    }}
                >
                    Get Result
                </Button>
                <CircularProgress
                    size={20}
                    style={{
                        alignSelf: "center",
                        marginTop: -28,
                        display: (this.state.fetchResult) ? "block" : "none",
                        color: colors.teal[300]
                    }}
                />
                {(this.state.resulted) &&
                    <Paper style={{marginTop: 25}}>
                        <div style={{padding: 15}}>
                            <Typography variant="subtitle2" style={{color: colors.teal[300]}}>Input :</Typography>
                            <Typography
                                variant="body2"
                                style={{marginTop: 10, marginLeft: 18, color: "rgba(0, 0, 0, .6)"}}
                            >
                                { this.state.resultedQuestion }
                            </Typography>
                        </div>
                        <Divider/>
                        <div style={{padding: 15}}>
                            <Typography variant="subtitle2" style={{color: colors.teal[300]}}>Result :</Typography>
                            <div style={{ marginTop: 10, marginLeft: 8 }}>
                                { this.result() }
                            </div>
                        </div>
                    </Paper>
                }
            </div>
        )
    };

    private result = () => {
        const result = this.state.result;
        const render: any[] = [];

        for (let idx = 0; idx < result.length; idx++) {
            render.push(
                // @ts-ignore
                <div className="result" style={{ paddingTop: 10, paddingLeft: 10 }} onClick={this.resultClick(result[idx].link)} >
                    { this.resultDetail(result[idx]) }
                    {( idx !== result.length-1 ) && <Divider/> }
                </div>
            )
        }

        if (render.length !== 0) {
            return render;
        } else {
            return <Typography variant="subtitle1" > Not found any result </Typography>
        }
    };
    private resultDetail = (result: any) => {
        return (
            <div style={{ display: "flex", flexDirection: "row", paddingBottom: 10 }}>
                <img
                    onError={this.imgError(result.title)}
                    onLoad={this.imgLoad(result.title)}
                    width={80}
                    height={120}
                    src={result.image}
                    // @ts-ignore
                    style={{ opacity: (this.state.loadedImg.indexOf(result.title) !== -1)  ? 1 : 0  }}
                    alt={result.title+" image"}
                />
                <CircularProgress
                    size={20}
                    style={{
                        position: "absolute",
                        alignSelf: "center",
                        marginLeft: 30,
                        // @ts-ignore
                        display: (this.state.loadedImg.indexOf(result.title) === -1) ? "block" : "none",
                        color: colors.teal[300]
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column", marginLeft: 15, width: "calc(100% - 80px)" }}>
                    <Typography variant="subtitle1" style={{ marginTop: 6, marginBottom: 1, }}>{ result.title }</Typography>
                    {this.state.resultReason.map(reason => (
                        <Typography variant="body1">
                            { Utils.capitalizeFirstLetter(reason).replace(/__/g, " ") } : { Parser(Utils.sortUnique(result[reason]).join(", ")) }
                        </Typography>
                    ))}
                </div>
            </div>
        )
    };
    private resultClick = (link: string) => {
        return () => {
            window.open(link, "_blank")
        }
    };

    private imgError = (title: string) => {
        return () => {
            let resultObject: any = this.state.result.filter((result: any) => result.title === title );
            if (resultObject.length === 1) {
                resultObject = resultObject[0];

                const img = resultObject.image.split("/");
                if (img[img.length - 2] === "large") {
                    img[img.length - 2] = "medium"
                } else if (img[img.length - 2] === "medium") {
                    img[img.length - 2] = "small"
                }

                this.setState((state: any) => ({
                    result: state.result.map((result: any) => {
                        if (result.title === title) {
                            return {
                                ...result,
                                image: img.join("/"),
                            }
                        } else {
                            return result;
                        }
                    })
                }))
            }
        }
    };
    private imgLoad = (title: string) => {
        return () => {
            setTimeout(() => this.setState((state: any) => ({
                // @ts-ignore
                loadedImg: [].concat(state.loadedImg, [ title ])
            })))
        }
    };

    private handleSuggestionItemClick = (name: string) => {
        return () => {
            this.setState((state: any) => {
                return {
                    fQuestion: [...state.fQuestion, name],
                    question: ""
                }
            });
            setTimeout(() => this.updateSuggestion());
        }
    };

    private updateSuggestion = async (value?: string) => {
        try {
            // get whats next
            const data = await Axios.get(`${apiEndPoint}whatsnext`, {
                params: { q: this.state.fQuestion.join(" "), }
            });
            // update suggestion
            this.setState({
                suggestion: data.data.next
            });

            let canGetResult = false;
            // check if each suggestion is parameter
            data.data.next.forEach((d: any) => {
                if (d.name === "/finish/") { canGetResult = true; }
                // loop each type of object
                d.type.forEach(async (dd: string) => {
                    // if parameter exist then search
                    if (dd !== "/string/") {
                        // get suggestion data
                        const dataT = await Axios.get(`${apiEndPoint}whatsnext/data`, {
                            params: { t: dd, q: value }
                        });
                        // update suggestion data
                        setTimeout(() => {
                            this.setState((state: any) => ({
                                suggestion: state.suggestion.map((suggest: any) => {
                                    if (suggest.name === d.name) {
                                        return {
                                            ...suggest,
                                            data: {
                                                ...state.suggestion.data,
                                                [dd]: dataT.data.map((da: string) => da.replace(/ /g, "~")),
                                            },
                                        }
                                    } else {
                                        return suggest;
                                    }
                                })
                            }))
                        });
                    }
                })
            });
            setTimeout(() => this.setState({ canGetResult }));
        } catch (e) {
            console.log("ERROR::question::request whatsnext", e);
        }
    };
    private getResult = async () => {
        if (!this.state.canGetResult) { return }

        let resultedQuestion = "";
        this.setState((state: any) => {
            resultedQuestion = state.fQuestion.join(" ");
            return { fetchResult: true };
        });
        try {
            // await new Promise(res => setTimeout(() => res(), 3000 ));
            const rawResultData = (await Axios.get(`${apiEndPoint}query`, {
                params: { q: resultedQuestion }
            })).data;

            const result: any[] = [];
            if (rawResultData.result.length !== 0) {
                rawResultData.result.forEach((newData: any) => {
                    const exist = result.filter(data => data.title === newData.title.value);
                    if (exist.length === 1) {
                        rawResultData.reason.forEach((reason: string) => {
                            if (reason !== "/nosorting/") {
                                exist[0][reason].push(newData[reason].value);
                            }
                        });
                    } else {
                        const newResult = {
                            title: newData.title.value,
                            image: newData.image.value,
                            link: newData.link.value,
                        };
                        rawResultData.reason.forEach((reason: string) => {
                            if (reason !== "/nosorting/") {
                                newResult[reason] = [newData[reason].value]
                            }
                        });
                        result.push(newResult);
                    }
                });
            }

            const noSorting = rawResultData.reason.indexOf("/nosorting/");
            if (noSorting === -1) {
                rawResultData.reason.forEach((reason: string) => {
                    result.sort((a, b) => b[reason].length - a[reason].length);
                });
            } else {
                rawResultData.reason.splice(noSorting, 1);
            }

            this.setState({ resulted: true, result: result.slice(0, 25), resultReason: rawResultData.reason, loadedImg: [] });
        } catch (e) {
            alert("Failed collecting result!");
            console.log(e);
        }
        this.setState({ fetchResult: false, resultedQuestion: resultedQuestion.replace(/~/g, " ") });
    };

    private handleQuestionFocus = async (e: React.MouseEvent<HTMLInputElement>) => {
        this.setState({ showSuggestion: true, questionRef: e.currentTarget, });
        this.updateSuggestion(this.state.question);
    };
    private handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.currentTarget.value;

        // check delete all string
        if (value === "") {
            this.setState({
                fQuestion: [],
                question: ""
            });
            setTimeout(()=>this.updateSuggestion());
            return;
        }

        // check backspace deleting fquestion
        if (this.state.fQuestion.length !== 0) {
            const finQuestion = this.state.fQuestion.map((da: string) => da.replace(/~/g, " ")).join(" ") + " ";
            // check if not deleting, then get pure user input
            if (value.indexOf(finQuestion) !== -1) {
                value = value.replace(finQuestion, "");
            } else {
                // bacspace deleting last question input
                this.setState(({ fQuestion }: any) => ({
                    fQuestion: fQuestion.slice(0, -1),
                    question: ""
                }));
                setTimeout(()=>this.updateSuggestion());
                return;
            }
        }

        // check space or , command
        if (value[value.length - 1] === " ") {
            const command = (value[value.length - 1] === " ") ? " " : ",";
            value = value.replace(" ", "");

            // deep check on name or data (type) suggestion
            const filteredSuggestion: any = this.state.suggestion.filter((s: any) => {
                let valid = (s.name.indexOf(this.state.question) !== -1);
                if(s.data) {
                    Object.keys(s.data).forEach((ss: string) => {
                        s.data[ss].forEach((dataKey: string) => {
                            valid = valid || (dataKey.toLowerCase().indexOf(this.state.question.toLowerCase()) !== -1);
                        });
                    });
                }
                return valid;
            });

            // if exist
            if (filteredSuggestion.length === 1) {
                let name = filteredSuggestion[0].name;
                if (name !== this.state.question && filteredSuggestion[0].data) {
                    Object.keys(filteredSuggestion[0].data).forEach((ss: string) => {
                        filteredSuggestion[0].data[ss].forEach((dataKey: string) => {
                            name = (dataKey.toLowerCase().indexOf(this.state.question.toLowerCase()) !== -1) ? dataKey : name;
                        });
                    });
                }

                if (name === "/finish/") {
                    setTimeout(() => this.getResult());
                    return;
                } else {
                    this.setState((state: any) => {
                        return {
                            fQuestion: [...state.fQuestion, name],
                            question: "",
                            suggestion: (command === " ") ? [] : state.suggestion
                        }
                    });
                    setTimeout(() => this.updateSuggestion());
                    return;
                }
            }
        }

        // if suggestion is object with parameter (input) then update suggestion based on user typed
        if (this.state.suggestion.filter((d: any) =>
            d.type.filter((dd: string) => (dd !== "/string/")).length !== 0
        ).length !== 0) {
            setTimeout(()=>this.updateSuggestion(value));
        }

        // normal input
        this.setState({
            question: value,
        })
    };
    private handleQuestionClickAway = () => {
        setTimeout(() => { this.setState({ showSuggestion: false, }); });
    };
    private handleQuestionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // key enter
        if (e.keyCode === 13) {
            setTimeout(() => this.getResult());
        }
    };

    private handleGetResult = () => {
        setTimeout(() => this.getResult());
    }
}

export default Questioner;