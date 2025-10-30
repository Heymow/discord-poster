const sunoApi = {};

// Extract the Suno ID from a message
sunoApi.extractSunoIdFromMessage = (message) => {
    const match = message.match(/suno\.com\/song\/([a-f0-9\-]{36})/i);
    return match ? match[1] : null;
}

// Fetch song analysis from the Suno API
sunoApi.fetchSongAnalysis = async (songId) => {
    const apiUrl = process.env.SUNOAPI_URL;
    if (!apiUrl) {
        throw new Error('❌ SUNOAPI_URL environment variable is not defined.');
    }
    const url = `${process.env.SUNOAPI_URL}${songId}`;
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`❌ Failed to fetch song analysis: ${res.statusText}`);
        }

        return await res.json();
    } catch (err) {
        console.error(`❌ Error fetching song analysis: ${err.message}`);
        throw err;
    }
}

// Export both functions
module.exports = sunoApi;