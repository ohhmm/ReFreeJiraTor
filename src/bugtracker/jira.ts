
import * as bugs from './bugtracker';

export class JiraIssueURL
    extends bugs.BugtrackerIssueURL<JiraIssueURL>
{
    constructor(input: string, base?: string | URL) {
        super(input, base);
    }

    getHostName(): string {
        return this.hostname;
    }

    restApiHost(): string {
        return this.hostname;
    }

    restApiSuffix(): string {
        return "rest/api/2/issue";
    }
}
