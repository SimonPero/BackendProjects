
function printHelp() {
    console.log("Usage: node index.js <command> [arguments]");
    console.log("\nAvailable commands:");
    console.log("  add --description <activity> --amount <cost> --category <category>                    Add a new task");
    console.log("  update <task_id> --description <activity> --amount <cost> --category <category>       Update an existing task");
    console.log("  delete <task_id>                                                                      Delete a task");
    console.log("  list [--category <category>] [--month <number>]                                       View complete list of expenses");
    console.log("  summary [--category <category>] [--month <number>]                                    View a summary of expenses");
    console.log("  create-category <newcategory>                                                         Create a new category of your own");
    console.log("  delete-category <category                                                             Delete a category by its name");
    console.log("  view-categories                                                                       View all the categories that exist");
    console.log("  set-budget <amount>                                                                   Set a budget for the current month");
    console.log("  export-expenses [--month <number>]                                                    Export a file of the expenses");
}
let commandTypes = ["add", "update", "delete", "list", "summary",]
async function main() {
    const args = process.argv.splice(2)
    let command = args[0]

    if (command === 'help') {
        printHelp();
        return;
    }

    switch (command) {
        case "add":
            console.log("wasaaaaaaa 1")
            break;
        case "update":
            console.log("wasaaaaaaa 2")
            break;
        case "delete":
            console.log("wasaaaaaaa 3")
            break;
        case "list":
            console.log("wasaaaaaaa 4")
            break;
        case "summary":
            console.log("wasaaaaaaa 5")
            break;
        case "create-category":
            console.log("wasaaaaaaa 6")
            break;
        case "delete-category":
            console.log("wasaaaaaaa 7")
            break;
        case "view-categories":
            console.log("wasaaaaaaa 8")
            break;
        case "set-budget":
            console.log("wasaaaaaaa 9")
            break;
        case "export-expenses":
            console.log("wasaaaaaaa 10")
            break;
        case "help":
            printHelp();
            break;

        default:
            printHelp();
            break;
    }
}

main().catch(error => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
});