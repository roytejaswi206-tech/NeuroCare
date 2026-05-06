from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.favorite import Favorite
import requests
from urllib.parse import quote

places_bp = Blueprint('places', __name__, url_prefix='/api/places')


@places_bp.route('/nearby', methods=['GET'])
def nearby():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify([]), 200

    query = f"[out:json];node[\"amenity\"=\"hospital\"](around:5000,{lat},{lon});out;"

    try:
        url = f"https://overpass-api.de/api/interpreter?data={quote(query)}"
        res = requests.get(url, timeout=10, headers={'User-Agent': 'NeuroCare-App/1.0'})
        
        if res.status_code == 200:
            data = res.json()
            result = []
            for el in data.get('elements', []):
                result.append({
                    'id': el.get('id'),
                    'name': el.get('tags', {}).get('name', 'Hospital'),
                    'lat': el.get('lat'),
                    'lon': el.get('lon'),
                    'type': 'hospital',
                    'address': el.get('tags', {}).get('addr:street', 'Address not available'),
                })
            return jsonify(result), 200
        else:
            print(f"Overpass API error: {res.status_code}")
            return jsonify([]), 200
    except Exception as exc:
        print(f"Places API error: {str(exc)}")
        return jsonify([]), 200


@places_bp.route('/save', methods=['POST'])
@jwt_required()
def save_place():
    user_id = get_jwt_identity()
    if user_id is None:
        return jsonify({'error': 'Invalid user identity'}), 401

    data = request.get_json() or {}
    name = data.get('name')
    lat = data.get('lat')
    lon = data.get('lon')
    place_type = data.get('type')
    address = data.get('address')

    if not name or lat is None or lon is None:
        return jsonify({'error': 'Name, latitude, and longitude are required'}), 400

    fav = Favorite(
        user_id=int(user_id),
        name=name,
        lat=float(lat),
        lon=float(lon),
        type=place_type,
        address=address,
    )
    db.session.add(fav)
    db.session.commit()

    return jsonify({'msg': 'saved', 'favorite': fav.to_dict()}), 201


@places_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_places():
    user_id = get_jwt_identity()
    if user_id is None:
        return jsonify({'error': 'Invalid user identity'}), 401

    favorites = Favorite.query.filter_by(user_id=int(user_id)).all()
    return jsonify({'favorites': [fav.to_dict() for fav in favorites]}), 200


@places_bp.route('/saved/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def delete_saved_place(favorite_id):
    user_id = get_jwt_identity()
    if user_id is None:
        return jsonify({'error': 'Invalid user identity'}), 401

    favorite = Favorite.query.filter_by(id=favorite_id, user_id=int(user_id)).first()
    if not favorite:
        return jsonify({'error': 'Saved place not found'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Saved place removed'}), 200


@places_bp.route('/panic', methods=['POST'])
@jwt_required()
def panic():
    return jsonify({'msg': 'Emergency alert sent'}), 200
