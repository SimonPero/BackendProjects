Here's a fast documentation for your **Client-Task-Tracker** project:

---

# Client-Task-Tracker

A simple command-line based task tracker allowing users to add, update, delete, and change the status of tasks. Tasks are stored in JSON files, categorized by their status (`todo`, `in-progress`, `done`).
- idea from [RoadMap.sh](https://roadmap.sh/projects/task-tracker)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:
   ```bash
   cd client-task-tracker
   ```

3. Install dependencies (if any):
   ```bash
   npm install
   ```

## Usage

To use the task tracker, run commands in the terminal:

```bash
node index.js <command> [arguments]
```

### Available Commands

- **Add a new task**  
  Add a new task to the `todo` list:
  ```bash
  node index.js add "<task description>"
  ```

- **Update a task description**  
  Update the description of an existing task:
  ```bash
  node index.js update <task_id> "<new description>"
  ```

- **Delete a task**  
  Delete a task by its `id`:
  ```bash
  node index.js delete <task_id>
  ```

- **Mark a task as in-progress**  
  Change the status of a task to `in-progress`:
  ```bash
  node index.js mark-in-progress <task_id>
  ```

- **Mark a task as done**  
  Change the status of a task to `done`:
  ```bash
  node index.js mark-done <task_id>
  ```

- **List tasks**  
  View tasks based on their status or view all tasks:
  - All tasks:
    ```bash
    node index.js list
    ```
  - Only `done` tasks:
    ```bash
    node index.js list done
    ```
  - Only `in-progress` tasks:
    ```bash
    node index.js list in-progress
    ```
  - Only `todo` tasks:
    ```bash
    node index.js list todo
    ```

## Project Structure

- **index.js**: Main entry point for running commands.
- **task.model.js**: Defines the `Task` class, handling task operations such as adding, updating, deleting, and changing status.
- **data/**: Folder where tasks are stored in JSON files based on their status (`todo.json`, `in-progress.json`, `done.json`).

## Task Operations

- **add(task)**: Adds a new task to the `todo` list.
- **update(id, newTask)**: Updates an existing task's description.
- **delete(id)**: Deletes a task by its `id`.
- **changeStatus(id, status)**: Changes the status of a task (e.g., `in-progress`, `done`).
- **list(type)**: Lists tasks based on their type or lists all tasks.

## Examples

- Add a task:
  ```bash
  node index.js add "Complete documentation"
  ```

- Update a task:
  ```bash
  node index.js update 1234567890 "Update project documentation"
  ```

- Mark task as `in-progress`:
  ```bash
  node index.js mark-in-progress 1234567890
  ```

- List all tasks:
  ```bash
  node index.js list
  ```

---

This should cover the basic functionality and commands for your **Client-Task-Tracker**. Let me know if you need more details!