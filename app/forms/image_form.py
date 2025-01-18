# try to use aws here

from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField,IntegerField,BooleanField
from app.api.aws_helpers import ALLOWED_EXTENSIONS
from wtforms.validators import DataRequired,NumberRange

class ProductImageForm(FlaskForm):
    product_id = IntegerField("Product Id", validators=[DataRequired()])
    image = FileField("Image File", validators=[FileRequired(),FileAllowed(list(ALLOWED_EXTENSIONS))])
    preview = BooleanField("Preview")
    submit = SubmitField("Create Post")