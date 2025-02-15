'use client';

import { ScrollArea } from '@mantine/core';
import { modals } from '@mantine/modals';
import { GalleryImageSelector } from '@/components/GalleryImageSelector';
import { ImageFileSchemaType } from '@/modules/ProductForm/form';

type Props = {
  storeId: number;
  value: ImageFileSchemaType[];
  onChange?: ((selectedImages: ImageFileSchemaType[]) => void) | undefined;
  size: string;
};

export const opeImageSelectorModal = (props: Props) => {
  modals.open({
    title: 'Select Image',
    size: props.size,
    radius: 'md',
    scrollAreaComponent: ScrollArea.Autosize,
    children: <GalleryImageSelector onClose={() => modals.closeAll()} {...props} />,
  });
};
