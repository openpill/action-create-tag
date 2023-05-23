const { Octokit } = require('octokit');

async function run() {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { owner, repo } = github.context.repo;

    const tagName = process.env.INPUT_TAG_NAME;
    const commitish = process.env.INPUT_COMMITISH;
    const tagMessage = process.env.INPUT_TAG_MESSAGE;
    const currentTime = new Date().toISOString();

    // Create the tag
    const tagResponse = await octokit.rest.git.createTag({
      owner,
      repo,
      tag: tagName,
      message: tagMessage,
      object: commitish,
      type: 'commit',
      tagger: {
        name: 'Joe Tagger',
        email: 'joe.tagger@email.local',
        date: currentTime,
      },
    });

    const tagSha = tagResponse.data.sha;

    // Create the reference to the tag
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tagName}`,
      sha: tagSha,
    });

    console.log('Tag created successfully!');
  } catch (error) {
    console.error('Error creating tag:', error);
    process.exit(1);
  }
}

run();

