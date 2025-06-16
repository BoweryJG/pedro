import { Box } from '@mui/material';
import ReactPlayer from 'react-player';

interface HeroVideoProps {
  videoUrl?: string;
}

const HeroVideo = ({ videoUrl = 'https://www.youtube.com/watch?v=vXu9dXqFbGU' }: HeroVideoProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(30,64,175,0.7) 0%, rgba(124,58,237,0.8) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <ReactPlayer
        url={videoUrl}
        playing
        loop
        muted
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
        }}
        config={{
          youtube: {
            playerVars: {
              disablekb: 1,
              modestbranding: 1,
              controls: 0,
              showinfo: 0,
              rel: 0,
            },
          },
        }}
      />
      {/* Local Video Fallback */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          display: 'none', // Hidden by default, show if YouTube fails
        }}
      >
        <source src="/videos/yomi-dental-surgery.mp4" type="video/mp4" />
        <source src="/videos/dental-practice.webm" type="video/webm" />
      </video>
    </Box>
  );
};

export default HeroVideo;