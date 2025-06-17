import React, { useState, useEffect } from 'react';

export default function ImageTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  
  const testPaths = [
    '/cyberpunk-dream.png',
    '/attached_assets/cyberpunk-dream.png',
    '/attached_assets/Blue%20Dream_1750197379239.png',
    '/attached_assets/Blue Dream_1750197379239.png',
    '/attached_assets/IMG_9246_1749918203092.png'
  ];

  useEffect(() => {
    const testImages = async () => {
      const results: Record<string, boolean> = {};
      
      for (const path of testPaths) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          results[path] = response.ok;
        } catch {
          results[path] = false;
        }
      }
      
      setTestResults(results);
    };
    
    testImages();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50 max-w-md">
      <h3 className="font-bold mb-2">Image Path Test</h3>
      {Object.entries(testResults).map(([path, success]) => (
        <div key={path} className={`text-xs ${success ? 'text-green-400' : 'text-red-400'}`}>
          {success ? '✓' : '✗'} {path}
        </div>
      ))}
    </div>
  );
}