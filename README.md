# Ticketing

Необходимо добавить хост `ticketing.dev` с адресом `127.0.0.1` в файл `/etc/hosts`

Необходимо добавить k8s секрет для jwt. Он должен иметь имя jwt-secret и иметь поле JWT_KEY.
Необходимо добавить k8s секрет для strpe. Он должен иметь имя stripe-secret и иметь поле STRIPE_KEY.

Необходимо напечатать `thisisunsafe` для того что бы разблокировать клиент.

## Folders

- [common](#common)
- [infrastructure](#infrastructure)
- [auth](#auth)
- [nats-test](#nats-test)
- client

### common

Представляет собой npm пакет который содержит в себе все общие файлы такие как ошибки и промежуточные обработчики.

### infrastructure

Содержит все файлы для развертывания kubernetes кластера.

### auth

Представляет собой единый центр аутентификации.

### nats-test

Необходима была для изучения основных принципов NATS.
