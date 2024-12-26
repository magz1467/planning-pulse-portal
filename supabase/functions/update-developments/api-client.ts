export async function fetchPageOfApplications(pageUrl: string) {
  const response = await fetch(pageUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Planning API responded with status: ${response.status}`);
  }

  return await response.json();
}