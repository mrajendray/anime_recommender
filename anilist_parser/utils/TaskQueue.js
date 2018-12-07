"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskQueue = /** @class */ (function () {
    function TaskQueue() {
    }
    TaskQueue.makeTaskList = function (type, waiter, limit) {
        return {
            type: type,
            limit: limit,
            running: 0,
            taskList: [],
            waiter: waiter,
        };
    };
    TaskQueue.doTask = function (taskList, taskFunc) {
        return new Promise(function (taskResolver, taskRejector) {
            taskList.taskList.push({
                taskFunc: taskFunc, taskResolver: taskResolver, taskRejector: taskRejector,
            });
            TaskQueue.nextTask(taskList);
        });
    };
    TaskQueue.pauseTask = function (taskList) {
        if (taskList.waiter !== undefined) {
            taskList.waiter = true;
        }
        else {
            throw Error("TaskList is not free task queue");
        }
    };
    TaskQueue.startTask = function (taskList) {
        if (taskList.waiter !== undefined) {
            taskList.waiter = false;
            TaskQueue.nextTask(taskList);
        }
        else {
            throw Error("TaskList is not free task queue");
        }
    };
    TaskQueue.nextTask = function (taskList) {
        if (taskList.waiter !== undefined && taskList.waiter === true) {
            return;
        }
        if ((taskList.limit !== undefined && taskList.running >= taskList.limit) ||
            taskList.taskList.length === 0) {
            return;
        }
        taskList.running = taskList.running + 1;
        var taskNow = (taskList.type === "queue") ? taskList.taskList.shift() : taskList.taskList.pop();
        taskNow.taskFunc(function (res) { return TaskQueue.taskResolver(taskList, taskNow.taskResolver, res); }, function (res) { return TaskQueue.taskResolver(taskList, taskNow.taskRejector, res); });
        this.nextTask(taskList);
    };
    TaskQueue.taskResolver = function (taskList, resolver, result) {
        taskList.running = taskList.running - 1;
        TaskQueue.nextTask(taskList);
        resolver(result);
        return true;
    };
    return TaskQueue;
}());
exports.default = TaskQueue;
//# sourceMappingURL=TaskQueue.js.map