class BaseAIProvider {
  embed_text(text: any) {
    throw new Error('embed_text must be implemented');
  }

  ask_question(question: any, context: any) {
    throw new Error('ask_question must be implemented');
  }

  chat(prompt: any) {
    return (this as any).ask_question(prompt, '');
  }
}

export default BaseAIProvider;

