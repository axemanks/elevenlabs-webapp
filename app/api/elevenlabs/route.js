import fs from "fs"; // to write the file
import path from "path"; // needed to specify path for file

export async function POST(request) {
    // get message and voice from request
  const { message, voice } = await request.json();

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: message,
          voice_settings: {
            stability: 0,
            similarity_boost: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

      const arrayBuffer = await response.arrayBuffer();
      // create file
      const buffer = Buffer.from(arrayBuffer);
      // give it a random name
      const file = Math.random().toString(36).substring(7);
    // save file
    fs.writeFile(path.join("public", "audio", `${file}.mp3`), buffer, () => {
      console.log("File written successfully");
    });
    // return audio file to front
    return new Response(JSON.stringify({ file: `${file}.mp3` }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}