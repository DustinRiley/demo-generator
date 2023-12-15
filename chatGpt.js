import OpenAI from "openai";
import fs from 'fs';


const createWithThreads = async (openai) => {

  const assistant = await openai.beta.assistants.create({
    model: "gpt-4-1106-preview",
    tools: [{ "type": "code_interpreter" }],
    instructions: `You're an assistant that creates well laid out PowerPoint presentations for sprint demos using the users provided input. 
    Each slide should have a title, subtitle and description. 
    The text of the slides should always fit within the slide. the description should never be more than half the width of the slide.
    All text should be left aligned, and be consistently formatted.
    you should follow the provided layout for each slide that is provided by the user
    `,

  })
  const run = await openai.beta.threads.createAndRun(
    {
      assistant_id: assistant.id,
      thread: {
        messages: [
          {
            role: "user", content: `Let's create a well structured powerpoint presentation for our sprint demo, making sure to include all issues. Here is my presentation data:
          ${response.choices[0].message.content}
          `
          },
        ],
      },
    }
  );


  let runStatus = "queued";
  let runObject;
  let count = 0;
  while (runStatus === "queued" || runStatus === "in_progress") {
    runObject = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id,
    );
    runStatus = runObject.status;
    console.log("Run status: ", runStatus)
    console.log("Waiting for seconds: ", count += 5)
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  if (runStatus === "failed") {
    throw new Error('No response from OpenAI');
  }
  const messages = await openai.beta.threads.messages.list(
    run.thread_id,
  );

  const files = messages.data.flatMap(message => message.file_ids)
  const firstFile = files[0];
  const data = await openai.files.content(firstFile);

  const runStep = await openai.beta.threads.runs.steps.list(
    run.thread_id,
    run.id
  );

  const fileData = await data.arrayBuffer();
  const powerpoint_data_buffer = Buffer.from(fileData);
  fs.writeFileSync(`./my-powerpoint-${firstFile}.pptx`, powerpoint_data_buffer);

}

const callChatGptApi = async (processedIssuesString) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {



    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 6000,
      messages: [
        { "role": "system", "content": "Create the text for a PowerPoint presentation for our sprint demo using the users provided content, challenges, solutions, and metrics. For each item in the file, produce a brief summary suitable for non-technical stakeholders, to be presented on individual slides. Avoid specific names, code, or user stories.\n\nSlide Layout:\n\n1. Introduction Slide:\n   - Title: 'Sprint Demo Release'\n   - Subtitle: 'Spaghetti Factory Team'\n   - Sprint Cycle: '{DATE RANGE OF 2 WEEKS ENDING ON THE NEXT MONDAY}'\n\n2. Goal Slide:\n   - Title: 'Sprint Goal'\n   - Subtitle: '{SUMMARY OF THEME OF THIS SPRINT FROM ALL ISSUES}'\n\n3. Issue Slides (for each issue):\n   - Title: '{ISSUE TITLE}'\n   - Subtitle: '{Reflect broader themes related to the sprint objectives, e.g., Marketing, Documentation Upgrades}'\n   - Description: '{SUMMARY OF THE ISSUE, including any metrics or KPIs if available}'" },
        { "role": "user", "content": processedIssuesString }
      ]
    })


    return response.choices[0].message.content;

  } catch (error) {
    console.error(`Failed to call OpenAI Chat API: ${error.message}`);
    throw error;
  }
};

export default callChatGptApi;

