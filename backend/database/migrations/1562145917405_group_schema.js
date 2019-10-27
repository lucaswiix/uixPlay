'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GroupSchema extends Schema {
  up () {
    this.create('groups', (table) => {
      table.increments()
      table.uuid('uuid').notNullable().unique();
      table.string('name').notNullable();
      table.integer('user_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
      
      table.boolean('isPrivate').defaultTo(0); 
      table.datetime('deletedDate').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('groups')
  }
}

module.exports = GroupSchema
