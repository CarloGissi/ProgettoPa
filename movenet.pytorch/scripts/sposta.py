import shutil
import os
import json

def leggi_file_json(file_json):
    with open(file_json, 'r') as file:
        dati_json = json.load(file)
    return dati_json

file_json1 = "./data/cropped/train2017.json"
dati_json = leggi_file_json(file_json1)
#for item in dati_json:
 #   print(item['img_name'])

def scrivi_su_file_json(dati_array, file_json):
    with open(file_json, 'w') as file:
        json.dump(dati_array[:1700], file)

if not os.path.exists('./data/test'):
    os.makedirs('./data/test')

file_json2 = "./data/test/test.json"
scrivi_su_file_json(dati_json, file_json2)

def scrivi_su_file_json2(dati_array, file_json):
    with open(file_json, 'w') as file:
        json.dump(dati_array[1700:], file)

file_json3 = "./data/cropped/train2017_agg.json"
scrivi_su_file_json2(dati_json, file_json3)


def sposta_foto(cartella_origine, cartella_destinazione, nome_foto):
    # Controlla se la cartella di destinazione esiste, altrimenti creala
    if not os.path.exists(cartella_destinazione):
        os.makedirs(cartella_destinazione)

    # Prende la lista dei file nella cartella di origine
    file_list = os.listdir(cartella_origine)

    # Sposta i file con il nome specificato nella cartella di destinazione
    for file in file_list:
        if file == nome_foto:
            origine_file = os.path.join(cartella_origine, file)
            destinazione_file = os.path.join(cartella_destinazione, file)
            shutil.move(origine_file, destinazione_file)
            print(f"Spostata foto {file} nella cartella di destinazione")

cartella_origine = './data/cropped/imgs'
cartella_destinazione = './data/test/imgs' 

dati_json_test = leggi_file_json('./data/test/test.json')
for item in dati_json_test:
    sposta_foto(cartella_origine,cartella_destinazione,item['img_name'])

   