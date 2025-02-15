from flask_wtf import FlaskForm
from wtforms import TextAreaField, IntegerField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class ReviewForm(FlaskForm):
    product_Id = IntegerField("Product Id")
    review = TextAreaField("Review", validators=[DataRequired()])
    stars = IntegerField("Stars", validators=[DataRequired()])
    recommendation = BooleanField("Recommend?")
    submit = SubmitField("Submit")