# Stage 1: Build frontend assets
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve application
FROM php:8.2-cli

# Install system dependencies
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

# Install dependencies without running scripts (because files aren't copied yet)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

# Copy project files
COPY . .

# Copy built frontend assets from the frontend stage
# Vite with Laravel plugin outputs to public/build by default
COPY --from=frontend /app/public/build public/build

# Now run the scripts (package discovery, etc.)
RUN composer dump-autoload --optimize

# Generate app key if missing
RUN if [ ! -f .env ]; then cp .env.example .env; fi
RUN php artisan key:generate

# Expose Port for Render
EXPOSE 10000

# Start Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
