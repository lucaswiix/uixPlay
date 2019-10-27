'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const uuid = use('uuid');
class Group extends Model {
    static get primaryKey () {
        return 'uuid'
      }
    
      static get incrementing () {
        return false
      }

      static async findByUUID(uuid, user_id){
        return await this.query()
          .whereNull('deletedDate')
          .where('uuid', uuid)
          .where((builder) => {
            builder.where(`isPrivate`, 0);
            builder.orWhere('user_id', user_id);
          })
          .first();
      }

      static async findByUserId(id){
        return await this.query()
        .where('user_id', id)
        .whereNull(`deletedDate`)
        .fetch();
      }

      static async new(data){
        return await this.create({ uuid:uuid.v4(), ...data});
      }
}

module.exports = Group
