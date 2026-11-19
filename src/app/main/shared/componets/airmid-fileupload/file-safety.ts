const IMAGE_TYPES = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp'
} as const;

export async function verifiedImageType(blob: Blob, fileName: string): Promise<string | null> {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension || !(extension in IMAGE_TYPES)) {
        return null;
    }

    const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    const matches = (signature: number[]) => signature.every((value, index) => bytes[index] === value);
    const jpeg = matches([0xff, 0xd8, 0xff]);
    const png = matches([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const gif = matches([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) || matches([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    const webp = matches([0x52, 0x49, 0x46, 0x46]) &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

    if ((extension === 'jpg' || extension === 'jpeg') && jpeg) return IMAGE_TYPES.jpeg;
    if (extension === 'png' && png) return IMAGE_TYPES.png;
    if (extension === 'gif' && gif) return IMAGE_TYPES.gif;
    if (extension === 'webp' && webp) return IMAGE_TYPES.webp;
    return null;
}
