from flask import Flask, jsonify, request
from flask_cors import CORS
from classes import Queue

app = Flask(__name__)
CORS(app)

fila_tad = Queue()
historico_lista = [] 
tabela_hash_senhas = {} 
proxima_senha = 1

@app.route('/dados', methods=['GET'])
def obter_dados():
    return jsonify({
        "fila": fila_tad.transforma_lista(),
        "historico": historico_lista,
        "proximaSenha": proxima_senha
    })


@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    global proxima_senha
    dados = request.json
    
    novo_cliente = {
        "id": str(proxima_senha) + "id",
        "nome": dados['nome'],
        "prioridade": dados['tipo'],
        "senha": proxima_senha,
        "status": "Aguardando",
        "chegada": dados['chegada']
    }
    
    fila_tad.enqueue(novo_cliente)
    
    tabela_hash_senhas[proxima_senha] = novo_cliente
    
    proxima_senha += 1
    return jsonify({"sucesso": True})


@app.route('/chamar', methods=['POST'])
def chamar():

    cliente = fila_tad.dequeue()
    if cliente:
        import datetime
        cliente['status'] = 'Concluído'
        cliente['conclusao'] = datetime.datetime.now().strftime("%H:%M:%S")
        
        tabela_hash_senhas[cliente['senha']] = cliente
        historico_lista.insert(0, cliente)
        
    return jsonify({"sucesso": True})


@app.route('/cancelar/<cliente_id>', methods=['POST'])
def cancelar(cliente_id):
 
    cliente = fila_tad.dequeue_for_id(cliente_id)
    if cliente:
        import datetime
        cliente['status'] = 'Cancelado'
        cliente['conclusao'] = datetime.datetime.now().strftime("%H:%M:%S")
        
        tabela_hash_senhas[cliente['senha']] = cliente
        historico_lista.insert(0, cliente)
        
    return jsonify({"sucesso": True})


@app.route('/buscar-senha/<int:senha>', methods=['GET'])
def buscar_senha(senha):
    cliente = tabela_hash_senhas.get(senha)
    if cliente:
        return jsonify({"encontrado": True, "cliente": cliente})
    return jsonify({"encontrado": False})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
 