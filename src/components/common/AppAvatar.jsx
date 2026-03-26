import Avatar from '@mui/material/Avatar';

const roseShades = ['#E85D8E', '#C94375', '#F08CB0', '#D7638E', '#F8A8C3'];

function stringToColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return roseShades[Math.abs(hash) % roseShades.length];
}

function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function AppAvatar({ name, src, size = 36, sx = {}, ...props }) {
  return (
    <Avatar
      src={src}
      sx={{
        width: size,
        height: size,
        bgcolor: src ? 'transparent' : stringToColor(name),
        fontSize: size * 0.38,
        fontWeight: 700,
        color: '#fff',
        ...sx,
      }}
      {...props}
    >
      {!src && initials(name)}
    </Avatar>
  );
}
