const { httpsRequest } = require('./httpsRequest');

const projectId = process.env.PROJECT_ID;
const token = process.env.PUBSUB_TOKEN;
const topic = process.env.PUBSUB_TOPIC || "github";

/**
 * Posts a message to a PubSub topic.
 *
 * @param {string} message The message string to post
 */
exports.postMessage = async (message) => {

  encodedMessage = Buffer.from(message).toString('base64')

  const postData = JSON.stringify({
    "messages": [{ "data": encodedMessage }]
  });


  console.log(postData)
  const options = {
    hostname: 'pubsub.googleapis.com',
    port: 443,
    path: `/v1/projects/${projectId}/topics/${topic}:publish`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  const request = await httpsRequest(options, postData);
  return { location: `https://pubsub.googleapis.com/c/v1/projects/${projectId}/topics/${topic}:publish`, body: request };
};