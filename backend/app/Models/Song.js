'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Song extends Model {
    static get primaryKey () {
        return 'uuid'
      }
    
      static get incrementing () {
        return false
      }

      static async new(data){
        return await this.create({ uuid:uuid.v4(), ...data});
      }
}

module.exports = Song
