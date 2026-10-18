# Build stage
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app

COPY gradlew settings.gradle build.gradle ./
COPY gradle/ gradle/

RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon

COPY src/ src/
RUN ./gradlew clean build -x test --no-daemon

RUN cp $(ls -S build/libs/*.jar | grep -v "plain" | head -n 1) /app/app-ready.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/app-ready.jar app.jar

ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

CMD ["java", "-jar", "app.jar"]