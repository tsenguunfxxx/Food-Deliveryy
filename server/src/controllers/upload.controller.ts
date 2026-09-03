import { Context } from "hono";
import { put } from "@vercel/blob";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Зургийг Vercel Blob руу байршуулна.
 *
 * Эрхийг SDK өөрөө шийднэ: BLOB_READ_WRITE_TOKEN байвал түүнийг,
 * Vercel дээр store холбогдсон бол OIDC-г ашиглана. Аль нь ч байхгүй
 * үед put() алдаа өгөх тул түүнийг барьж ойлгомжтой мессеж буцаана.
 *
 * Token нь зөвхөн сервер дээр байна — өмнө нь клиент талд
 * NEXT_PUBLIC_ хувьсагчаар ил гарч, хэн ч файл устгах боломжтой байсан.
 */
export const uploadImage = async (c: Context) => {
  const body = await c.req.parseBody();
  const file = body.file;

  if (!(file instanceof File)) {
    return c.json({ message: "Зураг илгээгээгүй байна" }, 400);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return c.json(
      { message: "Зөвхөн JPEG, PNG, WebP, AVIF зураг зөвшөөрнө" },
      400,
    );
  }
  if (file.size > MAX_BYTES) {
    return c.json({ message: "Зургийн хэмжээ 4MB-аас ихгүй байна" }, 400);
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      ...(process.env.BLOB_READ_WRITE_TOKEN
        ? { token: process.env.BLOB_READ_WRITE_TOKEN }
        : {}),
    });

    return c.json({ url: blob.url });
  } catch (error) {
    console.error("Blob upload амжилтгүй:", error);
    return c.json(
      {
        message:
          "Зураг хадгалж чадсангүй. Blob store энэ төсөлд холбогдсон эсэхийг шалгана уу.",
      },
      500,
    );
  }
};
