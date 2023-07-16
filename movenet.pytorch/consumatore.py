from celery import Celery
import os
import subprocess
from predict import main
from config import cfg
import os
PORT = os.environ.get("Q_PORT") or 5672
USER = os.environ.get("RABBIT_USER") or "guest"
PASS = os.environ.get("RABBIT_PASSWORD") or "guest"

app = Celery('app', broker='amqp://guest:guest@rabbitmq:5672//', backend='rpc://')

@app.task(name='app.inferenza')
def inferenza(tipo):
    comando = ['python', 'predict.py', tipo]
    process = subprocess.Popen(comando, stdout=subprocess.PIPE, universal_newlines=True)
    process.wait()
    return main(cfg)


    

#if __name__=="main":
 #   args=['consumatore']
  #  app.worker_main(argv=args)
