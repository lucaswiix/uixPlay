'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const uuid = use(`uuid`);

class Song extends Model {
  static get hidden () {
    return [`id`, `playlist_id`]
  }

  playlist() {
    return this.belongsTo(`App/Models/Playlist`, `playlist_id`, `id`)
  }
  
    static get primaryKey () {
        return 'uuid'
      }
    
      static get incrementing () {
        return false
      }

      static async new(data){
        return await this.create({ uuid:uuid.v4(), ...data});
      }

      static async findByUUID(uuid){
        return await this.query()
          .where('uuid', uuid)
          .first();
      }

}

module.exports = Song
