from celery.result import AsyncResult
from celery import Celery
from flask import Flask
from flask import jsonify

# Crea un'istanza di Celery e specifica il broker RabbitMQ
app = Celery('app', broker='amqp://guest:guest@localhost//', backend='rpc://')

flask = Flask(__name__)

@flask.route('/inferenza/<dataset>/<modello>')
def inferenza(dataset, modello):
    result = app.send_task('app.inferenza', kwargs={'dataset':dataset, 'modello':modello})
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
    flask.run()