'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


/** @type {typeof import('../../Models/Playlist')} Model */
const $playlist = use('App/Models/Playlist');
/** @type {typeof import('../../Models/Song')} Model */
const $song = use('App/Models/Song');
const fs = use('fs');
const http = use('axios');
const Env = use('Env')
const { YD } = require(`../../../config/config_ffmpeg`);
/**
 * Resourceful controller for interacting with songs
 */
class SongController {
  /**
   * Show a list of all songs.
   * GET songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    
  }


  /**
   * Create/save a new song.
   * POST songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, request, auth, response }) {
    const req = request.only([`url`]);
    let data = { videoId: req.url.split(`?v=`)[1] };    
    const res = await http.get(`https://content.googleapis.com/youtube/v3/videos?id=${data.videoId}&part=snippet&key=AIzaSyALsgqXO--x3zz4E-NZep_KOaeqKxbMIMo`);
    let playlist = await $playlist.findByUUID(params.playlistUUID);
    await $playlist.query().where(`uuid`, params.playlistUUID).update({thumbnail: res.data.items[0].snippet.thumbnails.default.url});

    return await $song.new({ thumbnail: res.data.items[0].snippet.thumbnails.default.url, name: res.data.items[0].snippet.title, playlist_id: playlist.id, ...data});
  }


  /**
   * Download song and send arrayOfBytes.
   * POST songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async downloadSong ({ params, request, auth, response }) {
    const song = await $song.findByUUID(params.songUUID);
    let path = `${Env.get('DOWNLOAD_OUTPUT')}/${song.toJSON().uuid}.mp3`;
    try {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }

      YD.download(song.toJSON().videoId, `${song.toJSON().uuid}.mp3`);
      
      response.ok({started: true});
      YD.on("progress", async (progress) => {
        await $song.query().where(`uuid`, params.songUUID).update({status: 'downloading'});
        // console.log(progress);
      });

      YD.on("finished", async (err, data) => {
        await $song.query().where(`uuid`, params.songUUID).update({status: 'downloaded'});
        console.log(`finished!`);
      });

      YD.on("error", async (error) => {
        await $song.query().where(`uuid`, params.songUUID).update({status: 'error'});
      });      

    } catch (error) {
      console.log(`error DOWNLOADSONG`, error);
      return response.internalServerError()
    }
  }

  async getStatus({ params, request, auth, response }) {
    const song = await $song.findByUUID(params.songUUID);
    let path = `${Env.get('DOWNLOAD_OUTPUT')}/${song.toJSON().uuid}.mp3`;
    if(song.toJSON().status == `downloaded`){
      return response.attachment(path)
    }
    return response.ok({ status: song.toJSON().status});
  }
  /**
   * Display a single song.
   * GET songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const uuid = params.uuid;
    return await $song.query().with(`playlist`).where(`uuid`, uuid).first();
  }

  /**
   * Update song details.
   * PUT or PATCH songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a song with id.
   * DELETE songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const uuid = params.songUUID;
    let isDeleted = await $song
                          .query()
                          .where('uuid', uuid)
                          .delete();

    if(isDeleted) return response.ok();
    else return response.badRequest({ error: 'Cannot find this song.'});
  }
}

module.exports = SongController
