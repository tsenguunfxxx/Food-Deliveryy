export const PASSWORD_MIN_LENGTH = 6;
// bcrypt 72 байтаас цааш үл тоодог тул дээд хязгаарыг тавьж өгнө.
export const PASSWORD_MAX_LENGTH = 64;

const RULES: { test: RegExp; message: string }[] = [
  { test: /[A-Za-zА-Яа-яӨөҮү]/, message: "Дор хаяж нэг үсэг агуулсан байх ёстой" },
  { test: /[0-9]/, message: "Дор хаяж нэг тоо агуулсан байх ёстой" },
  {
    test: /[^A-Za-z0-9А-Яа-яӨөҮү]/,
    message: "Дор хаяж нэг тусгай тэмдэгт агуулсан байх ёстой (!@#$ г.м.)",
  },
];

/**
 * Нууц үгийн шаардлага. Клиент талын шалгалтыг тойрч болдог тул
 * сервер дээр дахин шалгана. Алдаагүй бол null буцаана.
 */
export const validatePassword = (password: unknown): string | null => {
  if (typeof password !== "string" || password.length === 0) {
    return "Нууц үгээ оруулна уу";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Нууц үг хамгийн багадаа ${PASSWORD_MIN_LENGTH} тэмдэгт байна`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Нууц үг ${PASSWORD_MAX_LENGTH} тэмдэгтээс ихгүй байна`;
  }
  for (const rule of RULES) {
    if (!rule.test.test(password)) return rule.message;
  }
  return null;
};
