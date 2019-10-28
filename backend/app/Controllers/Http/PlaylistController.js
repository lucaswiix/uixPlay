'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


/** @type {typeof import('../../Models/Playlist')} Model */
const $playlist = use('App/Models/Playlist');
/** @type {typeof import('../../Models/Song')} Model */
const $song = use('App/Models/Song');

const moment = use(`moment`);
/**
 * Resourceful controller for interacting with playlists
 */
class PlaylistController {

  /**
   * List playlist.
   * GET playlists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ params, request, auth, response }) {
    const { pageNum, perPage } = request.all();    
    return await $playlist
    .query()
    .select(`uuid`, `name`, `isPrivate`, `thumbnail`, `created_at`, `updated_at`)
    .where((builder) => {
      builder.where(`isPrivate`, 0);
      builder.orWhere('user_id', auth.user.id);
    })
    .paginate(pageNum ? pageNum : 1, perPage ? perPage : 20);
  }

  /**
   * List songs of playlist.
   * GET playlists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async songs ({ params, request, auth, response }) {
    const { pageNum, perPage } = request.all(); 
    const playlist = await $playlist.findByUUID(params.uuid);
    return await $song
    .query()
    .where('playlist_id', playlist.id)
    .paginate(pageNum ? pageNum : 1, perPage ? perPage : 20);
  }

  /**
   * Create/save a new playlist.
   * POST playlists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, request, auth, response }) {
    const { name, isPrivate } = request.all();
    return await $playlist.new({user_id: auth.user.id, isPrivate, name});
   }

  /**
   * Display a single playlist.
   * GET playlists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, auth, response }) {
    const uuid = params.uuid;

    return await $playlist
    .query()
    .select(`uuid`, `name`, `isPrivate`, `user_id`, `thumbnail`, `created_at`, `updated_at`)
    .with(`user`)
    .where((builder) => {
      builder.where(`isPrivate`, 0);
      builder.orWhere('user_id', auth.user.id);
    })
    .where('uuid', uuid).first();
  }
  /**
   * Update playlist details.
   * PUT or PATCH playlists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, auth, response }) {
    const uuid = params.uuid;
    const { name } = request.all();
    
    await $playlist
      .query()
      .where('user_id', auth.user.id)
      .where(`uuid`, uuid)
      .update({name});

  }

  /**
   * Delete a playlist with id.
   * DELETE playlists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, auth, response }) {
    const uuid = params.uuid;

    let isDel = await $playlist.query()
            .where(`user_id`, auth.user.id)
            .where(`uuid`, uuid)
            .update({deletedDate: moment().format(`YYYY-MM-DD HH-mm-ss`)});

    if(isDel) return response.ok();
    else return response.badRequest();
  }
}

module.exports = PlaylistController
