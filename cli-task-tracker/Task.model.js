import fs from "node:fs/promises"

export default class Task {
    static directory = `data/`
    constructor(id, description, taskStatus, createdAt) {
        this.id = id,
            this.description = description,
            this.taskStatus = taskStatus,
            this.createdAt = createdAt
    }
    async updateFile(taskModified) {
        let list = await this.list(taskModified.taskStatus)
        let newList = list.filter((task) => task.id !== taskModified.id)
        await fs.writeFile(Task.directory + `${taskModified.taskStatus}.json`, JSON.stringify(newList));
    }
    async add(task) {
        const date = new Date();
        const id = Math.floor(Math.random() * 9000000000) + 1000000000;
        const addedTask = new Task(id, task, "todo",  date.toISOString())

        let todoList = await this.list("todo");
        if (todoList.isArray()) {
            todoList.push(addedTask)
            await fs.writeFile(Task.directory + "todo.json", JSON.stringify(todoList));
        } else {
            const todoList = [addedTask]
            await fs.mkdir(Task.directory, { recursive: true });
            await fs.writeFile(Task.directory + "todo.json", JSON.stringify(todoList));
        }
    }
    async update(id, newTask) {
        const checkId = parseInt(id)

        let todoList = await this.list("todo")
        let updatedTask;
        if (todoList.length === 0) {
            return console.log("No todo tasks found.");
        }

        todoList.forEach((task) => {
            if (task.id === checkId) {
                updatedTask = task
                task.description = newTask
            }
        })

        if (typeof updatedTask === "undefined") {
            return console.log(`Task with ID ${checkId} not found.`);
        }

        await fs.writeFile(Task.directory + "todo.json", JSON.stringify(todoList));
    }
    async delete(id) {
        const checkId = parseInt(id)
        let allTaskList = await this.list()

        if (allTaskList.length === 0) {
            return console.log("No tasks found.");
        }

        let deletedTask;
        allTaskList.forEach((task) => {
            if (task.id === checkId) {
                deletedTask = task
            }
        })

        if (typeof deletedTask === "undefined") {
            return console.log(`Task with ID ${checkId} not found.`);
        }

        await this.updateFile(deletedTask)
    }
    async changeStatus(id, typeChange) {
        const checkId = parseInt(id)
        let allTaskList = await this.list()
        if (allTaskList.length === 0) {
            return console.log("No tasks found.");
        }
        let doneList = []
        let modifiedTask;

        allTaskList.forEach((task) => {
            if (task.id === checkId) {
                if (task.taskStatus === typeChange) {
                    return console.log(`Task(id:${checkId}) is already marked as done.`)
                }
                modifiedTask = { ...task }
                task.taskStatus = typeChange
                doneList.push(task)
            }
        })

        if (!modifiedTask) {
            return console.log(`Task with ID ${checkId} not found.`);
        }

        await this.updateFile(modifiedTask);
        await fs.writeFile(Task.directory + "done.json", JSON.stringify(doneList));
    }

    async list(type) {
        switch (type) {
            case "done":
                try {
                    const donePath = Task.directory + "done.json";
                    await fs.access(donePath);
                    const list = JSON.parse(await fs.readFile(donePath, 'utf8'));
                    return list;
                } catch (error) {
                    return "could not find any done task. Try marking a task done";
                }
            case "in-progress":
                try {
                    const inProgressPath = Task.directory + "in-progress.json";
                    await fs.access(inProgressPath);
                    const list = JSON.parse(await fs.readFile(inProgressPath, 'utf8'));
                    return list;
                } catch (error) {
                    return "could not find any in-progress task. Try marking a task in-progress";
                }
            case "todo":
                try {
                    const todoPath = Task.directory + "todo.json";
                    await fs.access(todoPath);
                    const list = JSON.parse(await fs.readFile(todoPath, 'utf8'));
                    return list;
                } catch (error) {
                    return "could not find any todo task. Try using node index.js add <task> to create a task";
                }
            default:
                try {
                    const files = await fs.readdir(Task.directory);
                    let allTaskList = [];
                    for (const file of files) {
                        let list = JSON.parse(await fs.readFile(Task.directory + file, 'utf8'));
                        list.forEach((task) => {
                            allTaskList.push(task);
                        });
                    }
                    return allTaskList;
                } catch (error) {
                    return "could not find " + Task.directory + ". Try using node index.js add <task> to create a task";
                }
        }
    }
}