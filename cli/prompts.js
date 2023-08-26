#!/usr/bin/env node
import path from 'node:path';
import inquirer from 'inquirer';
import fs from 'fs-extra'
import { spawnSync } from 'node:child_process';

function askProjectDirectory() {
  const question = [
    {
      name: 'projectDirectory',
      type: 'input',
      message: 'Enter the name of the project directory (enter for current directory):',
      validate: function (value) {
        const currentPath = path.resolve('./');
        if (!value.length) {
          const files = fs.readdirSync(currentPath);
          if (files.length) {
            return 'Current directory is not empty, please enter a project name.';
          }
        }
        return true;
      }
    },
  ];
  return inquirer.prompt(question);
}

function askProjectType() {
  const question = [
    {
      name: 'projectType',
      type: 'list',
      message: 'What type of project would you like to generate?',
      choices: ['vanilla-js', 'astro', 'sveltekit'],
      default: 'vanilla-js',
    },
  ]
  return inquirer.prompt(question)
}

function askForGit() {
  const question = [
    {
      name: 'git',
      type: 'confirm',
      message: 'Would you like to initialize a git repository?',
      default: true,
    },
  ]
  return inquirer.prompt(question)
}

function askForInstall() {
  const question = [
    {
      name: 'install',
      type: 'confirm',
      message: 'Would you like to install dependencies?',
      default: true,
    },
  ]
  return inquirer.prompt(question)
}

// create a handler for the prompts
export async function promptUser() {
  const projectDirectory = await askProjectDirectory();
  const projectType = await askProjectType();
  const git = await askForGit();
  const install = await askForInstall();
  return {
    ...projectDirectory,
    ...projectType,
    ...git,
    ...install,
  }
}

promptUser().then((answers) => {
  answers.projectDirectory = answers.projectDirectory.replace(/^\/|\/$/g, '');
  if (answers.projectDirectory.length) {
    console.log(`\nGenerating project in ${answers.projectDirectory}...`);

    console.log('test1')
    createProject(answers.projectDirectory, answers.projectType, answers.git, answers.install);
  } else {
    console.log(`\nGenerating project in current directory...`);
    createProject(answers.projectDirectory, answers.projectType, answers.git, answers.install);
  }
});

async function createProject(directory, projectType, git, install) {

  const templateDir = path.resolve(new URL(import.meta.url).pathname, '../../', projectType).slice(3);
  console.log(templateDir);
  const targetDir = path.join(process.env.INIT_CWD, directory);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  try {
    fs.accessSync(templateDir, fs.constants.R_OK | fs.constants.W_OK);
  } catch (error) {
    console.log('no access!', error);
  }

  try {
    fs.copySync(templateDir, targetDir);
  } catch (error) {
    console.error(error);
  }

  if (git) {
    spawnSync('git', ['init'], { cwd: targetDir, stdio: 'inherit', shell: true });
  }

  if (install) {
    spawnSync('npm', ['install'], { cwd: targetDir, stdio: 'inherit', shell: true });
  }

}
