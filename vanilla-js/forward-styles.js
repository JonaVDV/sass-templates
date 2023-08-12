import fs from 'node:fs';
import path from 'node:path';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const scssPath = './src/scss/';

const rl = readline.createInterface({
  input,
  output,
});

setDirectory();

function setDirectory() {
  rl.question('Enter the path of the directory to scan: ', (answer) => {
    if (answer) {
      scanDirectory(scssPath + answer);
    } else {
      rl.close();
    }
  });
}

/**
 * Scans the specified directory for .scss files and processes them.
 * @param {string} path - The path of the directory to scan.
 * @returns {void}
 */
function scanDirectory(path) {
  fs.readdir(path, (err, files) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log(typeof files[0]);
    processFiles(files, path);
  });
}

/**
 * Processes the specified .scss files and creates an _index.scss file.
 * @param {string[]} files - An array of .scss file names to process.
 * @param {string} path - The path of the directory where the _index.scss file will be created.
 * @returns {void}
 */
function processFiles(files, path) {
  const newFiles = []

  Array.from(files).forEach((file) => {
    if (file.includes('.scss') && !file.includes('_index.scss')) {
      // remove the file extension and remove the underscore
      file = file.replace('.scss', '').replace('_', '');
      newFiles.push(file);
    }
  });

  files.forEach((file) => {
    if (file.includes('_index.scss')) {
      writeIndex(path, newFiles);
    }
  });

  createIndexFile(path, newFiles);
}

/**
 * Creates an empty _index.scss file in the specified path and writes the index of files to it.
 * @param {string} path - The path where the _index.scss file will be created.
 * @param {Array} files - An array of file names to be included in the index.
 * @returns {void}
 */
function createIndexFile(path, files) {
  fs.writeFile(`${path}/_index.scss`, '', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Created _index.scss file in ${path}`);
      writeIndex(path, files);
      rl.close();
    }
  });

}

/**
 * Writes an _index.scss file to the specified path, importing all files in the `files` array using the `@forward` rule.
 * @param {string} path - The path where the _index.scss file will be created.
 * @param {string[]} files - An array of file names to be imported in the _index.scss file.
 * @returns {void}
 */
function writeIndex(path, files) {
  fs.writeFile(`${path}/_index.scss`, `${files.map((file) => `@forward '${file}';`).join('\n')}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Wrote _index.scss file in ${path}`);
      rl.close();
    }
  });
}

