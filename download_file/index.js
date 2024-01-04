const fs = require('fs');
const util = require('util');

const API_URL = 'https://api.hancock.ink/v1';

// const finished = util.promisify(stream.finished);

function getFileDownloadURL(token, fileId) {
  return fetch(`${API_URL}/files/download_url/${fileId}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    }
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to get file download URL');
      return Promise.reject(error);
    });
}

function downloadFileBody(url, name) {
  const writeStream = fs.createWriteStream(`${name}.pdf`);

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return response.text().then(err => Promise.reject(err));
      }

      return response.body.pipeTo(fs.WriteStream.toWeb(writeStream));
    })
    .catch((error) => {
      console.log('Unable to upload file');
      return Promise.reject(error);
    });
}

async function main() {
  const apiToken = process.argv[2];
  const fileId = process.argv[3];

  if (!apiToken) {
    throw new Error('Missing required argument apiToken');
  }
  if (!fileId) {
    throw new Error('Missing required argument fileId');
  }

  const { url } = await getFileDownloadURL(apiToken, fileId);
  await downloadFileBody(url, fileId);

  console.log(`File ${fileId}.pdf succesfully downloaded!`);
}

main()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
