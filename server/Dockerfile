# Stage 1: Build frontend assets
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve application
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

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Install dependencies (no scripts to avoid errors before code copy)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

# Copy project files
COPY . .

# Copy built frontend assets
COPY --from=frontend /app/public/build public/build

# Finalize setup
RUN composer dump-autoload --optimize

# Generate app key if missing (prevents boot errors)
RUN if [ ! -f .env ]; then cp .env.example .env; fi
RUN php artisan key:generate

# Clean up config
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear

# Expose Render port
EXPOSE 10000

# Start Laravel using the built-in server (easiest for single-container deployment)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
