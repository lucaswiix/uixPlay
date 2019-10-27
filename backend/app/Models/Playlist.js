'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const uuid = use('uuid');
class Playlist extends Model {
    static get primaryKey () {
        return 'uuid'
      }
    
      static get incrementing () {
        return false
      }

      static async findByUUID(uuid){
        return await this.query()
          .where('uuid', uuid)
          .first();
      }

      static async new(data){
        return await this.create({ uuid:uuid.v4(), ...data});
      }

}

module.exports = Playlist
