# Expense Tracker CLI Tool

- idea from [RoadMap.sh](https://roadmap.sh/projects/task-tracker)


This is a Node.js command-line interface (CLI) application for tracking personal expenses. It allows users to add, update, delete, and list expenses, as well as manage categories, set budgets, and export data in CSV format. Users can interact with the tool using various commands to organize and analyze their expenses efficiently.

## Features
- **Add Expenses**: Add a new expense with a description, amount, and optional category.
- **Update Expenses**: Modify an existing expense by providing an expense ID.
- **Delete Expenses**: Remove an expense from the list by its ID.
- **List Expenses**: View all expenses, optionally filtered by category or month.
- **Summarize Expenses**: View a summary of total expenses, filtered by category or month.
- **Category Management**: Create, delete, and view custom categories.
- **Set Monthly Budget**: Define a budget for a specific month.
- **Export Expenses**: Export expenses as a CSV file, filtered by category or month.

## Getting Started

### Prerequisites
- Node.js installed on your system.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd expense-tracker-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage

Run the following command in the terminal to start using the Expense Tracker CLI:

```bash
node index.js <command> [arguments]
```

### Available Commands

| Command                     | Arguments & Description |
|------------------------------|-------------------------|
| **add**                      | `--description <string>` `--amount <number>` `--category <category>` <br>Add a new expense with a description and amount. Optionally, include a category. |
| **update**                   | `--id <expense_id>` `[--description <string>]` `[--amount <number>]` `[--category <category>]` <br>Update an existing expense by its ID. |
| **delete**                   | `--id <expense_id>` <br>Delete an expense by its ID. |
| **list**                     | `[--category <category>]` `[--month <number>]` <br>List all expenses, optionally filtering by category or month. |
| **summary**                  | `[--category <category>]` `[--month <number>]` <br>Show a summary of expenses by category or month. |
| **create-category**          | `<newcategory>` <br>Create a new custom category. |
| **delete-category**          | `<category>` <br>Delete a category by its name. |
| **view-categories**          | View all available categories. |
| **set-budget**               | `--month <number>` `--amount <number>` <br>Set a monthly budget. |
| **export-expenses**          | `[--month <number>]` `[--category <category>]` `--filename <name>` <br>Export expenses to a CSV file, filtered by category or month. |
| **help**                     | Show help and available commands. |

### Example Usage

1. **Add a new expense**:
   ```bash
   node index.js add --description "Lunch" --amount 12.50 --category "Food"
   ```

2. **Update an existing expense**:
   ```bash
   node index.js update --id 1 --amount 15.00
   ```

3. **Delete an expense**:
   ```bash
   node index.js delete --id 1
   ```

4. **List all expenses for a specific month**:
   ```bash
   node index.js list --month 10
   ```

5. **Set a monthly budget**:
   ```bash
   node index.js set-budget --month 10 --amount 500
   ```

6. **Export expenses to CSV**:
   ```bash
   node index.js export-expenses --month 10 --filename "october_expenses.csv"
   ```

### File Management

This CLI tool manages three main data files:
- `expenses.json`: Stores all expense records.
- `categories.json`: Stores custom categories.
- `months.json`: Stores monthly budget data.

The data is read from and written to these files automatically by the tool.

### Error Handling
The tool handles errors gracefully. If invalid arguments are provided or if required information is missing, an appropriate error message will be displayed, guiding the user to correct the command.

### Extensibility
The CLI can be extended with additional features, such as:
- More advanced filtering options (e.g., by date range).
- Visualizations of expenses (e.g., graphs).

## License
This project is licensed under the MIT License.