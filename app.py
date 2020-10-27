#!/usr/bin.python3
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={"r/*": {"Origins": "0.0.0.0"}})


@app.errorhandler(404)
def notFound():
    """ 404, Page not found """
    return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0")
