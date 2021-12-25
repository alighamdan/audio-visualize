const fs = require("fs");
const extensions = [".mp3", ".ogg"];

writeAllSongs();

function getAllSongs(dir) {
  return fs
    .readdirSync(dir, {
      encoding: "utf8",
    })
    .filter((file) => {
      let fileextension = file.split(".").reverse()[0];
      return extensions.includes(`.${fileextension}`);
    });
}

function writeAllSongs() {
  const data = `const allsongs = `;
  return fs.writeFileSync(
    "./allsongs.js",
    data +
      JSON.stringify(getAllSongs("./Music/"))
        .replace(/",/g, '",\n    ')
        .replace("[", "[\n    ")
        .replace(/"\]/g, "\"\n]")
  );
}
