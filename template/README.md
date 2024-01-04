# Hancock create transaction example

This example will create a new transaction and send it yo specified person.

Run example script:
- Run the example with `node create.js API_TOKEN FILE_ID`.
  You could use API_TOKEN obtained from [obtain token example](../obtain_api_token).
  You could use FILE_ID obtained from [upload file example](../upload_file) or any other file in your account: [https:/app.hancock.ink/files](https:/app.hancock.ink/files).
- Template will be created with sample fields added to the document.
- Run the example with `node use.js API_TOKEN TEMPLATE_ID RECIPIENT_EMAIL`.
  You could use API_TOKEN obtained from [obtain token example](../obtain_api_token).
  You could use TEMPLATE obtained from previous command output.
  It will prefill field for user and send transaction to specified email.

Notes:
- The examples is based on the [Hancock API](https://docs.hancock.ink).
- The example was tested on MacOS v14.1.1 with node v18.15.0
