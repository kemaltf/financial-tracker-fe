import { ProductSchemaFormValues } from '@/modules/ProductForm/form';
import { CreateProductDto } from '../types/product';

// Mengonversi data dari form menjadi format DTO yang sesuai
export const mapToCreateProductDto = (formData: ProductSchemaFormValues): CreateProductDto => {
  // Mengonversi categories ke array of numbers
  const categories = formData.categories.map((category) => Number(category));

  // Memetakan images ke ID array (asumsi ID gambar diambil dari file yang diupload atau dari URL)
  const imageIds = formData.images
    .filter((image) => image.id) // Memilih gambar yang sudah ada ID-nya
    .map((image) => Number(image.id));

  // Memetakan variants
  const variants = formData.variants.map((variant) => ({
    variantTypeId: Number(variant.id), // Asumsi variant.id adalah variantTypeId
    variantValue: variant.values.join(', '), // Menggabungkan nilai variannya
    sku: variant.sku || undefined,
    price: variant.price,
    stock: variant.stock,
    imageIds: variant.image.map((img) => Number(img.id)), // Mengambil image ID
  }));

  // Mengembalikan data yang sudah terformat
  const createProductDto: CreateProductDto = {
    name: formData.name,
    sku: formData.sku || undefined,
    description: formData.description,
    stock: formData.stock,
    price: formData.Price,
    categories,
    storeId: Number(formData.storeId), // Mengonversi storeId ke number
    imageIds: imageIds.length > 0 ? imageIds : undefined, // Menambahkan imageIds jika ada
    variants: variants.length > 0 ? variants : undefined, // Menambahkan variants jika ada
  };

  return createProductDto;
};
