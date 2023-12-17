
export interface Issue extends URL {
    getHostName(): string;
    getIssueId(): string;
    restApiHost(): string;
    restApiSuffix(): string;
    restApiUrl(): URL;
}

export abstract class BugtrackerIssueURL<T extends BugtrackerIssueURL<T>>
   extends URL
   implements Issue
{

    constructor(input: string, base?: string | URL) {
        super(input, base);
    }

    static usualIssueId(url: URL): string {
        const path = url.pathname.split("?")[0];
        const pathParts = path.split("/");
        const issueId = pathParts[pathParts.length - 1];
        return issueId;
    }

    getIssueId(): string {
        return BugtrackerIssueURL.usualIssueId(this);
    }

    abstract getHostName(): string;
    abstract restApiHost(): string;
    abstract restApiSuffix(): string;

    restApiUrl(): URL {
        const url = new URL(this.toString(), this);
        url.hostname = this.restApiHost();
        url.pathname = this.restApiSuffix() + "/" + this.getIssueId();
        return url;
    }
}
