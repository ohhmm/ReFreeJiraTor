import { log } from "console";
import * as bugtracker from "./bugtracker";
import * as github from "./github";
import * as jira from "./jira";

export function newIssueURL(url: string): bugtracker.Issue {
  const urlObj = new URL(url);
  if (urlObj.hostname === "github.com") {
    return new github.GitHubIssueURL(url, urlObj);
  } else if (
    urlObj.hostname.match(/.+\.atlassian\.net/) ||
    urlObj.hostname === "bugreports.qt.io"
  ) {
    return new jira.JiraIssueURL(url, urlObj);
  } else {
    log("Implement issue tracker support: " + urlObj);
    throw new Error("Implement issue tracker support: " + urlObj);
  }
}
