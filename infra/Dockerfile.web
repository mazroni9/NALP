FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql pcntl bcmath zip intl \
    && pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . /var/www/html

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    || true

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
