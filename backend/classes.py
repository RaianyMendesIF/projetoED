class Node:
    def __init__(self, cliente):
        self.cliente = cliente
        self.next = None


class Queue:
    def __init__(self):
        self.head = None            
        self.tail = None  
        self._size = 0 

    def enqueue(self, novo_cliente):
        node = Node(novo_cliente)
        
        if self.head is None:           
            self.head = node
            self.tail = node 

        elif novo_cliente['prioridade'] == "Preferencial" and self.head.cliente['prioridade'] == "Normal":
            node.next = self.head  
            self.head = node        

        elif novo_cliente['prioridade'] == "Preferencial":
            pointer = self.head
            while pointer.next is not None and pointer.next.cliente['prioridade'] == "Preferencial":
                pointer = pointer.next
            
            node.next = pointer.next
            pointer.next = node
            
            if node.next is None:
                self.tail = node

        else:
            self.tail.next = node
            self.tail = node

        self._size = self._size + 1

    # Remove o primeiro da fila (O(1))
    def dequeue(self):
        if self._size > 0:
            cliente = self.head.cliente
            self.head = self.head.next
    
            if self.head is None:
                self.tail = None

            self._size -= 1
            return cliente
        return None

    # Remove da fila pelo id (Cancelamento)
    def dequeue_for_id(self, cliente_id):
        pointer = self.head
        prev = None

        while pointer is not None:
            if pointer.cliente['id'] == cliente_id:
                if prev is None:
                    self.head = pointer.next
                    if self.head is None:
                        self.tail = None
                else:
                    prev.next = pointer.next  
                    if prev.next is None:
                        self.tail = prev
                
                self._size -= 1
                return pointer.cliente
                
            prev = pointer
            pointer = pointer.next
        return None

    # Transforma em lista para enviar ao React
    def transforma_lista(self):
        pointer = self.head
        lista = []
        while pointer is not None:
            lista.append(pointer.cliente)
            pointer = pointer.next
        return lista