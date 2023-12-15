# Purpose
This project takes a JIRA query to fetch JIRA issues uses chatGPT to summarize each issue and gives an overall summary
Using this data it then creates a powerpoint presentation

# Setup
You will need to customize the jira query yourself to get the issues you want to summarize
https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-get

Create an .env file following the format of .env.example

# Running
to run
```bash
yarn start
```

# Notes
Changing the chatgpt prompt may break the text parsing for the powerpoint slides