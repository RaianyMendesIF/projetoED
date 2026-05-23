from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


class Node:
    def __init__(self, cliente):
        self.cliente = cliente
        self.next = None

# Estrutura básica da fila
class Queue:
    def __init__(self):
        self.head = None            
        self.tail = None  
        self._size = 0 

    # Insere
    def enqueue(self, elem, time):
            node = Node(elem, time)
            if self.tail is None:           
                self.tail = node            
                self.head = node                       
            else:
                self.tail.next = node       
                self.tail = node            
            self._size = self._size + 1
    
    # Remove
    def dequeue(self):
        if self._size > 0:
            elem  = self.head.data
            self.head = self.head.next
    
            if self.head is None:
                self.tail = None

            self._size -= 1
            return elem
        raise IndexError("A fila está vazia!")


    def show(self):
        pointer = self.head
        while pointer:
            print(f"({pointer.data} - {pointer.time})")
            pointer = pointer.next


    def quantum(self, quantum):
        while self.head:
            self.head.time = self.head.time - quantum
            if self.head.time <= 0:
                print(f"{self.head.data} removido! Tempo: {self.head.time}")
                self.dequeue()
            else:
                node = self.head.data
                time = self.head.time
                self.dequeue()
                self.enqueue(node, time)