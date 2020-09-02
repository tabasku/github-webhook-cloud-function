const github = require('../util/github');
const pubsub = require('../util/pubSub');
const HTTPError = require('../util/httpError');

function getPushMessage(body) {
  if (body && body.repository && body.head_commit) {
    const repo = body.repository.name;
    const forced = body.forced ? 'force pushed' : 'pushed';
    const pusher = body.pusher.name;
    const commitMessage = body.head_commit.message;
    const commitUrl = body.head_commit.url;
    const commitAuthor = body.head_commit.author.name;
    const shortHash = body.head_commit.id.substring(0, 7);
    const message = `${pusher} ${forced} [${repo}/${shortHash}](${commitUrl})\n\n${commitMessage}\n\nby *${commitAuthor}*`;
    return message;
  }
  throw new HTTPError(400, `No push message generated for ${body.ref}`);
}

function getPROpenedMessage(body) {
  if (body && body.repository && body.head_commit) {
    const repo = body.repository.name;

    const pusher = body.pusher.name;
    const commitMessage = body.head_commit.message;
    const commitUrl = body.head_commit.url;
    const commitAuthor = body.head_commit.author.name;
    const shortHash = body.head_commit.id.substring(0, 7);
    const message = `${pusher} ${forced} [${repo}/${shortHash}](${commitUrl})\n\n${commitMessage}\n\nby *${commitAuthor}*`;
    return message;
  }
  throw new HTTPError(400, `No PR message generated for ${body.ref}`);
}

/**
 * Posts a message into PubSub Topic in response to a GitHub Webhook Event.
 *
 * @param {object} req Cloud Function request context.
 * @param {object} res Cloud Function response context.
 */
exports.githubToPubSub = async (event, req) => {
  let request = {};
  console.log(req.body)
  if (event === 'push') {
    const comment = getPushMessage(req.body);
    request = await pubsub.postMessage(comment);
  } else {
    request.body = `Ignored unsupported event: ${event}`;
  }
  return request;
};
