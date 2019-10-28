'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const addDefaultPrefix = (group) => {
  group.prefix('api/rest').middleware(['auth']);
  return group;
}

Route.group(() => {
  Route.post('/login', 'AuthController.login');
  Route.post('/register', 'AuthController.register');
}).prefix('api/rest/auth');


addDefaultPrefix(Route.group(()=>{
  Route.get('/', 'PlaylistController.index');
  Route.post('/', 'PlaylistController.store');
  Route.get('/:uuid', 'PlaylistController.show');
  Route.delete('/:uuid', 'PlaylistController.destroy');
  Route.put('/:uuid', 'PlaylistController.update');

  Route.get('/:uuid/song', 'PlaylistController.songs');
}).prefix('playlist'));


addDefaultPrefix(Route.group(()=>{
  Route.get('/:uuid', 'SongController.show');
  Route.post('/:playlistUUID', 'SongController.store');
  Route.get('/:songUUID/status', 'SongController.getStatus');
  Route.get('/:songUUID/download', 'SongController.downloadSong');
  Route.delete('/:songUUID', 'SongController.destroy');
}).prefix('song'));