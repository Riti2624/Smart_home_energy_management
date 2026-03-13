# Production Deployment Guide for Smart Energy Backend

## Deployment Checklist

- [ ] All unit tests pass
- [ ] Security scan completed
- [ ] JWT secret changed
- [ ] Database credentials updated
- [ ] Email service configured
- [ ] CORS origins set correctly
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Load balancer configured (if needed)
- [ ] Database backups automated

## Pre-Deployment Steps

### 1. Security Configuration

```yaml
# application.yml (Production)
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # NEVER update in production
  
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      connection-timeout: 30000

jwt:
  secret: ${JWT_SECRET}  # Use environment variable
  expiration: 86400000

server:
  servlet:
    session:
      timeout: 30m
  ssl:
    enabled: true
    key-store: /path/to/keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: tomcat
```

### 2. Environment Variables

Set these environment variables on your server:

```bash
export DB_URL=jdbc:mysql://prod-db-host:3306/smart_energy_db
export DB_USERNAME=smartenergy_user
export DB_PASSWORD=very_strong_password_here
export JWT_SECRET=generate-a-256bit-random-secret
export MAIL_USERNAME=your-service-email@gmail.com
export MAIL_PASSWORD=app-specific-password
export SERVER_PORT=8080
export KEYSTORE_PASSWORD=keystore_password
```

### 3. Database Backup

```bash
# Daily backup script (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u ${DB_USER} -p${DB_PASSWORD} smart_energy_db > backup_${DATE}.sql
gzip backup_${DATE}.sql
aws s3 cp backup_${DATE}.sql.gz s3://my-backups/
```

### 4. Rate Limiting

Add rate limiting middleware to prevent brute force attacks:

```java
// Add to Maven dependencies
<dependency>
    <groupId>io.github.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>7.10.0</version>
</dependency>
```

### 5. Monitoring Setup

```yaml
# Add actuator for metrics
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/smart-energy-backend-1.0.0.jar app.jar

ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

EXPOSE 8080

ENTRYPOINT ["java", "$JAVA_OPTS", "-jar", "app.jar"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: ${SPRING_DATASOURCE_URL}
      SPRING_DATASOURCE_USERNAME: ${SPRING_DATASOURCE_USERNAME}
      SPRING_DATASOURCE_PASSWORD: ${SPRING_DATASOURCE_PASSWORD}
      EMAIL_USER: ${EMAIL_USER}
      EMAIL_PASS: ${EMAIL_PASS}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mysql
    networks:
      - smart-network

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: smart_energy_db
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database-setup.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - smart-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql-data:

networks:
  smart-network:
    driver: bridge
```

### Deploy with Docker

```bash
# Build image
docker build -t smart-energy-backend:latest .

# Run container
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=$SPRING_DATASOURCE_URL \
  -e SPRING_DATASOURCE_USERNAME=$SPRING_DATASOURCE_USERNAME \
  -e SPRING_DATASOURCE_PASSWORD=$SPRING_DATASOURCE_PASSWORD \
  -e EMAIL_USER=$EMAIL_USER \
  -e EMAIL_PASS=$EMAIL_PASS \
  -e JWT_SECRET=$JWT_SECRET \
  smart-energy-backend:latest

# Or with docker-compose
docker-compose up -d
```

## Kubernetes Deployment

### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smart-energy-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: smart-energy-backend
  template:
    metadata:
      labels:
        app: smart-energy-backend
    spec:
      containers:
      - name: backend
        image: smart-energy-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DB_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: smart-energy-backend-service
spec:
  selector:
    app: smart-energy-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

### Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic db-credentials \
  --from-literal=url=jdbc:mysql://mysql:3306/smart_energy_db \
  --from-literal=username=$SPRING_DATASOURCE_USERNAME \
  --from-literal=password=$SPRING_DATASOURCE_PASSWORD

kubectl create secret generic jwt-secret \
  --from-literal=secret=$JWT_SECRET

# Deploy
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Check status
kubectl get pods
kubectl get svc
kubectl logs deployment/smart-energy-backend
```

## AWS Deployment (Optional)

### Deploy to Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p java-17-amazon-corretto-al2 smart-energy-backend

# Create environment
eb create smart-energy-prod

# Deploy
eb deploy

# Set environment variables
eb setenv \
  DB_URL=jdbc:mysql://prod-db:3306/smart_energy_db \
  DB_USERNAME=smartenergy \
  DB_PASSWORD=$DB_PASSWORD \
  JWT_SECRET=$JWT_SECRET

# Monitor
eb open
eb logs
```

### RDS Setup

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier smart-energy-prod \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username smartenergy \
  --master-user-password $DB_PASSWORD \
  --allocated-storage 20 \
  --backup-retention-period 30
```

## Monitoring & Logging

### CloudWatch Metrics

```bash
# Enable application metrics
curl http://localhost:8080/api/actuator/metrics
curl http://localhost:8080/api/actuator/health
```

### ELK Stack Setup (Optional)

```yaml
# logback-spring.xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="ELK" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>elk-host:5000</destination>
        <encoder class="net.logstash.logback.encoder.LogstashEncoder"/>
    </appender>
    <root level="INFO">
        <appender-ref ref="ELK"/>
    </root>
</configuration>
```

## Health Checks

```bash
# Application health
curl http://backend-url/api/health

# Database connection
curl http://backend-url/api/health/db

# Metrics
curl http://backend-url/api/metrics
```

## Troubleshooting Production Issues

### Memory Issues

```bash
# Increase JVM memory
export JAVA_OPTS="-Xms1g -Xmx2g -XX:+UseG1GC"
```

### Database Connection Pool

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 30
      minimum-idle: 10
      connection-timeout: 30000
      idle-timeout: 600000
```

### High CPU Usage

1. Check slow queries: `SET GLOBAL slow_query_log = 'ON';`
2. Add database indexes
3. Implement caching with Redis

###Email Service Down

1. Implement retry mechanism
2. Queue failed emails
3. Send alerts to operations team

## Post-Deployment

1. ✅ Run smoke tests
2. ✅ Verify all endpoints
3. ✅ Check database connectivity
4. ✅ Monitor logs
5. ✅ Test failover procedures
6. ✅ Document deployment
7. ✅ Set up alerts
8. ✅ Schedule maintenance windows

## Support & Maintenance

- **Daily**: Check logs and metrics
- **Weekly**: Review performance reports
- **Monthly**: Security patches and updates
- **Quarterly**: Database optimization and cleanup
- **Yearly**: Complete security audit

For detailed documentation, refer to:
- [Spring Boot Production Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Kubernetes Official Docs](https://kubernetes.io/docs/)
