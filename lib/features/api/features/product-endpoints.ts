import { ApiTags, BuilderType } from '..';
import { formatExchage } from '@/utils/helpers';
import { API_URL } from '../constants';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import type {
  CreateProductDto,
  CreateProductResponse,
  ProductQueryParams,
  ProductResponse,
} from '../types/product';

export const productEndpoints = (builder: BuilderType) => ({
  getProductsOption: builder.query<
    ApiResponse<ProductResponse>,
    ProductQueryParams & { paginationMode?: 'pagination' | 'infiniteScroll' }
  >({
    query: ({ page, limit, sortBy, sortDirection, storeId, filters }) => ({
      url: `${API_URL.PRODUCT}/opt`,
      method: 'GET',
      params: {
        page,
        limit,
        sortBy,
        sortDirection,
        storeId,
        ...filters,
      },
    }),
    providesTags: (result) =>
      result
        ? [
            // Menandai setiap transaksi dengan ID atau tag lainnya
            ...result.data.data.map(({ id }) => ({
              type: ApiTags.Product, // Menandai dengan type 'Transaction'
              id, // ID transaksi
            })),
            { type: ApiTags.Product, id: 'LIST' }, // Menandai daftar transaksi secara keseluruhan
          ]
        : [{ type: ApiTags.Product, id: 'LIST' }],
    transformResponse: (response: ApiResponse<ProductResponse>): ApiResponse<ProductResponse> => {
      return {
        ...response,
        data: {
          ...response.data,
          data: response.data.data.map((item) => ({
            ...item,
            value: item.value.toString(),
            label: `${item.label} - ${formatExchage(item.price, 'id-ID')}`,
          })),
        },
      };
    },
    // Gunakan merge hanya untuk infiniteScroll
    merge: (currentCache, newResponse, { arg }) => {
      if (arg.paginationMode === 'infiniteScroll') {
        // Gabungkan data lama dengan data baru
        const mergedData = [...currentCache.data.data, ...newResponse.data.data];
        const uniqueData = Array.from(new Map(mergedData.map((item) => [item.id, item])).values());

        uniqueData.sort((a, b) => Number(a.id) - Number(b.id));

        currentCache.data.data = uniqueData;
        currentCache.data.totalPages = newResponse.data.totalPages;
        currentCache.data.currentPage = newResponse.data.currentPage;
      } else {
        // Jika pagination biasa, langsung timpa data lama dengan data baru
        Object.assign(currentCache, newResponse);
      }
    },
    serializeQueryArgs: ({ endpointName }) => {
      return endpointName;
    },
  }),
  createProduct: builder.mutation<ApiResponse<CreateProductResponse>, CreateProductDto>({
    query: (product) => {
      const formData = new FormData();

      // **🔹 Handle Gambar Utama & ImageIds**
      const images: File[] = [];
      const imageIds: (number | null)[] = [];

      product.images.forEach((image) => {
        if (image.source === 'upload') {
          if (image.file) {
            images.push(image.file); // Simpan file di array images[]
          }
          imageIds.push(null); // Tempat kosong untuk backend
        } else {
          imageIds.push(Number(image.id));
        }
      });

      // **🔹 Handle Variants**
      const variants = product.variants.map(({ price, sku, stock, variantOptions }) => {
        return {
          sku,
          stock,
          price,
          variantOptions,
          imageIds: [], // ID gambar varian
        };
      });

      // **🔹 Buat Data Object**
      const data = {
        name: product.name,
        sku: product.sku,
        description: product.description,
        stock: product.stock,
        price: product.price,
        storeId: Number(product.storeId),
        categories: product.categories.map(Number), // Pastikan jadi number[]
        imageIds,
        variants,
      };

      // **🔹 Masukkan ke FormData**
      formData.append('data', JSON.stringify(data));

      // **🔹 Masukkan Gambar Utama**
      images.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      // **🔹 Masukkan Gambar Variants**
      product.variants.forEach((variant, variantIndex: number) => {
        variant.image.forEach((img, _imgIndex: number) => {
          if (img.file) {
            // Don't delete this code, in the future maybe we will have multiple image for variant.
            // formData.append(`variantImages[${variantIndex}][${imgIndex}]`, img.file);
            formData.append(`variantImages[${variantIndex}]`, img.file);
          }
        });
      });

      return {
        url: API_URL.PRODUCT, // Ganti dengan endpoint API yang sesuai
        method: 'POST',
        body: formData,
      };
    },
    invalidatesTags: [{ type: ApiTags.Product, id: 'LIST' }],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (_store, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Creating product', queryFulfilled);
    },
  }),
  deleteProduct: builder.mutation<{ status: string; message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `${API_URL.PRODUCT}/${id}`,
      method: 'DELETE',
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    invalidatesTags: (result, error, { id }) => [
      { type: ApiTags.Product, id }, // Hapus produk spesifik
      { type: ApiTags.Product, id: 'LIST' }, // Hapus daftar produk secara keseluruhan
    ],
  }),
});
