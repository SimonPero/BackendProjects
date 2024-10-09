export default class ExpenseTrackerLogic {
    static monthMap = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    };
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
    addExpense(description, amount, category) {
        const newExpense = new ExpenseTrackerLogic(description, amount, category)
        return newExpense
    }
    updateExpense(data, expenseId, updates) {
        const expense = this.findById(data, expenseId);
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                expense[key] = value;
            }
        });
        return data;
    }
    deleteExpense(data, expenseId) {
        this.findById(data, expenseId)
        data.forEach((expense, i) => {
            if (expense.id === expenseId) {
                data.splice(i, i)
            }
        })
        return data
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
                const monthname = ExpenseTrackerLogic.monthMap[keys[1][1]]
                showArr.forEach((expense) => {
                    totalSum += expense.amount
                })
                console.log(`Total expenses of ${monthname} from category ${keys[0][1]} : $${totalSum}`)

            } else if (typeof keys[0][1] !== "undefined") {
                let totalSum = 0
                showArr.forEach((expense) => {
                    totalSum += expense.amount
                })
                console.log(`Total expenses from category ${keys[0][1]} : $${totalSum}`)
            } else if (typeof keys[1][1] !== "undefined") {
                const monthname = ExpenseTrackerLogic.monthMap[keys[1][1]]
                let totalSum = 0
                showArr.forEach((expense) => {
                    totalSum += expense.amount
                })
                console.log(`Total expenses of ${monthname} : $${totalSum}`)
            }
        } else {
            let totalSum = 0
            data.forEach((expense) => {
                totalSum += expense.amount
            })
            console.log(`Total expenses of this year: $${totalSum}`)
        }
    }
    async setBudget(dunno) {

    }
    async exportExpensesFile(dunmo) {

    }
}