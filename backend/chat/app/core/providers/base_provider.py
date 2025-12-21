from abc import ABC, abstractmethod


class BaseAIProvider(ABC):
    """Interface base para provedores de IA"""

    @abstractmethod
    def embed_text(self, text: str) -> list[float]:
        """Gera embeddings de um texto"""
        pass

    @abstractmethod
    def ask_question(self, question: str, context: str) -> str:
        """Faz uma pergunta ao modelo com base em um contexto"""
        pass

    def chat(self, prompt: str) -> str:
        """Envia um prompt genérico ao modelo"""
        # Por padrão, se não implementado, tenta usar ask_question sem contexto
        return self.ask_question(prompt, "")
