import transformers
transformers.logging.set_verbosity_error()

from flask import Flask, render_template
from .api import api

def create_app():
    app = Flask(__name__)
    app.register_blueprint(api, url_prefix='/api')

    @app.route('/')
    def index():
        return render_template('index.html')

    return app
