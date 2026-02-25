# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend
WORKDIR /app
COPY apps/web/package*.json ./
RUN npm ci --legacy-peer-deps
COPY apps/web ./
RUN npm run build

# Stage 2: Laravel app
FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql pcntl bcmath zip intl \
    && pecl install redis && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY apps/web /var/www/html
COPY --from=frontend /app/public/build /var/www/html/public/build

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8080
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
