import socket
import os
import gzip
from threading import Thread
import json
# dictionar cu tipurile de media suportate
tipuriMedia = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'json': 'application/json',
    'xml': 'application/xml'
}
# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)
def procesare_cerere(clientsocket,address):
    print('S-a conectat un client.')
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        if len(data) == 0:
            break
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print('S-a citit linia de start din cerere: ##### ' + linieDeStart + '#####')
            numeResursa = linieDeStart.split(' ')[1]
            if numeResursa=='/':
                numeResursa = '/index.html'
            print('S-a cerut resursa: ' + numeResursa)
            # Parsarea cererii
            if linieDeStart.startswith('POST'):
                # Parsare continut cerere
                pozitie = cerere.find('\r\n\r\n')
                continut = cerere[pozitie+4:]
                elemente = continut.split(',')
                cerere_dict = json.loads(continut)
                # Creare obiect JSON cu numele de utilizator si parola
                username = cerere_dict['username']
                password = cerere_dict['password']
                obiect_json = {'utilizator': username, 'parola': password}

                 # Citire lista utilizatori din fisier
                with open('../continut/resurse/utilizatori.json', 'r') as f:
                    lista_utilizatori = json.load(f)

                # Adaugare noul utilizator in lista
                lista_utilizatori.append(obiect_json)

                # Scriere lista actualizata de utilizatori in fisier
                with open('../continut/resurse/utilizatori.json', 'w') as f:
                    json.dump(lista_utilizatori, f)

                # Trimitere raspuns
                raspuns = 'HTTP/1.1 200 OK\r\n\r\n'
                clientsocket.sendall(raspuns.encode())
                clientsocket.close()
                break
            else:
                 # extrage extensia fisierului pentru a determina tipul de media corespunzator
                extensie = numeResursa.split('.')[-1]
                tipMedia = tipuriMedia.get(extensie, 'application/octet-stream')
                # determina calea completa catre fisierul cerut
                caleFisier = os.path.join('../continut', numeResursa[1:])
                print(caleFisier)
                try:
                    if os.path.exists(caleFisier):
                        # citeste continutul fisierului
                        with open(caleFisier, 'rb') as fisier:
                            continutFisier = fisier.read()
                        # comprima continutul fisierului folosind gzip
                        continutComprimat = gzip.compress(continutFisier)
                        # calculeaza lungimea continutului fisierului comprimat
                        lungimeContinut = str(len(continutComprimat))
                        # construieste raspunsul HTTP cu codul de stare 200 (OK) si continutul fisierului
                        raspuns = 'HTTP/1.1 200 OK\r\nContent-Type: '+tipMedia+'\r\nContent-Encoding: gzip\r\nContent-Length: '+lungimeContinut+'\r\n\r\n'
                        raspuns = raspuns.encode() + continutComprimat 
                        # trimite răspunsul înapoi către client
                        clientsocket.sendall(raspuns)
                    else:
                        # daca fisierul nu exista, construieste raspunsul HTTP cu codul de stare 404 (Not Found)
                        raspuns = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 43\r\n\r\nFisierul cerut nu a putut fi gasit!'
                        # trimite răspunsul înapoi către client
                        clientsocket.sendall(raspuns.encode())
                    # Inchidem fisierul
                    fisier.close()
                except FileNotFoundError:
                # Daca fisierul nu exista, construieste raspunsul HTTP cu codul de stare 404 (Not Found)
                    raspuns = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 43\r\n\r\nFisierul cerut nu a putut fi gasit!'
                    clientsocket.sendall(raspuns.encode())
                except Exception as e:
                # Daca a aparut o eroare la citirea fisierului, construieste raspunsul HTTP cu codul de stare 500 (Internal Server Error)
                    raspuns = 'HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain\r\nContent-Length: '+str(len(str(e)))+'\r\n\r\nEroare la citirea fisierului: ' + str(e)
                    clientsocket.sendall(raspuns.encode())
                    clientsocket.close()
                break
    print('S-a terminat cititrea.')
    clientsocket.close()
    print('S-a terminat comunicarea cu clientul.')
while True:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')
    # asteapta conectarea unui client la server
    # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
    (clientsocket, address) = serversocket.accept()
    t = Thread(target=procesare_cerere, args=(clientsocket, address))
    t.start()
    t.join()

