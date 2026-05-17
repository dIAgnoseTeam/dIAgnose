from functools import wraps
from flask import jsonify
from app.utils.oauth_decorator import token_required

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated_function(current_user, *args, **kwargs):
        if int(current_user.get("id_rol", 0)) != 1:
            return jsonify({"message": "Admin access required"}), 403
        return f(current_user, *args, **kwargs)
    return decorated_function
