// textProcessing.js

const defaultUserStory = "As a _____________, I can ____________________________, so that ____________________________.";
const defaultAcceptanceCriteria = "1. 2. 3.";

const getTextFromDocument = (documentField) => {
    if (!documentField || !documentField.content) {
        return '';
    }

    let textContent = '';

    function extractText(content) {
        if (content.text) {
            let text = content.text.trim();
            text = text.replace(/(https?:\/\/[^\s]+)/g, '');

            const pattern = '/**\n * ';
            const patternIndex = text.indexOf(pattern);
            if (patternIndex !== -1) {
                text = text.substring(0, patternIndex);
            }

            if (text.includes(defaultAcceptanceCriteria) || text.includes(defaultUserStory)) {
                textContent += '';
            } else {
                textContent += text + ' ';
            }
        }
        if (content.content) {
            content.content.forEach(extractText);
        }
    }

    documentField.content.forEach(extractText);
    return textContent.trim();
};

const processJiraIssue = (issue) => {
    const processedIssue = {
        summary: issue.fields.summary,
        description: getTextFromDocument(issue.fields.description),
        acceptanceCriteria: getTextFromDocument(issue.fields.customfield_10080),
        userStory: getTextFromDocument(issue.fields.customfield_10079)
    };
    return processedIssue;
};

export default processJiraIssue;
