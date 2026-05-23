from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


class Node:
    def __init__(self, cliente):
        self.cliente = cliente
        self.next = None


class Queue:
    def __init__(self):
        self.head = None            
        self.tail = None  
        self._size = 0 

    # Insere na fila
    def enqueue(self, novo_cliente):
            node = Node(novo_cliente)
            
            if self.head is None:           
                self.tail = node            
                self.head = node 

            if novo_cliente['prioridade'] == "Preferencial" and self.head.cliente['prioridade'] == "Normal":
                self.head.next = self.head   
                self.head = node  

            pointer = self.head
            if novo_cliente['prioridade'] == "Preferencial":
                while pointer.next is not None and pointer.next.cliente['prioridade'] == "Preferencial":
                    pointer = pointer.next
                node.next = pointer.next
                pointer.next = node
            else:
                self.tail.next = node
                self.tail = node

            self._size = self._size + 1

    # Remove da fila
    def dequeue(self):
        if self._size > 0:
            cliente  = self.head.cliente
            self.head = self.head.next
    
            if self.head is None:
                self.tail = None

            self._size -= 1
            return cliente
        return None

        # Remove da fila pela senha
    
    # Remove da fila pelo id
    def dequeue_for_id(self, cliente_id):
        pointer = self.head
        prev = None

        while pointer is not None:
            if pointer.cliente['id'] == cliente_id:
                if prev is None:
                    self.head = pointer.next
                else:
                    prev.next = poiter.next
                return pointer.cliente
            prev = pointer
            pointer = pointer.next
        return None

    # Transforma em lista para enviar ao React
    def transforma_lista(self):
        pointer = self.head
        while pointer is not None:
            lista.append(pointer.cliente)
            pointer = pointer.next
        return lista
 