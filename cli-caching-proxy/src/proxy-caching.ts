import { Command } from 'commander';


interface ProxyOptions {
  port: number;
  url: string;
  cleanCache: string;
}

const program = new Command();

program
  .name('proxy-caching')
  .requiredOption('-p, --port <port>', 'must have a port', parseInt)
  .requiredOption('-u, --url <url>', 'must have a url')
  .option('-c, --clean-cache <url>', 'must have a cache url')
  .parse(process.argv);

const options = program.opts() as ProxyOptions;
console.log(options)

// Validate port number
if (isNaN(options.port)) {
  console.error('Error: Port must be a number');
  process.exit(1);
}

// Validate URLs
try {
  console.log(options.url)
} catch (error) {
  console.error('Error: Invalid URL format');
  process.exit(1);
}

console.log('Configuration:', {
  port: options.port,
  url: options.url,
  cleanCache: options.cleanCache
});

// Your proxy logic here