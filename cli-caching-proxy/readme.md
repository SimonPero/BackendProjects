# Caching Proxy - TypeScript

A command-line interface (CLI) caching proxy server designed to enhance data retrieval performance by caching responses from various sources. Built with Node.js, Commander, TypeScript, and Express.js, this tool is particularly effective with JSON APIs.

- **Project URL**: [Caching Proxy](./cli-caching-proxy/)
- **Inspiration**: [RoadMap.sh - Caching Server](https://roadmap.sh/projects/caching-server)

## Features

- **Dynamic Caching**: Caches responses based on the content type and HTTP method, optimizing data retrieval for repeated requests.
- **Configurable Cache Size**: Maintains a maximum cache size, automatically evicting the least relevant entries.
- **Staleness Management**: Implements rules to determine the freshness of cached data, allowing for a configurable time-to-live (TTL) based on content type.
- **Command-Line Options**: Easily manage cache operations via command-line arguments.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- TypeScript
- npm or yarn for package management

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Usage

To start the caching proxy server, use the command:

```bash
node cli-caching-proxy --port <port> --url <url>
```

To clean the cache for a specific URL, use:

```bash
node cli-caching-proxy --clean-cache <url>
```

### Example

Starting the proxy server:
```bash
node cli-caching-proxy --port 3000 --url https://example.com/api
```

Cleaning the cache:
```bash
node cli-caching-proxy --clean-cache https://example.com/api
```

## Implementation Overview

The core functionality is provided by the `CachingManager` class, which manages caching logic:

### Key Components

- **Cache Management**:
  - **TTL Management**: Default TTLs are set for different content types.
  - **Eviction Policy**: Entries are evicted based on access frequency and staleness.

- **Command Line Interface**:
  - Uses the `Commander` library to parse and handle command-line options for managing the cache.

- **Proxy Server**:
  - Built using Express.js, intercepts HTTP requests, checks the cache, and retrieves data from the original server if not cached.

### Code Snippets

#### CachingManager Class

```typescript
class CachingManager {
  private readonly MAX_CACHE_SIZE = 20;
  private readonly STALENESS_THRESHOLD = 24 * 60 * 60 * 1000; // 1 day
  // ...
  async addToCache(/* parameters */) { /* logic */ }
  async evictFromCache(/* parameters */) { /* logic */ }
  // ...
}
```

#### Starting the Proxy Server

```typescript
import startProxyServer from "./ProxyServer";

(async () => {
  const options = program.opts();
  startProxyServer(options.port, options.url, hostName[1]);
})();
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## Acknowledgments

- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [Commander](https://github.com/tj/commander.js)
