# Ticketing

Учебный проект для изучения микросервисной архитектуры, брокеров сообщений (NATS) и СI/CD при помощи GitHub.

- Необходимо добавить хост `ticketing.dev` с адресом `127.0.0.1` в файл `/etc/hosts`
- Необходимо добавить k8s секрет для jwt. Он должен иметь имя jwt-secret и иметь поле JWT_KEY.
- Необходимо добавить k8s секрет для strpe. Он должен иметь имя stripe-secret и иметь поле STRIPE_KEY.

Пример:

    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-key
    kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=some-key



Необходимо напечатать `thisisunsafe` для того что бы разблокировать клиент в браузере.
