package com.smartenergy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import lombok.extern.slf4j.Slf4j;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import java.util.Properties;

@Configuration
@Slf4j
public class MailConfig {

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        // Setup insecure SSL context for development
        // WARNING: This bypasses SSL verification and should NEVER be used in production
        setupInsecureSSL();
        
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        
        Properties props = new Properties();
        props.setProperty("mail.smtp.auth", "true");
        props.setProperty("mail.smtp.starttls.enable", "true");
        props.setProperty("mail.smtp.starttls.required", "false");
        props.setProperty("mail.smtp.starttls.protocols", "TLSv1.2");
        props.setProperty("mail.smtp.connectiontimeout", "5000");
        props.setProperty("mail.smtp.timeout", "10000");
        props.setProperty("mail.smtp.writetimeout", "10000");
        props.setProperty("mail.smtp.ssl.checkserveridentity", "false");
        props.setProperty("mail.smtp.ssl.trust", "*");
        
        mailSender.setJavaMailProperties(props);
        
        log.info("JavaMailSender configured for: {}", host);
        return mailSender;
    }

    /**
     * Setup insecure SSL context for development only.
     * This disables certificate validation for Gmail SMTP.
     * WARNING: NEVER use in production!
     */
    private void setupInsecureSSL() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    public void checkClientTrusted(X509Certificate[] certs, String authType) {
                    }

                    public void checkServerTrusted(X509Certificate[] certs, String authType) {
                    }
                }
            };

            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            
            log.warn("!!! INSECURE SSL CONTEXT ENABLED FOR DEVELOPMENT !!!");
            log.warn("!!! DO NOT USE IN PRODUCTION !!!");
        } catch (Exception e) {
            log.error("Failed to setup insecure SSL context", e);
        }
    }
}


