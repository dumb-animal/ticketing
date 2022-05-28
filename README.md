# Ticketing

Необходимо добавить хост `ticketing.dev` с адресом `127.0.0.1` в файл `/etc/hosts`

Необходимо добавить k8s секрет для jwt. Он должен иметь имя jwt-secret и иметь поле JWT_KEY.

## Folders

- [common](#common)
- [infrastructure](#infrastructure)
- [auth](#auth)
- client

### common

Представляет собой npm пакет который содержит в себе все общие файлы такие как ошибки и промежуточные обработчики.

### infrastructure

Содержит все файлы для развертывания kubernetes кластера.

### auth

Представляет собой единый центр аутентификации.
