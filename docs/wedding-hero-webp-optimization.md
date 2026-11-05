# Wedding hero WebP optimization

Use this process to resize wedding hero images proportionally to 2448 pixels wide (the reference width of `hero-3.webp`), without cropping, and encode them as WebP. The target is approximately 300 KB per image, within the desired 200–400 KB range.

## Recommended settings

```bash
cwebp -resize 2448 0 -size 307200 -pass 10 -m 6 -mt input.jpg -o output.webp
```

- `-resize 2448 0` sets the width to 2448 pixels and calculates the height from the input aspect ratio. It resizes the full image; no crop is performed.
- `-size 307200` asks the encoder to target 300 KiB. The result is approximate, not an exact byte limit.
- `-pass 10` gives the encoder more passes to reach the target size.
- `-m 6` uses the slowest, most thorough compression method.
- `-mt` enables multithreaded encoding.
- Do not add `-crop`; the full composition is retained.

## Example commands for these hero images

Run from the repository root when the matching JPEG sources are available. The original JPEGs used for the measured results below were removed after verification.

```bash
cwebp -resize 2448 0 -size 307200 -pass 10 -m 6 -mt public/images/wedding-page/hero-1.jpg -o public/images/wedding-page/hero-1.webp
cwebp -resize 2448 0 -size 307200 -pass 10 -m 6 -mt public/images/wedding-page/hero-2.jpg -o public/images/wedding-page/hero-2.webp
cwebp -resize 2448 0 -size 307200 -pass 10 -m 6 -mt public/images/wedding-page/hero-4.jpg -o public/images/wedding-page/hero-4.webp
cwebp -resize 2448 0 -size 307200 -pass 10 -m 6 -mt public/images/wedding-page/hero-5.jpg -o public/images/wedding-page/hero-5.webp
```

## Verify before removing a JPEG

Check that the output is WebP, exactly 2448 pixels wide, and that its height preserves the source aspect ratio:

```bash
sips -g format -g pixelWidth -g pixelHeight public/images/wedding-page/hero-1.jpg public/images/wedding-page/hero-1.webp
```

Check the output's exact byte size on macOS:

```bash
stat -f '%z bytes' public/images/wedding-page/hero-1.webp
```

The desired range is 204,800–409,600 bytes (200–400 KiB). Review the encoded image visually as well, since matching a file-size target can reduce image quality. Delete the JPEG only after confirming the WebP is valid, has the intended dimensions, and looks acceptable.
