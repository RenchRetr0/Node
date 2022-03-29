openapi: 3.0.3
info:
  description: |
    Документация к API мини-приложения для ВКонтакте [ical](https://github.com/Melodyn/ical).
  version: 1.0.0
  title: ical-vkma API
  contact:
    name: Сергей Мелодин
    url: https://melodyn.ru
    email: samelodyn@gmail.com
  license:
    name: GNU GPLv3
    url: https://github.com/Melodyn/ical/blob/main/LICENSE.txt
servers:
  # Added by API Auto Mocking Plugin
  - description: SwaggerHub API Auto Mocking
    url: https://virtserver.swaggerhub.com/Melodyn/ical-api/1.0.0
  - url: https://petstore.swagger.io/v2
  - url: https://melodyn-ical.herokuapp.com/api/{version}
    description: App backend
    variables:
      version:
        enum:
          - v1
        default: v1
security:
  - JWT: []
tags:
  - name: auth
    description: Аутентификация
    externalDocs:
      url: https://jwt.io/
      description: Документация JWT
  - name: calendar
    description: Работать с календарём сообщества. Авторизация по JWT
components:
  schemas:
    calendar:
      type: object
      required:
        - calendarId
        - timezone
      description: Объект календаря
      properties:
        calendarId:
          type: string
          description: Идентификатор календаря
          pattern: '^.+@.+\..+$'
          minLength: 5
        timezone:
          type: string
          minLength: 5
          description: Часовой пояс
      example:
        calendarId: 'ob1gcsbo877671s4295f693nv0@group.calendar.google.com'
        timezone: 'Europe/Moscow'
    vkParams:
      type: object
      description: |
        Объект с параметрами от ВКонтакте из query string. Всё, что начинается с префикса `vk_` и подпись из параметра `sign`.
      required:
        - sign
      properties:
        sign:
          type: string
      # ждём поддержки OAS 3.1: https://github.com/swagger-api/swagger-ui/issues/5891
      # patternProperties:
      #   '^vk_':
      #     type: string
      example:
        vk_access_token_settings: ''
        vk_app_id: '7966403'
        vk_are_notifications_enabled: '0'
        vk_group_id: '101295953'
        vk_is_app_user: '1'
        vk_is_favorite: '0'
        vk_language: 'ru'
        vk_platform: 'desktop_web'
        vk_ref: 'other'
        vk_ts: '1000000000'
        vk_user_id: '0'
        vk_viewer_group_role: 'admin'
        sign: 'B_07QeUbmuPRzrJnF5_sEh_6O-x6M5NYmR471Ztpv4E'
    200:
      type: object
      description: Объект с данными
    400:
      type: object
      description: Ответ описывает имя ошибки, текстовое описание на английском и параметры при которых ошибка возникла
      properties:
        name:
          type: string
          description: |
            Имена ошибок записываются через точку для поиска в словаре i18n. Примеры:
            * auth.vk.emptySign Отсутствует подпись параметров ВК
            * calendar.create.notFound При подключении нового календаря не удалось его найти по индентификатору
        message:
          type: string
        params:
          type: object
  securitySchemes:
    JWT:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        Документация JWT: [https://jwt.io/](https://jwt.io/)
  parameters:
    periodDays:
      name: periodDays
      in: query
      description: Период, на который получить мероприятия с сегодняшнего дня (по умолчанию - 30 дней)
      schema:
        type: integer
        minimum: 0
        maximum: 365
        default: 30
  requestBodies:
    calendar:
      required: true
      description: |
        Объект календаря:
        * Идентификатор обычно похож на адрес почты или им является.
        * Часовой пояс из базы [IANA](https://www.iana.org/time-zones)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/calendar'
    vkParams:
      required: true
      description: |
        Должен содержать все параметры с перфиксом `vk_` и подпись. Порядок не важен. Допустимы лишние свойства, они будут проигнорированы.
        
        В примере подпись создана с ключом `appSecretKey`
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/vkParams'
  responses:
    object:
      description: Объект с данными
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/200'
    400:
      description: Ошибка в запросе или при выполнении обработки корректных данных
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/400'
    401:
      description: |
        Любая ошибка авторизации:
        * Недостаточно прав (нужно быть админом);
        * Не удалось проверить подпись ВК;
        * Токен отсутствует, просрочен или некорректен;
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/400'
paths:
  /auth:
    post:
      description: |
        Принимает в теле запроса объект из query-строки с [параметрами от VK](https://vk.com/dev/vk_apps_docs3?f=6.%2B%D0%9F%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B%2B%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%D0%B0).
        
        Возвращает JWT с ограниченным сроком жизни. При его истечении необходима повторная аутентификация.
      summary: Получить JWT
      tags:
        - auth
      security: []
      responses:
        200:
          description: Аутентификация прошла успешно, возвращается JWT
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/200'
                  - properties:
                      token:
                        type: string
        401:
          $ref: '#/components/responses/400'
      requestBody:
        $ref: '#/components/requestBodies/vkParams'
  # calendar
  /calendar:
    get:
      description: ''
      summary: ''
      tags:
        - calendar
      parameters:
        - $ref: '#/components/parameters/periodDays'
      responses:
        200:
          $ref: '#/components/responses/object'
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'
    post:
      description: ''
      summary: ''
      tags:
        - calendar
      security:
        - JWT:
          - vk:admin
      requestBody:
        $ref: '#/components/requestBodies/calendar'
      responses:
        200:
          $ref: '#/components/responses/object'
        400:
          $ref: '#/components/responses/400'
        401:
          $ref: '#/components/responses/401'