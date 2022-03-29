{
    openapi: 3.1.0,
    info: {
        title: UserAuth API,
        version: 1.0.0,
        description: Документация к API,
        contact: {
            name: Игорь
        }
    },
    tags: [
        {
            name: auth,
            description: Получения признака что пользователь авторизован
        },
        {
            name: sign,
            description: Регистрация/Авторизация пользователя
        }
    ],
    paths: [
        {
            /auth: {
                get: {
                    description: Возвращает JWT с ограниченным сроком жизни. При его истечении необходима повторная аутентификация,
                    summary: Получить JWT,
                    tags: auth,
                    responses: [
                        {
                            200: {
                                description: Аутентификация прошла успешно, возвращается JWT,
                                properties: {
                                    token: {
                                        type: string
                                    },
                                    message: {
                                        type: string
                                    },
                                    email:{
                                        type: string
                                    }
                                }
                            },
                            500: {
                                description: Ошибка сервера,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status: {
                                        type: number
                                    }
                                }
                            },
                            401: {
                                description: Не авторизован,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status: {
                                        type: number
                                    }
                                }
                            },
                            404: {
                                description: Пользователь не существует,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status: {
                                        type: number
                                    }
                                }
                            }
                        }
                    ]
                }
            },

            /register: {
                post: {
                    description: Сохраняет данные пользователя в базу данных,
                    summary: Регистрация,
                    tags: sign,
                    responses: [
                        {
                            200: {
                                description: Регистрация прошла успешно,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status:{
                                        type: number
                                    }
                                }
                            },
                            500: {
                                description: Внутренняя ошибка сервера: не удалось подключиться к базе данных,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status: {
                                        type: number
                                    }
                                }
                            },
                            400: {
                                description: Регистрация не произошла.,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status: {
                                        type: number
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            /login: {
                post: {
                    description: Получение записи зарегестрированного пользователя,
                    summary: Авторизация,
                    tags: sign,
                    responses: [
                        {
                            200: {
                                description: Авторизация прошла успешно,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status:{
                                        type: number
                                    },
                                    user:{
                                        email:{
                                            type:string
                                        },
                                        createdAt:{
                                            type:date
                                        },
                                        updatedAt:{
                                            type:date
                                        }
                                    },
                                    token:{
                                        type:string
                                    }
                                }
                            },
                            400: {
                                description: Данные введены не корректно,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status: {
                                        type: number
                                    }
                                }
                            },
                            404: {
                                description: Пользователь не найден,
                                properties: {
                                    message: {
                                        type: string
                                    },
                                    status: {
                                        type: number
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    ]
}