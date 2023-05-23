const { Octokit } = require('octokit');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    
    const { owner, repo } = github.context.repo;

    const tagName = core.getInput('tag-name');
    const commitish = core.getInput('commitish');
    const tagMessage = core.getInput('tag-message');
    const token = core.getInput('token');
    const currentTime = new Date().toISOString();
    
    
    const octokit = new Octokit({
      auth: token,
    });
    
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

