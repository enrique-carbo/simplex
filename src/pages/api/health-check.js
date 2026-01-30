// src/pages/api/health-check.js
export async function GET() {
  const tests = {
    env: {
      POCKETBASE_URL: import.meta.env.PUBLIC_POCKETBASE_URL,
      MODE: import.meta.env.MODE
    },
    fetchTest: null,
    error: null
  };
  
  try {
    const response = await fetch(`${import.meta.env.PUBLIC_POCKETBASE_URL}/api/collections/products/records?perPage=1`);
    tests.fetchTest = {
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get('content-type')
    };
  } catch (error) {
    tests.error = error.message;
  }
  
  return new Response(JSON.stringify(tests, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}