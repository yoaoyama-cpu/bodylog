exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
 
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
 
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
 
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }
 
    const body = JSON.parse(event.body);
    console.log('Request model:', body.model);
 
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
 
    const data = await response.json();
    console.log('Anthropic response status:', response.status);
 
    if (!response.ok) {
      console.error('Anthropic API error:', JSON.stringify(data));
    }
 
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Function error:', err.message);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
