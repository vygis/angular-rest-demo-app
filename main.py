from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from bottle import route, run, template, static_file, get
from bottle import response, request, redirect, error, abort
from datetime import datetime
import cjson

from db import Advertisers, Pixels, PixelFires

engine = create_engine('sqlite:///test.db', echo=False)
date_format = "%d/%m/%Y"
'''
Connect to SQLite and start session
'''

Session = sessionmaker(bind=engine)


def to_dict(model):
    """ Returns a JSON representation of an SQLAlchemy-backed object.
    """

    if not model:
        return None

    if isinstance(model, list):
        models = model
        dict_model = []

        for model in models:
            tmp_dict = {}

            for col in model._sa_class_manager.mapper.mapped_table.columns:
                tmp_dict[col.name] = getattr(model, col.name)
                '''
                Catch dates here and convert time timestamps
                '''
                if type(tmp_dict[col.name]) is datetime:
                    tmp_dict[col.name] = int(tmp_dict[col.name].strftime("%s"))

            dict_model.append(tmp_dict)
    else:
        dict_model = {}

        for col in model._sa_class_manager.mapper.mapped_table.columns:
            dict_model[col.name] = getattr(model, col.name)

    return dict_model


def json_response(issuccess, message, data):
    res = {'success': issuccess, 'data': data}

    if message:
        res.update({'message': message})

    response.content_type = 'application/json'
    return cjson.encode(res)


def is_json():
    return request.content_type == 'application/json'


@error(405)
def mistake405(code):
    return 'The given call is not allowed by the application.'


@error(404)
def mistake404(code):
    return 'Sorry, this page does not exist.'


@route('/advertisers', method=['GET', 'POST'])
def getall_new_advertiser():
    session = Session()

    if request.method == 'POST':
        payload = request.json
        advertiser = Advertisers(name=payload['name'], address=payload['address'], city=payload['city'], tel=payload['tel'],
                          post_code=payload['post_code'])
        session.add(advertiser)
        session.commit()
        return json_response(True, 'advertiser created', to_dict(advertiser))


    advertisers = session.query(Advertisers).all()

    return json_response(True, 'advertisers listed', to_dict(advertisers))



@route('/advertisers/<id:int>', method=['GET', 'POST'])
def getone_update_advertiser(id):
    if not isinstance(id, (int, long, float, complex)):
        abort(400, 'Id is not an integer.')

    session = Session()

    advertiser = session.query(Advertisers).filter_by(id=id).first()

    if request.method == 'POST' and advertiser:

        if not advertiser:
            abort(400, 'No advertiser with %i.' % id)

        payload = request.json

        advertiser.name = payload['name']
        advertiser.address = payload['address']
        advertiser.city = payload['city']
        advertiser.tel = payload['tel']
        advertiser.post_code = payload['post_code']
        session.commit()

        return json_response(True, 'advertiser updated', {'advertiser': to_dict(advertiser)})

    pixels = session.query(Pixels).filter_by(advertiser_id=id).all() if advertiser else None

    return json_response(True, 'advertiser listed', {'advertiser': to_dict(advertiser), 'pixels': to_dict(pixels)})


@route('/advertisers/<id:int>', method=['DELETE'])
def delete_advertiser(id):
    if not isinstance(id, (int, long, float, complex)):
        abort(400, 'Id is not an integer.')

    session = Session()

    advertiser = session.query(Advertisers).filter_by(id=id).first()

    if not advertiser:
        abort(400, 'No advertiser with id %i.' % id)

    session.delete(advertiser)
    session.commit()

    return json_response(True, 'Advertiser id %i successfully deleted.', {'advertiser': to_dict(advertiser)})



@route('/', method=['GET'])
def index():
    return static_file('index.html', root='.')


@route('/pixels', method=['GET', 'POST'])
def getall_new_pixel():
    session = Session()

    if request.method == 'POST':
        payload = request.json
        pixel = Pixels(advertiser_id=payload['advertiser_id'], name=payload['name'])
        session.add(pixel)
        session.commit()

        return json_response(True, 'pixel created', to_dict(pixel))


    pixels = session.query(Pixels).all()


    return json_response(True, 'pixels listed', to_dict(pixels))



@route('/pixels/<id:int>', method=['GET', 'PUT'])
def getone_update_pixel(id):
    if not isinstance(id, (int, long, float, complex)):
        raise Exception('Id is not an integer')

    session = Session()

    pixel = session.query(Pixels).filter_by(id=id).first()

    if request.method == 'PUT' and pixel:

        if not pixel:
            abort(400, 'No pixel with %i.' % id)

        form = request.forms

        pixel.advertiser_id = form['advertiser_id']
        pixel.name = form['name']

        session.commit()

        redirect('/pixels/%i' % id)

    fires = session.query(PixelFires).filter_by(pixel_id=id).all() if pixel else None

    return json_response(True, 'pixel listed', {'pixel': to_dict(pixel), 'fires': to_dict(fires)})


@route('/pixels/<id:int>', method=['DELETE'])
def delete_pixel(id):
    if not isinstance(id, (int, long, float, complex)):
        abort(400, 'Id is not an integer.')

    session = Session()

    pixel = session.query(Pixels).filter_by(id=id).first()

    if not pixel:
        abort(400, 'No pixel with id %i.' % id)

    session.delete(pixel)
    session.commit()

    if is_json():
        return json_response(True, 'pixel id %i successfully deleted.', {'pixel': to_dict(pixel)})

    redirect('/advertisers')


@route('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='static/js')


@get('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='static/css')


@get('/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root='static/img')


@get('/<filename:re:.*\.(eot|ttf|woff|svg)>')
def fonts(filename):
    return static_file(filename, root='static/fonts')


run(host='localhost', port=8080)