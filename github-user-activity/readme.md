# GitHub User Activity Fetcher

This Node.js script fetches a GitHub user's activity from the GitHub API and filters the events based on the type of activity (e.g., `PushEvent`, `ForkEvent`). It provides a command-line interface (CLI) to display the activity details, including commits, repository names, and the event date.

## Features

- Fetches a list of activities for a GitHub user.
- Filters activities by event type (e.g., `PushEvent`, `IssuesEvent`).
- Lists all events or only specific types of events.
- Displays event details such as the type, user, repository, commits, and date.
- Provides a helpful guide with the `help` command.

## Prerequisites

- **Node.js** (version 12 or higher)
- Internet access (to fetch data from GitHub API)

## Installation

1. Clone the repository or copy the script to your local machine.
   ```bash
   git clone <repository-url>
   cd github-activity-fetcher
   ```

2. Ensure you have Node.js installed. You can check by running:
   ```bash
   node -v
   ```

3. Install any required dependencies (if necessary):
   ```bash
   npm install
   ```

## Usage

You can run the script using Node.js from the command line. The general syntax is:

```bash
node index.js <github-username> <event-type>
```

### Examples

1. **Fetch all activities for a user**:
   ```bash
   node index.js octocat all
   ```

2. **Fetch specific event types for a user (e.g., PushEvent)**:
   ```bash
   node index.js octocat PushEvent
   ```

3. **Display a list of supported events**:
   ```bash
   node index.js help
   ```

### Supported Event Types

The following event types are supported:
- `PushEvent`
- `IssuesEvent`
- `WatchEvent`
- `ForkEvent`
- `CreateEvent`
- `PullRequestEvent`
- `CommitCommentEvent`
- `DeleteEvent`
- `GollumEvent`
- `MemberEvent`
- `PublicEvent`
- `PullRequestReviewCommentEvent`
- `PullRequestReviewEvent`
- `ReleaseEvent`
- `SponsorshipEvent`
- `TeamAddEvent`
- `IssueCommentEvent`
- `StatusEvent`
- `RepositoryEvent`

You can use any of these event types as the second argument to filter by that specific event.

### Help Command

To see a list of supported events, use the `help` command:

```bash
node index.js help
```

## Error Handling

- If the user does not exist or there is a network error, a descriptive error message will be shown, and the program will exit.
- If an unsupported event type is entered, the script will notify the user and suggest using the `help` command for a list of valid event types.

## Example Output

When running a command like `node index.js octocat PushEvent`, the output will be:

```bash
Activity Type: PushEvent
User: octocat
Repo: octocat/Hello-World
Commits:
  - Initial commit
  - Added README.md
Date: 9/26/2024, 10:15:00 AM
---------------------------------------------------------
```

## License

This project is open-source and available under the MIT License.
