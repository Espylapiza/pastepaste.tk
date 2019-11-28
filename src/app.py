from flask import Flask, request, render_template, url_for, Response, redirect, abort
import os
import logging
from datetime import timedelta


cur_uid = 1

config_file = "uid"
os.makedirs("data/", exist_ok=True)


def create_app():
    global cur_uid
    if not os.path.isfile(config_file):
        with open(config_file, "w") as f:
            f.write("0")
            cur_uid = 0
    else:
        with open(config_file, "r") as f:
            cur_uid = f.read()
            cur_uid = int(cur_uid)
    return Flask(__name__)


app = create_app()

# app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", attr="autofocus", symbol=">")


@app.route("/paste/", methods=["POST"])
def paste():
    global cur_uid
    print(cur_uid, "aaa")
    data = request.get_data(as_text=True)
    cur_uid += 1
    with open(config_file, "w") as f:
        f.write(str(cur_uid))
    addr = "data/" + str(cur_uid)
    with open(addr, "w") as f:
        f.write(data)
    return str(cur_uid)


@app.route("/<uid>", methods=["GET"])
def view(uid):
    if uid.isdigit and len(uid) <= 6:
        addr = "data/" + str(uid)
        if os.path.isfile(addr):
            with open(addr, "r") as f:
                data = f.read()
            return render_template("index.html", text=str(data), attr="readonly", symbol="#")
    abort(404)


@app.route("/<uid>/raw", methods=["GET"])
def view_raw(uid):
    if uid.isdigit and len(uid) <= 6:
        addr = "data/" + str(uid)
        if os.path.isfile(addr):
            with open(addr, "r") as f:
                data = f.read()
            resp = Response(data)
            resp.headers["content-type"] = "text/plain; charset=UTF-8"
            return resp
    abort(404)


@app.route("/<uid>/html", methods=["GET"])
def view_html(uid):
    if uid.isdigit and len(uid) <= 6:
        addr = "data/" + str(uid)
        if os.path.isfile(addr):
            with open(addr, "r") as f:
                data = f.read()
            resp = Response(data)
            resp.headers["content-type"] = "text/html"
            return resp
    abort(404)


@app.errorhandler(404)
def page_not_found(e):
    return (render_template("index.html", text="404 not found", attr="readonly", symbol="#"), 404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081)
