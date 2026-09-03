import { api } from "./api";

/**
 * Зургийг сервер рүү илгээж, буцаж ирсэн нийтийн URL-ыг өгнө.
 *
 * Blob token сервер дээр үлддэг — клиент талд байрлуулбал хөтөч рүү
 * задарч, хэн ч файл бичих/устгах боломжтой болно.
 */
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<{ url: string }>("/upload", formData);
  return response.data.url;
};
