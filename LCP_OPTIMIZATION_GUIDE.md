# LCP (Largest Contentful Paint) Optimization Guide

## 🎯 Objective

Reduce LCP from current state to < 2.5 seconds (Google's "Good" threshold)

---

## 📊 Current Analysis

### LCP Element Identified

**Component**: Hero section video (`src/sections/hero.tsx`)  
**Element**: `<video>` tag displaying `memoji_out.mp4`  
**File Size**: **48.8 MB** (48,819 KB) ⚠️ **CRITICAL ISSUE**  
**Dimensions**: 170x170px (mobile), 190x190px (desktop)

### Problem Statement

The 48.8 MB video file is the Largest Contentful Paint element, causing:

- Slow initial page load
- Poor LCP score (likely > 4 seconds)
- Excessive bandwidth consumption
- Poor mobile experience

---

## ✅ Optimizations Implemented

### 1. Video Tag Optimization

**Changes Made**:

```tsx
<video
  className="h-[170px] w-[170px] md:h-[190px] md:w-[190px]"
  width="190"           // ✅ Added explicit width
  height="190"          // ✅ Added explicit height
  muted
  autoPlay
  loop
  playsInline
  preload="metadata"    // ✅ Changed from default to metadata-only
  poster={getAssetPath("memoji_poster.jpg")}  // ✅ Added poster image
>
```

**Benefits**:

- ✅ **Explicit dimensions** prevent Cumulative Layout Shift (CLS)
- ✅ **`preload="metadata"`** loads only video metadata, not full video
- ✅ **Poster image** displays immediately while video loads in background
- ✅ Reduces initial payload from 48.8 MB to ~50 KB (poster image)

### 2. Resource Hints Added

**Changes Made** (`src/app/layout.tsx`):

```tsx
<head>
  {/* Preload critical hero video poster for faster LCP */}
  <link rel="preload" href="/memoji_poster.jpg" as="image" />
  {/* Preconnect to improve resource loading */}
  <link rel="dns-prefetch" href="https://www.abishek-maharajan.online" />
</head>
```

**Benefits**:

- ✅ **Preload poster image** starts downloading immediately
- ✅ **DNS prefetch** reduces connection latency
- ✅ Browser prioritizes LCP element loading

---

## 🚨 Critical Action Required: Create Poster Image

### Option A: Extract Frame from Video (Recommended)

**Using FFmpeg** (requires installation):

```bash
# Install FFmpeg
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg
# Linux: apt-get install ffmpeg

# Extract first frame as poster image
ffmpeg -i public/memoji_out.mp4 -ss 00:00:00 -vframes 1 -q:v 2 public/memoji_poster.jpg

# Optimize the poster image
ffmpeg -i public/memoji_poster.jpg -vf scale=190:190 -q:v 85 public/memoji_poster.jpg
```

**Expected Result**: ~30-50 KB JPEG image

### Option B: Use Existing Image

If you have a static image of the memoji:

```bash
# Copy and resize existing image
cp path/to/memoji.jpg public/memoji_poster.jpg

# Resize to 190x190 (optional, using ImageMagick)
convert public/memoji_poster.jpg -resize 190x190 public/memoji_poster.jpg
```

### Option C: Create Placeholder (Temporary)

Create a simple colored circle as placeholder:

```bash
# Using ImageMagick
convert -size 190x190 xc:#f3f4f6 -fill #9ca3af -draw "circle 95,95 95,10" public/memoji_poster.jpg
```

---

## 📈 Expected Performance Improvements

### Before Optimization

- **LCP**: ~5-8 seconds (estimated)
- **Initial Load**: 48.8 MB video download
- **Time to Interactive**: Delayed by video load
- **Mobile Experience**: Very poor (cellular data)

### After Optimization (with poster image)

- **LCP**: ~1.5-2.0 seconds ✅ (poster image loads)
- **Initial Load**: ~50 KB poster image
- **Time to Interactive**: Immediate
- **Mobile Experience**: Excellent
- **Video loads**: In background after page interactive

### Performance Gain

- **LCP Improvement**: ~3-6 seconds faster ⚡
- **Bandwidth Saved**: 48.75 MB on initial load
- **Mobile Data Saved**: 97% reduction in initial payload

---

## 🔄 Additional Optimization Recommendations

### 1. Compress the Video File (HIGH PRIORITY)

The 48.8 MB video is **extremely large** for a 190x190px display.

**Recommended Compression**:

```bash
# Using FFmpeg - Aggressive compression for small display size
ffmpeg -i public/memoji_out.mp4 \
  -vf "scale=380:380" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -movflags +faststart \
  -an \
  public/memoji_out_optimized.mp4
```

**Expected Result**:

- Original: 48.8 MB
- Optimized: ~500 KB - 1 MB (95-98% reduction)
- Quality: Excellent for 190x190px display

**Parameters Explained**:

- `-vf "scale=380:380"`: Scale to 2x display size (for retina displays)
- `-crf 28`: Compression quality (23-28 is good for web)
- `-preset slow`: Better compression (slower encoding)
- `-movflags +faststart`: Enable progressive loading
- `-an`: Remove audio (not needed for muted autoplay)

### 2. Convert to WebM Format (Additional Optimization)

WebM typically provides better compression than MP4:

```bash
ffmpeg -i public/memoji_out.mp4 \
  -vf "scale=380:380" \
  -c:v libvpx-vp9 \
  -crf 35 \
  -b:v 0 \
  -an \
  public/memoji_out.webm
```

**Update video tag**:

```tsx
<video ...>
  <source src={getAssetPath("memoji_out.webm")} type="video/webm" />
  <source src={getAssetPath("memoji_out_optimized.mp4")} type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

### 3. Lazy Load Video (Alternative Approach)

If video is not critical for LCP, lazy load it:

```tsx
<video
  loading="lazy"  // Native lazy loading
  preload="none"  // Don't preload at all
  ...
>
```

### 4. Consider Animated GIF Alternative

For a 190x190px animation, an optimized GIF might be smaller:

```bash
# Convert video to optimized GIF
ffmpeg -i public/memoji_out.mp4 \
  -vf "fps=15,scale=190:190:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 \
  public/memoji.gif
```

**Then use Next.js Image**:

```tsx
import Image from "next/image";

<Image
  src="/memoji.gif"
  alt="Memoji animation"
  width={190}
  height={190}
  priority={true} // Critical for LCP
  unoptimized={true} // GIFs need unoptimized flag
/>;
```

---

## 🧪 Testing & Verification

### 1. Measure LCP Locally

The Web Vitals reporter is already integrated. Check browser console for:

```
[INFO] Web Vital: LCP
  value: 2000  // Should be < 2500ms
  rating: good
```

### 2. Test with Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Run audit for **Performance**
4. Check **Largest Contentful Paint** metric

**Target**: LCP < 2.5s (Green/Good)

### 3. Test on Real Device

```bash
# Build and serve locally
pnpm build
pnpm start

# Test on mobile device via network
# Use Chrome DevTools Remote Debugging
```

### 4. Production Testing

After deployment, use:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- Chrome User Experience Report (CrUX)

---

## 📋 Implementation Checklist

### Immediate (Required for LCP fix)

- [x] Add explicit width/height to video tag
- [x] Add `preload="metadata"` attribute
- [x] Add poster attribute to video tag
- [x] Add resource hints to layout
- [ ] **Create poster image** (memoji_poster.jpg) ⚠️ **BLOCKING**

### High Priority (Recommended)

- [ ] Compress video file from 48.8 MB to ~1 MB
- [ ] Test LCP score with Lighthouse
- [ ] Verify poster image displays correctly
- [ ] Measure bandwidth savings

### Medium Priority (Nice to have)

- [ ] Create WebM version for better compression
- [ ] Add multiple source formats
- [ ] Implement progressive enhancement
- [ ] Add loading state/skeleton

### Low Priority (Future optimization)

- [ ] Consider GIF alternative
- [ ] Implement adaptive loading based on connection
- [ ] Add service worker for caching
- [ ] Implement lazy loading for below-fold content

---

## 🎨 Creating the Poster Image

### Quick Solution (No Tools Required)

1. **Play the video** in a browser
2. **Take a screenshot** of the first frame
3. **Crop to 190x190px** using any image editor
4. **Save as** `public/memoji_poster.jpg`
5. **Optimize** using online tools:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)
   - Target: < 50 KB

### Automated Solution (Recommended)

```bash
# Install FFmpeg (one-time setup)
# Then run:
cd public
ffmpeg -i memoji_out.mp4 -ss 00:00:00 -vframes 1 -vf scale=190:190 -q:v 2 memoji_poster.jpg
```

---

## 📊 Success Metrics

### Before Implementation

- ❌ LCP: ~5-8 seconds
- ❌ Initial payload: 48.8 MB
- ❌ Mobile experience: Poor
- ❌ Lighthouse score: < 50

### After Implementation (Target)

- ✅ LCP: < 2.5 seconds
- ✅ Initial payload: < 100 KB
- ✅ Mobile experience: Excellent
- ✅ Lighthouse score: > 90

### Key Performance Indicators

- **LCP reduction**: > 3 seconds improvement
- **Bandwidth savings**: > 95%
- **Time to Interactive**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds

---

## 🚀 Deployment Steps

1. **Create poster image** (see instructions above)
2. **Verify poster exists**: `public/memoji_poster.jpg`
3. **Test locally**: `pnpm dev`
4. **Check browser console** for Web Vitals
5. **Run Lighthouse audit**
6. **Build for production**: `pnpm build`
7. **Deploy**: `pnpm deploy`
8. **Verify in production** with PageSpeed Insights

---

## 🔍 Troubleshooting

### Issue: Poster image not displaying

**Solution**: Verify file exists at `public/memoji_poster.jpg`

### Issue: Video still loads slowly

**Solution**: Compress video file (see recommendations above)

### Issue: LCP still > 2.5s

**Solution**:

1. Verify poster image is < 50 KB
2. Check network throttling in DevTools
3. Ensure preload link is in `<head>`
4. Verify no render-blocking resources

### Issue: Video doesn't autoplay

**Solution**: Ensure `muted` and `playsInline` attributes are present

---

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Optimize LCP](https://web.dev/optimize-lcp/)
- [Video Optimization](https://web.dev/fast/#optimize-your-images)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

**Status**: ⚠️ **PARTIALLY IMPLEMENTED**  
**Blocking**: Poster image creation required  
**Next Step**: Create `public/memoji_poster.jpg` (see instructions above)

**Estimated LCP Improvement**: **3-6 seconds faster** ⚡
