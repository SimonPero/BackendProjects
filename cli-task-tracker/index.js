import Task from "./Task.model.js"
const taskLogic = new Task()
const args = process.argv.splice(2)
const command = args[0]
const id = args[1]

switch (command) {
  case "add":
    const task = args[1]
    taskLogic.add(task)
    break;
  case "update":
    const newTask = args[2]
    taskLogic.update(id, newTask)

    break;
  case "delete":
    taskLogic.delete(id)

    break;
  case "mark-in-progress":
    const inProgress = args[1]
    taskLogic.changeStatus(id, inProgress)

    break;

  case "mark-done":
    const done = args[1]
    taskLogic.changeStatus(id, done)

    break;
  case "list":
    const type = args[1]
    if (!type) {
      console.log(await taskLogic.list())
    } else {
      console.log(await taskLogic.list(type))
    }

    break;
  case "help":
    console.log("Usage: node index.js <command> [arguments]");
    console.log("\nAvailable commands:");
    console.log("  add <task>                              Add a new task");
    console.log("  update <task_id> <task>                 Update an existing task");
    console.log("  delete <task_id>                        Delete a task");
    console.log("  mark-in-progress <task_id>              Mark a task as in-progress");
    console.log("  mark-done <task_id>                     Mark a task as completed");
    console.log("  list <list-type>(done,in-progress,todo)      List of tasks ");
    break;
  default:
    console.log("that command is not recognized try using node index.js help")
    break;
}