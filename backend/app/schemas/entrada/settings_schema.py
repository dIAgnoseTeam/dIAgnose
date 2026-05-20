from marshmallow import Schema, fields, validate


class UpdateSettingsSchema(Schema):
    reviews_enabled = fields.Bool(required=False)
    chat_enabled = fields.Bool(required=False)
    max_reviews_per_case = fields.Int(
        required=False,
        validate=validate.Range(min=1, max=100),
    )

    class Meta:
        unknown = "exclude"


class SetChatEnabledSchema(Schema):
    chat_enabled = fields.Bool(required=True)

    class Meta:
        unknown = "exclude"
