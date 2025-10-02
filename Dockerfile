FROM php:8.2-apache

# Mettre à jour et installer les dépendances
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        gd \
        mbstring \
        xml \
        zip \
        bcmath

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Activer mod_rewrite d'Apache
RUN a2enmod rewrite

# Copier les fichiers de l'application
COPY . /var/www/html

# Se déplacer dans le répertoire de travail
WORKDIR /var/www/html

# Créer les dossiers Laravel manquants s'ils n'existent pas
RUN mkdir -p storage storage/framework storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache

# Définir les permissions
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Installer les dépendances PHP
RUN composer install --no-dev --optimize-autoloader

# Configurer Apache pour utiliser le dossier public
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Exposer le port 80
EXPOSE 80