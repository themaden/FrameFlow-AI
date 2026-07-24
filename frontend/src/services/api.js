const API_BASE = '/api';

/**
 * Initiates campaign generation on backend.
 */
export async function startCampaign(userPrompt, style = 'Cinematic', numScenes = 4) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_prompt: userPrompt, style, num_scenes: numScenes }),
  });

  if (!response.ok) {
    throw new Error('Failed to trigger campaign generation');
  }

  return response.json();
}

/**
 * Connects to Server-Sent Events (SSE) stream for live updates.
 */
export function streamProgress(taskId, onUpdate, onError) {
  const eventSource = new EventSource(`${API_BASE}/stream/${taskId}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onUpdate(data);

      if (data.status === 'completed' || data.status === 'failed') {
        eventSource.close();
      }
    } catch (err) {
      console.error('Error parsing SSE data:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.error('SSE connection error:', err);
    if (onError) onError(err);
    eventSource.close();
  };

  return () => eventSource.close();
}
