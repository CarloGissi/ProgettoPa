"""
@Fire
https://github.com/fire717
"""
from lib import init, Data, MoveNet, Task
import torch

from config import cfg
from codecarbon import EmissionsTracker


def main(cfg):

    init(cfg)


    model = MoveNet(num_classes=cfg["num_classes"],
                    width_mult=cfg["width_mult"],
                    mode='train')
    model.load_state_dict(torch.load('./output/e41_valacc0.77507.pth'))
    # print(model)
    # b

    data = Data(cfg)
    train_loader, val_loader = data.getTrainValDataloader()
    # data.showData(train_loader)
    # b


    run_task = Task(cfg, model)
    tracker = EmissionsTracker()
    tracker.start()
    run_task.train(train_loader, val_loader)
    tracker.stop()




if __name__ == '__main__':
    main(cfg)