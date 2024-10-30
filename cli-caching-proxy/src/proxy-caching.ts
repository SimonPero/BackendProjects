import { Command } from "commander";
import FileManager from "./FileManager";
import { urlSplitter } from "../utils/UrlSplitter";
import startProxyServer from "./ProxyServer";
const fileManager = new FileManager();

const program = new Command();
program
  .name("proxy-caching")
  .option("-p, --port <port>", "must have a port", parseInt)
  .option("-u, --url <url>", "must have a url")
  .option("-c, --clean-cache <url>", "must have a cache url")
  .parse(process.argv);

const options = program.opts();

async function handleCleanCache(url: string) {
  const hostName = urlSplitter(url);
  if (!hostName) return;
  const access = await fileManager.readFile(hostName[1]);
  if (!access) return console.log("File does not exist.");
  await fileManager.deleteFile(hostName[1]);
  console.log(`File ${hostName[1]} found and deleted.`);
}

async function handleWriteCache(url: string) {
  const hostName = urlSplitter(url);
  if (!hostName) return;
  const access = await fileManager.readFile(hostName[1]);
  if (access) return console.log(`Cache file for ${hostName[1]} already exists.`);
  await fileManager.writeFile(hostName[1], []);
  console.log(`Cache file for ${hostName} created.`);
}

(async () => {
  if (!options.port && !options.url && options.cleanCache) {
    await handleCleanCache(options.cleanCache);
  } else if (options.port && options.url && !options.cleanCache) {
    await handleWriteCache(options.url);
    startProxyServer(options.port, options.url);
  } else {
    console.log(
      "Invalid options. Please specify either `--port <port> --url <url>` or `--clean-cache <url>`."
    );
  }
})();
