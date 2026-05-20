from marshmallow import Schema, fields

class UpdateSettingsSchema(Schema):
    chat_enabled = fields.Bool(required=False)
    reviews_enabled = fields.Bool(required=False)
    max_reviews_per_case = fields.Int(required=False)

class UpdateChatEnabledSchema(Schema):
    chat_enabled = fields.Bool(required=True)

def appsettings_to_dict(appsettings):
    return {
        "id": appsettings.id,
        "chat_enabled": appsettings.chat_enabled,
        "reviews_enabled": appsettings.reviews_enabled,
        "max_reviews_per_case": appsettings.max_reviews_per_case,
    }


def appsettings_public_to_dict(appsettings):
    """Versión reducida para usuarios no-admin: solo campos relevantes para la UI."""
    return {
        "chat_enabled": appsettings.chat_enabled,
        "reviews_enabled": appsettings.reviews_enabled,
        "max_reviews_per_case": appsettings.max_reviews_per_case,
    }
