"""
@Fire
https://github.com/fire717
"""
import os
import random
import pandas as pd 

from lib import init, Data, MoveNet, Task
from multiprocessing import Process
#from codecarbon import EmissionsTracker

from config import cfg
import sys





def main(cfg):

    init(cfg)
    arg1= sys.argv[1]
    arg2 = sys.argv[2]

    model = MoveNet(num_classes=cfg["num_classes"],
                    width_mult=cfg["width_mult"],
                    mode='train')
    
    
    data = Data(cfg)
    test_loader = data.getCostumTestDataloader("./data/images/img_1_1")


    run_task = Task(cfg, model)
    #tracker = EmissionsTracker()
    #tracker.start()
    run_task.modelLoad("output/e120_valacc0.79633.pth")
    folder_path = 'output/'+arg1+'_'+arg2+'/'

    #if not os.path.exists(folder_path):
     #   try:
      #      os.makedirs(folder_path)
       # except OSError as e:
        #    print("Si è verificato un errore durante la creazione della cartella:", e)
   
    ##with open(folder_path+arg1 + '_' + arg2 + '.json', 'w') as file:
      ##  json.dump(run_task.predict(test_loader, folder_path), file,indent=4, sort_keys=True)

    #print(run_task.predict(test_loader, folder_path))
    

    result = run_task.predict(test_loader, 'output/predict' )
    return result
    
    

    #tracker.stop()



if __name__ == '__main__':
    main(cfg)