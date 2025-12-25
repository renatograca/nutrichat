class BaseAIProvider {
  embed_text(text) {
    throw new Error('embed_text must be implemented');
  }

  ask_question(question, context) {
    throw new Error('ask_question must be implemented');
  }

  chat(prompt) {
    return this.ask_question(prompt, '');
  }
}

export default BaseAIProvider;
