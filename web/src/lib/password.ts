import * as z from "zod";

export const PASSWORD_MIN_LENGTH = 6;
// bcrypt 72 байтаас цааш үл тоодог тул дээд хязгаарыг тавьж өгнө.
export const PASSWORD_MAX_LENGTH = 64;

export const PASSWORD_HINT =
  "Үсэг, тоо, тусгай тэмдэгт агуулсан байх ёстой.";

/** Бүртгүүлэх болон нууц үг шинэчлэхэд хэрэглэнэ. */
export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Нууц үг хамгийн багадаа ${PASSWORD_MIN_LENGTH} тэмдэгт байна`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Нууц үг ${PASSWORD_MAX_LENGTH} тэмдэгтээс ихгүй байна`,
  )
  .regex(/[A-Za-zА-Яа-яӨөҮү]/, "Дор хаяж нэг үсэг агуулсан байх ёстой")
  .regex(/[0-9]/, "Дор хаяж нэг тоо агуулсан байх ёстой")
  .regex(
    /[^A-Za-z0-9А-Яа-яӨөҮү]/,
    "Дор хаяж нэг тусгай тэмдэгт агуулсан байх ёстой (!@#$ г.м.)",
  );
