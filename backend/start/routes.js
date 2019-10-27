'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

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
  Route.resource('group', 'GroupController').apiOnly()
  Route.get(`group/:uuid/playlist`, `GroupController.playlist`);
})
);


addDefaultPrefix(Route.group(()=>{
  Route.get('/:uuid', 'PlaylistController.index');
  Route.post('/:groupUUID', 'PlaylistController.store');
  Route.delete('/:uuid', 'PlaylistController.delete');
  Route.put('/:uuid', 'PlaylistController.update');
}).prefix('playlist'));


addDefaultPrefix(Route.group(()=>{

}).prefix('songs'));