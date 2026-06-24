import unittest

from classes import Queue


class HistoricoTests(unittest.TestCase):
    def setUp(self):
        self.fila = Queue()
        self.historico = [
            {"nome": "Ana", "data_hora": "2024-01-10 09:30:00"},
            {"nome": "Carlos", "data_hora": "2024-01-11 08:00:00"},
            {"nome": "Beatriz", "data_hora": "2024-01-09 10:00:00"},
        ]

    def test_filtrar_e_ordenar_historico_por_data_hora(self):
        resultado = self.fila.filtrar_e_ordenar_historico(self.historico, ordem="recente")

        self.assertEqual([cliente["nome"] for cliente in resultado], ["Carlos", "Ana", "Beatriz"])

    def test_busca_no_historico_por_nome(self):
        cliente = self.fila.busca_no_historico_por_nome(self.historico, "ana")

        self.assertIsNotNone(cliente)
        self.assertEqual(cliente["nome"], "Ana")


if __name__ == "__main__":
    unittest.main()
