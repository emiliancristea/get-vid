const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const axios = require('axios');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  // Serve index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get video info (for quality selection)
app.post('/video-info', async (req, res) => {
  const { videoUrl } = req.body;
  
  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    if (ytdl.validateURL(videoUrl)) {
      // Get YouTube video info
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title;
      const thumbnail = info.videoDetails.thumbnails[0].url;
      
      // Format available qualities for frontend
      const formats = info.formats
        .filter(format => format.hasVideo && format.hasAudio)
        .map(format => ({
          itag: format.itag,
          qualityLabel: format.qualityLabel,
          mimeType: format.mimeType.split(';')[0],
          bitrate: format.bitrate,
        }))
        // Remove duplicates based on qualityLabel
        .filter((format, index, self) => 
          index === self.findIndex(f => f.qualityLabel === format.qualityLabel)
        )
        .sort((a, b) => b.bitrate - a.bitrate);

      return res.json({
        platform: 'youtube',
        title,
        thumbnail,
        formats,
      });
    } else if (videoUrl.includes('tiktok.com')) {
      return res.json({
        platform: 'tiktok',
        title: 'TikTok Video', // TikTok metadata would require more complex scraping
        formats: [{ itag: 'tiktok', qualityLabel: 'Default', mimeType: 'video/mp4' }],
      });
    } else if (videoUrl.includes('twitter.com') || videoUrl.includes('x.com')) {
      return res.json({
        platform: 'twitter',
        title: 'Twitter/X Video', // Twitter metadata would require authentication
        formats: [{ itag: 'twitter', qualityLabel: 'Default', mimeType: 'video/mp4' }],
      });
    } else {
      return res.status(400).json({ error: 'Unsupported URL' });
    }
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

// API endpoint for video download
app.post('/download', async (req, res) => {
  const { videoUrl, quality } = req.body; // Added quality parameter
  console.log('Received download request for:', videoUrl, 'Quality:', quality);

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    // YouTube download
    if (ytdl.validateURL(videoUrl)) {
      console.log('Valid YouTube URL, attempting to download...');
      
      // Get video info for title/filename
      const info = await ytdl.getInfo(videoUrl);
      const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '_');
      const fileName = `${videoTitle}.mp4`;
      
      // Set headers for video download
      res.header('Content-Disposition', `attachment; filename="${fileName}"`);
      
      // Use specified quality if provided, else best quality
      let options = { quality: 'highest' };
      if (quality) {
        options = { quality };
      }
      
      ytdl(videoUrl, options).pipe(res);
    } 
    // TikTok download (simplified implementation - would need better API or scraping in production)
    else if (videoUrl.includes('tiktok.com')) {
      console.log('TikTok URL detected, attempting to download...');
      res.status(501).json({ error: 'TikTok downloads are not fully implemented yet due to API limitations. This would require a backend service with proper authentication in production.' });
      
      // In a real implementation, you would:
      // 1. Use a headless browser or specialized API service
      // 2. Extract the video URL from the TikTok page
      // 3. Stream the video content to the client
      
      /* Example of what production code might look like:
      const tiktokResponse = await fetch('https://api.example.com/tiktok-download', {
        method: 'POST',
        body: JSON.stringify({ url: videoUrl }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const videoData = await tiktokResponse.buffer();
      res.header('Content-Disposition', 'attachment; filename="tiktok-video.mp4"');
      res.end(videoData);
      */
    } 
    // Twitter/X download (simplified implementation)
    else if (videoUrl.includes('twitter.com') || videoUrl.includes('x.com')) {
      console.log('Twitter/X URL detected, attempting to download...');
      res.status(501).json({ error: 'Twitter/X downloads are not fully implemented yet due to API limitations. This would require a backend service with proper authentication in production.' });
      
      // In a real implementation, you would:
      // 1. Use Twitter API with proper authentication
      // 2. Extract the video URL from the tweet
      // 3. Stream the video content to the client
      
      /* Example of what production code might look like:
      const twitterResponse = await fetch('https://api.example.com/twitter-download', {
        method: 'POST',
        body: JSON.stringify({ url: videoUrl }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const videoData = await twitterResponse.buffer();
      res.header('Content-Disposition', 'attachment; filename="twitter-video.mp4"');
      res.end(videoData);
      */
    } else {
      console.log(`Unsupported URL: ${videoUrl}`);
      return res.status(400).json({ error: 'Unsupported URL. We currently support YouTube, TikTok, and Twitter/X links.' });
    }
  } catch (error) {
    console.error('Error during download process:', error);
    res.status(500).json({ error: 'Failed to download video. Please try again later.' });
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || port}`);
});
