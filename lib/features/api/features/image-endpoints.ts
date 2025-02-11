import { ApiTags, BuilderType } from '..';
import { API_URL } from '../constants';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import {
  CreateImagesDTO,
  GetImageQueryParams,
  GetImageResponseType,
  ImageType,
} from '../types/images';

const { IMAGES } = API_URL;

export const imagesEndpoints = (builder: BuilderType) => ({
  getImages: builder.query<ApiResponse<GetImageResponseType>, void>({
    query: () => ({
      url: IMAGES,
      method: 'GET',
    }),
    providesTags: (result) =>
      result
        ? [
            // Menandai setiap store dengan ID
            ...result.data.images.map(({ id }) => ({
              type: ApiTags.Image,
              id,
            })),
            { type: ApiTags.Image, id: 'LIST' },
          ]
        : [{ type: ApiTags.Image, id: 'LIST' }],
  }),
  uploadImages: builder.mutation<ApiResponse<ImageType[]>, CreateImagesDTO>({
    query: (formData) => {
      return {
        url: `${IMAGES}/upload-multiple`,
        method: 'POST',
        body: formData,
      };
    },
    invalidatesTags: [{ type: ApiTags.Image, id: 'LIST' }],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Uploading images..', queryFulfilled);
    },
  }),
  getImage: builder.query<ApiResponse<ImageType>, GetImageQueryParams>({
    query: (image) => ({
      url: `${IMAGES}/${image.id}`,
      method: 'GET',
    }),
  }),
  deleteImage: builder.mutation<{ status: string; message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `${IMAGES}/${id}`,
      method: 'DELETE',
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [{ type: ApiTags.Image, id: 'LIST' }],
  }),
});
