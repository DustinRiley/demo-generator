import getJiraIssues from './jira.js'
import processJiraIssue from './textProcessing.js'
import summarizeSprint from './chatGpt.js'
import createPowerpoint from './createPowerPoint.js';
import dotenv from 'dotenv';
dotenv.config();
const main = async () => {

  try {
    const jiraResponse = await getJiraIssues();
    const processedIssues = jiraResponse.issues.map(processJiraIssue);
    const processedIssuesString = processedIssues.map(JSON.stringify).join('\n\n');

    if (!processedIssuesString) {
      throw new Error('No issues found');
    }

    // needed if doing threads
    // create readable stream from object array
    // const processedIssuesStream = fs.createReadStream(processedIssues);
    // fs.writeFileSync('processed_issues.json', JSON.stringify(processedIssues, null, 4), 'utf8');


    const response = await summarizeSprint(processedIssuesString);
    createPowerpoint(response);
    console.log("done")
  } catch (error) {
    console.error(`Error in main function: ${error.message}`);
  }
};

main();
