import socket
import os

# dictionar cu tipurile de media suportate
tipuriMedia = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'ico': 'image/x-icon'
}
# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)
while True:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')
    # asteapta conectarea unui client la server
    # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
    (clientsocket, address) = serversocket.accept()
    print('S-a conectat un client.')
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print('S-a citit linia de start din cerere: ##### ' + linieDeStart + '#####')
            numeResursa = linieDeStart.split(' ')[1]
            print('S-a cerut resursa: ' + numeResursa)
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
                        
                    # construieste raspunsul HTTP cu codul de stare 200 (OK) si continutul fisierului
                    raspuns = 'HTTP/1.1 200 OK\r\nContent-Type: '+tipMedia+'\r\n\r\n'
                    #raspuns = raspuns.encode() + continutFisier
                    raspuns = raspuns.encode()+ continutFisier
                    # trimite răspunsul înapoi către client
                    clientsocket.sendall(raspuns)
                else:
                    # daca fisierul nu exista, construieste raspunsul HTTP cu codul de stare 404 (Not Found)
                    raspuns = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\nFisierul cerut nu a putut fi gasit!'
                    # trimite răspunsul înapoi către client
                    clientsocket.sendall(raspuns.encode())
                # Inchidem fisierul
                fisier.close()
            except FileNotFoundError:
            # Daca fisierul nu exista, construieste raspunsul HTTP cu codul de stare 404 (Not Found)
                raspuns = 'HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\nFisierul cerut nu a putut fi gasit!'
                clientsocket.sendall(raspuns.encode())
            except Exception as e:
            # Daca a aparut o eroare la citirea fisierului, construieste raspunsul HTTP cu codul de stare 500 (Internal Server Error)
                raspuns = 'HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain\r\n\r\nEroare la citirea fisierului: ' + str(e)
                clientsocket.sendall(raspuns.encode())
        break
    print('S-a terminat cititrea.')
    clientsocket.close()
    print('S-a terminat comunicarea cu clientul.')
