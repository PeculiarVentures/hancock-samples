const API_URL = 'https://api.hancock.ink/v1';

function createTemplate(token, fileId) {
  return fetch(`${API_URL}/templates`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Non Disclosure for test',
      fileIds: [fileId], // specify one or more files to be included in transaction
      recipients: [{ type: 'signer', role: 'Contractor' }], // specify one or more transaction recipients
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to create template');
      return Promise.reject(error);
    });
}

async function addFieldsToDocument(token, fileId, fields) {
  return fetch(`${API_URL}/files/meta/${fileId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      attributes: { fields },
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to add fields');
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

  const template = await createTemplate(apiToken, fileId);

  // Add sample fields to the document
  // NOTE: it is recommended to add fields via UI for better experience

  const fields = [
    {
      "fieldName": "Sender",
      "type": "text",
      "rect": [
        59.3,
        6.2591,
        17.3,
        2.8591
      ],
      "readonly": true,
      "id": "6596c5f452038034a327f9f3",
      "page": 0,
      "value": "My Company",
    },
    {
      "fieldName": "ContractorName",
      "type": "text",
      "rect": [
        23.2,
        9.2727,
        23.9,
        2.1636
      ],
      "recipient": {
        "role": "Contractor"
      },
      "id": "6596c5f4a9ddc4dee329d330",
      "page": 0,
    }
  ];

  console.log(`Template with id ${template.id} successfully started!\n You can view template at https://app.hancock.ink/template/${template.id}`);

  await addFieldsToDocument(apiToken, fileId, fields);

  console.log('Sample fields were added to document');
}

main()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
