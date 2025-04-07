module.exports = function extractSunoIdFromMessage(message) {
    const match = message.match(/suno\.com\/song\/([a-f0-9\-]{36})/i);
    return match ? match[1] : null;
}

module.exports = async function fetchSongAnalysis(songId) {
    const url = `${process.env.SUNOAPI_URL}${songId}`;
    const res = await fetch(url);
    return await res.json();
}