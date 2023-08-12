// import fs from 'node:fs';
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
          // create a folder in the current directory
          const files = fs.readdirSync(currentPath);
          if (files.length) {
            return 'Current directory is not empty, please enter a project name.';
          }
        }
        // fs.mkdirSync(currentPath + '/' + value);
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
      choices: ['vanlila','astro', 'sveltekit' ],
      default: 'vanlila',
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

function askForTypeScript() {
  const question = [
    {
      name: 'typescript',
      type: 'confirm',
      message: 'Would you like to use TypeScript?',
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
  const typescript = await askForTypeScript();
  const install = await askForInstall();
  return {
    ...projectDirectory,
    ...projectType,
    ...git,
    ...typescript,
    ...install,
  }
}

promptUser().then((answers) => {
  if (answers.projectDirectory.length) {
    console.log(`\nGenerating project in ${answers.projectDirectory}...`);
  } else {
    console.log(`\nGenerating project in current directory...`);
  }
  createProject(answers.projectDirectory, answers.projectType, answers.git, answers.install);
});

function createProject(directory, projectType, git, install){
  // get the folder contents of the template directory
  const templateDir = path.resolve(projectType);
  const targetDir = path.resolve(directory);

  fs.mkdirSync(targetDir);

  // copy the template directory to the target directory if it exists
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, targetDir, {
      filter: (src, dest) => {
      //  filter out node_modules
        if (src.indexOf('node_modules') !== -1) {
          return false;
        }
        return true;
      }
    });
    
  }

  // initialize git if the user wants to
  if (git) {
    spawnSync('git', ['init'], { cwd: targetDir, stdio: 'inherit', shell: true });
  }

  if (install) {
    spawnSync('npm', ['install'], { cwd: targetDir, stdio: 'inherit', shell: true });
  }

}

