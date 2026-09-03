/**
 * Vercel-ийн serverless entrypoint.
 *
 * Локал дээр src/server.ts (@hono/node-server) порт сонсдог бол Vercel
 * дээр порт байхгүй — HTTP method тус бүрээр экспортлосон функцийг
 * хүсэлт ирэх бүрд дуудна. Hono-гийн app.fetch нь Web-стандарт
 * Request → Response гарын үсэгтэй тул шууд тохирно.
 */
import app from "../src/index.js";

const handler = (request: Request) => app.fetch(request);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
