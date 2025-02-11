export type ImageType = {
  key: string;
  url: string;
  mimeType: string;
  size: number;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type GetImageResponseType = {
  images: ImageType[];
};

export type CreateImagesDTO = FormData;

export interface GetImageQueryParams {
  id: string;
}
