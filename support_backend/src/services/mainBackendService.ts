const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const callMainBackend = async (endpoint: string, options: FetchOptions = {}) => {
    try {
        // Create a copy of headers and remove Content-Length to let fetch calculate it
        const headers = new Headers(options.headers || {});
        headers.set('Content-Type', 'application/json');

        // Remove Content-Length if present - fetch will recalculate it
        headers.delete('content-length');

        const response = await fetch(`${MAIN_BACKEND_URL}${endpoint}`, {
            ...options,
            headers: headers
        });

        if (!response.ok) {
            console.error(`❌ Backend responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ Error calling main backend: ${endpoint}`, error);
        throw error;
    }
};