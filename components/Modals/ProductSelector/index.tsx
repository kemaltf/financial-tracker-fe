import { modals } from '@mantine/modals';
import { ProductSelector, ProductsSelector } from '@/components/ProductsSelector';

interface ProductSelectorModalProps {
  storeId: number;
  value: ProductSelector[]; // Daftar ID produk yang sudah dipilih
  onChange: (selectedIds: ProductSelector[]) => void; // Fungsi untuk mengembalikan produk yang dipilih
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string; // Ukuran modal (default: lg)
}

export const openProductSelectorModal = ({ size, ...props }: ProductSelectorModalProps): void => {
  modals.open({
    title: 'Pilih Produk',
    size,
    children: <ProductsSelector onClose={() => modals.closeAll()} {...props} />,
  });
};
