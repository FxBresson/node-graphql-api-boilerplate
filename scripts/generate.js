/* Imports
   ==================== */
const fs = require('fs');
const argv = require('yargs').argv;
const chalk = require('chalk');

/* Functions
   ==================== */

const logError = msg => console.log(chalk.bold.red(msg));
const logWarning = msg => console.log(chalk.bold.yellowBright(msg));
const logSuccess = msg => console.log(chalk.bold.greenBright(msg));
const logInfo = msg => console.log(chalk.bold.white(msg));
const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const appendModelExport = (data, replaceObject) => {
  //TODO: improve regex
  const matches = data.match(/export { [\s\S]*( };)/);
  const end = matches[1];
  const temp = data.replace(end, `, ${replaceObject}${end}`);
  return temp;
};

const addModelImport = (data, model, type) => {
  const matches = data.match(/^import[\s\S]*?';$/gm);
  const importsChunck = matches[matches.length - 1];
  const path = type === 'TC' ? `./${model}/type-composer` : `./${model}`;
  return data.replace(
    importsChunck,
    `${importsChunck}\nimport { ${model}${type} } from '${path}';`
  );
};

const addModelTo = (filepath, model, type) => {
  const data = fs.readFileSync(filepath, 'utf-8');
  const temp = addModelImport(data, model, type);
  const newValue = appendModelExport(temp, `${model}${type}`);
  fs.writeFileSync(filepath, newValue, 'utf-8');
};

const modelTCTemplate = name => `
import { composeWithMongoose } from 'graphql-compose-mongoose/node8';
import { ${name} } from './index';

const ${name}TC = composeWithMongoose(${name});

export { ${name}TC };
`;

const modelIndexTemplate = name => `
import mongoose from 'mongoose';

const ${name}Schema = new mongoose.Schema({
  generated_key: Boolean,
});

const ${name} = mongoose.model('${name}', ${name}Schema);

export { ${name}Schema, ${name} };
`;

/* Constants
   ==================== */
//TODO: Sanitize newModelName
const newModelName = argv._[0];
const root = './src';
const directories = getDirectories(`${root}/models`);
const newModelFolder = `${root}/models/${newModelName}`;

/* Verification
   ==================== */
if (!newModelName) {
  logError('Please provide a name for your model');
  return;
}

if (argv._.length > 1) {
  logWarning('Please provide only one name');
  return;
}

if (newModelName[0] !== newModelName[0].toUpperCase()) {
  logWarning('Please write your model name with an uppercase');
  return;
}

if (directories.includes(newModelName)) {
  logError(`Model ${newModelName} already exists`);
  return;
}

/* Processing
   ==================== */
if (!argv.dev) {
  logInfo(`Generation model ${newModelName}`);
  try {
    fs.mkdirSync(newModelFolder);

    fs.writeFileSync(
      `${newModelFolder}/index.ts`,
      modelIndexTemplate(newModelName)
    );

    fs.writeFileSync(
      `${newModelFolder}/type-composer.ts`,
      modelTCTemplate(newModelName)
    );

    addModelTo(`${root}/models/index.ts`, newModelName, '');

    addModelTo(`${root}/models/schemas.ts`, newModelName, 'Schema');

    addModelTo(`${root}/models/type-composers.ts`, newModelName, 'TC');

    logSuccess(`Model ${newModelName} succesfully generated !`);
  } catch {
    logError('An error occured');
  }
}
