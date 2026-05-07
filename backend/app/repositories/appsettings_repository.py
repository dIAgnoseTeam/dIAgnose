from sqlalchemy import select, func

from app.models.app_settings import AppSettings
from app.models.chat import Chat
from app.models.clinical_case import CasoClinico
from app.models.review import Valoracion
from app.models.user import Usuario
from db.config.session import SessionLocal

# Campos permitidos para actualización desde la API
ALLOWED_SETTINGS_FIELDS = {
    "chat_enabled",
    "reviews_enabled",
    "max_reviews_per_case",
}


class AppSettingsRepository:

    @staticmethod
    def get_settings():
        with SessionLocal() as s:
            return s.execute(select(AppSettings)).scalar_one_or_none()

    @staticmethod
    def update_settings(settings_data: dict):
        """Actualiza únicamente los campos incluidos en settings_data que estén permitidos."""
        with SessionLocal() as s:
            settings = s.execute(select(AppSettings)).scalar_one_or_none()
            if settings:
                for field, value in settings_data.items():
                    if field in ALLOWED_SETTINGS_FIELDS:
                        setattr(settings, field, value)
            else:
                # Primera creación: aplicar defaults del modelo más los datos recibidos
                init_data = {k: v for k, v in settings_data.items() if k in ALLOWED_SETTINGS_FIELDS}
                settings = AppSettings(**init_data)
                s.add(settings)
            s.commit()
            s.refresh(settings)
            return settings

    @staticmethod
    def get_dashboard_stats():
        """Devuelve métricas agregadas de toda la plataforma para el panel admin."""
        with SessionLocal() as s:
            # Usuarios
            total_usuarios = s.scalar(select(func.count(Usuario.id))) or 0

            # Casos clínicos
            total_casos = s.scalar(select(func.count(CasoClinico.id))) or 0

            # Casos sin ninguna valoración
            casos_con_valoracion = s.scalar(select(func.count(func.distinct(Valoracion.id_caso)))) or 0
            casos_sin_valorar = total_casos - casos_con_valoracion

            # Casos con valoración completa (>= 3 valoraciones)
            settings = s.execute(select(AppSettings)).scalar_one_or_none()
            max_reviews = settings.max_reviews_per_case if settings else 3  # fallback sensato

            casos_completos = (
                s.scalar(
                    select(func.count()).select_from(
                        select(Valoracion.id_caso)
                        .group_by(Valoracion.id_caso)
                        .having(func.count(Valoracion.id) >= max_reviews)
                        .subquery()
                    )
                )
                or 0
            )

            # Valoraciones
            review_stats = s.execute(
                select(
                    func.count(Valoracion.id).label("total"),
                    func.avg(Valoracion.puntuacion).label("media"),
                )
            ).one()
            total_valoraciones = review_stats.total or 0
            media_puntuacion = round(review_stats.media, 2) if review_stats.media else 0.0

            # Distribución de puntuaciones (1–5)
            distribucion_rows = s.execute(
                select(Valoracion.puntuacion, func.count(Valoracion.id).label("cnt")).group_by(Valoracion.puntuacion)
            ).all()
            distribucion = {str(row.puntuacion): row.cnt for row in distribucion_rows}

            # Chats
            total_chats = s.scalar(select(func.count(Chat.id))) or 0
            chats_activos = s.scalar(select(func.count(Chat.id)).where(Chat.activo == "T")) or 0

            return {
                "usuarios": {
                    "total": total_usuarios,
                },
                "casos_clinicos": {
                    "total": total_casos,
                    "sin_valorar": casos_sin_valorar,
                    "con_valoracion_completa": casos_completos,
                },
                "valoraciones": {
                    "total": total_valoraciones,
                    "media_puntuacion": media_puntuacion,
                    "distribucion": distribucion,
                },
                "chats": {
                    "total": total_chats,
                    "activos": chats_activos,
                },
            }
