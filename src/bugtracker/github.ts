import * as bugs from "./bugtracker";

export class GitHubIssueURL extends bugs.BugtrackerIssueURL<GitHubIssueURL> {
  constructor(input: string, base?: string | URL) {
    super(input, base);
  }

  static parse(owner: string, repo: string, number: number) {
    return new GitHubIssueURL(
      `https://github.com/${owner}/${repo}/issues/${number}`,
    );
  }

  getHostName(): string {
    return "github.com";
  }

  restApiHost(): string {
    return "api.github.com";
  }

  restApiSuffix(): string {
    return "issues";
  }
}
