'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlaylistSchema extends Schema {
  up () {
    this.create('playlists', (table) => {
      table.increments()
      table.uuid('uuid').notNullable().unique();
      table.string('name').notNullable();
      table.integer(`group_id`)
        .notNullable()
        .unsigned()
        .references(`id`)
        .inTable(`groups`)
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.timestamps()
    })
  }

  down () {
    this.drop('playlists')
  }
}

module.exports = PlaylistSchema
