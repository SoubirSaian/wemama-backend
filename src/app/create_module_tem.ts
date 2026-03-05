/* eslint-disable no-undef */
import fs from 'fs';
import { modelNames } from 'mongoose';
import path from 'path';

// Function to create module folder and files inside a given profile folder
function createModule(profileName: string, moduleName: string): void {
    const baseDir = path.join(__dirname, profileName);
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
    }

    const moduleDir = path.join(baseDir, moduleName);
    if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir);
    }
    const files: string[] = [
        `${moduleName}.interface.ts`,
        `${moduleName}.routes.ts`,
        `${moduleName}.model.ts`,
        `${moduleName}.controller.ts`,
        `${moduleName}.service.ts`,
        `${moduleName}.validation.ts`,
    ];

    const defaultContents: Record<string, string> = {
        [`${moduleName}.interface.ts`]: `import { Types } from "mongoose";

export interface I${capitalize(moduleName)} {
    user: Types.ObjectId;
    name: string;
    username?: string;
    phone?: string;
    email: string;
    address?: string;
    profile_image?: string;
    totalAmount?: number;
    totalPoint?: number;
}`,

        [`${moduleName}.routes.ts`]: `import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ${moduleName}Validations from "./${moduleName}.validation";
import ${moduleName}Controller from "./${moduleName}.controller";


const ${moduleName}Router = express.Router();



export default ${moduleName}Router;`,

        [`${moduleName}.model.ts`]: `import { model, Schema, models } from "mongoose";
import { I${capitalize(moduleName)} } from "./${moduleName}.interface";

const ${moduleName}Schema = new Schema<I${capitalize(moduleName)}>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    profile_image: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },
    totalPoint: { type: Number, default: 0 }
}, { timestamps: true });

const ${moduleName}Model = models.${capitalize(moduleName)} || model<I${capitalize(moduleName)}>("${capitalize(
            moduleName
        )}", ${moduleName}Schema);

export default ${moduleName}Model;`,

        [`${moduleName}.controller.ts`]: `import catchAsync from "../../../utilities/catchasync";
import sendResponse from "../../../utilities/sendResponse";
import ${moduleName}Services from "./${moduleName}.service";

const u = catchAsync(async (req, res) => {

    const result = await ${moduleName}Services.updateUserProfile();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "P",
        data: result,
    });
});

const ${capitalize(moduleName)}Controller = { u };

export default ${capitalize(moduleName)}Controller;`,

        [`${moduleName}.service.ts`]: `import ApiError from "../../../error/ApiError";
import { I${capitalize(moduleName)} } from "./${moduleName}.interface";
import ${moduleName}Model from "./${moduleName}.model";

const u = async () => {

};

const ${capitalize(moduleName)}Services = { u };

export default ${capitalize(moduleName)}Services;`,

        [`${moduleName}.validation.ts`]: `import { z } from "zod";

        
const u = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const ${capitalize(moduleName)}Validations = { u };

export default ${capitalize(moduleName)}Validations;`,
    };

    files.forEach((file) => {
        const filePath = path.join(moduleDir, file);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, defaultContents[file], 'utf8');
        }
    });

    console.log(
        `Module '${moduleName}' created successfully inside '${profileName}'.`
    );
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const args: string[] = process.argv.slice(2);
if (args.length !== 2) {
    console.log('Usage: ts-node script.ts <profileName> <moduleName>');
    process.exit(1);
}

const profileName: string = args[0];
const moduleName: string = args[1];
createModule(profileName, moduleName);
