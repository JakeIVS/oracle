from flask import Flask, jsonify, request, abort, make_response, session
from flask_restful import Resource
from models import *
from config import app, db, api, socket_io
from flask_migrate import Migrate  # Import Flask-Migrate
from flask_cors import CORS
from flask_socketio import join_room, leave_room

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Add the following two lines to enable CORS for your app
CORS(app, supports_credentials=True)


class Signup(Resource):
    def post(self):
        try:
            data = request.get_json()
            new_user = User(
                email = data['email'],
                first_name = data['first_name'],
                last_name = data['last_name'],
                theme = 'default',
            )
            new_user.password_hash = data['password']
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)
        except:
            return make_response({'errors':['validation errors']}, 400)

class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"error": "No user currently logged in"}, 401)
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.email == data['email']).first()
        if user:
            if user.authenticate(data['password']):
                session['user_id'] = user.id
                return user.to_dict(), 201
            else:
                return {"error": "Invalid Password"}, 401
        else:
            return {"error": "User not found"}, 404
        
class Logout(Resource):
    def delete(self):
        user_id = session['user_id']
        if user_id:
            session['user_id'] = None
            return {}, 204
        else:
            return {"error": "No user logged in currently"}, 401

class Spells(Resource):
    def get(self):
        spells = Spell.query.all()
        return make_response([spell.to_dict() for spell in spells], 200)

class SpellsId(Resource):
    def get(self, id):
        spell = Spell.query.filter(Spell.id == id).first()
        if not spell:
            return make_response({'error': 'Spell not found'}, 404)
        return make_response(spell.to_dict(), 200)

class Campaigns(Resource):
    def post(self):
        try:
            data = request.get_json()
            user_id = session['user_id']
            campaign = Campaign(
                dm_id = user_id,
                name = data['name'],
                join_code = data['join_code']
            )
            db.session.add(campaign)
            db.session.commit()
            return make_response(campaign.to_dict(), 201)
        except:
            return make_response({'errors': ['validation errors']}, 401)

class CampaignsId(Resource):
    def get(self, id):
        campaign = Campaign.query.filter(Campaign.id == id).first()
        if campaign:
            return make_response(campaign.to_dict(), 200)
        return make_response({'error':'Campaign not found'}, 404)
    def delete(self, id):
        campaign = Campaign.query.filter(Campaign.id == id).first()
        if campaign:
            campaign.delete()
            return make_response({},204)
        return({'error':'Campaign not found'}, 404)
    def patch(self, id):
        campaign = Campaign.query.filter(Campaign.id == id).first()
        if campaign:
            try:
                data = request.get_json()
                for attr in data:
                    setattr(campaign, attr, data[attr])
                db.session.commit()
                return make_response(campaign.to_dict(), 202)
            except:
                return make_response({'errors':['Validation errors']}, 402)
        return make_response({"error":"Campaign not found"}, 404)        

class Characters(Resource):
    def post(self):
        try:
            data = request.get_json()
            user_id = session['user_id']
            character = Character(
                owner_id = user_id,
                name = data['name'],
                image_url = data['image_url'],
                race = data['race'],
                gender = data['gender'],
                character_class = data['character_class'],
                level = data['level'],
                strength_score = data['strength_score'],
                dexterity_score = data['dexterity_score'],
                constitution_score = data['constitution_score'],
                intelligence_score = data['intelligence_score'],
                wisdom_score = data['wisdom_score'],
                charisma_score = data['charisma_score'],
                speed = 30,
            )
            db.session.add(character)
            db.session.commit()
            return make_response(character.to_dict(), 201)
        except:
            return make_response({'errors':['Validation errors']}, 401)

class CharactersId(Resource):
    def patch(self, id):
        character = Character.query.filter(Character.id == id).first()
        if character:
            try:
                data = request.get_json()
                for attr in data:
                    setattr(character, attr, data[attr])
                db.session.commit()
                return make_response(character.to_dict(), 202)
            except:
                return make_response({'errors':['Validation errors']}, 402)
        return make_response({"error":"Character not found"}, 404)        
    def get(self,id):
        user_id = session['user_id']
        character = Character.query.filter(Character.id == id).first()
        if character.owner_id == user_id:
            return make_response(character.to_dict(), 200)
        else:
            return make_response({'error': 'character id does not exist or is not owned by this user'}, 401)


api.add_resource(Signup, '/signup')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Spells, '/spells')
api.add_resource(SpellsId, '/spells/<int:id>')
api.add_resource(Campaigns, '/campaigns')
api.add_resource(CampaignsId, '/campaigns/<int:id>')
api.add_resource(Characters, '/characters')
api.add_resource(CharactersId, '/characters/<int:id>')


@socket_io.on('connect')
def handle_connect():
    print('new connection')

@socket_io.on('join_room')
def handle_connect(room_code):
    print(f'Joining Campaign Session: code [{room_code}]')
    session['room'] = room_code
    join_room(room_code)

@socket_io.on('return_field')
def handle_return_field(field_id):
    socket_io.emit('from_server', field_id)
    print(f'Recieved: {field_id}')

@socket_io.on('disconnect')
def disconnected():
    """event listener when client disconnects to the server"""
    print('user disconnected')
    socket_io.emit('disconnected', "User disconnected")

if __name__ == '__main__':
    socket_io.run(app, port=5555)