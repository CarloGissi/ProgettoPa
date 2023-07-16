from celery.result import AsyncResult
from celery import Celery
from flask import Flask
from flask import jsonify
import os


PORT = os.environ.get("Q_PORT") or 5672
USER = os.environ.get("RABBIT_USER") or "guest"
PASS = os.environ.get("RABBIT_PASSWORD") or "guest"
# Crea un'istanza di Celery e specifica il broker RabbitMQ
app = Celery('app', broker='amqp://guest:guest@rabbitmq:5672//', backend='rpc://')

flask = Flask(__name__)

@flask.route('/inferenza/<tipo>')
def inferenza(tipo):
    result = app.send_task('app.inferenza', kwargs={'tipo':tipo})
    result_id = result.id

    response = {
        'job_id': result_id
    }
    
    return jsonify(response)
    
@flask.route('/job-status/<job_id>')
def get_job_status(job_id):
    result = AsyncResult(job_id, app=app)
    job_status = result.state

    if job_status == 'FAILURE':
        error_message = str(result.result)
        response = {
            'job_id': job_id,
            'status': job_status,
            'error_message': error_message
        }
    else:
        result_value = app.AsyncResult(result.id, app = app).result

        response = {
            'job_id': job_id,
            'status': job_status,
            'result': result_value
        }

    return jsonify(response)

if __name__ == '__main__':
    flask.run(host="0.0.0.0",port = 5000)