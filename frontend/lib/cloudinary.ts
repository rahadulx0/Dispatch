type LoaderArgs = { src: string; width: number; quality?: number };

const UPLOAD_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

function buildLoader(aspect: string | null) {
  return function loader({ src, width, quality }: LoaderArgs): string {
    const m = src.match(UPLOAD_RE);
    if (!m) return src;
    const parts = [
      'f_auto',
      `q_${quality ?? 'auto'}`,
      'c_fill',
      'g_auto',
      aspect ? `ar_${aspect}` : null,
      `w_${width}`,
    ].filter(Boolean);
    return `${m[1]}${parts.join(',')}/${m[2]}`;
  };
}

export const cardCoverLoader = buildLoader('16:10');
export const articleCoverLoader = buildLoader('16:9');
export const thumbLoader = buildLoader('7:5');
export const avatarLoader = buildLoader('1:1');
