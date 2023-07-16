from celery import Celery
import os
import subprocess
from predict import main
from config import cfg

from lib import init, Data, MoveNet, Task
import os
PORT = os.environ.get("Q_PORT") or 5672
USER = os.environ.get("RABBIT_USER") or "guest"
PASS = os.environ.get("RABBIT_PASSWORD") or "guest"

app = Celery('app', broker='amqp://guest:guest@rabbitmq:5672//', backend='rpc://')

@app.task(name='app.inferenza')
def inferenza(userid, dataset, tipo):
    #comando = ['python', 'predict.py', tipo]
    #process = subprocess.Popen(comando, stdout=subprocess.PIPE, universal_newlines=True)
    #process.wait()
    #return main(cfg)
    init(cfg)
    model = MoveNet(num_classes=cfg["num_classes"],
                    width_mult=cfg["width_mult"],
                    mode='train')
    data = Data(cfg)
    if(tipo=="0"):
        folder_path ='./data/images/img_'+userid+'_'+dataset
    elif(tipo=="1"):
        folder_path ='./data/video/v_'+userid+'_'+dataset+'/frame'

    test_loader = data.getCostumTestDataloader(folder_path)
    run_task = Task(cfg, model)
    run_task.modelLoad("output/e120_valacc0.79633.pth")
    result = run_task.predict(test_loader, 'output/predict_'+userid+'_'+dataset )
    return result


    

#if __name__=="main":
 #   args=['consumatore']
  #  app.worker_main(argv=args)
