FROM php:8.3-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install msmtp (lightweight sendmail replacement) to route mail to MailHog
RUN apt-get update && apt-get install -y msmtp && rm -rf /var/lib/apt/lists/*

# Configure msmtp to point at the MailHog SMTP service
RUN echo "account default\nhost mailhog\nport 1025\nfrom noreply@djmisha.com\n" > /etc/msmtprc

# Tell PHP to use msmtp as the sendmail binary
RUN echo "sendmail_path = /usr/bin/msmtp -t" > /usr/local/etc/php/conf.d/mail.ini

# Allow .htaccess overrides
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Expose PHP scripts from a separate mount at /php
RUN printf "Alias /php /var/www/php\n<Directory /var/www/php>\n    AllowOverride All\n    Require all granted\n</Directory>\n" > /etc/apache2/conf-available/php-alias.conf \
    && a2enconf php-alias

EXPOSE 80
