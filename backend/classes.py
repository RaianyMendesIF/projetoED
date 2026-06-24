import datetime


class Node:
    def __init__(self, cliente):
        self.cliente = cliente
        self.next = None


class Queue:
    def __init__(self):
        self.head = None            
        self.tail = None  
        self._size = 0 

    def is_empty(self):
        return self.head is None

    def get_size(self):
        return self._size

    def enqueue(self, novo_cliente):
        node = Node(novo_cliente)
        
        if self.is_empty():           
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
        if not self.is_empty():
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

    def obter_chave_ordem(self, cliente):
        valor = cliente.get('data_hora') or cliente.get('dataHora') or cliente.get('chegada') or cliente.get('conclusao') or cliente.get('data')

        if isinstance(valor, datetime.datetime):
            return valor

        if isinstance(valor, str):
            texto = valor.strip()
            if not texto:
                return datetime.datetime.min

            formatos = (
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%d %H:%M",
                "%d/%m/%Y %H:%M:%S",
                "%d/%m/%Y %H:%M",
                "%Y-%m-%d",
                "%d/%m/%Y",
                "%H:%M:%S",
                "%H:%M",
            )

            for formato in formatos:
                try:
                    return datetime.datetime.strptime(texto, formato)
                except ValueError:
                    continue

            try:
                return datetime.datetime.fromisoformat(texto)
            except ValueError:
                pass

            if ":" in texto and len(texto) <= 5:
                try:
                    return datetime.datetime.strptime(f"1900-01-01 {texto}", "%Y-%m-%d %H:%M")
                except ValueError:
                    pass

        return datetime.datetime.min

    def _ordenar_historico(self, historico, ordem="recente"):
        resultado = [cliente for cliente in historico]
        resultado.sort(key=self.obter_chave_ordem, reverse=(ordem != "antigo"))
        return resultado

    # Filtra e ordena o histórico
    def filtrar_e_ordenar_historico(self, historico, busca="", ordem="recente"):
        busca = busca.lower().strip()

        if busca:
            resultado = [cliente for cliente in historico if busca in cliente.get('nome', '').lower()]
        else:
            resultado = [cliente for cliente in historico]

        resultado = sorted(resultado, key=self.obter_chave_ordem, reverse=(ordem != "antigo"))
        if ordem == 'antigo':
            resultado.sort(key=self.obter_chave_ordem)
        return resultado

    def busca_no_historico_por_nome(self, historico, nome_procurado):
        nome_procurado = nome_procurado.strip().lower()
        resultado = [cliente for cliente in historico if cliente.get('nome', '').lower() == nome_procurado]
        resultado.sort(key=self.obter_chave_ordem, reverse=True)
        return resultado[0] if resultado else None

    def busca_por_nome(self, nome_procurado):
        nome_procurado = nome_procurado.strip().lower()
        pointer = self.head
        
        while pointer is not None:
            if pointer.cliente['nome'].lower() == nome_procurado:
                return pointer.cliente 
            pointer = pointer.next      
            
        return None 