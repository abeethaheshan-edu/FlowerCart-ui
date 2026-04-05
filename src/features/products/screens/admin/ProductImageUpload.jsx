import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';

function ImageSlot({ index, preview, isMain, onSelect, onRemove }) {
  const inputRef = useRef(null);

  return (
    <Box sx={{ position: 'relative', flexShrink: 0 }}>
      <Box
        onClick={() => !preview && inputRef.current?.click()}
        sx={{
          width: isMain ? '100%' : 72,
          height: isMain ? 160 : 72,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: preview ? 'primary.light' : '#d1d5db',
          bgcolor: preview ? '#fff' : '#fafafa',
          cursor: preview ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          transition: 'border-color 0.15s, background-color 0.15s',
          '&:hover': preview
            ? {}
            : { borderColor: 'primary.main', bgcolor: '#fdf2f5' },
        }}
      >
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt=""
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <AddPhotoAlternateOutlinedIcon
              sx={{ fontSize: isMain ? 30 : 20, color: '#9ca3af' }}
            />
            {isMain && (
              <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center' }}>
                Click to upload
              </Typography>
            )}
          </Box>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSelect(index, file);
            e.target.value = '';
          }}
        />
      </Box>

      {preview && (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          sx={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: 20,
            height: 20,
            bgcolor: '#374151',
            color: '#fff',
            zIndex: 2,
            '&:hover': { bgcolor: '#111827' },
          }}
        >
          <CloseIcon sx={{ fontSize: 11 }} />
        </IconButton>
      )}
    </Box>
  );
}

export default function ProductImageUpload({ images, onImageSelect, onImageRemove }) {
  return (
    <Box>
      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5, color: 'text.primary' }}>
        Product Images
      </Typography>

      <Typography variant="caption" sx={{ mb: 1.5, display: 'block', color: 'text.secondary' }}>
        Main Image *
      </Typography>

      <ImageSlot
        index={0}
        preview={images[0]}
        isMain
        onSelect={onImageSelect}
        onRemove={onImageRemove}
      />

      <Typography variant="caption" sx={{ mt: 1.5, mb: 1, display: 'block', color: 'text.secondary' }}>
        Additional Photos (up to 4)
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        {[1, 2, 3, 4].map((i) => (
          <ImageSlot
            key={i}
            index={i}
            preview={images[i]}
            isMain={false}
            onSelect={onImageSelect}
            onRemove={onImageRemove}
          />
        ))}
      </Box>

      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#9ca3af' }}>
        Supported: JPG, PNG, WEBP. Max 5 MB each.
      </Typography>
    </Box>
  );
}
