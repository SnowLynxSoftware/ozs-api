export class BaseRouter {
    public readonly BASE_PATH: string;
    public ROUTE_OPTIONS: Array<any>;

    constructor(_basePath: string) {
        this.BASE_PATH = _basePath;
        this.ROUTE_OPTIONS = [];
    }
}
