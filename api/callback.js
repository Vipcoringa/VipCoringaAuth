import axios from "axios";

const CLIENT_ID = "1388781351984955392";
const CLIENT_SECRET = "clAFaqOa5jxlcYYtv89zGOmZbJBI54CV";
const REDIRECT_URI = "https://vipcoringa.vercel.app/api/callback";
const BOT_TOKEN = "MTM4ODc4MTM1MTk4NDk1NTM5Mg.GScJ53.YAAvi576AkdsvvQrD-5buBWAhdMNMA26rURXRU";
const GUILD_ID = "1347747437854326875";

export default async function handler(req, res) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Código de autorização ausente.");

    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        scope: "identify guilds.join",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data?.access_token;
    if (!accessToken) throw new Error("Token de acesso não recebido.");

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userId = userResponse.data?.id;
    if (!userId) throw new Error("ID do usuário não encontrado.");

    await axios.put(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${userId}`,
      { access_token: accessToken },
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.writeHead(302, { Location: '/?verified=1' });
    res.end();

  } catch (err) {
    console.error("Erro no callback Discord:", err?.response?.data || err?.message || err);
    if (!res.headersSent) {
      res.status(500).send("Erro na autenticação Discord. Tente novamente mais tarde.");
    }
  }
}
