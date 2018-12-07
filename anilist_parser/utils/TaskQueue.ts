interface ITaskList {
    type: "queue"|"stack",
    limit?: number,
    running: number,
    taskList: ITaskEntity[],
    waiter?: boolean,
}
interface ITaskEntity {
    taskFunc: ITaskFunc,
    taskResolver: () => void,
    taskRejector: () => void,
}
type ITaskFunc = ( taskResolver: ( res?: any ) => boolean, taskRejector: ( res?: any ) => boolean ) => Promise<boolean>|boolean;
export default class TaskQueue {
    public static makeTaskList(type: "queue"|"stack", waiter?: boolean, limit?: number): ITaskList {
    return {
        type,
        limit,
        running: 0,
        taskList: [],
        waiter,
    }
}
    public static doTask(taskList: ITaskList, taskFunc: ITaskFunc): Promise<any> {
        return new Promise((taskResolver, taskRejector) => {
            taskList.taskList.push({
                taskFunc, taskResolver, taskRejector,
            });
            TaskQueue.nextTask(taskList);
        });
    }
    public static pauseTask(taskList: ITaskList) {
        if (taskList.waiter !== undefined) {
            taskList.waiter = true;
        } else {
            throw Error("TaskList is not free task queue");
        }
    }
    public static startTask(taskList: ITaskList) {
        if (taskList.waiter !== undefined) {
            taskList.waiter = false;
            TaskQueue.nextTask(taskList);
        } else {
            throw Error("TaskList is not free task queue");
        }
    }

    private static nextTask(taskList: ITaskList) {
        if (taskList.waiter !== undefined && taskList.waiter === true) {
            return;
        }
        if (
            (taskList.limit !== undefined && taskList.running >= taskList.limit) ||
            taskList.taskList.length === 0
        ) {
            return;
        }

        taskList.running = taskList.running + 1;
        const taskNow =  (taskList.type === "queue") ? taskList.taskList.shift() : taskList.taskList.pop();

        taskNow.taskFunc(
            res => TaskQueue.taskResolver(taskList, taskNow.taskResolver, res),
            res => TaskQueue.taskResolver(taskList, taskNow.taskRejector, res)
        );

        this.nextTask(taskList);
    }
    private static taskResolver = ( taskList: ITaskList, resolver: (result: any) => void, result: any) => {
        taskList.running = taskList.running - 1;
        TaskQueue.nextTask(taskList);
        resolver(result);
        return true;
    }
}