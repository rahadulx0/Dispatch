'use client';

import Image, { type ImageProps } from 'next/image';
import {
  articleCoverLoader,
  avatarLoader,
  cardCoverLoader,
  thumbLoader,
} from '@/lib/cloudinary';

type Variant = 'card' | 'thumb' | 'article' | 'avatar';

const LOADERS = {
  card: cardCoverLoader,
  thumb: thumbLoader,
  article: articleCoverLoader,
  avatar: avatarLoader,
} as const;

type Props = Omit<ImageProps, 'loader'> & { variant: Variant };

export default function CloudinaryImage({ variant, ...rest }: Props) {
  return <Image loader={LOADERS[variant]} {...rest} />;
}
