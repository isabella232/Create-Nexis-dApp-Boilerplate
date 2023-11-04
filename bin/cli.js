#!/usr/bin/env node

import chalk from "chalk";
import prompts from "prompts";
import path from "path";
import os from "os";
import fse from "fs-extra";
import _progress from "cli-progress";
import { execSync } from "child_process";
import yargs from "yargs/yargs";
import * as dotenv from "dotenv";

dotenv.config();

const createDapp = (resolvedProjectPath, projectPath) => {
	// Create the project folder and copy the template files
	console.log(chalk.bold(chalk.green("\n🚀 Creating your Exzo App 🚀\n")));
	const progressBar = new _progress.Bar({}, _progress.Presets.shades_classic);
	progressBar.start(100, 0);
	let value = 0;

	const timer = setInterval(function () {
		value++;
		progressBar.update(value);
		if (value >= progressBar.getTotal()) {
			clearInterval(timer);
			fse.mkdtemp(path.join(os.tmpdir(), "exzo-"), (err, folder) => {
				if (err) throw err;
				execSync(
					`git clone --depth 1 ${"https://github.com/raebeatrose4/create-exzo-dapp"} ${folder}`,
					{ stdio: "pipe" }
				);
				fse.copySync(path.join(folder, "core"), resolvedProjectPath);
				fse.writeFileSync(
					path.join(resolvedProjectPath, ".env"),
					"SKIP_PREFLIGHT_CHECK=true"
				);
				progressBar.stop();
				console.log(
					chalk.bold(
						chalk.magenta("\n🎉 Your Exzo dApp is ready 🎉\n\n")
					),
					"To start your dapp, run the following commands:\n\n",
					chalk.bold("\tcd " + projectPath),
					chalk.bold("\n\tyarn"),
					chalk.bold("\n\tyarn start\n")
				);
				console.log(chalk.gray("Deleting temporary files..."));
				cleanUpFiles(folder);
			});
		}
	}, 10);
};

const cleanUpFiles = folder => {
	// Delete the temporary folder
	fse.rmSync(path.join(folder), {
		recursive: true,
		force: true,
	});

	console.log(chalk.yellow("Project cleaned up ✅ "));
};

// Get the project path from the command line if provided, else default to null
const cmdLineRes = yargs(process.argv.slice(2)).command(
	"$0 [folder-name]",
	"create a new Exzo App project",
	yargs => {
		yargs.positional("folder-name", {
			describe: "Folder to create your Exzo dapp in",
			type: "string",
			default: null,
		});
	}
).argv;

try {
	// Print the Exzo logo and welcome message
	console.log(
		chalk.green(`
	::::::::::::::::::::::::................
        ::::::::::::::::::::::::................
        ::::::::::::::::::::::::................
        ::::::::::::::::::::::::................
        ::::::::::::::::::::::::................
        ::::::::::::::::-+#%%#+-:...............
        :::::::::::::=*%%%%%%%%%#+=:............
        :::::::::::#%%%%%+*#%%###%%%#:..........
        :::::::::::%%%%%+::::-+#%%%%%:..........
        :::::::::::%%%%%-:::::::=#%%%:..........
        :::::::::::%%%##-:::::::-#%%%:..........
        :::::::::::##%%%+::::-+#%%%%%:..........
        :::::::::::#%%%%%++#%%%%%%%%#:..........
        :::::::::::::=*%%%%%%%%%%*=:............
        ::::::::::::::::=+#%%#*=:...............
        :::::::::::::::::::--::::...............
        :::::::::::::::::::::::::...............
        :::::::::::::::::::::::::...............
`)
	);

	console.log("\n");
	console.log("🪸 Welcome to the create-exzo-dapp wizard 🪸");

	// If the project path is not provided, ask the user for it
	let projectPath = "";
	let context = {};

	projectPath = cmdLineRes.folderName || "";

	// Checks if project name is provided
	if (typeof projectPath === "string") {
		projectPath = projectPath.trim();
	}

	while (!projectPath) {
		console.log("\n");
		projectPath = await prompts({
			type: "text",
			name: "projectPath",
			message: "What is your project name? \n",
			initial: "my-exzo-dapp",
		}).then(data => data.projectPath);
	}

	//Reformat project's name
	projectPath = projectPath.trim().replace(/[\W_]+/g, "-");
	context.resolvedProjectPath = path.resolve(projectPath);
	let dirExists = fse.existsSync(context.resolvedProjectPath);

	let i = 1;

	// Check if project exists
	while (dirExists) {
		projectPath = await prompts({
			type: "text",
			name: "projectPath",
			message:
				"A directory with this name already exists, please use a different name \n",
			initial: cmdLineRes.folderName
				? `${cmdLineRes.folderName}-${i}`
				: `${projectPath}-${i}`,
		}).then(data => data.projectPath.trim().replace(/[\W_]+/g, "-"));

		context.resolvedProjectPath = path.resolve(projectPath);

		dirExists = fse.existsSync(context.resolvedProjectPath);

		i += 1;
	}
	context.projectName = path.basename(context.resolvedProjectPath);

	if (cmdLineRes.folderName) {
		createDapp(context.resolvedProjectPath, context.projectName);
	} else {
		const finalPrompt = await prompts({
			type: "confirm",
			name: "value",
			message: `Are you sure you want to create your exzo dapp in ${chalk.green(
				projectPath
			)} folder? \n`,
			initial: true,
		}).then(data => data.value);

		if (finalPrompt) {
			createDapp(context.projectName, context.projectName);
		} else {
			process.exit(0);
		}
	}
} catch (err) {
	process.env.ENVIRONMENT === "development" && console.error(err);
}