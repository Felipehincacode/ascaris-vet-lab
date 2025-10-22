import ngrok from 'ngrok';
import qrcode from 'qrcode-terminal';

const port = 8080;

(async function () {
  const url = await ngrok.connect(port);
  console.log(`🚀 Public URL: ${url}`);
  qrcode.generate(url, { small: true });
})();