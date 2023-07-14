from celery import Celery
import os
import subprocess
from predict import main
from config import cfg

app = Celery('app', broker='amqp://guest:guest@rabbitmq:5672//', backend='rpc://')

@app.task(name='app.inferenza')
def inferenza(dataset, modello):
    comando = ['python', 'predict.py', dataset, modello]
    process = subprocess.Popen(comando, stdout=subprocess.PIPE, universal_newlines=True)
    process.wait()
    return main(cfg)


    

#if __name__=="main":
 #   args=['consumatore']
  #  app.worker_main(argv=args)
