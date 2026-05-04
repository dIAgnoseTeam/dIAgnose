# Flujo de migraciones (Alembic)

## Estado actual (resumen)

- Alembic usa `backend/migrations/env.py` para leer `Config.SQLALCHEMY_DATABASE_URI` y cargar los modelos con `import app.models`.
- `target_metadata` apunta a `db.config.base.base.metadata`, correcto para autogenerar.
- Hay una migracion inicial en `migrations/versions/`.
- `backend/run.py` ejecuta `alembic upgrade head` al arrancar.

Conclusión: la base es correcta y funcional, con un unico punto a vigilar: el `alembic.ini` se busca con ruta relativa si se ejecuta desde otra carpeta.

## Flujo recomendado (local)

1) Modificar o crear modelos SQLAlchemy.
2) Generar migracion:

```
alembic revision --autogenerate -m "descripcion_cambio"
```

3) Revisar el contenido de la migracion en `migrations/versions/`.
4) Aplicar cambios:

```
alembic upgrade head
```

5) Probar la app.
6) Commitear los cambios, incluyendo `migrations/versions/`.

## Downgrade (rollback)

Si necesitas revertir migraciones:

- Volver una migracion:

```
alembic downgrade -1
```

- Volver a una revision concreta (ID de la migracion):

```
alembic downgrade <revision_id>
```

Tip: usa `alembic history` para ver los IDs disponibles.

## Flujo recomendado (produccion)

1) Generar migraciones en desarrollo.
2) Subir el codigo con `migrations/versions/` al repositorio.
3) En el despliegue, ejecutar:

```
alembic upgrade head
```

4) Arrancar la aplicacion.

## Que se sube a Git

- Si: `migrations/versions/` (son scripts, no datos reales).
- No: `db.sqlite` u otros archivos con datos reales.

## Notas de implementacion actual

- `backend/migrations/env.py` sobrescribe `sqlalchemy.url` desde `Config`.
- El `alembic.ini` mantiene una URL por defecto, pero no es la fuente real.
- `backend/run.py` aplica migraciones al arrancar; funciona, pero en produccion suele ejecutarse de forma explicita.
