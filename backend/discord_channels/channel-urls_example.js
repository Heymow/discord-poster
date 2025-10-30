module.exports = [
  // Name of a Discord channel
  "https://discord.com/channels/{serverId}/{channelId}",
];

const urls = {};

urls.SHOWCASE_URLS = new Set([
  // Name of a Discord channel for Suno AI song links
  "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.PLAYLIST_URLS = new Set([
  // Name of a Discord channel for playlist links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.RIFFUSION_URLS = new Set([
  // Name of a Discord channel for Riffusion links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.YOUTUBE_URLS = new Set([
  // Name of a Discord channel for YouTube links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.SPOTIFY_URLS = new Set([
  // Name of a Discord channel for Spotify links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.SOUNDCLOUD_URLS = new Set([
  // Name of a Discord channel for SoundCloud links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.TWITTER_URLS = new Set([
  // Name of a Discord channel for Twitter links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.INSTAGRAM_URLS = new Set([
  // Name of a Discord channel for Instagram links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.TIKTOK_URLS = new Set([
  // Name of a Discord channel for TikTok links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

urls.FACEBOOK_URLS = new Set([
  // Name of a Discord channel for Facebook links
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

// The following channels are @everyone channels, which means they can be tagged with @everyone
urls.EVERYONE_CHANNELS = new Set([
  // These channels will be tagged with @everyone. They also have to be in the above lists.
  // "https://discord.com/channels/{serverId}/{channelId}",
]);

module.exports = urls;
