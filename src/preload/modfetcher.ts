import path from "path";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "fs";

export class ModFetcher {
    async modlistExists(): Promise<boolean> {
        return fs.existsSync(path.join(process.cwd(), "data", "modrepo"));
    }

    async refreshModList(): Promise<void> {
        const dir = path.join(process.cwd(), "data", "modrepo");
        if (await this.modlistExists()) {
            await git.clone({
                fs,
                http,
                dir,
                url: "https://github.com/skyline69/balatro-mod-index",
            });
        } else {
            await git.pull({ fs, http, dir, ref: "main" });
        }
    }

    async getModList(): Promise<any[]> {
        const modsDir = path.join(process.cwd(), "data", "modrepo", "mods");
        const mods = fs.readdirSync(modsDir);
        const modDirs = mods.filter((mod) =>
            fs.lstatSync(path.join(modsDir, mod)).isDirectory()
        );
        const modList = modDirs.map((mod) => {
            const modPath = path.join(modsDir, mod);
            const modInfo = JSON.parse(
                fs.readFileSync(path.join(modPath, "meta.json")).toString()
            );
            modInfo.folderName = mod;
            const imagePath = path.join(modPath, "thumbnail.jpg");
            if (fs.existsSync(imagePath)) {
                const imageB64 = fs.readFileSync(imagePath, { encoding: 'base64' });
                modInfo.imageB64 = imageB64;
            }
            const descriptionPath = path.join(modPath, "description.md");
            if (fs.existsSync(descriptionPath)) {
                modInfo.description = fs.readFileSync(descriptionPath).toString();
            }
            return modInfo;
        });

        return modList;
    }
}
