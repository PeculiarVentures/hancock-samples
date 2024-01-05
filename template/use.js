const API_URL = 'https://api.hancock.ink/v1';

function getTemplate(token, templateId) {
  return fetch(`${API_URL}/templates/${templateId}`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to get template');
      return Promise.reject(error);
    });
}

function useTemplate(token, templateId, templateRolesData) {
  return fetch(`${API_URL}/templates/${templateId}/use`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      templateRolesData
    }),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to get template');
      return Promise.reject(error);
    });
}


function getFile(token, fileId) {
  return fetch(`${API_URL}/files/meta/${fileId}`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to get file');
      return Promise.reject(error);
    });
}

async function updateFieldsInDocument(token, fileId, fields) {
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

function startTransaction(token, transactionId) {
  return fetch(`${API_URL}/transactions/${transactionId}/start`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }

      return response.json();
    })
    .catch((error) => {
      console.log('Unable to start transaction');
      return Promise.reject(error);
    });
}

async function main() {
  const apiToken = process.argv[2];
  const templateId = process.argv[3];
  const recipientEmail = process.argv[4];

  if (!apiToken) {
    throw new Error('Missing required argument apiToken');
  }
  if (!templateId) {
    throw new Error('Missing required argument templateId');
  }
  if (!recipientEmail) {
    throw new Error('Missing required argument recipientEmail');
  }

  const transaction = await useTemplate(apiToken, templateId, { Contractor: { email: recipientEmail }});

  /* now you have a created transaction in "draft" mode,
     which means on this step you could edit it before start.
  */

  const file = await getFile(apiToken, transaction.fileIds[0]);

  // Prefill ContractorName field for individual recipient

  for (const field of file.attributes.fields) {
    if (field.fieldName === 'ContractorName') {
      field.value = recipientEmail;
    }
  }

  await updateFieldsInDocument(apiToken, file.id, file.attributes.fields);

  // Actually send document for signing

  await startTransaction(apiToken, transaction.id);

  console.log(`Transaction with id ${transaction.id} successfully started!\n User ${recipientEmail} will receive an email.\n You can view transaction at https://app.hancock.ink/transaction/${transaction.id}`);
}

main()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
