
# MovenetX
##  **Indice**
* [Obiettivo](#intro)
* [Progettazione](#prog)
    * [Diagrammi UML](#uml)
    * [Descrizione dei pattern](#pattern)
* [Installazione](#install)
    * [Rotte](#rotte)
    * [Dettaglio delle richieste API](#uso)
* [Software & Framework utilizzati](#software)
* [Autori](#Autori)


<a name="intro"></a>
##  Obiettivo
L'obiettivo primario di questo progetto è lo sviluppo di un backend [Node.js](https://nodejs.org/en), il quale offrirà funzionalità avanzate per gestire e processare dataset e modelli neurali. Questo portale sarà accessibile solo agli utenti registrati, i quali avranno la possibilità di caricare i propri dataset contenenti dati come immagini o video, e i rispettivi modelli neurali, che saranno reti neurali pre-addestrate.

Una delle principali funzionalità sarà quella di effettuare inferenze sui dataset e modelli caricati. Il nostro obiettivo è creare un ambiente affidabile e scalabile, in cui gli utenti possano gestire facilmente i propri dataset e modelli, eseguire inferenze e monitorare i task che richiedono tempi di elaborazione più prolungati.

In conclusione, si è sviluppato un backend che è in grado di gestire i modelli e i dataset di ciascun utente, per effettuare inferenza su di essi, monitorando i task più complessi tramite un gestore di code.

<a name="prog"></a>
##  Progettazione

<a name="uml"></a>
# Diagrammi UML
## Use Case Diagram
<img src = "https://raw.githubusercontent.com/CarloGissi/ProgettoPa/master/diagrammi%20UML/movenetX.jpg"/>

## Sequence Diagram
#### Creazione di un utente
<img src ="https://github.com/CarloGissi/ProgettoPa/blob/master/diagrammi%20UML/crea%20utente.jpg?raw=true"/>

#### Login
<img src ="https://github.com/CarloGissi/ProgettoPa/blob/master/diagrammi%20UML/login.jpg?raw=true"/>

#### Creazione di un dataset
<img src ="https://github.com/CarloGissi/ProgettoPa/blob/master/diagrammi%20UML/crea%20dataset.jpg?raw=true"/>

#### Upload di un'immagine
<img src ="https://github.com/CarloGissi/ProgettoPa/blob/master/diagrammi%20UML/carica%20immagine.jpg?raw=true"/>

#### Inferenza sull'immagine
<img src ="https://github.com/CarloGissi/ProgettoPa/blob/master/diagrammi%20UML/inferenza.jpg?raw=true"/>

#### Risultato del job
<img src ="https://github.com/CarloGissi/ProgettoPa/blob/master/diagrammi%20UML/result%20job.jpg?raw=true"/>

#### Aggiunta del credito ad un utente da parte dell'amministratore
<img src ="https://github.com/CarloGissi/ProgettoPa/blob/master/diagrammi%20UML/aggiungi%20credito.jpg?raw=true"/>

I restanti diagrammi sono prenenti nella cartella dei [Diagrammi UML](https://github.com/CarloGissi/ProgettoPa/tree/master/diagrammi%20UML).
<a name="pattern"></a>
##  Descrizione dei pattern
Nello sviluppo di questo progetto sono stati utilizzati diversi design pattern seguendo le best practice per una buona programmazione. I patter utilizzati sono:

* MVC
* Singleton
* DAO
* Factory
* Chain of Responsibility
* Message Queuing

### MVC
Il pattern MVC (Model-View-Controller) è un'architettura software che organizza un'applicazione in tre componenti distinti:
- Model: Rappresenta i dati e le regole di business dell'applicazione.
- View: Visualizza l'interfaccia utente e l'output dei dati dal Model.
- Controller: Gestisce le interazioni dell'utente, aggiorna il Model e seleziona la View corretta da mostrare.

MVC separa la logica dell'applicazione in modo da migliorare la manutenibilità, la scalabilità e la riutilizzabilità del codice, favorendo una chiara separazione tra la presentazione dei dati e la loro gestione. Nella nostra implementazione, non necessitando di una vera e propria View, quest'ultima non è stato sviluppata.

### Singleton
Il pattern Singleton è un design pattern creazionale che garantisce l'esistenza di una sola istanza di una classe in un'applicazione.

In breve, il pattern Singleton si basa su un metodo statico per fornire un unico punto di accesso all'istanza della classe e assicurarsi che essa sia creata una sola volta, indipendentemente dal numero di richieste di istanza.

Questo pattern è stato utilizzato nella connessione al database nel file [databaseSingleton.ts](https://github.com/CarloGissi/ProgettoPa/blob/master/Server/Singleton/databaseSingleton.ts).

### DAO
Il pattern DAO (Data Access Object) implementato con Sequelize, un ORM (Object-Relational Mapping) per Node.js, separa la logica di accesso ai dati dal resto dell'applicazione.

Attraverso Sequelize, è stato possibile definire modelli che rappresentano le tabelle del database e creare DAO corrispondenti per ciascun modello, fornendo metodi per eseguire operazioni CRUD (Create, Read, Update, Delete) sui dati.

Questa separazione consente di scrivere codice più pulito e mantenibile, facilitando l'interazione con il database e consentendo di cambiare facilmente il tipo di database sottostante senza dover modificare il resto dell'applicazione.

### Factory
Il pattern Factory è stato utilizzato per creare un'interfaccia comune per gestire oggetti di errori standardizzati con la stessa struttura per gli status code.

Attraverso questa implementazione, il Factory semplifica la creazione di oggetti di errore con una struttura simile, migliorando la gestione degli errori e la comprensione dei messaggi in tutto l'applicativo, garantendo uniformità nei formati degli errori e semplificando la manutenzione del codice. Nel dettaglio questo pattern è stato utilizzato nel [FactoryError.ts](https://github.com/CarloGissi/ProgettoPa/blob/master/Server/Factory/FactoryError.ts).

### Chain of Responsibility
Il pattern CoR è stato utilizzato attraverso dei middleware per il processamento dell'elaborazione delle richieste. In particolare, si è utilizzato un middleware per l'autenticazione del token ricevuto dal login, uno per il controllo dei proprietari delle risorse utilizzate per le richieste di un utente specifico, ed infine, uno per il controllo dei privilegi di amministratore.

Questi middlewares consenteno una gestione sequenziale delle richieste, e garantiscono un'accesso sicuro ed appropriato alle risorse, oltre che ad una buona manutenibilità del codice.

### Message Queuing
Questo pattern è ampiamente utilizzato nell'architettura software per la comunicazione asincrona tra diversi componenti del sistema. L'obiettivo principale di questo pattern è consentire la comunicazione tra componenti disaccoppiando mittente e destinatario, consentendo una maggiore scalabilità e affidabilità del sistema.

Il Message Queue Pattern si basa sull'uso di una coda di messaggi, che agisce come intermediario tra i componenti del sistema. I messaggi vengono inviati dai mittenti alla coda di messaggi, e i destinatari prelevano i messaggi dalla coda e li elaborano.

Nel nostro caso, il mittente è il [produttore](https://github.com/CarloGissi/ProgettoPa/blob/master/Produttore/produttore.py) che manda delle richieste al destinatario tramite dei job. Il destinatario è il [consumatore](https://github.com/CarloGissi/ProgettoPa/blob/master/movenet.pytorch/consumatore.py), sempre in ascolto, che riceve il messaggio del produttore ed esegue l'attività ricevuta estraendolo dalla coda.

La comunicazione tra il produttore ed il consumatore è asincrona ed è gestita da un sistema di messaggistica chiamato RabbitMQ e da un framework per la gestione delle code dei job chiamato Celery.

<a name="install"></a>
##  Installazione
Per intallare l'applicazione MovenetX è possibile utilizzare Docker Compose per eseguire tutti i servizi necessari.

### Utilizzo di Docker Compose

1. Installa Docker e Docker Compose.

2. Clona questo repository sul tuo computer locale.
```
git clone https://github.com/CarloGissi/ProgettoPa
```
3. Apri un terminale ed entra nella directory del progetto.

4. Esegui il seguente comando per avviare i servizi:

```bash
docker-compose up --build
```

Questo comando avvierà tutti i servizi specificati nel Docker Compose necessari per avviare l'applicazione.

5. L'applicazione è in ascolto all'indirizzo `http://localhost:8080`.

### Utilizzo di Postman
Per facilitare l'utilizzo di rotte predefinite puoi utilizzare [Postman](https://www.postman.com/) per richiamare le API ed eseguire le richieste. Ti basta scaricarlo e importare i file che sono presenti [qui](https://github.com/CarloGissi/ProgettoPa/tree/master/Collection).

<a name="rotte"></a>
#  Rotte
Le richieste che l'utente può effettuare vanno eseguite tramite Postman ai seguenti indiritti in ---- *localhost:8080* ----

N° | Tipo | Rotta | TOKEN JWT
----- | ------------ | -------------------- | ----------------------
[1](#1) | ` POST ` | `/user/login` | *NO*
[2](#2) | ` GET ` | `/user/all` | *NO*
[3](#3) | ` POST ` | `/user/new` | *NO*
[4](#4) | ` PUT ` | `/user/update?id=<id>` | *SI*
[5](#5) | ` DELETE ` | `/user/delete?id=<id>` | *SI*
[6](#6) | ` GET ` | `/user/creditoresiduo` | *SI*
[7](#7) | ` POST ` | `/user/ricaricacredito` | *SI*
[8](#8) | ` GET ` | `/model/all` | *NO*
[9](#9) | ` POST ` | `/model/new` | *NO*
[10](#10) | ` PUT ` | `/model/update?id=<id>` | *SI*
[11](#11) | ` DELETE ` | `/model/delete?id=<id>` | *SI*
[12](#12) | ` POST ` | `/model/inferenza` | *SI*
[13](#13) | ` GET ` | `/model/stato/:job` | *SI*
[14](#14) | ` GET ` | `/model/risultato/:job` | *SI*
[15](#15) | ` GET ` | `/dataset/all` | *NO*
[16](#16) | ` POST ` | `/dataset/new` | *SI*
[17](#17) | ` PUT ` | `/dataset/update?id=<id>` | *SI*
[18](#18) | ` DELETE ` | `/dataset/delete?id=<id>` | *SI*
[19](#19) | ` POST ` | `/dataset/caricafile?id=<id>` | *SI*
[20](#20) | ` POST ` | `/dataset/caricavideo?id=<id>` | *SI*


<a name="uso"></a>
## Dettaglio delle richieste API
Per avere una corretta risposta bisogna effettuare le richieste in questo modo:
<a name="1"></a>
###  1. POST /user/login

Body: 
```json
{
    "nome_utente": "carlo",
    "password": "roberto",
}
```

Risposta: 
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg5MzQ2NTk4LCJleHAiOjE2ODkzNTAxOTh9.lR3BsrnSo9HV4nkiEnrTb5Tha7h8DYtDMAFUP65K2uk"
}
```
<a name="2"></a>
###  2. GET /user/all

Risposta:
```	                          
[
	{
        "id": 1,
        "nome_utente": "rob",
        "email": "rob@email.it",
        "password": "rob",
        "admin": true,
        "credito": 10,
        "createdAt": "2023-07-16T09:45:09.687Z",
        "updatedAt": "2023-07-16T09:45:09.687Z"
    },
	....
	{
        "id": 10,
        "nome_utente": "carlo",
        "email": "carlo@email.it",
        "password": "carlo",
        "admin": true,
        "credito": 10,
        "createdAt": "2023-07-16T09:45:09.687Z",
        "updatedAt": "2023-07-16T09:45:09.687Z"
    }
]
```

<a name="3"></a>
###  3. POST /user/new

Body: 
```json
{
    "nome_utente":"rob",
    "email":"rob@email.it",
    "password":"carlo",
    "admin": false
}
```

Risposta:
```	                          
{
    "id": 1,
    "nome_utente": "rob",
    "email": "rob@email.it",
    "password": "carlo",
    "admin": false,
    "credito": 10,
    "createdAt": "2023-07-16T09:45:09.687Z",
    "updatedAt": "2023-07-16T09:45:09.687Z"
}
```

<a name="4"></a>
###  4. PUT /user/update?id=1

Body: 
```json
{
    "nome_utente":"rob",
    "email":"rob@email.it",
    "password":"carlo",
    "admin": false
}
```

Risposta:
```	                          
{
    "id": 1,
    "nome_utente": "rob",
    "email": "rob@email.it",
    "password": "carlo",
    "admin": false,
    "credito": 10,
    "createdAt": "2023-07-16T09:45:09.687Z",
    "updatedAt": "2023-07-16T09:45:09.687Z"
}
```

<a name="5"></a>
###  5. DELETE /user/delete?id=1

Risposta:
```	                          
{
    "msg": "utente eliminato."
}
```

<a name="6"></a>
### 6. GET	/user/creditoresiduo?id=1

Risposta:
```	                          
{
    "credito": 10
}
```

<a name="7"></a>
### 7. POST	/user/ricaricacredito?id=1

Body:
```	                          
{
    "email": "rob@email.it",
    "credito": 1
}
```

Risposta:
```	                          
{
    "result": "Ricarica effettuata."
}
```

<a name="8"></a>
###  8. GET /model/all

Risposta:
```	                          
[
    {
        "id": 3,
        "nome": "modello",
        "datasetid": 5,
        "userid": 1,
        "createdAt": "2023-07-16T16:15:59.525Z",
        "updatedAt": "2023-07-16T16:15:59.525Z"
    }
]
```

<a name="9"></a>
###  9. POST /model/new

Body: 
```json
{
    "nome": "modello",
    "datasetid": 5,
    "userid": 1
}
```

Risposta:
```	                          
{
    "id": 3,
    "nome": "modello",
    "datasetid": 5,
    "userid": 1,
    "updatedAt": "2023-07-16T16:15:59.525Z",
    "createdAt": "2023-07-16T16:15:59.525Z"
}
```

<a name="10"></a>
###  4. PUT /model/update?id=3

Body: 
```json
{
    "nome": "modello_mod",
    "datasetid": 1,
}
```

Risposta:
```	                          
{
    "id": 3,
    "nome": "modello_mod",
    "datasetid": 5,
    "userid": 1,
    "updatedAt": "2023-07-16T16:15:59.525Z",
    "createdAt": "2023-07-16T16:15:59.525Z"
}
```

<a name="11"></a>
###  11. DELETE /model/delete?id=3

Risposta:
```	                          
{
    "msg": "modello eliminato."
}
```

<a name="12"></a>
###  12. GET /model/inferenza

Body: 
```json
{
    "id": 1,
    "userid": 1,
    "did": 1,
    "tipo": 0
}
```

Risposta:
```	                          
{
    "job_id": "28635082-9ced-47e3-aac4-365212f57547"
}
```

<a name="13"></a>
###  13. GET /model/stato/:id

Risposta:
```	                          
{
    "job_id": "28635082-9ced-47e3-aac4-365212f57547",
    "stato": "SUCCESS"
}
```

<a name="14"></a>
###  14. POST /model/risultato/:id

Risposta:
```	                          
{
    "id": "28635082-9ced-47e3-aac4-365212f57547",
    "risultato": [
        [
            [
                100,
                68
            ],
            [
                100,
                63
            ],
            [
                99,
                64
            ],
            [
                108,
                61
            ],
            [
                -192,
                -192
            ],
            [
                121,
                76
            ],
            [
                105,
                77
            ],
            [
                125,
                101
            ],
            [
                102,
                101
            ],
            [
                105,
                112
            ],
            [
                102,
                110
            ],
            [
                129,
                109
            ],
            [
                117,
                105
            ],
            [
                113,
                117
            ],
            [
                97,
                117
            ],
            [
                153,
                149
            ],
            [
                134,
                137
            ]
        ]
    ]
}
```

<a name="15"></a>
###  15. GET /dataset/all

Risposta:
```	                          
[
    {
        "deletedAt": null,
        "id": 4,
        "nome": "6",
        "tags": "lorenzo",
        "uid": 1,
        "createdAt": "2023-07-16T09:45:36.796Z",
        "updatedAt": "2023-07-16T09:47:38.525Z"
    },
    {
        "deletedAt": null,
        "id": 5,
        "nome": "dataset",
        "tags": "prova",
        "uid": 1,
        "createdAt": "2023-07-16T16:15:27.500Z",
        "updatedAt": "2023-07-16T16:15:27.500Z"
    }
]
```

<a name="16"></a>
###  16. POST /dataset/new

Body: 
```json
{
    "nome": "dataset",
    "tags": "prova",
    "uid": 1
}
```

Risposta:
```	                          
{
    "deletedAt": null,
    "id": 5,
    "nome": "dataset",
    "tags": "prova",
    "uid": 1,
    "updatedAt": "2023-07-16T16:15:27.500Z",
    "createdAt": "2023-07-16T16:15:27.500Z"
}
```

<a name="17"></a>
###  17. PUT /dataset/update?id=5

Body: 
```json
{
    "nome": "dataset",
    "tags": "modificato"
}
```

Risposta:
```	                          
{
    "msg": "Dataset aggiornato."
}
```

<a name="18"></a>
###  18. DELETE /dataset/delete?id=5

Risposta:
```	                          
{
    "msg": "dataset eliminato."
}
```

<a name="19"></a>
###  19. POST /dataset/caricafile?id=5

Body:
```	                          
{
    "immagine": "img.jpg"
}
```

Risposta:
```	                          
{
    "msg": "Immagine caricata correttamente."
}
```

<a name="20"></a>
###  20. POST /dataset/caricavideo?id=5

Body:
```	                          
{
    "video": "video.mp4"
}
```

Risposta:
```	                          
{
    "msg": "Video caricato correttamente."
}
```

<a name="software"></a>
# Software e Framework utilizzati
Per la realizzazione di questo applicativo sono stati utilizzati i seguenti strumenti:

- [Node.js](https://nodejs.org/it/)
- [Express](https://expressjs.com/it/)
- [Sequelize](https://sequelize.org/)
- RDBMS ([Postgres](https://www.postgresql.org/))
- [Celery](https://docs.celeryq.dev/en/stable/)
- [Flask](https://flask.palletsprojects.com/en/2.2.x/)
- [RabbitMQ](https://www.rabbitmq.com/)
- L'applicativo [Postman](https://www.postman.com) per richiamare le API ed eseguire delle richieste
- L'ambiete [GitHub](https://github.com) per il versioning del codice

<a name="autor"></a>
# Autori
- [Carlo Gissi](https://github.com/CarloGissi)
- [Roberto Mustillo](https://github.com/RobertoMustillo)
