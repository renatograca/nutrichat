package com.bodyteam.nutrichat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
		exclude = {
				org.springframework.ai.autoconfigure.chat.client.ChatClientAutoConfiguration.class,
				org.springframework.ai.model.chat.client.autoconfigure.ChatClientAutoConfiguration.class,
//				org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatAutoConfiguration.class

		}
)
public class NutrichatApplication {

	public static void main(String[] args) {
		SpringApplication.run(NutrichatApplication.class, args);
	}

}
