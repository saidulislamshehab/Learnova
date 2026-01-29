# Stage 1: Build frontend assets
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Install PHP dependencies
FROM composer:2 AS composer-deps
WORKDIR /app
COPY composer.json composer.lock ./
COPY database ./database
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY routes ./routes
COPY resources ./resources
COPY public ./public
COPY artisan ./artisan

# Install dependencies with platform requirements
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --ignore-platform-reqs

# Stage 3: Serve application
FROM php:8.2-cli

# Install system dependencies & extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy project files
COPY . .

# Copy vendor from composer stage
COPY --from=composer-deps /app/vendor ./vendor

# Copy built frontend assets
COPY --from=frontend /app/public/build ./public/build

# Set up Laravel directories with proper permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Generate app key if missing (prevents boot errors)
RUN if [ ! -f .env ]; then cp .env.example .env; fi
RUN php artisan key:generate --force

# Run post-autoload scripts now that everything is in place
RUN composer dump-autoload --optimize

# Clean up config
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear

# Expose Render port
EXPOSE 10000

# Start Laravel using the built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
