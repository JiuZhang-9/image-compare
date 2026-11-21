import fs from "node:fs";
import path from "node:path";

const rootDirectories = ["src"];
const ignoredSegments = ["styles", "test", "assets"];
const issues = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return ignoredSegments.includes(entry.name) ? [] : walk(fullPath);
    }

    return [fullPath];
  });
}

for (const file of rootDirectories.flatMap(walk)) {
  if (!/\.(ts|tsx)$/.test(file) || /\.test\.(ts|tsx)$/.test(file)) {
    continue;
  }

  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const location = `${file}:${index + 1}`;

    if (/#[0-9a-fA-F]{3,8}\b/.test(line)) {
      issues.push(`${location} 裸色值（请使用 tokens.css）`);
    }

    if (/\b(?:rgba?|hsla?)\(/.test(line)) {
      issues.push(`${location} 裸 rgb/hsl 颜色（请使用 tokens.css）`);
    }

    if (/!important/.test(line)) {
      issues.push(`${location} 禁止 !important`);
    }

    const classMatch = line.match(/className=(?:"([^"]*)"|\{`([^`]*)`\})/);
    const classValue = classMatch?.[1] ?? classMatch?.[2] ?? "";

    if (/\[[^\]]+\]/.test(classValue)) {
      issues.push(`${location} 禁止 Tailwind 任意值`);
    }
  });
}

for (const styleFile of ["src/styles/tokens.css", "src/styles/globals.css"]) {
  if (!fs.existsSync(styleFile)) {
    continue;
  }

  const lines = fs.readFileSync(styleFile, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    if (/!important/.test(line)) {
      issues.push(`${styleFile}:${index + 1} 禁止 !important`);
    }
  });
}

if (issues.length > 0) {
  console.error("UI conventions check failed:\n");
  for (const issue of issues) {
    console.error(`  ${issue}`);
  }
  process.exit(1);
}

console.log("UI conventions check passed.");
