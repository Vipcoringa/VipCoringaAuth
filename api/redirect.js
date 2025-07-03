export default function handler(req, res) {
  const redirectUri = encodeURIComponent('https://vipcoringa.vercel.app/api/callback');
  const clientId = '1388781351984955392';

  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify%20guilds.join`;
  res.writeHead(302, { Location: discordAuthUrl });
  res.end();
}
