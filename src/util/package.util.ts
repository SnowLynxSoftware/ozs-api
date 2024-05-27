import * as json from "../../package.json";

export class PackageUtil {
    public static GetVersion(): string {
        return json.version;
    }
}
