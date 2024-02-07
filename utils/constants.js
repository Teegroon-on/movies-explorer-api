const NOT_FOUND_CODE = 404;
const NOT_FOUND_TEXT = 'Запрашиваемый ресурс не найден';
const FORBIDDEN_URL_CODE = 403;
const FORBIDDEN_URL_TEXT = 'Доступ запрещен';
const BAD_REQUEST_CODE = 400;
const BAD_REQUEST_TEXT = 'Переданы некорректные данные';
const SERVER_ERROR_CODE = 500;
const SERVER_ERROR_TEXT = 'Произошла неизвестная ошибка';
const OK_CODE = 200;
const UNAUTHORIZED_CODE = 401;
const UNAUTHORIZED_TEXT = 'Неверный логин или пароль';
const CONFLICT_ERROR_CODE = 409;
const CONFLICT_ERROR_TEXT = 'Пользователь с таким email уже существует';
const SALT = 10;
const LINK_INCORRECT_TEXT = 'Ссылка не корректна';
const MAIL_INCORRECT_TEXT = 'Email не корректен';
const LIMIT_TEXT = 'Вы превысили число запросов по данному адресу';

module.exports = {
  NOT_FOUND_CODE,
  BAD_REQUEST_CODE,
  SERVER_ERROR_CODE,
  OK_CODE,
  SALT,
  UNAUTHORIZED_CODE,
  NOT_FOUND_TEXT,
  BAD_REQUEST_TEXT,
  SERVER_ERROR_TEXT,
  CONFLICT_ERROR_TEXT,
  UNAUTHORIZED_TEXT,
  CONFLICT_ERROR_CODE,
  FORBIDDEN_URL_CODE,
  FORBIDDEN_URL_TEXT,
  LINK_INCORRECT_TEXT,
  MAIL_INCORRECT_TEXT,
  LIMIT_TEXT,
};
