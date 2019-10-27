'use strict'

/** @type {typeof import('../../Models/User')} Model */
const User = use('App/Models/User');
const uuid = use('uuid');
class AuthController {

    /**
     * Register new user
     * POST uixplay
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
   */
    async register({ request, auth }){
        const data = request.only(['username', 'email', 'password']);
        await User.create({...data, uuid: uuid.v4()});        
        const token = await auth.attempt(data.username, data.password);
        return token;        
    }
 
    async login({ request, auth }){
        const { username, password } = request.all();
        const token = await auth.attempt(username, password);
        return token;
    }
}

module.exports = AuthController
