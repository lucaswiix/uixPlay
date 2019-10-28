const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const Env = use('Env')

const YD = new YoutubeMp3Downloader({
    "ffmpegPath": Env.get('FFMPEG_PATH', '/usr/bin/ffmpeg'),        // Where is the FFmpeg binary located?
    "outputPath": Env.get('DOWNLOAD_OUTPUT', '/home/lucaswiix/git/uixPlay/backend/assets/mp3'),    // Where should the downloaded and encoded files be stored?
    "queueParallelism": 10,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});

exports.YD = YD;