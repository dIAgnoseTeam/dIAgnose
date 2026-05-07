def appsettings_to_dict(appsettings):
    return {
        "id": appsettings.id,
        "chat_enabled": appsettings.chat_enabled,
        "reviews_enabled": appsettings.reviews_enabled,
        "max_reviews_per_case": appsettings.max_reviews_per_case,
        "maintenance_mode": appsettings.maintenance_mode,
        "allow_new_users": appsettings.allow_new_users,
    }


def appsettings_public_to_dict(appsettings):
    """Versión reducida para usuarios no-admin: solo campos relevantes para la UI."""
    return {
        "chat_enabled": appsettings.chat_enabled,
        "reviews_enabled": appsettings.reviews_enabled,
        "maintenance_mode": appsettings.maintenance_mode,
    }
