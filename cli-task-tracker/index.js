const args = process.argv.splice(2)
const command = args[0]
const task = args[1]

switch (command) {
  case "add":
    console.log("add")
    break;
  case "update":
    console.log("update")

    break;
  case "delete":
    console.log("delete")

    break;
  case "mark-in-progress":
    console.log("progress")

    break;

  case "mark-done":
    console.log("markdone")

    break;
  case "list":
    console.log("list")

    break;
    case "help":
    console.log("node index.js list")
    console.log("node index.js markdone")
    console.log("node index.js delete")
    console.log("node index.js progress")
    console.log("node index.js update")
    console.log("node index.js update")
    console.log("node index.js add")
    break;
  default:
    console.log("that command is not recognized try using node index.js help")
    break;
}