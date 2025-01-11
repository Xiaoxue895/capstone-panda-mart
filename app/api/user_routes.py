from flask import Blueprint, jsonify,request
from flask_login import login_required,current_user
from app.models import User,db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if not user:
        return {'error': 'User not found'}, 404
    return user.to_dict()

@user_routes.route('/<int:id>',methods=['PUT'])
@login_required
def update_user(id):

    user = User.query.get(id)
    if not user:
        return {'error': 'User not found'}, 404
    
    if current_user.id != id:
        return {'error': 'Permission denied'}, 403
    
    data = request.get_json()

    if 'firstname' in data:
        user.firstname = data['firstname']
    if 'lastname' in data:
        user.lastname = data['lastname']
    if 'username' in data:
        user.username = data['username']
    # if 'email' in data:
    #     user.email = data['email']
    # if 'password' in data:
    #     user.password = data['password']

    db.session.commit()
    return user.to_dict()



@user_routes.route('/<int:id>',methods=['DELETE'])
@login_required
def delete_user(id):

    user = User.query.get(id)
    if not user:
        return {'error':'user not found'},404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message':'user delete successfully'})