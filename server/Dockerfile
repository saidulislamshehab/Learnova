FROM richarvey/nginx-php-fpm:latest

COPY . .

# Image Configuration
#ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel Configuration
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1



# Move start.sh to where the base image expects user scripts
RUN mkdir -p /var/www/html/scripts && mv /var/www/html/start.sh /var/www/html/scripts/start.sh && chmod +x /var/www/html/scripts/start.sh

# Let the base image do its thing
CMD ["/start.sh"]