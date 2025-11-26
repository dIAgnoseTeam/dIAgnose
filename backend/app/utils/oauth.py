from authlib.integrations.flask_client import OAuth

oauth  = OAuth()

def configure_oauth(app):
    # Configurar el cliente OAuth de Google
    from app.config import Config
    
    oauth.init_app(app)

    oauth.register(
        name='google',
        client_id=Config.GOOGLE_CLIENT_ID,
        client_secret=Config.GOOGLE_CLIENT_SECRET,
        server_metadata_url=Config.GOOGLE_DESCOVERY_URL,
        client_kwargs={
            'scope': ' '.join(Config.OAUTH_SCOPES),
        }
    )
    
    return oauth

def get_google_oauth_client():
    return oauth.create_client('google')