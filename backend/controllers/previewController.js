import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname } from "path";
import qs from "qs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COOKIES = "remixdsid=vk1.a.jdsQaYne0S1xtaABpWRjFPwYhk8UPbTff6fgxK5Pm_3hAonAgHOmPVNGmXvfM9bBc8Xq92b66Pn0JGGtL_1T72QPNrYld74Vb6IicVbwsW6Fx6BLvGZPld_WFxCX2kJDuOJFcspoHB2GyfvTeJPMbGBPWlbfnsLwh3SQaCXniIs;";
const ACCESS_TOKEN = "vk1.a.llE3IaUjbKIRJt_Hnf6eyD8bNkFrjHyj00mQ2MNMjIgFImD2iF6F7K0WwE50vxnRxpoiSGrYvocZyy0w65iZzmsrlqwTnjiC2O3cspVeqBg7zTQZOPJFHDYk_zAS7oaAJwBu_tMkTy8tMRSj6NMzMcyhWi_4T7zXk8NIZ5EQrbg-XKAD3ALG3eafBJcNxc2x28RYcIR5-rFqEn_RSjc3lg";
const APP_ID = "52649896";

export default class VideoPreviewController {
  static getVkWebToken = async () => {
    try {
      const url = "https://vkvideo.ru/al_video.php?act=web_token";
      const data = qs.stringify({
        access_token: ACCESS_TOKEN,
        app_id: APP_ID,
        version: "1"
      });
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://vkvideo.ru",
        Referer: "https://vkvideo.ru/",
        Cookie: COOKIES
      };

      const response = await axios.post(url, data, { headers });
      if (response.data?.error) {
        console.error("Error in VK Web Token:", response.data.error_text);
        return null;
      }
      return response.data[0]?.access_token || null;
    } catch (error) {
      console.error("Failed to get VK Web Token:", error);
      return null;
    }
  };

  static makeVkRequest = async (ownerId, videoId) => {
    try {
      const webToken = await VideoPreviewController.getVkWebToken();
      if (!webToken) {
        console.error("Failed to retrieve VK Web Token");
        return null;
      }
      const rawData = await VideoPreviewController.getVideoData(ownerId, videoId, webToken);
      return rawData;
    } catch (error) {
      console.error("Error in makeVkRequest:", error);
      return null;
    }
  };

  static getVideoData = async (ownerId, videoId, webToken) => {
    try {
      const url = "https://api.vkvideo.ru/method/execute?v=5.246&client_id=7879029";
      const codeString = `return [API.account.getHelpHints({}), API.video.getVideoDiscover({"video_id":${videoId},"owner_id":${ownerId},"track_code":"","access_key":"","count":10,"fields":"verified,is_esia_verified,is_sber_verified,is_tinkoff_verified","ref":"direct"})];`;
      const formData = {
        code: codeString,
        access_token: webToken,
        v: "5.246"
      };

      const response = await axios.post(url, qs.stringify(formData));
      return response.data;
    } catch (error) {
      console.error("Failed to get video data:", error);
      return null;
    }
  };

  static downloadImage = async (imgUrl, savePath) => {
    try {
      const response = await axios({ url: imgUrl, responseType: "stream" });
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  /**
   * Метод, который:
   * 1. Получает ссылку на видео от клиента (req.body.videoUrl).
   * 2. Вытягивает ownerId и videoId (часть ссылки "video{ownerId}_{videoId}").
   * 3. Запрашивает данные о видео через makeVkRequest() => получаем ссылку на превью.
   * 4. Собирает финальную ссылку на превью (finalUrl).
   * 5. Проверяет, существует ли уже файл с именем "video_{ownerId}_{videoId}.jpg".
   *    - Если нет, скачивает.
   *    - Если есть, ничего не делает (повторное скачивание не нужно).
   * 6. Возвращает клиенту путь к файлу превью.
   */
  static savePreview = async (req, res) => {
    try {
      const { videoUrl } = req.body;
      if (!videoUrl) {
        return res.status(400).json({ error: "Video URL is required" });
      }

      // Извлекаем ownerId и videoId из ссылки (формат: "https://vk.com/video{ownerId}_{videoId}")
      // Например, если videoUrl = "https://vk.com/video-12345_67890"
      // то videoUrl.split("/")[3] = "video-12345_67890"
      // Далее slice(5) уберёт "video", останется "-12345_67890"
      const [videoOwner, videoId] = videoUrl.split("/")[3].slice(5).split("_");

      const rawData = await VideoPreviewController.makeVkRequest(videoOwner, videoId);
      if (!rawData || !rawData.response) {
        return res.status(500).json({ error: "Failed to retrieve video data" });
      }

      // Получаем первичную ссылку на изображение
      // (по аналогии с Python-кодом, дальше нужно собрать finalUrl)
      const imgUrl = rawData.response[1].current_video.image[0].url;

      // Далее парсим URL, чтобы "собрать" финальную ссылку (type, tkn, fn и т.д.)
      const parts = imgUrl.split("=");
      const requestData = [];
      for (let i = 1; i < parts.length; i++) {
        const data = parts[i].split("&");
        requestData.push(data[0]);
      }
      // requestData = [id, idx, type, tnk, fn]
      const [id, idx, type, tnk /* fn */] = requestData;
      const finalUrl = `https://i.mycdn.me/getVideoPreview?id=${id}&idx=${idx}&type=${type}&tkn=${tnk}&fn=vid_x`;

      // Делаем имя файла по формату "video_{ownerId}_{videoId}.jpg"
      const filename = `video_${videoOwner}_${videoId}.jpg`;
      const previewPath = path.join(__dirname, "../media", filename);

      // Если файл не существует - скачиваем
      if (!fs.existsSync(previewPath)) {
        await VideoPreviewController.downloadImage(finalUrl, previewPath);
      }
      // Возвращаем путь (можно вернуть относительный путь, если нужно)
      return res.status(200).json({
        message: "Preview is ready",
        previewPath: `/media/${filename}`
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };
}
