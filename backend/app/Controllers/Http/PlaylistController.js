'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


/** @type {typeof import('../../Models/Playlist')} Model */
const $playlist = use('App/Models/Playlist');
/** @type {typeof import('../../Models/Song')} Model */
const $song = use('App/Models/Song');
/** @type {typeof import('../../Models/Group')} Model */
const $group = use('App/Models/Group');
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
    const uuid = params.uuid;
    const { pageNum, perPage } = request.all();
    const groups = await $group
    .query()
    .select(`id`)
    .whereNull('deletedDate')
    .where((builder) => {
      builder.where(`isPrivate`, 0);
      builder.orWhere('user_id', auth.user.id);
    }).fetch();
    const groupsIds = groups.toJSON().map(g => g.id);
    const playlist = await $playlist
    .query()
    .whereIn('group_id', groupsIds)
    .where('uuid', uuid)
    .first();

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
    const { name } = request.all();
    const group = await $group.findByUUID(params.groupUUID, auth.user.id);
    return await $playlist.new({group_id: group.id, name});
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
    const { pageNum, perPage } = request.all();
    const groups = await $group
    .query()
    .select(`id`)
    .whereNull('deletedDate')
    .where((builder) => {
      builder.where(`isPrivate`, 0);
      builder.orWhere('user_id', auth.user.id);
    }).fetch();
    const groupsIds = groups.toJSON().map(g => g.id);
    const playlist = await $playlist
    .query()
    .whereIn('group_id', groupsIds)
    .where('uuid', uuid)
    .first();

    return await $song
    .query()
    .where('playlist_id', playlist.id)
    .paginate(pageNum ? pageNum : 1, perPage ? perPage : 20);

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
    const groups = await $group
    .query()
    .select(`id`)
    .whereNull('deletedDate')
    .where((builder) => {
      builder.where(`isPrivate`, 0);
      builder.orWhere('user_id', auth.user.id);
    }).fetch();
    const groupsIds = groups.toJSON().map(g => g.id);
    
    await $playlist
      .query()
      .whereIn(`group_id`, groupsIds)
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
    const uuid = params.id;
    const groups = $group.findByUserId(auth.user.id);
    const groupsIds = groups.map(g => g.id);
    await $playlist.query()
            .whereIn(`group_id`, groupsIds)
            .where(`uuid`, uuid)
            .delete();
  }
}

module.exports = PlaylistController
