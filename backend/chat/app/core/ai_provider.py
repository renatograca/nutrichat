import os
from abc import ABC, abstractmethod


class AIProvider(ABC):
    """Interface genérica para provedores de IA."""

    @abstractmethod
    def get_embedding(self, text: str) -> list[float]:
        """Gera o embedding para um texto."""
        pass

    @abstractmethod
    def chat(self, prompt: str) -> str:
        """Gera uma resposta para o prompt dado."""
        pass
