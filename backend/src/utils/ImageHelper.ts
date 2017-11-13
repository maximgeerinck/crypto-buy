import * as fs from "fs";
import * as path from "path";
import * as request from "request";
import * as url from "url";
const gm = require("gm").subClass({ imageMagick: true });

const DEFAULT_EXTENSION = "jpg";

export const getExt = (image: string): string => {
    if (!image) {
        return DEFAULT_EXTENSION;
    }

    const parts = image.split(".");
    if (parts.length <= 1) {
        return DEFAULT_EXTENSION;
    }

    const ext = parts.slice(-1).join(".");

    return ext.length < 5 ? ext : DEFAULT_EXTENSION;
};

export const downloadImage =
    async (imagePath: string, name: string, exportDir: string): Promise<any> => {
        if (!imagePath.startsWith("http") || !url.parse(imagePath)) {
            return;
        }

        try {
            const ext = getExt(imagePath);

            // download image in HR
            // console.log(`creating ${imageName} with extension ${ext}`);
            const writeStream = fs.createWriteStream(
                path.join(__dirname + "/../../public", exportDir, `${name}.${ext}`));
            const req = request(imagePath).on("error", (err: any) => console.log(err));

            return req.pipe(writeStream).on("error", (err: any) => console.log(err));

            // return gm(req)
            //     .resize("50")
            //     .quality(80)
            //     .write(path.join(__dirname + "/../../public", exportDir, `${name}.${ext}`), (err: any) => {
            //         return Promise.resolve();
            //     });
        } catch (ex) {
            console.log(ex);
            return;
        }

    };
