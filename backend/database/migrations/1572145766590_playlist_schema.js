'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlaylistSchema extends Schema {
  up () {
    this.create('playlists', (table) => {
      table.increments()
      table.uuid('uuid').notNullable().unique();
      table.string('name').notNullable();
      table.boolean('isPrivate').defaultTo(0); 
      table.integer(`user_id`)
      .notNullable()
      .unsigned()
      .references(`id`)
      .inTable(`users`)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
      
      table.string('thumbnail').nullable();
      table.datetime(`deletedDate`).nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('playlists')
  }
}

module.exports = PlaylistSchema
