import Categories from "./Categories.model.js";
import ExpenseTrackerLogic from "./ExpenseTracker.model.js";
import FileManager from "./FileManager.js";
const expenseTrackerLogic = new ExpenseTrackerLogic()
const fileManager = new FileManager()
const categoryLogic = new Categories()
function printHelp() {
    console.log("Usage: node index.js <command> [arguments]");
    console.log("\nAvailable commands:");
    console.log("  add --description <string> --amount <cost> [--category <category>]                          Add a new task");
    console.log("  update --id <task_id> [--description <activity>] [--amount <cost>] [--category <category>]  Update an existing task");
    console.log("  delete --id <task_id>                                                                       Delete a task");
    console.log("  list [--category <category>] [--month <number>]                                             View complete list of expenses");
    console.log("  summary [--category <category>] [--month <number>]                                          View a summary of expenses");
    console.log("  create-category <newcategory>                                                               Create a new category of your own");
    console.log("  delete-category <category                                                                   Delete a category by its name");
    console.log("  view-categories                                                                             View all the categories that exist");
    console.log("  set-budget --month <number> --amount <cost>                                                 Set a budget for the current month");
    console.log("  export-expenses [--month <number>]                                                          Export a file of the expenses");
}

function parseArgs(args) {
    const result = {
        command: args[0],
        options: {}
    };

    for (let i = 1; i < args.length; i += 2) {
        const key = args[i].replace(/^--/, '');
        const value = args[i + 1];

        if (key && value && !value.startsWith('--')) {
            result.options[key] = value;
        } else {
            console.error(`Invalid argument pair: ${args[i]} ${args[i + 1]}`);
            i -= 1;
        }
    }

    return result;
}

async function main() {
    const args = process.argv.splice(2)
    const expensesFileName = "expenses"
    const categoriesFileName = "categories"
    const monthsFileName = "months"

    let parsedArgs = parseArgs(args)

    if (parsedArgs.command === 'help') {
        printHelp();
        return;
    }
    let data = await fileManager.readFile(expensesFileName);
    let categories = await fileManager.readFile(categoriesFileName);
    let monthsData = await fileManager.readFile(monthsFileName);

    switch (parsedArgs.command) {
        case "add":
            try {
                if (!Array.isArray(data)) {
                    data = [];
                }

                const { description, amount, category } = parsedArgs.options;

                if (!description || !amount) {
                    throw new Error("Description and amount are required");
                }

                if (amount < 0) {
                    throw new Error("Amount cannot be negative");
                }

                const newExpense = await expenseTrackerLogic.addExpense(description, parseFloat(amount), category || null, monthsData);
                data.push(newExpense.expense);
                console.log(newExpense.mData)
                await fileManager.writeFile(expensesFileName, data);
                await fileManager.writeFile(monthsFileName, newExpense.mData);
            } catch (error) {
                console.error("Error adding expense:", error.message);
            }
            break;
        case "update":
            try {
                if (!Array.isArray(data)) {
                    throw new Error("Try using the command add to create your first expense");
                }

                const { id, description, amount, category } = parsedArgs.options;

                if (!id) {
                    throw new Error("Expense id is required for updating.");
                }
                if (amount < 0) {
                    throw new Error("Amount cannot be negative");
                }
                data = expenseTrackerLogic.updateExpense(data, id, { category, amount: amount ? parseFloat(amount) : undefined, description }, monthsData)
                await fileManager.writeFile(expensesFileName, data.expenseData)
                await fileManager.writeFile(monthsFileName, data.monthsData)
            } catch (error) {
                console.error("Error updating expense:", error.message);
            }
            break;
        case "delete":
            try {
                const { id } = parsedArgs.options
                data = expenseTrackerLogic.deleteExpense(data, id, monthsData)
                await fileManager.writeFile(expensesFileName, data.expenseData)
                await fileManager.writeFile(monthsFileName, data.monthsData)
            } catch (error) {
                console.error("Error deleting expense:", error.message);
            }
            break;
        case "list":
            try {
                const { category, month } = parsedArgs.options
                expenseTrackerLogic.viewList(data, { category, month })
            } catch (error) {
                console.error("Error viewing the list of expenses:", error.message);
            }
            break;
        case "summary":
            try {
                const { category, month } = parsedArgs.options
                expenseTrackerLogic.viewSummary(data, { category, month })
            } catch (error) {
                console.error("Error viewing the summary of expenses:", error.message);
            }
            break;
        case "create-category":
            try {
                if (!Array.isArray(categories)) {
                    categories = [];
                }
                const { category } = parsedArgs.options
                if (!category) {
                    throw new Error("Category is required");
                }
                const res = categoryLogic.createCategory(categories, category)
                categories.push(res)
                fileManager.writeFile(categoriesFileName, categories)
                console.log("The category has been added")
            } catch (error) {
                console.error("Error creating a category:", error.message);
            }
            break;
        case "delete-category":
            try {
                const { category } = parsedArgs.options
                if (!category) {
                    throw new Error("Category is required");
                }
                categories = categoryLogic.deleteCategory(categories, category)
                fileManager.writeFile(categoriesFileName, categories)
            } catch (error) {
                console.error("Error deleting a category:", error.message);
            }
            break;
        case "view-categories":
            categoryLogic.viewCategories(categories)
            break;
        case "set-budget":
            try {
                const { month, amount } = parsedArgs.options;
                if (!month || !amount) {
                    throw new Error("Month and amount are required");
                }
                if (amount < 0) {
                    throw new Error("Amount cannot be negative");
                }
                monthsData = expenseTrackerLogic.setBudget(monthsData, month, amount)
                await fileManager.writeFile(monthsFileName, monthsData);

            } catch (error) {
                console.error("Error setting a budget", error.message);
            }
            break;
        case "export-expenses":
            console.log("wasaaaaaaa 10")
            expenseTrackerLogic.exportExpensesFile()
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