'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SongsSchema extends Schema {
  up () {
    this.create('songs', (table) => {
      table.increments();
      table.uuid('uuid').notNullable().unique();     
      table.string(`name`).notNullable();
      table.string('url');
      table.string('src');
      table.integer('playlist_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('playlists')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
            
      table.timestamps()
    })
  }

  down () {
    this.drop('songs')
  }
}

module.exports = SongsSchema
