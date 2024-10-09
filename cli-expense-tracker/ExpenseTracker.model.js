import * as readline from 'node:readline/promises';

export default class ExpenseTrackerLogic {
    constructor(description, amount, category) {
        this.id = (Math.floor(Math.random() * 90000000) + 10000000).toString(),
            this.date = new Date().toLocaleDateString("en-GB"),
            this.description = description,
            this.amount = amount,
            this.category = category
    }
    findById(data, expenseId) {
        const foundExpense = data.find((expense) => expense.id === expenseId);
        if (typeof foundExpense === "undefined") {
            throw new Error(`Expense with id ${expenseId} not found.`);
        }
        return foundExpense
    }
    async addExpense(description, amount, category, monthsData) {
        const month = ((new Date().toLocaleDateString("en-GB")).split("/"))[1];
        const foundMonth = monthsData.find((t) => t.number === month);
        foundMonth.usedBudget += amount;

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        if (foundMonth.usedBudget > foundMonth.budget) {
            console.log("You are exceeding your monthly budget");

            const answer = await rl.question('Do you want to continue and add the expense? (yes/no) ');

            if (answer.toLowerCase() === 'yes') {
                console.log("Expense added despite exceeding budget.");
                const newExpense = new ExpenseTrackerLogic(description, amount, category);
                rl.close();
                return { expense: newExpense, mData: monthsData };
            } else {
                console.log("Expense not added.");
                rl.close();
                throw new Error("Expected Error. Expense has not been added successfully");
            }
        } else {
            const newExpense = new ExpenseTrackerLogic(description, amount, category);
            rl.close();
            return { expense: newExpense, mData: monthsData };
        }
    }
    updateExpense(data, expenseId, updates, monthsData) {
        const expense = this.findById(data, expenseId);
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === "amount") {
                    const month = ((new Date().toLocaleDateString("en-GB")).split("/"))[1]
                    const foundMonth = monthsData.find((t) => t.number === month)
                    if (expense[key] > value) {
                        let difer = value - expense[key];
                        foundMonth.usedBudget += difer

                    } else {
                        let difer = expense[key] - value;
                        foundMonth.usedBudget -= difer
                    }
                    expense[key] = value;
                } else {
                    expense[key] = value;
                }
            }
        });
        return { expenseData: data, monthsData: monthsData };
    }
    deleteExpense(data, expenseId, monthsData) {
        this.findById(data, expenseId)
        data.forEach((expense, i) => {
            if (expense.id === expenseId) {
                const month = ((new Date().toLocaleDateString("en-GB")).split("/"))[1]
                const foundMonth = monthsData.find((t) => t.number === month)
                foundMonth.usedBudget -= expense.amount
                data.splice(i, 1)
            }
        })
        return { expenseData: data, monthsData: monthsData };

    }
    async viewList(data, updates) {
        const year = ((new Date().toLocaleDateString("en-GB")).split("/"))[2]
        let showArr = []
        let keys = Object.entries(updates)
        keys[1][0] = "date"
        if (typeof keys[1][1] !== "undefined" && typeof keys[0][1] !== "undefined") {
            showArr = data.filter(expense => {
                if ((expense[keys[1][0]].split("/"))[2] === year) {
                    if ((expense[keys[1][0]].split("/"))[1] === keys[1][1] && expense[keys[0][0]] === keys[0][1]) {
                        return expense
                    }
                }
            })
        } else {
            keys.forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === "date") {
                        let month = value.toString().replace(/^0+/, '');
                        month = month.slice(-2);
                        month = month.padStart(2, '0');
                        keys[1][1] = month;
                        value = month;

                        console.log(value, keys[1][1])
                        showArr = data.filter((expense) => {
                            if ((expense[key].split("/"))[2] === year) {
                                return (expense[key].split("/"))[1] === value
                            }
                        })
                    } else if (key.length) {
                        showArr = data.filter(expense => expense[key] == value);
                    }
                }
            });
        }

        if (showArr.length !== 0) {
            console.table(showArr);
        } else {
            console.table(data);
        }
    }
    async viewSummary(data, updates) {
        const year = ((new Date().toLocaleDateString("en-GB")).split("/"))[2]
        let showArr = []
        let keys = Object.entries(updates)
        keys[1][0] = "date"
        if (typeof keys[1][1] !== "undefined" && typeof keys[0][1] !== "undefined") {
            showArr = data.filter(expense => {
                if ((expense[keys[1][0]].split("/"))[2] === year) {
                    if ((expense[keys[1][0]].split("/"))[1] === keys[1][1] && expense[keys[0][0]] === keys[0][1]) {
                        return expense
                    }
                }
            })
        } else {
            keys.forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === "date") {
                        let month = value.toString().replace(/^0+/, '');
                        month = month.slice(-2);
                        month = month.padStart(2, '0');
                        keys[1][1] = month;
                        value = month;

                        showArr = data.filter((expense) => {
                            if ((expense[key].split("/"))[2] === year) {
                                return (expense[key].split("/"))[1] === value
                            }
                        })
                    } else if (key.length) {
                        showArr = data.filter(expense => expense[key] == value);
                    }
                }
            });
        }

        if (showArr.length !== 0) {
            if (typeof keys[1][1] !== "undefined" && typeof keys[0][1] !== "undefined") {
                let totalSum = 0
                const monthname = ExpenseTrackerLogic.monthMap[keys[1][1]].name
                showArr.forEach((expense) => {
                    totalSum += expense.amount
                })
                console.log(`Total expenses of ${monthname} from category ${keys[0][1]} : $${totalSum}`)
                return totalSum
            } else if (typeof keys[0][1] !== "undefined") {
                let totalSum = 0
                showArr.forEach((expense) => {
                    totalSum += expense.amount
                })
                console.log(`Total expenses from category ${keys[0][1]} : $${totalSum}`)
                return totalSum
            } else if (typeof keys[1][1] !== "undefined") {
                const monthname = ExpenseTrackerLogic.monthMap[keys[1][1]].name
                let totalSum = 0
                showArr.forEach((expense) => {
                    totalSum += expense.amount
                })
                console.log(`Total expenses of ${monthname} : $${totalSum}`)
                return totalSum
            }
        } else {
            let totalSum = 0
            data.forEach((expense) => {
                totalSum += expense.amount
            })
            console.log(`Total expenses of this year: $${totalSum}`)
        }
    }
    setBudget(monthsData, month, amount) {
        let parsedMonth = month.toString().replace(/^0+/, '');
        parsedMonth = parsedMonth.slice(-2);
        parsedMonth = parsedMonth.padStart(2, '0');

        const foundMonth = monthsData.find((t) => t.number === month)

        if (typeof foundMonth === "undefined") {
            throw new Error("Try entering a month correctly");
        }
        foundMonth.budget = amount
        return monthsData
    }
    exportExpensesFile(dunmo) {

    }
}