const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const prompt = 'Hi :) can you explian what is react js in 30-40 words';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
};

const requestBody = {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: prompt },
  ],
};

fetch(apiUrl, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(requestBody),
})
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    console.log(data.choices[0].message)
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle errors here
  });
