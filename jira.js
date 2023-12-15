import fetch from 'node-fetch';

const getJiraIssues = async () => {
  try {
    const response = await fetch(`${process.env.JIRA_ENDPOINT}/rest/api/3/search?jql=project%20%3D%20'DEVP'%20AND%20status%20%3D%20'Done'%20AND%20sprint%20%3D%202914%20AND%20type%20in%20standardIssueTypes()&startAt=0&maxResults=50&validateQuery=strict&fields=summary,description,customfield_10080,customfield_10079`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.BOT_EMAIL}:${process.env.API_TOKEN}`).toString('base64')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch Jira issues: ${error.message}`);
    throw error;
  }
};

export default getJiraIssues;
