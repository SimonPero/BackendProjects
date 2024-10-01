

async function fetchActivities(user) {
    try {
        const res = await fetch(`https://api.github.com/users/${user}/events`);
        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error(`Error fetching activities: ${error.message}`);
        process.exit(1);
    }
}

function logActivity(activity) {
    const { type, actor, repo, payload, created_at } = activity;
    const commits = payload.commits
        ? payload.commits.map(commit => `  - ${commit.message}`).join('\n            ')
        : 'No commits available';
    console.log(`
        Activity Type: ${type}
        User: ${actor.login}
        Repo: ${repo.name}
        Commits:
        ${commits}
        Date: ${new Date(created_at).toLocaleString()}
        ---------------------------------------------------------`);
}

function logActivities(activities, checkType) {
    const filteredActivities = checkType === 'all'
        ? activities
        : activities.filter(activity => activity.type === checkType);

    if (filteredActivities.length === 0) {
        console.log(`There are no events${checkType !== 'all' ? ` of type ${checkType}` : ''}`);
    } else {
        filteredActivities.forEach(logActivity);
    }
}

function printHelp() {
    console.log("Usage: node index.js <user> <eventName>");
    console.log(`Supported events are: \n${eventTypes.join("\n")}`);
    console.log("Use 'all' to show all event types");
}

const eventTypes = [
    "PushEvent", "IssuesEvent", "WatchEvent", "ForkEvent", "CreateEvent", "PullRequestEvent",
    "CommitCommentEvent", "DeleteEvent", "GollumEvent", "MemberEvent", "PublicEvent",
    "PullRequestReviewCommentEvent", "PullRequestReviewEvent", "ReleaseEvent", "SponsorshipEvent",
    "TeamAddEvent", "IssueCommentEvent", "StatusEvent", "RepositoryEvent"
];

async function main() {
    const args = process.argv.splice(2)
    const user = args[0]
    let command = args[0]
    if (args[0] !== "help") {
        command = args[1]
    }

    if (!user || command === 'help') {
        printHelp();
        return;
    }

    const activities = await fetchActivities(user);

    if (command === 'all' || eventTypes.includes(command)) {
        logActivities(activities, command);
    } else {
        console.log("Unsupported event type. Try using 'node index.js help' for a list of supported events.");
    }
}

main().catch(error => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
});