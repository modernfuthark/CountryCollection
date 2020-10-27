#!/usr/bin.python3
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={"r/*": {"Origins": "0.0.0.0"}})


@app.errorhandler(404)
def notFound():
    """ 404, Page not found """
    return jsonify({"error": "Not found"}), 404

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")
