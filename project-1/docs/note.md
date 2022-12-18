# Pensine
## creer un model en mode api avec le controller et la migration

```sh
php artisan make:model NOMDUMODEL -c --api -m
```

## creation des champs de la table associée via la migration

```php
public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title',255);
            $table->string('description',255);
            $table->timestamps();
        });
    }
```

## Update de la BDD

```sh
php artisan migrate
```


