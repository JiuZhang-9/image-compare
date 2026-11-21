import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const fixtureDirectory = path.resolve("e2e/fixtures");
fs.mkdirSync(fixtureDirectory, { recursive: true });

async function solid(name, background) {
  await sharp({
    create: { width: 64, height: 64, channels: 4, background },
  })
    .png()
    .toFile(path.join(fixtureDirectory, name));
}

await solid("red.png", { r: 200, g: 64, b: 64, alpha: 1 });
await solid("blue.png", { r: 48, g: 96, b: 200, alpha: 1 });
await solid("transparent.png", { r: 0, g: 0, b: 0, alpha: 0 });

fs.writeFileSync(
  path.join(fixtureDirectory, "corrupt.png"),
  "this is not a png file\n",
  "utf8",
);

console.log(`fixtures written to ${fixtureDirectory}`);
