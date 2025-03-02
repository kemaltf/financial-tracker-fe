import { ApiTags, BuilderType } from '..';
import { formatExchage } from '@/utils/helpers';
import { handleQueryNotification } from '../helpers';
import { type ApiResponse } from '../types/common';
import type {
  CreateProductDto,
  CreateProductResponse,
  ProductQueryParams,
  ProductResponse,
} from '../types/product';

export const productEndpoints = (builder: BuilderType) => ({
  getProductsOption: builder.query<ApiResponse<ProductResponse>, ProductQueryParams>({
    query: ({ page, limit, sortBy, sortDirection, storeId, filters }) => ({
      url: 'products/opt',
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
    transformResponse: (response: ApiResponse<ProductResponse>): ApiResponse<ProductResponse> => {
      return {
        ...response,
        data: {
          ...response.data,
          data: response.data.data.map((item) => ({
            ...item,
            value: item.value.toString(),
            label: `${item.label} - ${item.sku} - ${formatExchage(item.price, 'id-ID')}`,
          })),
        },
      };
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
        variant.image.forEach((img, imgIndex: number) => {
          if (img.file) {
            formData.append(`variantImages[${variantIndex}][${imgIndex}]`, img.file);
          }
        });
      });

      return {
        url: '/products', // Ganti dengan endpoint API yang sesuai
        method: 'POST',
        body: formData,
      };
    },
    invalidatesTags: [{ type: ApiTags.Product, id: 'LIST' }],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onQueryStarted: async (store, { dispatch, queryFulfilled }) => {
      await handleQueryNotification('Creating product', queryFulfilled);
    },
  }),
});
