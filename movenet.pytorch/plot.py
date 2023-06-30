from numpy.ma.extras import average
from numpy.core.numeric import array_equal
import json
import matplotlib.pyplot as plt
import os


def leggi_file_json(cartella):
    file_json_to_array = []
    file_lista = sorted(os.listdir(cartella))
    for file in file_lista:
        if file.endswith(".json"):
          if file == "1.json" or int(file[:-5]) % 5 == 0:
             percorso_file = os.path.join(cartella, file)
             with open(percorso_file, "r") as f:
                dati = json.load(f)
                file_json_to_array.append(average(dati)) # Prende la loss minima per ogni epoca
                #file_json_to_array.append(dati[-1]) # -1 prende l'ultimo elemento dell'array del file
                print(file_json_to_array)
    return file_json_to_array

# Specifica il percorso del file JSON

cartella = "./data/loss_train"
cartella2 = "./data/loss_val"
# Leggi il contenuto del file JSON
my_array_loss_train=leggi_file_json(cartella)
my_array_loss_val=leggi_file_json(cartella2)

# Crea un grafico con l'array
plt.figure()
plt.plot(my_array_loss_train, label="train_loss")
plt.plot(my_array_loss_val, label="val_loss")
plt.title('Training and validation loss')
plt.xlabel("Indice")
plt.ylabel("Valore")
#plt.xlim((0,4))
plt.legend()


cartella = "./data/acc_train"
cartella2 = "./data/acc_val"
# Leggi il contenuto del file JSON
my_array_acc_train=leggi_file_json(cartella)
my_array_acc_val=leggi_file_json(cartella2)

# Crea un grafico con l'array
plt.figure()
plt.plot(my_array_acc_train, label="train_accuracy")
plt.plot(my_array_acc_val, label="val_accuracy")
plt.title('Training and validation accuracy')
plt.xlabel("Indice")
plt.ylabel("Valore")
#plt.xlim((0,4))
plt.legend()
plt.show()