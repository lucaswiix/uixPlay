'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('../../Models/Group')} Model */
const group = use('App/Models/Group');

/** @type {typeof import('../../Models/Playlist')} Model */
const playlist = use('App/Models/Playlist');
const moment = use('moment');

/**
 * Resourceful controller for interacting with groups
 */
class GroupController {
  /**
   * Show a list of all groups.
   * GET groups
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, auth }) {
    const { search, pageNum, perPage } = request.all();
    if(search){
      return await group.query()
      .select(`uuid`, `name`, `isPrivate`, `created_at`)
      .where('name', 'LIKE', `%${search}%`)
      .whereNull('deletedDate')
      .where((builder) => {
        builder.where(`isPrivate`, 0);
        builder.orWhere('user_id', auth.user.id);
      })
      .paginate(pageNum ? pageNum : 1, perPage ? perPage : 20);
    }else{
      return await group.query()
      .select(`uuid`, `name`, `isPrivate`, `created_at`)
      .whereNull('deletedDate')
      .where((builder) => {
        builder.where(`isPrivate`, 0);
        builder.orWhere('user_id', auth.user.id);
      })
      .paginate(pageNum ? pageNum : 1, perPage ? perPage : 20);
    }
  }

  /**
   * Create/save a new group.
   * POST groups
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    const data = request.only(['name', 'isPrivate']);
    return await group.new({user_id: auth.user.id, ...data});
  }

  /**
   * Display a single group.
   * GET groups/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, auth, response }) {
    const uuid = params.uuid;
    return await group.findByUUID(uuid); 
  }

  /**
   * Display a playlists in group.
   * GET groups/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async playlist({ params, request, auth, response }){
    const groupUUID = params.uuid;
    const { pageNum, perPage } = request.all();
    const singleGroup = await group.findByUUID(groupUUID, auth.user.id);
    return await playlist
    .query()
    .select(`uuid`, `name`, `created_at`)
    .where('group_id', singleGroup.id)
    .paginate(pageNum ? pageNum : 1, perPage ? perPage : 20);

  }

  /**
   * Update group details.
   * PUT or PATCH groups/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, auth, response }) {
    const data = request.only(['name']);
    const uuid = params.id;
    await group.query()
    .where('uuid', uuid)
    .where('user_id', auth.user.id)
    .update({name: data.name});
  }

  /**
   * Delete a group with id.
   * DELETE groups/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, auth, response }) {
    const uuid = params.id;
    await group.query()
    .where('uuid', uuid)
    .where('user_id', auth.user.id)
    .update({
      deletedDate: moment().format('YYYY-MM-DD HH-mm-ss')
    })
  }

}

module.exports = GroupController
