import axios from 'axios';

export async function uploadImageToStorage(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('Failed to read image.');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeImage(imageBase64: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY;
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const body = {
    requests: [{
      image: { content: imageBase64.split(',')[1] },
      features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
    }],
  };
  const response = await axios.post(url, body);
  const labels = response.data.responses[0].labelAnnotations.map((label: any) => label.description);
  return labels.join(' ');
}
